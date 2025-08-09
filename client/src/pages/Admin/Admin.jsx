import './css/Admin.css';
import Layout from '../Layout';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useRef, useState } from 'react';
import useAuth from '../../hooks/auth';
import { useNavigate } from 'react-router-dom';


function Admin () {
  const [name, setName] = useState('');

  const navigate = useNavigate();

  useAuth('admin');

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

  
  return(
    <Layout
      headerContent={'Gardner College E-Voting Admin Dashboard'}
      mainContent={
        <div className='admin-dashboard'>
          <h2>Welcome back, {name}</h2>
        </div>
      }
      footerContent={
        <ul>
          <li><a href="/admin/registration">Registration</a></li>
          <li><a href="/admin/elections">Elections</a></li>
          <li><a href="/settings">Settings</a></li>
        </ul>
      }
    ></Layout>
  )
}

export default Admin;