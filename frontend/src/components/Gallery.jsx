import React, { useState, useEffect } from "react";
import axios from "axios";
import "../static/css/Gallery.css";
import { API_URL } from "../config";

function Gallery() {
    // Estado para almacenar el índice de la imagen activa
    const [activeImgIndex, setActiveImgIndex] = useState(0);

    // Estado para almacenar las URLs de las imágenes de la galería
    const [galleryImgs, setGalleryImgs] = useState([]);

    useEffect(() => {
        // Función para obtener la lista de imágenes de la galería utilizando Axios
        async function fetchGalleryImages() {
            try {
                const response = await axios.get(`${API_URL}/gallery/`);
                const data = response.data;
                const images = data.map(image => image);
                console.log(response.data);
                setGalleryImgs(images);
            } catch (error) {
                console.error('Error fetching gallery images:', error);
                setGalleryImgs([]);
            }


        }

        // Llamar a la función para obtener la lista de imágenes al cargar el componente
        fetchGalleryImages();

        // Configurar un intervalo para cambiar la imagen activa cada 5 segundos
        const interval = setInterval(() => {
            setActiveImgIndex(prevIndex => (prevIndex + 1) % galleryImgs.length);
        }, 5000);

        // Limpiar el intervalo cuando el componente se desmonta o cuando el índice de imagen activa cambia
        return () => clearInterval(interval);
}, [galleryImgs.length]);

    return (
        <div className="gallery">
            {galleryImgs.map((img, index) => (
                <img
                    key={index}
                    src={img}
                    alt={`Imagen ${index + 1}`}
                    className={index === activeImgIndex ? "active" : ""}
                />
            ))}
        </div>
    );
}

export default Gallery;
