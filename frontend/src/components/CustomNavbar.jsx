import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import "../static/css/CustomNavbar.css";

function CustomNavbar() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Realiza una petición al servidor para obtener el usuario actual
                const response = await axios.get(`${API_URL}/current-user/`, {
                    withCredentials: true,
                });
                setUser(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUser();
    }, []);

    return (
        <nav className="navbar navbar-expand-md navbar-custom bg-primary">
            <div className="container-fluid">
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse bg-primary" id="navbarNav">
                    <ul className="navbar-nav d-flex justify-content-between w-100">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                Inicio
                            </Link>
                        </li>
                        {!user && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/registro">
                                        Registro
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">
                                        Iniciar sesión
                                    </Link>
                                </li>
                            </>
                        )}
                        {user && !user.is_admin && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/jugadores">
                                        Jugadores y traspasos
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/logout">
                                        Cerrar sesión
                                    </Link>
                                </li>
                            </>
                        )}
                        {user &&
                            user.is_authenticated &&
                            user.is_admin && (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/panel-admin/">
                                            Panel de administración
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/jugadores">
                                            Jugadores y traspasos
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/logout">
                                            Cerrar sesión
                                        </Link>
                                    </li>
                                </>
                            )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default CustomNavbar;
