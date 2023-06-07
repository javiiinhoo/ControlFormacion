import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import Cookies from "js-cookie";
import { Modal } from "react-bootstrap";
const PlayerSearch = () => {
  // Estado para almacenar la lista de jugadores
  const [jugadores, setJugadores] = useState([]);
  // Estado para almacenar el nombre del jugador buscado
  const [nombreJugador, setNombreJugador] = useState("");
  // Estado para almacenar los resultados de la búsqueda
  const [resultados, setResultados] = useState([]);
  // Estado para almacenar el jugador seleccionado
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  // Estado para almacenar los traspasos del jugador seleccionado
  const [playerTransfers, setPlayerTransfers] = useState([]);
  // Estado para almacenar el índice del traspaso actual en playerTransfers
  const [currentTransferIndex, setCurrentTransferIndex] = useState(0);
  // Estado para almacenar las listas de traspasos
  const [transferLists, setTransferLists] = useState([]);
  // Estado para almacenar la lista seleccionada
  const [selectedList, setSelectedList] = useState(null);
  // Estado para almacenar el usuario actual
  const [currentUser, setCurrentUser] = useState(null);
  // Estado para almacenar el nombre de la lista a crear
  const [listName, setListName] = useState("");
  // Estado para controlar la visibilidad del formulario de creación de lista
  const [showCreateList, setShowCreateList] = useState(false);
  // Estado para mostrar un mensaje de éxito en caso de que no haya errores
  const [successMessage, setSuccessMessage] = useState('');
  // Estado para mostrar un mensaje de error en caso de que haya errores
  const [errorMessage, setErrorMessage] = useState('');
  // Estado para mostrar un mensaje de aviso si el transfer ya está en la lista de traspasos
  const [warningMessage, setWarningMessage] = useState('');
    // Estado para mostrar un mensaje de aviso si el transfer ya está en la lista de traspasos
  const [modalSuccessMessage, setModalSuccessMessage] = useState('');

  // useEffect para cargar los datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener el usuario actual
        const currentUserResponse = await axios.get(`${API_URL}/current-user/`, {
          withCredentials: true,
        });
        setCurrentUser(currentUserResponse.data);

        // Obtener la lista de jugadores
        const jugadoresResponse = await axios.get(`${API_URL}/player-search/`, {
          headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
        const jugadoresData = jugadoresResponse.data;
        if (jugadoresData.jugadores) {
          setJugadores(jugadoresData.jugadores);
        }

        // Obtener las listas de traspasos
        const transferListsResponse = await axios.get(`${API_URL}/transfer-lists/`, {
          headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        setTransferLists(transferListsResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  // Función para manejar el envío del formulario de búsqueda
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/player-search/`,
        { nombre: nombreJugador },
        {
          headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const data = response.data;
      if (data.jugadores) {
        setResultados(data.jugadores);
      }
    } catch (error) {
      setErrorMessage(error.response.data)
      console.log(error);
    }
  };

  // Función para manejar el cambio en el input de nombre del jugador
  const handleInputChange = (event) => {
    setNombreJugador(event.target.value);
  };

  // Función para abrir el modal y obtener los traspasos del jugador seleccionado
  const openModal = async (jugador) => {
    setSelectedPlayer(jugador);
    setCurrentTransferIndex(0);
    try {
      const response = await axios.get(
        `${API_URL}/player-transfers/${jugador.nombre}/`,
        {
          headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const data = response.data;

      if (data.transfers) {
        setPlayerTransfers(data.transfers.map((transfer) => ({ ...transfer, jugador })));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Función para cerrar el modal y limpiar los datos del jugador seleccionado
  const closeModal = () => {
    setSelectedPlayer(null);
    setPlayerTransfers([]);
    setCurrentTransferIndex(0);
  };

  // Función para mostrar el siguiente traspaso en el modal
  const handleNextTransfer = () => {
    setCurrentTransferIndex((prevIndex) =>
      prevIndex === playerTransfers.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Función para mostrar el traspaso anterior en el modal
  const handlePrevTransfer = () => {
    setCurrentTransferIndex((prevIndex) =>
      prevIndex === 0 ? playerTransfers.length - 1 : prevIndex - 1
    );
  };

  // Función para añadir el traspaso seleccionado a la lista de traspasos
  const handleAddToTransferList = async () => {
    if (selectedList && selectedPlayer && playerTransfers.length > 0) {
      const selectedTransfer = playerTransfers[currentTransferIndex];

      const isTransferInList = selectedList.transfers.some(
        (transfer) => transfer.id === selectedTransfer.id
      );
      if (isTransferInList) {
        setWarningMessage('El traspaso ya está en la lista de traspasos.');
        return;
      }

      const newTransfer = {
        transfer: {
          id: selectedTransfer.id,
          nombre: selectedPlayer.nombre,
          enlace: selectedPlayer.enlace,
          temporada: selectedTransfer.temporada,
          coste: selectedTransfer.coste,
          valor_mercado: selectedTransfer.valor_mercado,
          fecha: selectedTransfer.fecha,
          ultimo_club: selectedTransfer.ultimo_club,
          nuevo_club: selectedTransfer.nuevo_club,
        },
      };
      try {
        const response = await axios.post(
          `${API_URL}/transfer-lists/${selectedList.id}/add-transfer/`,
          newTransfer,
          {
            headers: {
              "X-CSRFToken": Cookies.get("csrftoken"),
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }

        );
        const updatedTransferLists = transferLists.map((list) =>
          list.id === selectedList.id ? response.data : list
        );
        setTransferLists(updatedTransferLists);
        setSelectedList(response.data);
        setModalSuccessMessage(response.data.message);
      } catch (error) {
        setWarningMessage(error);
      }
    }
  };

  // Función para crear una nueva lista de traspasos
  const handleCreateTransferList = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/transfer-lists/`,
        {
          name: listName,
          transfers: [selectedPlayer],
          user_id: currentUser?.id,
        },
        {
          headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setTransferLists([...transferLists, response.data]);
      setSelectedList(response.data);
      setListName("");
    } catch (error) {
      console.log(error);
    }
  };

  // Función para agrupar los jugadores por nombre y ordenarlos por el último traspaso
  const agruparJugadores = () => {
    const agrupados = resultados.reduce((acc, jugador) => {
      const existingJugador = acc.find((j) => j.nombre === jugador.nombre);
      if (existingJugador) {
        existingJugador.transfers = existingJugador.transfers || [];
        if (jugador.transfers && jugador.transfers.length > 0) {
          existingJugador.transfers.push(...jugador.transfers);
        }
      } else {
        const newJugador = { ...jugador };
        newJugador.transfers = jugador.transfers || [];
        acc.push(newJugador);
      }
      return acc;
    }, []);

    agrupados.sort((a, b) => {
      const aTransfers = a.transfers || [];
      const bTransfers = b.transfers || [];
      const aLatestTransferYear = Math.max(...aTransfers.map((transfer) => transfer.temporada), 0);
      const bLatestTransferYear = Math.max(...bTransfers.map((transfer) => transfer.temporada), 0);
      return bLatestTransferYear - aLatestTransferYear;
    });

    return agrupados;
  };

  // Obtener los jugadores agrupados por nombre y ordenados por traspasos
  const jugadoresAgrupados = agruparJugadores();

  return (
    <div>
      <div className="container mt-4">
        <h2 className="text-center">Búsqueda de jugadores</h2>
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
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8 col-sm-10">
            <form onSubmit={handleSubmit} className="d-flex">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Nombre del jugador"
                value={nombreJugador}
                onChange={handleInputChange}
                style={{ width: "70%" }}
              />
              <button type="submit" className="btn btn-primary">
                Buscar
              </button>
            </form>

            {/* Mostrar los jugadores agrupados */}
            {jugadoresAgrupados.length > 0 && (
              <div className="mt-4 min-vh-100">
                {jugadoresAgrupados.map((jugador) => (
                  <div key={jugador.id}>
                    <div
                      className="card mb-3"
                      onClick={() => openModal(jugador)}
                      style={{ cursor: "pointer" }}
                      data-toggle="modal"
                      data-target="#playerModal"
                    >
                      <div className="card-body">
                        <h5 className="card-title">{jugador.nombre}</h5>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal show={selectedPlayer !== null} onHide={closeModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Traspasos de {selectedPlayer && selectedPlayer.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalSuccessMessage && (
            <div className="alert alert-success" role="alert">
              {modalSuccessMessage}
            </div>
          )}
          {playerTransfers.length > 0 ? (
            <>
              <div className="d-flex justify-content-between">
                <button className="btn btn-primary" onClick={handlePrevTransfer}>
                  &lt;
                </button>
                <button className="btn btn-primary" onClick={handleNextTransfer}>
                  &gt;
                </button>
              </div>
              <div className="card mb-3">
                <div className="card-body">
                  <p>
                    <strong>Temporada:</strong> {playerTransfers[currentTransferIndex].temporada}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {playerTransfers[currentTransferIndex].fecha}
                  </p>
                  <p>
                    <strong>Último club:</strong> {playerTransfers[currentTransferIndex].ultimo_club}
                  </p>
                  <p>
                    <strong>Nuevo club:</strong> {playerTransfers[currentTransferIndex].nuevo_club}
                  </p>
                  <p>
                    <strong>Valor de mercado:</strong> {playerTransfers[currentTransferIndex].valor_mercado}
                  </p>
                  <p>
                    <strong>Coste:</strong> {playerTransfers[currentTransferIndex].coste}
                  </p>
                </div>
              </div>
              {/* Agrega la opción de seleccionar lista existente */}
              <div className="form-group">
                <label htmlFor="selectList">Seleccionar lista existente:</label>
                <select
                  className="form-control"
                  id="selectList"
                  value={selectedList ? selectedList.id : ""}
                  onChange={(e) => {
                    const selectedListId = e.target.value;
                    const list = transferLists.find((list) => list.id === parseInt(selectedListId));
                    setSelectedList(list);
                  }}
                >
                  <option value="">Seleccionar lista...</option>
                  {transferLists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <p>No se encontraron traspasos para este jugador.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          {currentUser && (
            <>
              {!selectedList && (
                <button className="btn btn-primary" onClick={() => setShowCreateList(true)}>
                  Crear lista de traspasos
                </button>
              )}
              {selectedList && (
                <button
                  className="btn btn-primary"
                  onClick={handleAddToTransferList}
                >
                  Añadir a la lista de traspasos
                </button>
              )}
            </>
          )}
          {warningMessage && (
            <div className="alert alert-warning" role="alert">
              {warningMessage}
            </div>
          )}
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
        </Modal.Footer>
      </Modal>
      {/* Modal para crear una nueva lista de traspasos */}
      <Modal show={showCreateList} onHide={() => setShowCreateList(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Crear lista de traspasos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="listName">Nombre de la lista:</label>
            <input
              type="text"
              className="form-control"
              id="listName"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={handleCreateTransferList}>
            Crear
          </button>
          <button className="btn btn-secondary" onClick={() => setShowCreateList(false)}>
            Cancelar
          </button>
        </Modal.Footer>
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      </Modal>
    </div>
  );
};

export default PlayerSearch;
