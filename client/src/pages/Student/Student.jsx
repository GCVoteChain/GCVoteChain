import { useNavigate } from 'react-router-dom';
import './css/Student.css'
import { useEffect, useRef, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import useAuth from '../../hooks/auth';
import Layout from '../Layout';


function Student() {
  const [name, setName] = useState('');

  const navigate = useNavigate();

  useAuth('voter');

  const effectRan = useRef(false);

  useEffect(() => {
    if (!effectRan.current) {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/');
        return;
      }

      const decoded = jwtDecode(token);
      setName(decoded.name);
    }

    effectRan.current = true;
  }, [navigate]);


  return (
    <Layout
      headerContent={'Gardner College E-Voting Student Dashboard'}
      mainContent={
        <div className='student-dashboard'>
          <h2>Welcome back, {name}</h2>
        </div>
      }
      footerContent={
        <ul>
          <li><a href='/student/elections'>Elections</a></li>
          <li><a href='/student/settings'>Settings</a></li>
        </ul>
      }
    ></Layout>
  )
}


export default Student;