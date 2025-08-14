const bcrypt = require('bcryptjs');
const { keccak256, solidityPacked } = require('ethers');
const userModel = require('../models/userModel.js');
const codeModel = require('../models/authCodeModel.js');

const jwt = require('jsonwebtoken');

// const { loadContracts } = require('../services/contract.js');

const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    tls: {
        rejectUnauthorized: true,
    },
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS
    },
});


async function register(req, res) {
    try {
        const { studentId, password, name, email, role } = req.body;
        console.log(req.body);

        const hashedPassword = await bcrypt.hash(password, 10);
        const voterId = keccak256(solidityPacked(['string', 'string', 'string'], [studentId, email, role]));

        // const contracts = await loadContracts();

        // const tx = await contracts.voterManager.registerVoter(voterId);
        // await tx.wait();

        userModel.registerUser(voterId, studentId, hashedPassword, name, email, role);
        res.send({ message: 'Registered successfully'});
    } catch (err) {
        console.error('Error registering:', err);
        res.status(500).send({ message: 'Failed to register user' });
    }
}


async function login(req, res) {
    try {
        const { studentId, password, code } = req.body;
        
        const user = userModel.getUser(studentId);
        if (!user) return res.status(401).send({ message: 'Incorrect username/password' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send({ message: 'Incorrect username/password' });
        }
        
        if (user.enabled_2fa) {
            const currentTime = Math.floor(Date.now() / 1000);

            if (!code) {
                const isCodeSent = codeModel.isCodeSent(studentId, currentTime);
                if (!isCodeSent) {
                    const generatedCode = await generateCode(studentId);

                    const mailOptions = {
                        from: `<${process.env.NODEMAILER_EMAIL}>`,
                        to: `${user.email}`,
                        subject: 'Your 2FA Verification Code',
                        text: `
                        \rHello ${user.name},

                        \rYour 2FA verification code is ${generatedCode}.

                        \rThis code will expire in 5 minutes.

                        \rIf you did not request this, please ignore this email.`
                    };
                    
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) return console.error('Error sending email:', error);
                        console.log('Email sent successfully:', info.response);
                    })
                }

                return res.status(202).send({
                    message: 'Please enter the code sent to your email.'
                });
            }

            const validCode = codeModel.isCodeValid(studentId, code, currentTime);
            if (!validCode) {
                return res.status(401).send({ message: 'Incorrect code. Try again.' });
            } else {
                codeModel.useCode(studentId, code);
            }
        }
        
        const token = jwt.sign(
            { student_id: user.student_id, name: user.name, role: user.role },
            process.env.JWT_TOKEN,
            { expiresIn: '1h' }
        );
        
        res.send({ token, message: 'Login successfully!' });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).send({ message: 'Internal server error' });
    }
}


async function updatePassword(req, res) {
    try {
        const { studentId, oldPassword, newPassword, code } = req.body;

        const user = userModel.getUser(studentId);
        if (!user) throw new Error(`ID (${studentId}) not found\n`);

        console.log(user.enabled_2fa);

        if (user.enabled_2fa) {
            const currentTime = Math.floor(Date.now() / 1000);

            if (!code) {
                const isCodeSent = codeModel.isCodeSent(studentId, currentTime);
                if (!isCodeSent) {
                    const generatedCode = await generateCode(studentId);

                    const mailOptions = {
                        from: `<${process.env.NODEMAILER_EMAIL}>`,
                        to: `${user.email}`,
                        subject: 'Your 2FA Verification Code',
                        text: `
                        \rHello ${user.name},

                        \rYour 2FA verification code is ${generatedCode}.

                        \rThis code will expire in 5 minutes.

                        \rIf you did not request this, please ignore this email.`
                    };
                    
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) return console.error('Error sending email:', error);
                        console.log('Email sent successfully:', info.response);
                    })
                }

                return res.status(202).send({
                    message: 'Please enter the code sent to your email.'
                });
            }

            const validCode = codeModel.isCodeValid(studentId, code, currentTime);
            if (!validCode) {
                return res.status(401).send({
                    status: 'incorrect_code',
                    message: 'Incorrect code. Try again.'
                });
            } else {
                codeModel.useCode(studentId, code);
            }
        }

        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) {
            return res.status(401).send({
                status: 'incorrect_password',
                message: 'Incorrect password'
            });
        }

        if (oldPassword === newPassword) {
            return res.status(400).send({ message: 'New password must be different from the old password' });
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        userModel.updatePassword(studentId, hashedPassword);

        res.send({ message: 'Password changed successfully' });
    } catch (err) {
        console.error('Error updating paswword:', err);
        res.status(500).send({ message: 'Failed to update password' });
    }
}


async function get2FAState(req, res) {
    try {
        const { studentId } = req.params;

        const user = userModel.get2FAState(studentId);

        res.send({ state: user.enabled_2fa });
    } catch (err) {
        console.error('Error retrieving 2FA state:', err);
        res.status(500).send({ message: 'Failed retrieving 2FA state' });
    }
}


async function toggle2FA(req, res) {
    try {
        const { studentId, code } = req.body;

        const user = userModel.getUser(studentId);
        if (!user) throw new Error(`ID (${studentId}) not found\n`);
        
        const currentTime = Math.floor(Date.now() / 1000);

        if (!code) {
            const isCodeSent = codeModel.isCodeSent(studentId, currentTime);
            if (!isCodeSent) {
                const generatedCode = await generateCode(studentId);

                const mailOptions = {
                    from: `<${process.env.NODEMAILER_EMAIL}>`,
                    to: `${user.email}`,
                    subject: 'Your 2FA Verification Code',
                    text: `
                    \rHello ${user.name},

                    \rYour 2FA verification code is ${generatedCode}.

                    \rThis code will expire in 5 minutes.

                    \rIf you did not request this, please ignore this email.`
                };
                
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) return console.error('Error sending email:', error);
                    console.log('Email sent successfully:', info.response);
                })
            }

            return res.status(202).send({
                message: 'Please enter the code sent to your email.'
            });
        }

        const validCode = codeModel.isCodeValid(studentId, code, currentTime);
        if (!validCode) {
            return res.status(401).send({ message: 'Incorrect code. Try again.' });
        } else {
            codeModel.useCode(studentId, code);
        }

        userModel.toggle2FA(studentId, !user.enabled_2fa);

        res.send({
            state: !user.enabled_2fa,
            message: `2FA is ${(!user.enabled_2fa ? 'enabled' : 'disabled')} successfully.`
        });
    } catch (err) {
        console.error('Error updating 2FA state:', err);
        res.status(500).send({ message: 'Failed to updating 2FA state' });
    }
}


async function generateCode(studentId) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    try {
        let code = '';

        const randomValues = crypto.getRandomValues(new Uint8Array(8));
        for (let i = 0; i < 8; i++) {
            code += charset[randomValues[i] % charset.length];
        }

        const expiresAt = Math.floor((Date.now() + 300000) / 1000);

        codeModel.addCode(studentId, code, expiresAt);

        return code;
    } catch (err) {
        console.error('Error generating code:', err);
        res.status(500).send({ message: 'Failed to generate code' });
    }
}


module.exports = {
    register,
    login,
    updatePassword,
    get2FAState,
    toggle2FA
};