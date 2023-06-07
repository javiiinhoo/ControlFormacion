import React from "react";
import Login from "../components/Login";

import CustomNavbar from "../components/CustomNavbar";
import Footer from "../components/Footer";

const LoginScreen = () => {
    return (
        <div>
            <CustomNavbar />
            <div className="container min-vh-100">
                <Login onLogin={() => { }} />
            </div>
            <Footer />
        </div>
    );
};

export default LoginScreen;
