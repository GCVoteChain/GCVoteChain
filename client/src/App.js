import {  Routes,Route } from "react-router-dom";
import LogIn  from "./pages/LogIn"
import Student from "./pages/Student/Student";
import Admin from "./pages/Admin/Admin";
import Result from "./pages/Student/Result";
import PartyList from "./pages/Student/PartyList";
import Candidate from "./pages/Admin/Candidate";
import Registration from "./pages/Admin/Registration";
import Voting from "./pages/Admin/Voting"
import Settings from "./pages/Student/Settings";

function App() {
  return(
    <Routes>
      <Route path="/" element ={< LogIn/>} />
      <Route path="/Student" element={<Student/>}/>
      <Route path="/Result" element={<Result/>}/>
      <Route path="/PartyList" element= {<PartyList/>}/>
      <Route path="/Admin" element={<Admin/>}/>
      <Route path="/Voting" element={<Voting/>}/>
      <Route path="/Settings" element={<Settings/>}/>
      <Route path="/Registration" element={<Registration/>}/>
      <Route path="/Candidate" element={<Candidate/>}/>
      
    </Routes> 
  )


  
}


export default App;
