import "./css/Login.css"
import { useState } from "react"


function Login (){
    const [user,setuser] = useState ("")
    const [pass,setpass] = useState ("")
    const changeuser = event => {
        setuser (event.target.value)
    }

    const changepass = event => {
        setpass (event.target.value)
    }

    const enter =  () => {
        fetch(
            'http://localhost:8008/api/auth/login',
            {
                method:'POST',
                headers:{'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId: user , password: pass})
            }
            
        )
        .catch(err=> console.error('Erro loging in',err.message));
         
    }

    return(
        <div className="body">
            <div className="wrapper">
                <div className="form-box login"></div>
                <form action="">
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="text" placeholder="Username" onChange={changeuser} value={user} required/>
                    </div>
                    <div className="input-box">
                        <input type="Password" placeholder="Password" onChange={changepass} value={pass} required/>
                    </div>
                   <div className="Button"><button type="submit" onClick={enter()} >Login</button></div>
                </form>
            </div>
        </div>
    )

}
export default Login;