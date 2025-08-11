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

    const [loading, setLoading] = useState(false);


    useAuth('admin');

    const isFormValid = id.trim() !== '' && pass.trim() !== '' && email.trim() !== '';

    const registerHandler = async(e) => {
        e.preventDefault();

        if (!isFormValid || loading) return;

        setLoading(true);
        
        try {

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
    
            const data = await res.json();
            
            window.alert(data.message);
    
            setID('');
            setPass('');
            setName('');
            setEmail('');
        } catch (err) {
            console.error('Registration failed:', err);
            window.alert('Registratation failed. Please try again');
        } finally {
            setLoading(false);
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
                            <button type='submit' disabled={!isFormValid || loading}>
                                {loading ? 'Registering...' : 'Register'}
                            </button>       
                        </div>
                    </form>
                </div>
            }
            footerContent={
                <ul>
                    <li><a href='/admin/registration'>Registration</a></li>
                    <li><a href='/admin/elections'>Elections</a></li>
                    <li><a href='/admin/settings'>Settings</a></li>
                </ul>
        }></Layout>
    )
}

export default Registration;