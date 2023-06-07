import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "../config";
import "../static/css/Logout.module.css";

const Logout = ({ onLogout }) => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");

    useEffect(() => {
        const csrftoken = Cookies.get("csrftoken");
        if (!csrftoken) {
            navigate(`/`);
        }
    }, [navigate]);

    const handleLogout = async () => {
        const csrftoken = Cookies.get("csrftoken");
        if (csrftoken) {
            try {
                const config = {
                    headers: {
                        "X-CSRFToken": csrftoken,
                    },
                };
                const res = await axios.post(`${API_URL}/logout/`, {}, config);
                if (res.status === 200) {
                    setMessage("Cerraste sesión exitosamente");
                    onLogout();
                    Cookies.remove("sessionid");
                    setTimeout(() => {
                        navigate(`/`);
                    }, 3000);
                }
            } catch (err) {
                console.log(err);
                setMessage("Error al cerrar sesión");
            }
        } else {
            setMessage("No puedes cerrar sesión, ya que no tienes una sesión activa.");
            setTimeout(() => {
                navigate("/");
            }, 3000);
        }
    };

    return (
        <div className="container d-flex justify-content-center  vh-100">
            <div className="text-center">
                <h2>Cerrar sesión</h2>
                {message && (
                    <div className="alert alert-info" role="alert">
                        {message}
                    </div>
                )}
                <button className="btn btn-danger" onClick={handleLogout}>
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
};

export default Logout;
