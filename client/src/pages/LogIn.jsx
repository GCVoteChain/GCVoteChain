import "./css/Login.css"


function Login (){
    return(
        <div className="body">
            <div className="wrapper">
                <div className="form-box login"></div>
                <form action="">
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="text" placeholder="Username" required/>
                    </div>
                    <div className="input-box">
                        <input type="Password" placeholder="Password" required/>
                    </div>
                   <div className="Button"><button type="submit" onClick={enter()} >Login</button></div>
                </form>
            </div>
        </div>
    )

}
function enter (){
fetch(
    '/login',
{
    method: 'POST',
    headers: {'Content-Type' : 'application/json'},
    body: JSON.stringify({})
}

)
}
export default Login;