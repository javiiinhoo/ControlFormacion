import React from "react";
import PlayerSearch from "../components/PlayerSearch";
import CustomNavbar from "../components/CustomNavbar";
import Footer from "../components/Footer";
import "../static/css/PlayerSearch.module.css";

const PlayerSearchScreen = () => {
    return (
        <div>
            <CustomNavbar />
            <div className="container min-vh-100">
                <PlayerSearch/>
            </div>
            <Footer />
        </div>
    );
};

export default PlayerSearchScreen;
