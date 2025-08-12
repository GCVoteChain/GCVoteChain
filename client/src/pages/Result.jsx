import './css/Result.css';
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import React from 'react';
import { jwtDecode } from "jwt-decode";


function Result(){
    const navigate = useNavigate();
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState(true);

    const [isElectionOver, setIsElectionOver] = useState(false);
    
    const { electionId } = useParams();

    const POSITIONS = useMemo(() => {
        return [
            'President',
            'Vice President',
            'Secretary',
            'Treasurer',
            'Auditor',
            'PRO'
        ]
    }, []);

    const effectRan = useRef(false);

    useEffect(() => {
        setLoading(true);

        if (!effectRan.current) {
            (async () => {
                try {
                    const token = localStorage.getItem('authToken');
                    if (!token) {
                        navigate('/');
                        return;
                    }
    
                    if (!electionId) {
                        const decoded = jwtDecode(token);
    
                        if (decoded.role === 'admin') navigate('/admin/elections');
                        else if (decoded.role === 'voter') navigate('/student/elections');
                    }
                    
                    const getElection = await fetch(
                        `/api/elections/${electionId}`,
                        {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        }
                    );
                    
                    if (!getElection.ok) {
                        const decoded = jwtDecode(token);
                        
                        if (decoded.role === 'admin') navigate('/admin/elections');
                        else if (decoded.role === 'voter') navigate('/student/elections');
                    }
                    
                    const election = await getElection.json();

                    setIsElectionOver(Date.now() > election.end_time * 1000);

                    const res = await fetch(
                        `/api/candidates/${election.id}`,
                        {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        }
                    );

                    if (res.ok) {
                        const data = await res.json();

                        setResults(() => {
                            const grouped = {};

                            POSITIONS.forEach(position => {
                                grouped[position] = [];
                            });

                            data.forEach(({ student_id, position, name, vote_count }) => {
                                if (!grouped[position]) grouped[position] = [];
                                grouped[position].push({ student_id, position, name, vote_count });
                            });

                            return grouped;
                        });
                    }

                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            })();
        }
        
        effectRan.current = true;
        setLoading(false);
    }, [navigate, isElectionOver, electionId, POSITIONS]);


    const backPageHandler = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/');
            return;
        }

        const role = jwtDecode(token).role;
        if (role === 'voter') navigate(`/student/elections/${electionId}/candidates`);
        else if (role === 'admin') navigate(`/admin/eletiond/${electionId}/candidates`);
    }
    

    return(
        <div className='results'>
            <div>
                <button type='button' onClick={backPageHandler}>Back</button>
            </div>
            <div className='results-candidates'>
                {loading ? (
                    <p>Loading...</p>
                ) : !isElectionOver ? (
                    <p>Results will be available after the election ends.</p>
                ) : (
                    <div>
                        {POSITIONS.map((position) => (
                            <div className='results-candidates-position'>
                                <h2>{position.charAt(0).toUpperCase() + position.slice(1)}</h2>
                                <ul>
                                    {results[position] && results[position].map((candidate) => (
                                        <li key={candidate.student_id}>
                                            <p>{candidate.name}: {candidate.vote_count} votes</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Result;