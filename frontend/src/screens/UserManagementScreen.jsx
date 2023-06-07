import React from "react";
import CustomNavbar from "../components/CustomNavbar";
import Footer from "../components/Footer";
import UserManagement from "../components/UserManagement";

const UserManagementScreen = () => {
    return (
        <div>
            <CustomNavbar />
            <div className="container min-vh-100">
                <UserManagement />
            </div>
            <Footer />
        </div>
    );
};

export default UserManagementScreen;
