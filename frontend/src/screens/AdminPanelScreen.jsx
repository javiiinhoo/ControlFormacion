import React from "react";
import AdminPanel from "../components/AdminPanel";

import CustomNavbar from "../components/CustomNavbar";
import Footer from "../components/Footer";

const AdminPanelScreen = () => {
    return (
        <div>
            <CustomNavbar />
            <div className="container min-vh-100">
                <AdminPanel />
            </div>
            <Footer />
        </div>
    );
};

export default AdminPanelScreen;
