import "./css/Dashboard.css"

 function Dashboard (){
    return(
        <div className="bodies">
   <header className = "navbar">
    <nav className="navbar-links">
    <ul><li><a href="#">Dashboard</a></li>
        <li><a href="#">Party Lists</a></li>
        <li><a href="#">Results</a></li>
        <li><a href="#">Contacts</a></li>
        </ul>
        </nav>
   </header>

 <section class="partylists">

      <div class="partylist-card">
        <h2>Partylist:</h2>
        <form action="#" method="POST">

          <div class="member">
            <span>President:</span>
            <select name="auditor">
              <option value="">Select Candidate</option>
           
            </select>
          </div>
          <div class="member">
               <span>Vice President:</span>
           <select name="auditor">
              <option value="">Select Candidate</option>
           
            </select>
          </div>

          <div class="member">
            <span>Secretary:</span>
             <select name="auditor">
              <option value="">Select Candidate</option>
           
            </select>
          </div>

          <div class="member">
            <span>Treasurer:</span>
             <select name="auditor">
              <option value="">Select Candidate</option>
           
            </select>
          </div>

          <div class="member">
            <span>Auditor:</span>
            <select name="auditor">
              <option value="">Select Candidate</option>
           
            </select>
          </div>

          <div class="member">
            <span>PRO:</span>
            <select name="pro">
              <option value="">Select Candidate</option>
             
            </select>
          </div>

          <div class="submit-container">
            <button type="submit" class="submit-btn">Submit Vote</button>
          </div>
        </form>
      </div>

    </section>

</div>

    )
} export default Dashboard;