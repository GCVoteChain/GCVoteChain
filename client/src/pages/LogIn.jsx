import "./css/Login.css";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

import { jwtDecode } from 'jwt-decode';


function Login (){
    const navigate = useNavigate();
    
    const [user, setUser] = useState ('');
    const [pass, setPass] = useState ('');
    const [loginStatus, setLoginStatus] = useState('');

    const [codeInput, setCodeInput] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [showCodeInputModal, setShowCodeInputModal] = useState(false);

    const isFormValid = user.trim() !== '' && pass.trim() !== '';

    const handleLogin = async(e) => {
        e.preventDefault();

        setLoading(true);

        if (isFormValid) {
            let reqBody = { studentId: user, password: pass };
            if (codeInput) reqBody['code'] = codeInput;

            const res = await fetch(
                '/api/auth/login',
                {
                    method:'POST',
                    headers:{'Content-Type': 'application/json' },
                    body: JSON.stringify(reqBody)
                }
            );

            const data = await res.json();
            
            setLoginStatus(data.message);

            if (res.ok) {
                if (res.status === 202) {
                    setShowCodeInputModal(true);
                    setLoading(false);
                    return;
                }

                localStorage.setItem('authToken', data.token);

                const decoded = jwtDecode(data.token);

                if (decoded.role === 'admin') navigate('/admin');
                else if (decoded.role === 'voter') navigate('/student');
                else setLoginStatus('Something went wrong. Try again later.');
            }
        }

        setLoading(false);
    }

    return(
        <div className='login'>
            <div className="login-form">
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <div className="login-form-input-box">
                        <label>Student ID:</label>
                        <input type="text" placeholder="ID" onChange={event => setUser(event.target.value)} value={user} required/>
                    </div>
                    <div className="login-form-input-box">
                        <label>Password:</label>
                        <input type="Password" placeholder="Password" onChange={event => setPass(event.target.value)} value={pass} required/>
                    </div>
                    <div className="login-form-submit"><button type="submit" disabled={!isFormValid}>Login</button></div>
                </form>
                <p id="login-form-login-status" style={{ textAlign: 'center', marginTop: '25px', color: 'black' }}>
                    {loginStatus}
                </p>

                {showCodeInputModal && (
                    <div className='code-modal'>
                        <div className='code-modal-form'>
                            <label>
                                <input
                                    type='text'
                                    value={codeInput || ''}
                                    onChange={(e) => setCodeInput(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </label>
                            <button
                                type='submit'
                                disabled={codeInput.length < 8}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )

}
export default Login;