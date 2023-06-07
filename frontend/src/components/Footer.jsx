import React, { useState } from "react";
import "../static/css/Footer.css";

const Footer = () => {
    // Estados para controlar la visualización de secciones
    const [contactoShow, setContactoShow] = useState(false);
    const [siguenosShow, setSiguenosShow] = useState(false);
    const [enlacesInteresShow, setEnlacesInteresShow] = useState(false);

    // Funciones para alternar la visualización de secciones
    const toggleContacto = () => {
        setContactoShow(!contactoShow);
    };

    const toggleSiguenos = () => {
        setSiguenosShow(!siguenosShow);
    };

    const toggleEnlacesInteres = () => {
        setEnlacesInteresShow(!enlacesInteresShow);
    };

    return (
        <footer className="bg-primary text-white">
            <div className="container py-2">
                <div className="row">
                    <div className="col-md-4 col-sm-6">
                        <h3 className="mb-4">
                            <button
                                aria-controls="collapseContacto"
                                aria-expanded={contactoShow}
                                className="btn btn-link collapsed slide-fwd-center text-white"
                                data-target="#collapseContacto"
                                data-toggle="collapse"
                                type="button"
                                onClick={toggleContacto}
                            >
                                Contacto
                            </button>
                        </h3>
                        <div
                            className={"collapse" + (contactoShow ? " show" : "")}
                            id="collapseContacto"
                            aria-labelledby="headingContacto"
                            data-parent="#accordionFooter"
                        >
                            <ul className="list-unstyled">
                                <li>
                                    <a
                                        href="mailto:info@rcdeportivo.es?Subject=Consulta"
                                        className="text-white"
                                    >
                                        info@rcdeportivo.es
                                    </a>
                                </li>
                                <li>
                                    <a href="tel:+34981253300" className="text-white">
                                        +34 981 253 300
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6">
                        <h3 className="mb-4">
                            <button
                                aria-controls="collapseSiguenos"
                                aria-expanded={siguenosShow}
                                className="btn btn-link collapsed slide-fwd-center text-white"
                                data-target="#collapseSiguenos"
                                data-toggle="collapse"
                                type="button"
                                onClick={toggleSiguenos}
                            >
                                Síguenos
                            </button>
                        </h3>
                        <div
                            className={"collapse" + (siguenosShow ? " show" : "")}
                            id="collapseSiguenos"
                            aria-labelledby="headingSiguenos"
                            data-parent="#accordionFooter"
                        >
                            <ul className="list-inline">
                                <li className="list-inline-item">
                                    <a
                                        href="https://www.facebook.com/rcdeportivo"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <i className="fab fa-facebook fa-2x text-white"></i>
                                    </a>
                                </li>
                                <li className="list-inline-item">
                                    <a
                                        href="https://twitter.com/rcdeportivo"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <i className={`fab fa-twitter fa-2x text-white`}></i>
                                    </a>
                                </li>
                                <li className="list-inline-item">
                                    <a
                                        href="https://www.instagram.com/rcdeportivo"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <i className={`fab fa-instagram fa-2x text-white`}></i>
                                    </a>
                                </li>
                                <li className="list-inline-item">
                                    <a
                                        href="https://es.linkedin.com/company/rcdeportivo"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <i className={`fab fa-linkedin fa-2x text-white`}></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6">
                        <h3 className="mb-4">
                            <button
                                aria-controls="collapseEnlacesInteres"
                                aria-expanded={enlacesInteresShow}
                                className="btn btn-link collapsed slide-fwd-center text-white"
                                data-target="#collapseEnlacesInteres"
                                data-toggle="collapse"
                                type="button"
                                onClick={toggleEnlacesInteres}
                            >
                                Enlaces de interés
                            </button>
                        </h3>
                        <div
                            className={"collapse" + (enlacesInteresShow ? " show" : "")}
                            id="collapseEnlacesInteres"
                            aria-labelledby="headingEnlacesInteres"
                            data-parent="#accordionFooter"
                        >
                            <ul className="list-unstyled">
                                <li>
                                    <a href="https://www.rcdeportivo.es/" className="text-white">
                                        Web oficial
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://tienda.rcdeportivo.es/"
                                        className="text-white"
                                    >
                                        Tienda oficial
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://abonos.rcdeportivo.es/"
                                        className="text-white"
                                    >
                                        Abonos
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="bg-light my-2" />
                <div className="row">
                    <div className="col-md-12 text-center">
                        <p className="mb-0">
                            Todos los derechos reservados © Real Club Deportivo de La Coruña{" "}
                            {new Date().getFullYear()}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
