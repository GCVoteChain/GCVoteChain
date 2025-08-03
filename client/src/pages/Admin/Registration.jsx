import './css/Registration.css'
import { useState } from 'react';
import Layout from '../Layout';

function Registration() {
    const [id, setID] = useState('');
    const [pass, setPass] = useState('');
    const [email, setEmail] = useState('');

    const registerHandler = async(e) => {
        e.preventDefault();
    }
    
    return(
        <Layout 
            headerContent={'Voter Registration'} 
            mainContent={
                <div className='registration-form'>
                    <h2>Voter Information</h2>
                    <form onSubmit={registerHandler}>
                        <div className='registration-form-input-box'>
                            <input type='text' placeholder='Student ID' onChange={event => setID(event.target.value)} value={id}required/>
                        </div>
                        <div className='registration-form-input-box'>
                            <input type='Password' placeholder='Password' onChange={event => setPass(event.target.value)} value={pass}required/>
                        </div>
                        <div className='registration-form-input-box'>
                            <input type='email' placeholder='Email' onChange={event => setEmail(event.target.value)} value={email}required/>
                        </div>
                        <div className='registration-form-submit'>
                            <button type='submit'> Register</button>       
                        </div>
                    </form>
                </div>
            }
            footerContent={
                <ul>
                    <li><a href='./Registration'>Registration</a></li>
                    <li><a href='./Voting'>Voting</a></li>
                    <li><a href='./Candidate'>Candidate</a></li>
                </ul>
        }></Layout>
    )
}

export default Registration;