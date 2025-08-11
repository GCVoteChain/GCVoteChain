import Layout from "../Layout";
import { useNavigate,useParams } from "react-router-dom";
import useAuth from "../../hooks/auth";
import { useEffect,useMemo,useRef,useState } from "react";

function Voting() {
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

    const [loading, setLoading] = useState(false);

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

    return ('');
}


export default Voting;