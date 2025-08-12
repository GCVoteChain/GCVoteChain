import './css/Candidates.css'
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../Layout";
import useAuth from "../../hooks/auth";
import { useEffect, useMemo, useRef, useState } from "react";


function Candidates () {
    const navigate = useNavigate();

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

    const [selectedElection, setSelectedElection] = useState({});
    const [candidates, setCandidates] = useState({});


    useAuth('voter');
    
    const { electionId } = useParams();

    const getCandidates = async() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/');
            return;
        }
        
        if (!electionId) {
            navigate('/student/elections');
            return;
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
            navigate('/student/elections');
            return;
        }

        const election = await getElection.json();

        setSelectedElection(election);

        const res = await fetch(
            `/api/candidates/${electionId}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (res.ok) {
            const data = await res.json();

            setCandidates(() => {
                const grouped = {};

                POSITIONS.forEach(position => {
                    grouped[position] = [];
                });

                data.forEach(({ student_id, position, name }) => {
                    if (!grouped[position]) grouped[position] = [];
                    grouped[position].push({ student_id, position, name });
                });

                return grouped;
            })
        }
    }

    const effectRan = useRef(false);
    useEffect(() => {
        if (!effectRan.current) {
            (async () => await getCandidates())();
        }

        effectRan.current = true;
    });


    return (
        <Layout
            headerContent={'Candidates'}
            mainContent={
                <div className='candidates-div'>
                    <div className='candidates-div-header'>
                        <h2>{selectedElection.title}</h2>
                        <div className='candidates-div-header-buttons'>
                            <button
                                type='button'
                                onClick={() => navigate(`/elections/${selectedElection.id}/results`)}
                                disabled={selectedElection.status !== 'closed'}
                            >
                                Results
                            </button>
                            <button
                                type='button'
                                onClick={() => navigate(`/student/elections/${selectedElection.id}/vote`)}
                                disabled={selectedElection.status !== 'open'}
                            >
                                Vote
                            </button>
                        </div>
                    </div>
                    <div className='candidates-div-list'>
                        {POSITIONS.map((position) => (
                            <details key={position}>
                                <summary>{position}</summary>
                                {candidates[position] && candidates[position].length > 0 ? (
                                    <ul>
                                        {candidates[position].map((candidate) => (
                                            <li key={candidate.student_id}>
                                                <h3>{candidate.name}</h3>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No candidate yet</p>
                                )}
                            </details>
                        ))}
                    </div>
                </div>
            }
            footerContent={
                <ul>
                    <li><a href="/student/elections">Elections</a></li>
                    <li><a href="/student/settings">Settings</a></li>
                </ul>
            }
        ></Layout>
    );
}

export default Candidates;