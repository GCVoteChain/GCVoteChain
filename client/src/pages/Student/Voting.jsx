import Layout from "../Layout";
import { useNavigate,useParams } from "react-router-dom";
import useAuth from "../../hooks/auth";
import { useEffect,useMemo,useRef,useState } from "react";

function Voting() {

    


    return(
        <Layout 
            headerContent={'Voting'} 
            mainContent={<div>
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
            </div>}
            footerContent={
                <ul>
                    <li><a href="/Student/Election">Election</a></li>
                    <li><a href="/Student/settings">Settings</a></li>
                </ul>
        }></Layout>
    )
}


export default Voting;