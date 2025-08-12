import {  Routes,Route } from "react-router-dom";
import LogIn  from "./pages/LogIn"
import Result from "./pages/Result";

import Student from "./pages/Student/Student";
import StudentCandidate from "./pages/Student/Candidates";
import StudentElection from "./pages/Student/Election";
import StudentSettings from "./pages/Student/Settings";
import Voting from "./pages/Student/Voting";

import Admin from "./pages/Admin/Admin";
import VoterRegistration from "./pages/Admin/Registration";
import AdminCandidates from "./pages/Admin/Candidates";
import AdminElection from "./pages/Admin/Elections";
import AdminSettings from "./pages/Admin/Settings";


function App() {
  return(
    <Routes>
      <Route path="/" element ={< LogIn/>} />
      <Route path="/student" element={<Student/>}/>
      <Route path="/student/elections" element={<StudentElection/>}/>
      <Route path="/student/elections/:electionId/candidates" element= {<StudentCandidate/>}/>
      <Route path="/student/elections/:electionId/vote" element={<Voting/>}/>
      <Route path="/student/settings" element={<StudentSettings/>}/>
      
      <Route path="/admin" element={<Admin/>}/>
      <Route path="/admin/registration" element={<VoterRegistration/>}/>
      <Route path="/admin/elections" element={<AdminElection/>}/>
      <Route path="/admin/elections/:electionId/candidates" element={<AdminCandidates/>}/>
      <Route path="/admin/settings" element={<AdminSettings/>}/>

      <Route path="/elections/:electionId/results" element={<Result/>}/>

      <Route path='*' element={<h1>404 - Page Not Found</h1>}/>
    </Routes> 
  )
}


export default App;
