import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import Cookies from "js-cookie";
import { Modal, Button } from "react-bootstrap";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    is_superuser: false,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/user-management/`, {
        withCredentials: true,
        headers: {
          "X-CSRFToken": Cookies.get("csrftoken"),
          "Content-Type": "application/json",
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const createUser = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/user-management/`,
        newUser,
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
            "Content-Type": "application/json",
          },
        }
      );
      setSuccessMessage(response.data.message);
      setErrorMessage("");
      setShowModal(false);
      fetchUsers();
      setNewUser({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        is_superuser: false,
      });
    } catch (error) {
      console.error(error);
      setSuccessMessage("");
      setErrorMessage("Error al crear el usuario.");
    }
  };

  const updateUser = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/user-management/${selectedUser.id}/`,
        selectedUser,
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
            "Content-Type": "application/json",
          },
        }
      );
      setSuccessMessage(response.data.message);
      setErrorMessage("");
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      setSuccessMessage("");
      setErrorMessage("Error al actualizar el usuario.");
    }
  };

  const deleteUser = async () => {
    try {
      const response = await axios.delete(
        `${API_URL}/user-management/${selectedUser.id}/`,
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
            "Content-Type": "application/json",
          },
        }
      );
      setSuccessMessage(response.data.message);
      setErrorMessage("");
      setShowDeleteModal(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      setSuccessMessage("");
      setErrorMessage("Error al eliminar el usuario.");
    }
  };

  const handleInputChange = (e) => {
    if (selectedUser) {
      setSelectedUser({
        ...selectedUser,
        [e.target.name]: e.target.value,
      });
    } else {
      setNewUser({
        ...newUser,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleCheckboxChange = (e) => {
    if (selectedUser) {
      setSelectedUser({
        ...selectedUser,
        is_superuser: e.target.checked,
      });
    } else {
      setNewUser({
        ...newUser,
        is_superuser: e.target.checked,
      });
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  return (
    <div className="user-management">
      <h2 className="user-management__title text-center">Gestión de usuarios</h2>
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      <table className="table">
        <thead>
          <tr>
            <th>Tipo de usuario</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.is_superuser ? "Administrador" : "Usuario estándar"}</td>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.email}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => openEditModal(user)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => openDeleteModal(user)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-center mt-4">
        <button
          className="btn btn-success"
          onClick={() => {
            setShowModal(true);
            setSelectedUser(null);
          }}
        >
          Crear usuario
        </button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedUser ? "Editar usuario" : "Crear usuario"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Nombre de usuario</label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={
                  selectedUser ? selectedUser.username : newUser.username
                }
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                className="form-control"
                name="first_name"
                value={
                  selectedUser
                    ? selectedUser.first_name
                    : newUser.first_name
                }
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Apellidos</label>
              <input
                type="text"
                className="form-control"
                name="last_name"
                value={
                  selectedUser
                    ? selectedUser.last_name
                    : newUser.last_name
                }
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={
                  selectedUser ? selectedUser.email : newUser.email
                }
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={
                  selectedUser ? selectedUser.password : newUser.password
                }
                onChange={handleInputChange}
              />
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="is_superuser"
                checked={
                  selectedUser
                    ? selectedUser.is_superuser
                    : newUser.is_superuser
                }
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label">Administrador</label>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={selectedUser ? updateUser : createUser}>
            {selectedUser ? "Guardar cambios" : "Crear usuario"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas eliminar este usuario?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={deleteUser}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement;
