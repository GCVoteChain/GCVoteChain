import Layout from "./Layout";

function Result(){
    
    return(
        <Layout
            headerContent={'Candidates'}
            mainContent={<div>
                <form>
                    
                </form>
            </div>}
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