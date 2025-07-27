import {  Routes,Route } from "react-router-dom";
import LogIn  from "./pages/LogIn"
import Student from "./pages/Student/Student";
import Admin from "./pages/Admin/Admin";

function App() {
  return(
    <Routes>
      <Route path="/" element ={< LogIn/>} />
      <Route path="/Student" element={<Student/>}/>
      <Route path="/Admin" element={<Admin/>}/>
    </Routes>
  )


  
}

export default App;
