import React from "react";
import Layout from "./Layout";

function Settings(){
    return(
        <Layout
            headerContent={'Settings'}
            mainContent={''}
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

export default Settings;