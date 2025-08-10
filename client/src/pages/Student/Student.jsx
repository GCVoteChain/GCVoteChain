import React from "react";
import "./css/Student.css"
import Layout from "../Layout";

 function Student (){
   return(
    <Layout
      headerContent={'Gardner College E-Voting Student Dashboard'}
      mainContent={
        <div className='admin-dashboard'>
          <h2>Welcome back, Student</h2>
        </div>
      }
      footerContent={
        <ul>
          <li><a href="/Student/Election">Election</a></li>
          <li><a href="/Student/settings">Settings</a></li>
        </ul>
      }
    ></Layout>
   )
 } export default Student;