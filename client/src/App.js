import {  Routes,Route } from "react-router-dom";
import LogIn  from "./pages/LogIn"
import Result from "./pages/Result";
import Settings from "./pages/Settings";

import Student from "./pages/Student/Student";
import StudentCandidate from "./pages/Student/Candidates";
import StudentElection from "./pages/Student/Election";
import Voting from "./pages/Student/Voting";

import Admin from "./pages/Admin/Admin";
import VoterRegistration from "./pages/Admin/Registration";
import AdminCandidate from "./pages/Admin/Candidates";
import AdminElection from "./pages/Admin/Election";
import AdminCreateElection from './pages/Admin/CreateElection';


function App() {
  return(
    <Routes>
      <Route path="/" element ={< LogIn/>} />
      <Route path="/student" element={<Student/>}/>
      <Route path="/student/candidates" element= {<StudentCandidate/>}/>
      <Route path="/student/election" element={<StudentElection/>}/>
      <Route path="/student/vote" element={<Voting/>}/>
      
      <Route path="/admin" element={<Admin/>}/>
      <Route path="/admin/registration" element={<VoterRegistration/>}/>
      <Route path="/admin/candidates" element={<AdminCandidate/>}/>
      <Route path="/admin/elections" element={<AdminElection/>}/>
      <Route path="/admin/elections/create" element={<AdminCreateElection/>}/>

      <Route path="/settings" element={<Settings/>}/>
      <Route path="/results" element={<Result/>}/>
    </Routes> 
  )
}


export default App;
