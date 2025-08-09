import './css/Election.css'
import { useEffect, useRef, useState } from "react";
import useAuth from "../../hooks/auth";
import Layout from "../Layout";
import { useNavigate } from "react-router-dom";
import React from 'react';

import { formatDistanceToNow } from 'date-fns';


function getTimeRemaining(dateTime) {
    const timestamp = Number(dateTime) * 1000;
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
}


function Election() {
    const navigate = useNavigate();
    
    const [elections, setElections] = useState([]);

    const [resMessage, setResMessage] = useState('');
    const [showMessageModal, setShowMessageModal] = useState(false);

    const [newElectionName, setNewElectionName] = useState('');
    const [showNewElectionModal, setShowNewElectionModal] = useState(false);
    
    const [selectedElection, setSelectedElection] = useState({});
    const [showSelectedElectionModal, setShowSelectedElectionModal] = useState(false);

    const [electionStartTime, setElectionStartTime] = useState('');
    const [electionEndTime, setElectionEndTime] = useState('');
    const [showElectionTimeModal, setShowElectionTimeModal] = useState(false);
    
    
    useAuth('admin');

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
    
                    setElections(data);
                }
            })();
        }

        effectRan.current = true;
    }, [navigate]);


    const newElectionHandler = async(e) => {
        e.preventDefault();

        if (newElectionName !== '') {
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
                    setElections(data);
                } else if (getRes.status === 403 || getRes.status === 401) {
                    localStorage.removeItem('authToken');
                    navigate('/');
                    return;
                }

            } else if (addResult.status === 401 || addResult.status === 403) {
                localStorage.removeItem('authToken');
                navigate('/');
                return;
            }
            
            setNewElectionName('');
            setShowNewElectionModal(false);
        }
    }


    const setElectionScheduleHandler = async(e) => {
        e.preventDefault();

        if (electionStartTime.trim() !== '' && electionEndTime.trim() !== '') {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/');
                return;
            }

            const setRes = await fetch(
                '/api/elections/set-schedule',
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: selectedElection.id,
                        startTime: electionStartTime,
                        endTime: electionEndTime
                    })
                }
            );

            const setData = await setRes.json();

            setResMessage(setData.message);
            setShowMessageModal(true);

            if (setRes.ok) {
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
                    setElections(data);
                } else if (getRes.status === 403 || getRes.status === 401) {
                    localStorage.removeItem('authToken');
                    navigate('/');
                    return;
                }
            } else if (setRes.status === 401 || setRes.status === 403) {
                localStorage.removeItem('authToken');
                navigate('/');
                return;
            }

            setElectionStartTime('');
            setElectionEndTime('');
            setSelectedElection({});

            setShowSelectedElectionModal(false);
            setShowElectionTimeModal(false);
        }
    }

    
    return(
        <Layout
            headerContent={'Elections'}
            mainContent={
                <div className='elections'>
                    {elections.length === 0 ? (<p> No elections available.</p>) : (
                        <ul className='elections-list'>
                            {elections.map((election) => (
                                <li key={election.id} className='election-item' onClick={() => {
                                    setSelectedElection(election);
                                    setShowSelectedElectionModal(true);
                                }}>
                                    <div className='election-item-top'>
                                        <div className='election-item-name'>{election.title}</div>
                                        <div className='election-item-status'>
                                            {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                                        </div>
                                    </div>
                                    {election.start_time && election.status === 'scheduled' && (
                                        <div className='election-item-time'>
                                            Starts in: {getTimeRemaining(election.start_time)}
                                        </div>
                                    )}
                                    {election.end_time && election.status === 'open' && (
                                        <div className='election-item-time'>
                                            Ends in: {getTimeRemaining(election.end_time)}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}

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
                                        <button type='submit' disabled={newElectionName.trim() === ''}>Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {showMessageModal && (
                        <div className='elections-message-modal'>
                            <div className='elections-message-modal-div'>
                                <p>{resMessage.split('\n').map((line, index) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        <br/>
                                    </React.Fragment>
                                ))}</p>
                                <button onClick={() => setShowMessageModal(false)}>Okay</button>
                            </div>
                        </div>
                    )}

                    {showSelectedElectionModal && (
                        <div className='elections-selected-modal'>
                            <div className='elections-selected-modal-form'>
                                <div className='selected-election-div-info'>
                                    <h1>{selectedElection.title}</h1>
                                    <span className={`status ${selectedElection.status}`}>
                                        {selectedElection.status.charAt(0).toUpperCase() + selectedElection.status.slice(1)}
                                    </span>
                                </div>

                                <div className='selected-election-div-candidates'>
                                    <button disabled={selectedElection.status !== 'draft'} onClick={() => {
                                        navigate(`/admin/elections/${selectedElection.id}/candidates`);
                                    }}>Manage Candidates</button>
                                </div>

                                <div className='selected-election-div-schedule'>
                                    <button disabled={selectedElection.status === 'open' || selectedElection.status === 'closed'} onClick={() => {
                                        setResMessage(`
                                            Setting the election schedule is a final action. Once the schedule is set:\n
                                            - You will no longer be able to add or edit candidates.\n
                                            - This action cannot be undone.
                                        `);
                                        setShowMessageModal(true);
                                        setShowElectionTimeModal(true);
                                    }}>Set Schedule</button>
                                </div>

                                {showElectionTimeModal && (
                                    <div className='selected-election-time-modal'>
                                        <div className='selected-election-time-modal-form'>
                                            <form onSubmit={setElectionScheduleHandler}>
                                                <div className='selected-election-div-time'>
                                                    <label>Start time:</label>
                                                    <input
                                                        type='datetime-local' 
                                                        required={true} 
                                                        value={electionStartTime} 
                                                        onChange={(e) => setElectionStartTime(e.target.value)}/>
                                                </div>
                                                <div className='selected-election-div-time'>
                                                    <label>End time:</label>
                                                    <input 
                                                        type='datetime-local' 
                                                        required={true} 
                                                        value={electionEndTime} 
                                                        onChange={(e) => setElectionEndTime(e.target.value)}/>
                                                </div>
                                                <div className='selected-election-time-modal-form-buttons'>
                                                    <button type='submit'>Submit</button>
                                                    <button type='button' onClick={() => {
                                                        setElectionStartTime('');
                                                        setElectionEndTime('');
                                                        setShowElectionTimeModal(false);
                                                    }}>Cancel</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}
                                <button className='elections-selected-modal-form-close' onClick={() => {
                                    setShowSelectedElectionModal(false);
                                    setSelectedElection({});
                                }}>Close</button>
                            </div>
                        </div>
                    )}
                </div>
            }
            footerContent={
                <div className='elections-footer'>
                    <div className='elections-button-add' onClick={() => setShowNewElectionModal(true)}>New Election</div>
                    <ul>
                        <li><a href="/admin/registration">Registration</a></li>
                        <li><a href="/admin/elections">Elections</a></li>
                        <li><a href="/settings">Settings</a></li>
                    </ul>
                </div>
            }
        ></Layout>
    );
}

export default Election;