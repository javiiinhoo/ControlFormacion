import React from "react";
import Registro from "../components/Register";
import CustomNavbar from "../components/CustomNavbar";
import Footer from "../components/Footer";

const RegisterScreen = () => {
    return (
        <div>
            <CustomNavbar />
            <div className="container min-vh-100">
                <Registro />
            </div>
            <Footer />
        </div>
    );
};

export default RegisterScreen;
