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

    const [showCandidateInfoModal, setShowCandidateInfoModal] = useState(false);

    useAuth('admin');
    
    const { electionId } = useParams();

    const effectRan = useRef(false);
    useEffect(() => {
        if (!effectRan.current) {
            (async () => {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    navigate('/');
                    return;
                }
                
                if (!electionId) {
                    navigate('/admin/elections');
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
                    navigate('/admin/elections');
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

                    if (!data.length === 0) {
                        setCandidates(() => {
                            const grouped = {};

                            POSITIONS.forEach(position => {
                                grouped[position] = [];
                            });

                            data.forEach(({ id, position, name }) => {
                                if (grouped[position]) grouped[position] = [];
                                grouped[position].push({ id, position, name });
                            });

                            return grouped;
                        })
                    }
                }
            })();
        }

        effectRan.current = true;
    }, [navigate, electionId, POSITIONS]);

    

    return (
        <Layout
            headerContent={'Candidates'}
            mainContent={
                <div className='candidates-div'>
                    <div className='candidates-div-header'>
                        <h2>{selectedElection.title}</h2>
                        <button className='candidates-div-add' onClick={() => setShowCandidateInfoModal(true)}>
                            Add new candidate
                        </button>
                    </div>
                    <div className='candidates-div-list'>
                        {POSITIONS.map((position) => (
                            <details key={position}>
                                <summary>{position}</summary>
                                {candidates[position] && candidates[position].length > 0 ? (
                                    <ul>
                                        {candidates[position].map(({ id, name }) => (
                                            <li key={id}>
                                                <h3>{name}</h3>
                                                <button className='candidate-edit'>Edit</button>
                                                <button className='candidate-remove'>Remove</button>
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
                    <li><a href="/admin/registration">Registration</a></li>
                    <li><a href="/admin/elections">Elections</a></li>
                    <li><a href="/settings">Settings</a></li>
                </ul>
            }
        ></Layout>
    );
}

export default Candidates;