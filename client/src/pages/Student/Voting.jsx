import './css/Voting.css';
import Layout from "../Layout";
import { useNavigate,useParams } from "react-router-dom";
import useAuth from "../../hooks/auth";
import { useEffect,useMemo,useRef,useState } from "react";

import eccrypto from 'eccrypto';


function Voting() {
    const navigate = useNavigate();

    useAuth('voter');

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
    
    const [votes, setVotes] = useState({});
    
    const [loading, setLoading] = useState(false);

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

        try {
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
            )

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
                    })

                    return grouped;
                });
            }
        } catch (err) {
            console.error(err);
        }
    }


    const effectRan = useRef(false);
    useEffect(() => {
        if (!effectRan.current) {
            (async () => await getCandidates())();
        }

        effectRan.current = true;
    });


    const encryptVote = async(token) => {
        try {
            const res = await fetch(
                '/api/crypto/public-key',
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const data = await res.json();
            
            const publicKey = Buffer.from(data, 'hex');

            const payload = Buffer.from(JSON.stringify(votes));

            const encryptedVote = await eccrypto.encrypt(publicKey, payload);

            return Buffer.concat([
                encryptedVote.iv,
                encryptedVote.ephemPublicKey,
                encryptedVote.ciphertext,
                encryptedVote.mac,
            ]);
        } catch (err) {
            console.error('Error encrypting vote:', err);
        }
    }


    const submitVoteHandler = async(e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/');
                return;
            }

            const payload = await encryptVote(token);

            const res = await fetch(
                `/api/elections/${electionId}/vote`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ vote: payload.toString('hex') })
                }
            );

            const data = await res.json();

            window.alert(data.message);

            if (res.ok) {
                navigate(`/student/elections/${electionId}/candidates`);
                return;
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    }


    const allVotesValid = !POSITIONS.every(position => votes[position] && votes[position].trim() !== '');


    return (
        <Layout
            headerContent={'Voting'}
            mainContent={
                <div className='voting'>
                    <h2>{selectedElection?.title || 'Election'}</h2>
                    <form onSubmit={submitVoteHandler}>
                        {POSITIONS.map((position) => (
                            <div key={position}>
                                <label htmlFor={position}>
                                    <strong>{position}</strong>
                                </label>
                                <br/>
                                <select
                                    id={position}
                                    value={votes[position] || ''}
                                    onChange={(e) => {
                                        setVotes(prev => ({
                                            ...prev,
                                            [position]: e.target.value
                                        }));
                                    }}
                                    required
                                >
                                    <option value=''>-- Select a candidate --</option>
                                    {(candidates[position] || []).map(candidate => (
                                        <option
                                            key={candidate.student_id}
                                            value={candidate.student_id}
                                        >
                                            {candidate.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                        <div className='voting-submit'>
                            <button 
                                type='submit'
                                disabled={allVotesValid || loading}
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            }
            footerContent={
                <ul>
                    <li><a href='/student/elections'>Elections</a></li>
                    <li><a href='/student/elections'>Settings</a></li>
                </ul>
            }
        ></Layout>
    );
}


export default Voting;