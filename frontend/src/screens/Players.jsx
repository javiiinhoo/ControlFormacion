import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import CustomNavbar from "../components/CustomNavbar";
import Footer from "../components/Footer";

const Players = () => {
    return (
        <div>
            <CustomNavbar />
            <div className="container">
                <div className="card mb-3 mt-2">
                    <div className="card-body text-center">
                        <div className="container min-vh-100">
                            {/* Botón para buscar jugadores */}
                            <Button
                                variant="primary"
                                className="mx-2 my-2 animate__animated animate__fadeIn"
                            >
                                <Link className="nav-link" to="/buscar-jugadores/">
                                    Búsqueda de jugadores
                                </Link>
                            </Button>
                            {/* Botón para consultar listas de traspasos */}
                            <Button
                                variant="primary"
                                className="mx-2 my-2 animate__animated animate__fadeIn"
                            >
                                <Link className="nav-link" to="/listas-traspasos/">
                                    Consultar listas de traspasos
                                </Link>
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Players;
