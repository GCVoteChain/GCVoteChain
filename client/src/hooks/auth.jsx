import { jwtDecode } from "jwt-decode";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";


function useAuth(role) {
    const navigate = useNavigate();

    const effectRan = useRef(false);

    useEffect(() => {
        if (!effectRan.current) {
            (async () => {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    navigate('/');
                    return;
                }
    
                try {
                    const res = await fetch(
                        `/api/auth/${role}`,
                        {
                            method: 'POST',
                            headers: {
                                'authorization': `Bearer ${token}`,
                                'Content-type': 'application/json',
                            }
                        }
                    );
    
                    if (!res.ok) throw new Error();
    
                    return jwtDecode(token);
                } catch {
                    localStorage.removeItem('authToken');
                    navigate('/');
                    return;
                }
            })();
        }

        effectRan.current = true;
    }, [navigate, role]);
}


export default useAuth;