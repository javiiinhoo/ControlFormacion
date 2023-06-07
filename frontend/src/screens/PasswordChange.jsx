import React from "react";
import CustomNavbar from "../components/CustomNavbar";
import PasswordChangeForm from "../components/PasswordChangeForm";
import Footer from "../components/Footer";

const ChangePasswordScreen = () => {
    return (
        <div>
            <CustomNavbar />
            <div className="container min-vh-100">
                <PasswordChangeForm />
            </div>
            <Footer />

        </div>
    );
};

export default ChangePasswordScreen;
