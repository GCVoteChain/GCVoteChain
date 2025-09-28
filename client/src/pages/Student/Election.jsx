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
    
    const [UUID, setUUID] = useState('');
    const [loading, setLoading] = useState(false);
    const [showVoteVerificationModal, setShowVoteVerificationModal] = useState(false);

    useAuth('voter');

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


    const uuidHandler = async(e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/');
                return;
            }

            const res = await fetch(
                `/api/elections/vote-confirmation/${UUID}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const data = await res.json();

            window.alert(data.message);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
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
                                    navigate(`/student/elections/${election.id}/candidates`);
                                }}>
                                    <div className='election-item-top'>
                                        <div className='election-item-name'>{election.title}</div>
                                        <div className={`election-item-status ${election.status}`}>
                                            {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                                        </div>
                                    </div>
                                    {election.start_time && election.status === 'scheduled' && (
                                        <div className='election-item-time'>
                                            Starts {getTimeRemaining(election.start_time)}
                                        </div>
                                    )}
                                    {election.end_time && election.status === 'open' && (
                                        <div className='election-item-time'>
                                            Ends {getTimeRemaining(election.end_time)}
                                        </div>
                                    )}
                                    {election.end_time && election.status === 'closed' && (
                                        <div className='election-item-time'>
                                            Ended {getTimeRemaining(election.end_time)}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}

                    {showVoteVerificationModal && (
                        <div className='elections-verification-modal'>
                            <div className='elections-verification-modal-form'>
                                <button className='elections-verification-modal-form-close' onClick={() => setShowVoteVerificationModal(false)}>×</button>
                                <h3>Vote Verification</h3>
                                <form onSubmit={uuidHandler}>
                                    <div className='elections-verification-modal-form-input-box'>
                                        <input
                                            type='text'
                                            value={UUID}
                                            placeholder={'UUID'}
                                            onChange={(e) => setUUID(e.target.value)}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className='elections-verification-modal-form-submit'>
                                        <button
                                            type='submit'
                                            disabled={UUID.trim() === '' || loading}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            }
            footerContent={
                <div className='elections-footer'>
                    <div className='elections-verify-uuid' onClick={() => setShowVoteVerificationModal(true)}>Verify Vote</div>
                    <ul>
                        <li><a href="/student/elections">Elections</a></li>
                        <li><a href="/student/settings">Settings</a></li>
                    </ul>
                </div>
            }
        ></Layout>
    );
}

export default Election;