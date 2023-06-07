import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

import { API_URL } from "../config";
import "../static/css/Login.module.css";

const Login = ({ onLogin }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const authtoken = Cookies.get("authtoken");
        if (authtoken) {
            navigate(`/logout`);
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password } = formData;
        try {
            const res = await axios.post(
                `${API_URL}/login/`,
                { username, password },
                {
                    withCredentials: true,
                    headers: {
                        "X-CSRFToken": Cookies.get("csrftoken"),
                        "Content-Type": "application/json",
                    },
                }
            );
            if (res.status === 200) {
                setErrorMessage("");
                setSuccessMessage("Iniciaste sesión exitosamente");
                onLogin(username);
                setTimeout(() => {
                    navigate(`/`);
                }, 2000); // Esperar 2 segundos antes de redirigir al usuario
            }
        } catch (err) {
            console.log(err);
            setErrorMessage("Nombre de usuario o contraseña incorrectos");
        }
    };

    return (
        <div className="container mb-5">
            <h2 className="text-center mb-4">Iniciar sesión</h2>
            <form className="text-center" onSubmit={handleSubmit}>
                {errorMessage && (
                    <div className="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>
                )}
                {successMessage && (
                    <div className="alert alert-success" role="alert">
                        {successMessage}
                    </div>
                )}
                <div className="form-group">
                    <label htmlFor="username">Usuario:</label>
                    <input
                        className="form-control"
                        name="username"
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        className="form-control"
                        name="password"
                        onChange={handleInputChange}
                        required
                        type="password"
                    />
                </div>
                <button className="btn btn-primary mb-3 login-btn" type="submit">
                    Iniciar sesión
                </button>
            </form>
        </div>
    );
};

export default Login;
