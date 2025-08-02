import "./css/Login.css";
import { useState } from "react";


function Login (){
    const [user, setUser] = useState ('')
    const [pass, setPass] = useState ('')
    const [loginStatus, setLoginStatus] = useState('');

    const handleLogin = async(e) => {
        e.preventDefault();

        if (user.trim() && pass.trim()) {
            const res = await fetch(
                '/api/auth/login',
                {
                    method:'POST',
                    headers:{'Content-Type': 'application/json' },
                    body: JSON.stringify({ studentId: user , password: pass})
                }
            )
            .then(res => res.json())
            .catch(err=> console.error('Erro loging in',err.message));
    
            setLoginStatus(res.message);
        }
    }

    return(
        <div className="body">
            <div className="wrapper">
                <div className="form-box login"></div>
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="text" placeholder="Student ID" onChange={event => setUser(event.target.value)} value={user} required/>
                    </div>
                    <div className="input-box">
                        <input type="Password" placeholder="Password" onChange={event => setPass(event.target.value)} value={pass} required/>
                    </div>
                   <div className="Button"><button type="submit">Login</button></div>
                </form>
                <p id="loginStatus" style={{ textAlign: 'center', marginTop: '25px', color: 'black' }}>{loginStatus}</p>
            </div>
        </div>
    )

}
export default Login;