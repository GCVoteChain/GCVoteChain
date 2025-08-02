import React from "react";
import "./css/Student.css"

 function Student (){
    return(
        <div className="bodies">
   <div class="navbar-logo">Gardner College E-Voting</div>

 <section className="partylists">

      <div className="partylist-card">
        <h2>Voting</h2>
        <form action="#" method="POST">

          <div className="member">
            <span>President:</span>
            <select name="auditor">
              <option value="">Select Candidate</option>
           
            </select>
          </div>
          <div className="member">
               <span>Vice President:</span>
           <select name="auditor">
              <option value="">Select Candidate</option>
           
            </select>
          </div>

          <div className="member">
            <span>Secretary:</span>
             <select name="auditor">
              <option value="">Select Candidate</option>
           
            </select>
          </div>

          <div className="member">
            <span>Treasurer:</span>
             <select name="auditor">
              <option value="">Select Candidate</option>
           
            </select>
          </div>

          <div className="member">
            <span>Auditor:</span>
            <select name="auditor">
              <option value="">Select Candidate</option>
           
            </select>
          </div>

          <div className="member">
            <span>PRO:</span>
            <select name="pro">
              <option value="">Select Candidate</option>
             
            </select>
          </div>

          <div className="submit-container">
            <button type="submit" class="submit-btn">Submit Vote</button>
          </div>
        </form>
      </div>

    </section>

    <footer className = "navbar">
      
   
    <nav className="navbar-links">
    <ul><li><a href="./Student">Dashboard</a></li>
        <li><a href="./PartyList">Party Lists</a></li>
        <li><a href="./Result">Results</a></li>
        </ul>
        </nav>
   </footer>

</div>

    )
} export default Student;