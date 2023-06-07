import React from "react";
import TransferList from "../components/TransferList";
import CustomNavbar from "../components/CustomNavbar";
import Footer from "../components/Footer";

const TransferListScreen = () => {
    return (
        <div>
            <CustomNavbar />
            <div className="container min-vh-100">
                <TransferList />
            </div>
            <Footer />
        </div>
    );
};

export default TransferListScreen;
