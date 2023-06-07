import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const PasswordChangeForm = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (newPassword !== confirmNewPassword) {
        // Verificar si las contraseñas nuevas coinciden
        setErrorMessage("La nueva contraseña y su confirmación no coinciden");
        return;
      }

      const response = await axios.post(
        `${API_URL}/change-password/`,
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
          confirmNewPassword: confirmNewPassword,
        },
        {
          headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setSuccessMessage(response.data.detail);
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      setTimeout(() => {
        navigate("/");
      }, 3000); // Esperar 3 segundos antes de redirigir a la página de inicio
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.detail
      ) {
        // Mostrar mensaje de error específico si está disponible
        setErrorMessage(error.response.data.detail);
      } else {
        setErrorMessage("Error al cambiar contraseña");
      }
      console.error(error);
    }
  };

  return (
    <div className="card container">
      <div className="card-header">
        <h2 className="text-center">Cambiar contraseña</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="oldPassword">Contraseña actual</label>
            <input
              type="password"
              className="form-control"
              name="oldPassword"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">Nueva contraseña</label>
            <input
              type="password"
              className="form-control"
              name="newPassword"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmNewPassword">
              Confirmar nueva contraseña
            </label>
            <input
              type="password"
              className="form-control"
              name="confirmNewPassword"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Guardar cambios
          </button>
        </form>
        {successMessage && (
          <div className="alert alert-success mt-3">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="alert alert-danger mt-3">{errorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default PasswordChangeForm;
