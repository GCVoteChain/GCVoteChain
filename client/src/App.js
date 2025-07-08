import {  Routes,Route } from "react-router-dom";
import LogIn  from "./pages/LogIn"
import Dashboard from "./pages/Dashboard";

function App() {
  return(
    <Routes>
      <Route path="/" element ={< LogIn/>} />
      <Route path="/Dash" element={<Dashboard/>}/>
    </Routes>
  )


  
}

export default App;
