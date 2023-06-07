import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import CustomNavbar from "../components/CustomNavbar";
const NotFound = () => {
    return (
        <div>
            <CustomNavbar />
            <div className="container min-vh-100">
                <div className="text-center mt-5">
                    <p>La página que estás buscando no existe.</p>
                    <button className="btn btn-primary">
                        <Link className="text-white" to="/">
                            Volver a la página de inicio
                        </Link>
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );

};

export default NotFound;
