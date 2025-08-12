import Layout from "./Layout";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from 'react';


function Result(){
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [electionEnd, setElectionEnd] = useState(null);

    const effectRan = useRef(false);

    useEffect(() => {
        setLoading(true);

        if (!effectRan.current) {
            (async () => {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    navigate('/');
                    return;
                }
                
                const resInfo = await fetch(
                    'api/elections/info',
                    {
                        headers: 'GET',

                    }
                )
                    .then(res => res.json())
                    .then(data => {
                        setElectionEnd(data.endTime); 
                    })
                    .catch(console.error);
        
                
                await fetch('/api/elections/results')
                    .then(res => res.json())
                    .then(data => {
                        setResults(data);
                        setLoading(false);
                    })
                    .catch(console.error);
            })();
        }
        
        effectRan.current = true;
        setLoading(false);
    }, [navigate, setResults, setLoading, setElectionEnd]);

    const isElectionOver = electionEnd && Date.now() > electionEnd * 1000;

    return(
        <div className='results'>
            {loading ? (
                <p>Loading...</p>
            ) : !isElectionOver ? (
                <p>Results will be available after the election ends.</p>
            ) : (
                <ul>
                    {results.map(candidate => (
                        <li key={candidate.id}>
                            {candidate.name}: {candidate.votes} votes
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Result;