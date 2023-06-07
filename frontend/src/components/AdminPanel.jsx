import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { Link } from "react-router-dom";
import { Table, Button } from "react-bootstrap";

const AdminPanel = () => {
  // Estados del componente
  const [playersLog, setPlayersLog] = useState([]); // Estado para almacenar los logs de jugadores
  const [scrapeLog, setScrapeLog] = useState([]); // Estado para almacenar los logs de traspasos
  const [selectedLog, setSelectedLog] = useState(null); // Estado para almacenar el log seleccionado
  const [expandedLogs, setExpandedLogs] = useState([]); // Estado para almacenar los logs expandidos
  const [currentPage, setCurrentPage] = useState(1); // Estado para almacenar la página actual de los logs
  const logsPerPage = 20; // Cantidad de logs por página

  // Maneja la acción de ver un log específico
  const handleViewLog = async (script) => {
    try {
      // Realiza una petición al servidor para obtener los logs correspondientes al script
      const response = await axios.get(`${API_URL}/logs/?script=${script}`, {
        withCredentials: true,
      });

      // Actualiza los estados según el script seleccionado
      if (script === "players") {
        setPlayersLog(response.data.logs.map((log) => ({ ...log, currentPage: 1 })));
        setScrapeLog([]);
        setSelectedLog(selectedLog === "players" ? null : "players");
      } else if (script === "scraper") {
        setScrapeLog(response.data.logs.map((log) => ({ ...log, currentPage: 1 })));
        setPlayersLog([]);
        setSelectedLog(selectedLog === "scraper" ? null : "scraper");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Formatea una fecha en el formato "dd/mm/yyyy"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Maneja el cambio de visibilidad de un log específico
  const handleToggleLog = (date, script) => {
    if (script === "players") {
      const playerLogs = playersLog.map((log) =>
        log.date === date ? { ...log, expanded: !log.expanded } : log
      );
      setPlayersLog(playerLogs);
    } else if (script === "scraper") {
      const scrapeLogs = scrapeLog.map((log) =>
        log.date === date ? { ...log, expanded: !log.expanded } : log
      );
      setScrapeLog(scrapeLogs);
    }
  };

  // Maneja el cambio de página en la paginación de los logs
  const handlePageChange = (date, script, pageNumber) => {
    if (script === "players") {
      const updatedPlayersLog = playersLog.map((log) => {
        if (log.date === date) {
          return {
            ...log,
            currentPage: pageNumber,
          };
        }
        return log;
      });
      setPlayersLog(updatedPlayersLog);
    } else if (script === "scraper") {
      const updatedScrapeLog = scrapeLog.map((log) => {
        if (log.date === date) {
          return {
            ...log,
            currentPage: pageNumber,
          };
        }
        return log;
      });
      setScrapeLog(updatedScrapeLog);
    }
  };

  // Renderiza los logs según el script seleccionado
  const renderLog = () => {
    if (selectedLog === "players") {
      return (
        <div>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Log</th>
              </tr>
            </thead>
            <tbody>
              {playersLog.map((log, index) => (
                <tr key={index}>
                  <td className="date-cell">{formatDate(log.date)}</td>
                  <td>
                    {expandedLogs.includes(log.date) ? (
                      <div className="log-details-content">
                        <pre>{log.changes_detected}</pre>
                        <Button
                          variant="primary"
                          onClick={() => handleToggleLog(log.date, "players")}
                        >
                          Ocultar
                        </Button>
                      </div>
                    ) : (
                      <div>
                        {log.changes_detected.split("\n").length >
                          logsPerPage ? (
                          <div>
                            <pre>
                              {log.changes_detected
                                .split("\n")
                                .slice(
                                  (log.currentPage - 1) * logsPerPage,
                                  log.currentPage * logsPerPage
                                )
                                .join("\n")}
                            </pre>
                            <div className="pagination text-center">
                              {log.currentPage > 1 && (
                                <Button
                                  variant="primary" className="mx-auto"
                                  onClick={() =>
                                    handlePageChange(
                                      log.date,
                                      "players",
                                      log.currentPage - 1
                                    )
                                  }
                                >
                                  &lt; Anterior
                                </Button>
                              )}
                              {log.changes_detected.split("\n").length >
                                log.currentPage * logsPerPage && (
                                  <Button
                                    variant="primary" className="mx-auto"
                                    onClick={() =>
                                      handlePageChange(
                                        log.date,
                                        "players",
                                        log.currentPage + 1
                                      )
                                    }
                                  >
                                    Siguiente &gt;
                                  </Button>
                                )}
                            </div>
                          </div>
                        ) : (
                          <pre>{log.changes_detected}</pre>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      );
    } else if (selectedLog === "scraper") {
      return (
        <div>
          <Table striped bordered hover responsive>

            <thead>
              <tr>
                <th>Fecha</th>
                <th>Log</th>
              </tr>
            </thead>            <tbody>
              {scrapeLog.map((log, index) => (
                <tr key={index}>
                  <td className="date-cell">{formatDate(log.date)}</td>
                  <td>
                    {expandedLogs.includes(log.date) ? (
                      <div className="log-details-content">
                        <pre>{log.changes_detected}</pre>
                        <Button
                          variant="primary"
                          onClick={() => handleToggleLog(log.date, "scraper")}
                        >
                          Ocultar
                        </Button>
                      </div>
                    ) : (
                      <div>
                        {log.changes_detected.split("\n").length >
                          logsPerPage ? (
                          <div>
                            <pre>
                              {log.changes_detected
                                .split("\n")
                                .slice(
                                  (log.currentPage - 1) * logsPerPage,
                                  log.currentPage * logsPerPage
                                )
                                .join("\n")}
                            </pre>
                            <div className="pagination text-center">
                              {log.currentPage > 1 && (
                                <Button
                                  variant="primary" className="mx-auto"
                                  onClick={() =>
                                    handlePageChange(
                                      log.date,
                                      "scraper",
                                      log.currentPage - 1
                                    )
                                  }
                                >
                                  &lt; Anterior
                                </Button>
                              )}
                              {log.changes_detected.split("\n").length >
                                log.currentPage * logsPerPage && (
                                  <Button
                                    variant="primary" className="mx-auto"
                                    onClick={() =>
                                      handlePageChange(
                                        log.date,
                                        "scraper",
                                        log.currentPage + 1
                                      )
                                    }
                                  >
                                    Siguiente &gt;
                                  </Button>
                                )}
                            </div>
                          </div>
                        ) : (
                          <pre>{log.changes_detected}</pre>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      );
    }
  };

  return (
    <div>
      <div className="admin-panel text-center">
        <h2>Panel de administración</h2>

        <div className="admin-panel-actions">
          <Button
            variant={selectedLog === "players" ? "primary" : "outline-primary"}
            onClick={() => handleViewLog("players")}
          >
            {selectedLog === "players" ? "Ocultar log de jugadores" : "Ver log de jugadores"}
          </Button>
          <Button
            variant={selectedLog === "scraper" ? "primary" : "outline-primary"}
            onClick={() => handleViewLog("scraper")}
          >
            {selectedLog === "scraper" ? "Ocultar log de traspasos" : "Ver log de traspasos"}
          </Button>
          <Button variant="outline-primary" className="mx-2 my-2 animate__animated animate__fadeIn primary">
            <Link className="nav-link" to="/gestion-usuarios/">
              Gestión de usuarios
            </Link>
          </Button>
        </div>
        {renderLog()}
      </div>
    </div>
  );

};

export default AdminPanel;
