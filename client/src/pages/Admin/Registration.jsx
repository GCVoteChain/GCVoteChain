import './css/registration.css'

function Registration() {
    return( 
    <div className="bodies">
        <div className="wrapper2">
        <form action="">
            <h1>Register</h1>
            <div className="input-box">
                <input type="text" placeholder="Name" required/>
                <input type="Password" placeholder="Password" required/>
                <input type="email" placeholder="Email" required/>  
             <button type="submit"> Register</button>       
            </div>
        </form>
        </div>

   <footer className = "navbar">
     <li><a href="./Registration">Registration</a></li>
    </footer>
    <nav className="navbar-links">
    <ul><li><a href="./Voting">Voting</a></li>
        <li><a href="./Candidate">Candidate</a></li>
        </ul>
        </nav>
   </div>

    )
 

}

export default Registration;