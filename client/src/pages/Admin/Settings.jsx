import '../css/Settings.css'
import Layout from "../Layout";
import { useNavigate } from "react-router-dom";

function Settings(){
    const navigate = useNavigate();

    return(
        <Layout
            headerContent={'Settings'}
            mainContent={
                <div className='settings'>
                    <button
                        type='button'
                        onClick={() => {

                        }}
                    >
                        Change password
                    </button>
                    <button
                        type='button'
                        onClick={() => {
                            const confirmed = window.confirm('Are you sure you want to log out?');
                            if (confirmed) {
                                localStorage.removeItem('authToken');
                                navigate('/');
                            }
                        }}
                    >
                        Log out
                    </button>
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

export default Settings;