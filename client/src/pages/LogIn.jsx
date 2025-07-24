import "./css/Login.css"


function Login (){
    return(
        <div className="body">
            <div className="wrapper">
                <div className="form-box login"></div>
                <form action="">
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="text" placeholder="Name" required/>
                    </div>
                    <div className="input-box">
                        <input type="Password" placeholder="Password" required/>
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    )

}

export default Login;