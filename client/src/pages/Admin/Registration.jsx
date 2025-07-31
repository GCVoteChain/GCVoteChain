

function Registration() {
    return( 
    <div className="bodies">
        <div className="wrapper">
        <form action="">
            <h1>Register</h1>
            <div className="input-box">
                <input type="text" placeholder="Name" required/>
                <input type="Password" placeholder="Password" required/>
                       
                            </div>
                    
        </form>
        </div>

   <header className = "navbar">
    <nav className="navbar-links">
    <ul><li><a href="./Voting">Voting</a></li>
        <li><a href="./Candidate">Candidate</a></li>
        <li><a href="./Registration">Registration</a></li>
        </ul>
        </nav>
   </header>
   </div>

    )
 

}

export default Registration;