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

    const [newId, setNewId] = useState('');
    const [selectedCandidate, setSelectedCandidate] = useState({});

    const [showCandidateInfoModal, setShowCandidateInfoModal] = useState(false);

    const [loading, setLoading] = useState(false);

    useAuth('admin');
    
    const { electionId } = useParams();

    const getCandidates = async() => {
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
            `/api/candidates/${electionId}/preview`,
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

                data.candidates.forEach(({ student_id, position, name }) => {
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


    const addCandidateHandler = async (e) => {
        e.preventDefault();
        
        if (newId.trim() !== '' && selectedCandidate.name.trim() !== '' && selectedCandidate.position.trim() !== '') {
            setLoading(true);
            
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    navigate('/');
                    return;
                }

                const res = await fetch(
                    '/api/candidates/add',
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            studentId: newId,
                            electionId: selectedElection.id,
                            name: selectedCandidate.name,
                            position: selectedCandidate.position
                        })
                    }
                );
    
                const data = await res.json();
                window.alert(data.message);
    
                if (res.ok) {
                    await getCandidates();
    
                    setNewId('');
                    setSelectedCandidate({});
                    setShowCandidateInfoModal(false);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    }


    const editCandidateHandler = async(e) => {
        e.preventDefault();
        
        if (selectedCandidate.name.trim() !== '' && selectedCandidate.position.trim() !== '') {
            setLoading(true);
            
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    navigate('/');
                    return;
                }
                
                const res = await fetch(
                    '/api/candidates/update',
                    {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            studentId: selectedCandidate.student_id,
                            electionId: selectedElection.id,
                            name: selectedCandidate.name,
                            position: selectedCandidate.position
                        })
                    }
                );
    
                const data = await res.json();
                window.alert(data.message);

                if (res.ok) {
                    await getCandidates();
    
                    setNewId('');
                    setSelectedCandidate({});
                    setShowCandidateInfoModal(false);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    }
    

    const removeCandidateHandler = async(studentId) => {
        setLoading(true);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/');
                return;
            }
            
            const res = await fetch(
                '/api/candidates/remove',
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        electionId: selectedElection.id,
                        studentId: studentId
                    })
                }
            );
    
            const data = await res.json();
            window.alert(data.message);
    
            if (res.ok) {
                await getCandidates();
    
                setNewId('');
                setSelectedCandidate({});
                setShowCandidateInfoModal(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    

    return (
        <Layout
            headerContent={'Candidates'}
            mainContent={
                <div className='candidates-div'>
                    <div className='candidates-div-header'>
                        <h2>{selectedElection.title}</h2>
                        <button
                            className='candidates-div-add'
                            disabled={loading || selectedElection.status !== 'draft'}
                            onClick={() => {
                                setSelectedCandidate({});
                                setShowCandidateInfoModal(true);
                            }}
                        >
                            New Candidate
                        </button>
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
                                                <button
                                                    className='candidate-edit'
                                                    disabled={loading || selectedElection.status !== 'draft'}
                                                    onClick={() => {
                                                        setSelectedCandidate(candidate);
                                                        setShowCandidateInfoModal(true);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className='candidate-remove'
                                                    disabled={loading || selectedElection.status !== 'draft'}
                                                    onClick={() => {
                                                        const confirm = window.confirm(`Are you sure you want to remove ${candidate.name}?`);
                                                        if (confirm) removeCandidateHandler(candidate.student_id);
                                                    }}
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No candidate yet</p>
                                )}
                            </details>
                        ))}
                    </div>
                    {showCandidateInfoModal && (
                        <div className='candidates-div-info-modal'>
                            <div className='candidates-div-info-modal-form'>
                                <h2>{selectedCandidate.student_id ? 'Edit Candidate' : 'New Candidate'}</h2>
                                <form onSubmit={selectedCandidate.student_id ? editCandidateHandler : addCandidateHandler}>
                                    <label>
                                        Student ID:
                                        <input
                                            type='text'
                                            value={selectedCandidate.student_id ? selectedCandidate.student_id : newId}
                                            onChange={(e) => setNewId(e.target.value)}
                                            required
                                            disabled={selectedCandidate.student_id || loading || selectedElection.status !== 'draft'}
                                        />
                                    </label>
                                    <label>
                                        Name:
                                        <input
                                            type='text'
                                            value={selectedCandidate.name || '' }
                                            onChange={(e) => setSelectedCandidate({ ...selectedCandidate, name: e.target.value })}
                                            required
                                            disabled={loading || selectedElection.status !== 'draft'}
                                        />
                                    </label>
                                    <label>
                                        Position:
                                        <select
                                            value={selectedCandidate.position || ''}
                                            onChange={(e) => setSelectedCandidate({ ...selectedCandidate, position: e.target.value })}
                                            required
                                            disabled={loading || selectedElection.status !== 'draft'}
                                        >
                                            <option value=''>Select Position</option>
                                            {POSITIONS.map((pos) => (
                                                <option key={pos} value={pos}>
                                                    {pos}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <div className='modal-buttons'>
                                        <button type='submit' disabled={loading || selectedElection.status !== 'draft'}>
                                            {loading ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            type='button'
                                            onClick={() => {
                                                setShowCandidateInfoModal(false);
                                                setSelectedCandidate({});
                                                setNewId('');
                                            }}
                                            disabled={loading || selectedElection.status !== 'draft'}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            }
            footerContent={
                <ul>
                    <li><a href="/admin/registration">Registration</a></li>
                    <li><a href="/admin/elections">Elections</a></li>
                    <li><a href="/admin/settings">Settings</a></li>
                </ul>
            }
        ></Layout>
    );
}

export default Candidates;