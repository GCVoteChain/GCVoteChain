import { useEffect, useState } from 'react';
import useAuth from '../../hooks/auth';
import '../css/Settings.css'
import Layout from "../Layout";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

function Settings(){
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [state2FA, setState2FA] = useState(false);

    const [codeStatus, setCodeStatus] = useState('');
    const [codeInput, setCodeInput] = useState('');
    const [showCodeInputModal, setShowCodeInputModal] = useState(false);

    const [passStatus, setPassStatus] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [verifyNewPassword, setVerifyNewPassword] = useState('');
    const [showPasswordInputModal, setShowPasswordInputModal] = useState(false);

    useAuth('voter');

    useEffect(() => {
        (async() => {
            setLoading(true);

            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    navigate('/');
                    return;
                }

                const decoded = jwtDecode(token);

                const res = await fetch(
                    `/api/auth/2fa/${decoded.student_id}`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                    }
                );

                if (res.ok) {
                    const data = await res.json();
                    setState2FA(data.state);
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        })();
    }, [navigate, setLoading, setState2FA]);


    const toggle2FAHandler = async(e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/');
                return;
            }

            const decoded = jwtDecode(token);
            
            let reqBody = {
                studentId: decoded.student_id,
                code: codeInput || undefined
            };

            const res = await fetch(
                '/api/auth/2fa',
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(reqBody)
                }
            );

            const data = await res.json();

            if (res.status === 200) {
                setCodeStatus('');
                setState2FA(data.state);
                setShowCodeInputModal(false);
            } else if (res.status === 202) {
                setCodeStatus(data.message);
                setShowCodeInputModal(true);
            } else {
                setCodeStatus(data.message);
            }

            setCodeInput('');
        } catch (err) {
            console.log('Error:', err);
        } finally {
            setLoading(false);
        }
    }

    const newPasswordHandler = async(e) => {
        e.preventDefault();

        setLoading(true);

        if (newPassword !== verifyNewPassword) {
            setPassStatus('New password does not match');
        }

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/');
                return;
            }

            const decoded = jwtDecode(token);
            
            let reqBody = {
                studentId: decoded.student_id,
                oldPassword: oldPassword,
                newPassword: newPassword,
                code: codeInput || undefined
            };

            const res = await fetch(
                '/api/auth/update-password',
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(reqBody)
                }
            );

            const data = await res.json();
            
            if (res.status === 200) {
                setCodeStatus('');
                setOldPassword('');
                setNewPassword('');
                setVerifyNewPassword('');
                setPassStatus('');
                setShowPasswordInputModal(false);
                setShowCodeInputModal(false);

                window.alert(data.message);
            } else if (res.status === 202) {
                setCodeStatus(data.message);
                setShowCodeInputModal(true);
            } else if (res.status === 401 && data.status === 'incorrect_code') {
                setCodeStatus(data.message);
            } else {
                setPassStatus(data.message);
            }

            setCodeInput('');
        } catch (err) {
            console.log('Error:', err);
        } finally {
            setLoading(false);
        }
    }

    const sanitizeInput = (input) => {
        return input.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
    }
    

    return(
        <Layout
            headerContent={'Settings'}
            mainContent={
                <div>
                    <div className='settings'>
                        <button
                            type='button'
                            onClick={toggle2FAHandler}
                            disabled={loading}
                        >
                            <label className='switch'>
                                <input type='checkbox' checked={state2FA} readOnly/>
                                <span className='slider'/>
                            </label>
                            Enable/Disable 2FA
                        </button>
                        <button
                            type='button'
                            onClick={() => setShowPasswordInputModal(true)}
                            disabled={loading}
                        >
                            Change password
                        </button>
                        <button
                            type='button'
                            onClick={() => {
                                const confirmed = window.confirm('Are you sure you want to log out?');
                                if (confirmed) {
                                    localStorage.removeItem('authToken');
                                    navigate('/');
                                }
                            }}
                            disabled={loading}
                        >
                            Log out
                        </button>
                    </div>

                    {showCodeInputModal && (
                        <div className='code-modal'>
                            <div className='code-modal-form'>
                                <form onSubmit={showPasswordInputModal ? newPasswordHandler : toggle2FAHandler}>
                                    <p>{codeStatus}</p>
                                    <div className='code-modal-form-input-box'>
                                        <input
                                            type='text'
                                            value={codeInput || ''}
                                            placeholder='Code'
                                            onChange={(e) => setCodeInput(sanitizeInput(e.target.value))}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className='code-modal-form-submit'>
                                        <button
                                            type='submit'
                                            disabled={codeInput.length < 8 || loading}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {showPasswordInputModal && (
                        <div className='password-modal'>
                            <div className='password-modal-form'>
                                <button className='password-modal-form-close' onClick={() => {
                                    setShowPasswordInputModal(false);
                                    setOldPassword('');
                                    setNewPassword('');
                                    setVerifyNewPassword('');
                                }}
                                >
                                    ×
                                </button>
                                <h3>Change password</h3>
                                <form onSubmit={newPasswordHandler}>
                                    <p>{passStatus}</p>
                                    <div className='password-modal-form-input-box'>
                                        <input
                                            type='password'
                                            value={oldPassword || ''}
                                            placeholder='Old password'
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className='password-modal-form-input-box'>
                                        <input
                                            type='password'
                                            value={newPassword || ''}
                                            placeholder='New password'
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className='password-modal-form-input-box'>
                                        <input
                                            type='password'
                                            value={verifyNewPassword || ''}
                                            placeholder='Confirm new password'
                                            onChange={(e) => setVerifyNewPassword(e.target.value)}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className='password-modal-form-submit'>
                                        <button
                                            type='submit'
                                            disabled={oldPassword.trim() === '' || newPassword.trim() === '' || verifyNewPassword.trim() === '' || loading}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            }
            footerContent={
                <ul>
                    <li><a href="/student/elections">Elections</a></li>
                    <li><a href="/student/settings">Settings</a></li>
                </ul>
            }
        ></Layout>
    );
}

export default Settings;