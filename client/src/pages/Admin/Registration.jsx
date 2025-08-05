import './css/Registration.css'
import { useState } from 'react';
import Layout from '../Layout';
import { useNavigate } from 'react-router-dom';

import useAuth from '../../hooks/auth';


function Registration() {
    const navigate = useNavigate();
    
    const [id, setID] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useAuth('admin');

    const isFormValid = id.trim() !== '' && pass.trim() !== '' && email.trim() !== '';

    const registerHandler = async(e) => {
        e.preventDefault();

        if (isFormValid) {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/');
                return;
            }
            
            const res = await fetch(
                '/api/auth/register',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        studentId: id,
                        password: pass,
                        name: name,
                        email: email,
                        role: 'voter'
                    })
                }
            );

            if (!res.ok) {
                console.log('Failed to register new voter');
            }
        }
    }
    
    return(
        <Layout 
            headerContent={'Voter Registration'} 
            mainContent={
                <div className='registration-form'>
                    <h2>Voter Information</h2>
                    <form onSubmit={registerHandler}>
                        <div className='registration-form-input-box'>
                            <label>Student ID:</label>
                            <input type='text' placeholder='Student ID' onChange={event => setID(event.target.value)} value={id}required/>
                        </div>
                        <div className='registration-form-input-box'>
                            <label>Password:</label>
                            <input type='Password' placeholder='Password' onChange={event => setPass(event.target.value)} value={pass}required/>
                        </div>
                        <div className='registration-form-input-box'>
                            <label>Nickname</label>
                            <input type='text' placeholder='Nickname' onChange={event => setName(event.target.value)} value={name}required/>
                        </div>
                        <div className='registration-form-input-box'>
                            <label>Email</label>
                            <input type='email' placeholder='Email' onChange={event => setEmail(event.target.value)} value={email}required/>
                        </div>
                        <div className='registration-form-submit'>
                            <button type='submit' disabled={!isFormValid}> Register</button>       
                        </div>
                    </form>
                </div>
            }
            footerContent={
                <ul>
                    <li><a href='/admin/registration'>Registration</a></li>
                    <li><a href='/admin/elections'>Election</a></li>
                    <li><a href='/admin/candidates'>Candidates</a></li>
                    <li><a href='/settings'>Settings</a></li>
                </ul>
        }></Layout>
    )
}

export default Registration;