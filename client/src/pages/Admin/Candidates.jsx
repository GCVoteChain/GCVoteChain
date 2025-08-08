import Layout from "../Layout";


function Candidate () {
    return (
        <Layout
            headerContent={'Candidates'}
            mainContent={''}
            footerContent={
                <ul>
                    <li><a href="/admin/registration">Registration</a></li>
                    <li><a href="/admin/elections">Elections</a></li>
                    <li><a href="/admin/candidates">Candidates</a></li>
                    <li><a href="/settings">Settings</a></li>
                </ul>
            }
        ></Layout>
    );
}

export default Candidate;