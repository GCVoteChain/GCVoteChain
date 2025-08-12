import Layout from "./Layout";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from 'react';
import { formatDistanceToNow } from 'date-fns';

function getTimeRemaining (dateTime){
    const timestamp = Number(dateTime) * 1000;
    return formatDistanceToNow (new Date(timestamp), {addSuffix: true});
}

function Result(){
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [electionEnd, setElectionEnd] = useState(null);

    useEffect(() => {
       
        fetch('/api/election/info')
            .then(res => res.json())
            .then(data => {
                setElectionEnd(data.endTime); 
            });

        
        fetch('/api/election/results')
            .then(res => res.json())
            .then(data => {
                setResults(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const isElectionOver = electionEnd && Date.now() > electionEnd * 1000;

    return(
        <Layout
            headerContent={'Election Results'}
            mainContent={
                <div>
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
            }
            footerContent={
                <ul>
                    <li><a href="/Student/Student">Registration</a></li>
                    <li><a href="/Student/Candidates">Election</a></li>
                    <li><a href="/Student/Election">Candidates</a></li>
                    <li><a href="/Student/settings">Settings</a></li>
                </ul>
            }
        ></Layout>
    )
}

export default Result;