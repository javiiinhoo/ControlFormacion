import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import Cookies from "js-cookie";
import { Modal, Card, Button } from "react-bootstrap";

const TransferList = () => {
  const [transferLists, setTransferLists] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedList, setSelectedList] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteResult, setDeleteResult] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/current-user/`, {
          headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchTransferLists = async () => {
      try {
        const response = await axios.get(`${API_URL}/transfer-lists/`, {
          headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        const filteredLists = response.data.filter((list) => {
          return currentUser && currentUser.is_admin ? true : list.user_id === (currentUser && currentUser.id);
        });

        setTransferLists(filteredLists);
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser) {
      fetchTransferLists();
    }
  }, [currentUser]);

  const handleOpenModal = (list) => {
    setSelectedList(list);
    setShowContent(true);
    setCurrentIndex(0);
  };

  const handleCloseModal = () => {
    setSelectedList(null);
    setShowContent(false);
    setCurrentIndex(0);
  };

  const handleNextTransfer = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const handlePreviousTransfer = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const handleDeleteTransferList = async (listId) => {
    try {
      const response = await axios.delete(`${API_URL}/transfer-lists/${listId}/`, {
        headers: {
          "X-CSRFToken": Cookies.get("csrftoken"),
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setDeleteResult(response.data.message);
      const updatedLists = transferLists.filter((list) => list.id !== listId);
      setTransferLists(updatedLists);
    } catch (error) {
      console.log(error);
    }
    setDeleteConfirmation(false);
  };

  const handleConfirmDelete = (listId) => {
    setSelectedList({ id: listId });
    setDeleteConfirmation(true);
  };

  return (
    <div>
      <h2 className="text-center">Listas de traspasos</h2>
      {deleteResult && (
        <p className={`alert ${deleteResult.success ? "alert-success" : "alert-danger"}`}>{deleteResult.message}</p>
      )}
      <div className="card-deck">
        {transferLists.map((list) => (
          <Card key={list.id} className="mb-3">
            <Card.Body>
              <Card.Title>{list.name}</Card.Title>
              <div>
                <p>Creado por: {list.username}</p>
                <Button variant="primary" onClick={() => handleOpenModal(list)}>
                  Ver contenido
                </Button>
                {currentUser && (currentUser.is_admin || currentUser.id === list.user_id) && (
                  <Button variant="danger ml-2" onClick={() => handleConfirmDelete(list.id)}>
                    Borrar lista
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Modal show={selectedList !== null} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Contenido de la lista</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showContent && selectedList && selectedList.transfers.length > 0 ? (
            <div>
              <ul className="list-group">
                <li key={currentIndex} className="list-group-item">
                  <p>Nombre: {selectedList.transfers[currentIndex].nombre}</p>
                  <p>
                    Enlace: <a href={selectedList.transfers[currentIndex].enlace}>{selectedList.transfers[currentIndex].enlace}</a>
                  </p>
                  <p>Temporada: {selectedList.transfers[currentIndex].temporada}</p>
                  <p>Fecha: {selectedList.transfers[currentIndex].fecha}</p>
                  <p>Último club: {selectedList.transfers[currentIndex].ultimo_club}</p>
                  <p>Nuevo club: {selectedList.transfers[currentIndex].nuevo_club}</p>
                  <p>Valor de mercado: {selectedList.transfers[currentIndex].valor_mercado}</p>
                  <p>Coste: {selectedList.transfers[currentIndex].coste}</p>
                </li>
              </ul>
              <div className="mt-3 text-center">
                {currentIndex > 0 && (
                  <Button variant="primary mr-2" onClick={handlePreviousTransfer}>
                    Anterior
                  </Button>
                )}
                {currentIndex < selectedList.transfers.length - 1 && (
                  <Button variant="primary mr-2" onClick={handleNextTransfer}>
                    Siguiente
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <p>No hay transfers en esta lista.</p>
          )}
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={deleteConfirmation} onHide={() => setDeleteConfirmation(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Confirmación de borrado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas borrar esta lista?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleDeleteTransferList(selectedList.id)}>
            Borrar
          </Button>
          <Button variant="secondary" onClick={() => setDeleteConfirmation(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TransferList;
