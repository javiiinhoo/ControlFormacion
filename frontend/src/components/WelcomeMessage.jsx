import React, { useState, useEffect } from "react";
import axios from "axios";

import { API_URL } from "../config";

function WelcomeMessage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Función para obtener los datos del usuario actual
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/current-user/`, {
          withCredentials: true,
        });

        setUser(response.data); // Almacena los datos del usuario en el estado
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser(); // Llama a la función para obtener los datos del usuario al montar el componente
  }, []);

  const getDaysSinceFoundation = () => {
    const foundationDate = new Date(1906, 2, 2); // Fecha de fundación del club
    const currentDate = new Date();
    const timeDiff = Math.abs(currentDate.getTime() - foundationDate.getTime());
    const daysSinceFoundation = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // Calcula los días desde la fundación
    return daysSinceFoundation;
  };

  const renderApprovalMessage = () => {
    // Renderiza un mensaje si la cuenta del usuario no ha sido aprobada por el administrador
    if (user?.profile?.is_approved && !user?.is_authenticated) {
      return (
        <p className="display-12 text-center">
          Su cuenta aún no ha sido aprobada por el administrador.
        </p>
      );
    }
    return null;
  };

  return (
    <div className="welcome-message-container">
      <div>
        {/* Título de bienvenida con el nombre de usuario */}
        <h1 className="display-4 text-center">
          ¡Bienvenido a Gestión de Derechos{user && user.first_name ? `, ${user.first_name}` : ""}!
        </h1>

        {renderApprovalMessage()} {/* Renderiza el mensaje de aprobación si corresponde */}
      </div>
      <div className="text-center">
        {/* Muestra los días desde la fundación del club */}
        <p className="mb-0">{getDaysSinceFoundation()} días durmindo de pé!</p>
        <p className="mb-0">Forza Dépor!</p>
      </div>
    </div>
  );
}

export default WelcomeMessage;
