import './css/Election.css'
import { useEffect, useRef, useState } from "react";
import useAuth from "../../hooks/auth";
import Layout from "../Layout";
import { useNavigate } from "react-router-dom";


function Election() {
    const navigate = useNavigate();
    
    const [elections, setElections] = useState([]);
    const [newElectionName, setNewElectionName] = useState('');
    const [resMessage, setResMessage] = useState('');
    
    const [showNewElectionModal, setShowNewElectionModal] = useState(false);

    const [showMessageModal, setShowMessageModal] = useState(false);
    
    useAuth('admin');

    const isFormValid = newElectionName.trim() !== '';

    const effectRan = useRef(false);

    useEffect(() => {
        if (!effectRan.current) {
            (async () => {
                const token = localStorage.getItem('authToken');
                
                const res = await fetch(
                    '/api/elections/',
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                    }
                );

                if (res.status === 403 || res.status === 401) {
                    localStorage.removeItem('authToken');
                    navigate('/');
                    return;
                } else if (res.ok) {
                    const data = await res.json();
                    console.log(data);
    
                    setElections(data);
                }
            })();
        }

        effectRan.current = true;
    }, [navigate]);


    const newElectionHandler = async(e) => {
        e.preventDefault();

        if (isFormValid) {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/');
                return;
            }

            const addResult = await fetch(
                '/api/elections/add',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title: newElectionName})
                }
            );

            const addResultData = await addResult.json();

            
            setResMessage(addResultData.message);
            setShowMessageModal(true);

            if (addResult.ok) {
                const getRes = await fetch(
                    '/api/elections/',
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                    }
                );
                
                if (getRes.ok) {
                    const data = await getRes.json();
                    console.log(data);
    
                    setElections(data);
                } else if (getRes.status === 403 || getRes.status === 401) {
                    localStorage.removeItem('authToken');
                    navigate('/');
                    return;
                }

                setShowNewElectionModal(false);
            }
        }
    }
    
    
    return(
        <Layout
            headerContent={'Election'}
            mainContent={
                <div className='elections'>
                    {elections.length === 0 ? (<p> No elections available.</p>) : (
                        <ul className='elections-list'>
                            {elections.map((election) => (
                                <li key={election.id} className='election-item'>
                                    <button className='election-info'>
                                        <div className='election-info-name'>{election.title}</div>
                                        <div className='election-info-status'>{election.status}</div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className='elections-button-add' onClick={() => setShowNewElectionModal(true)}>New Election</div>

                    {showNewElectionModal && (
                        <div className='elections-add-modal'>
                            <div className='elections-add-modal-form'>
                                <button className='elections-add-modal-form-close' onClick={() => setShowNewElectionModal(false)}>×</button>
                                <h3>New Election</h3>
                                <form onSubmit={newElectionHandler}>
                                    <div className='elections-add-modal-form-input-box'>
                                        <input type='text' value={newElectionName} placeholder='Election name' onChange={(e) => setNewElectionName(e.target.value)} required/>
                                    </div>
                                    <div className='elections-add-modal-form-submit'>
                                        <button type='submit' disabled={!isFormValid}>Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {showMessageModal && (
                        <div className='elections-message-modal'>
                            <div className='elections-message-modal-div'>
                                <p>{resMessage}</p>
                                <button onClick={() => setShowMessageModal(false)}>Okay</button>
                            </div>
                        </div>
                    )}
                </div>
            }
            footerContent={
                <ul>
                    <li><a href="/admin/registration">Registration</a></li>
                    <li><a href="/admin/elections">Election</a></li>
                    <li><a href="/admin/candidates">Candidates</a></li>
                    <li><a href="/settings">Settings</a></li>
                </ul>
            }
        ></Layout>
    );
}

export default Election;