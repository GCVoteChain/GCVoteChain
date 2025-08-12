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

    useAuth('admin');

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


    const toggle2FAHandler = async() => {
        setLoading(true);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/');
                return;
            }

            const decoded = jwtDecode(token);
            
            const res = await fetch(
                '/api/auth/2fa',
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ studentId: decoded.student_id })
                }
            );

            const data = await res.json();

            setState2FA(!state2FA);
            
            window.alert(data.message);
        } catch (err) {
            console.log('Error:', err);
        } finally {
            setLoading(false);
        }
    }

    return(
        <Layout
            headerContent={'Settings'}
            mainContent={
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
            }
            footerContent={
                <ul>
                    <li><a href="/admin/registration">Elections</a></li>
                    <li><a href="/admin/elections">Elections</a></li>
                    <li><a href="/admin/settings">Settings</a></li>
                </ul>
            }
        ></Layout>
    );
}

export default Settings;