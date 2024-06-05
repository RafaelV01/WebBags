// Importa las funciones necesarias de Firebase si aún no lo has hecho
import { getDoc, doc,  } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getDownloadURL, ref } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";
import { db, } from "./data.js";
import {archivoimg }from "./global.js"

// Importa las funciones necesarias de Firebase si aún no lo has hecho
import { getDoc, doc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "./firebaseConfig.js";

// Función para obtener los datos de los productos desde Firestore
export const getProductsData = async () => {
    try {
        const productsDoc = await getDoc(doc(db, "productos", "data"));
        if (productsDoc.exists()) {
            return productsDoc.data();
        } else {
            throw new Error("No se encontraron datos de productos en Firestore");
        }
    } catch (error) {
        throw new Error("Error al obtener los datos de productos: " + error.message);
    }
};

// Función para mostrar los productos en el carousel
export const mostrarProductos = async () => {
    try {
        const productsData = await getProductsData();
        const productList = document.getElementById("products-list");

        // Limpiar el contenido previo en caso de que ya haya elementos en la lista
        productList.innerHTML = "";

        // Iterar sobre los datos de los productos y crear elementos de lista para cada uno
        Object.values(productsData).forEach(producto => {
            const listItem = document.createElement("li");
            listItem.textContent = `${producto.nombre} - $${producto.precio}`;

            // Agregar el elemento de lista al elemento <ul>
            productList.appendChild(listItem);
        });
    } catch (error) {
        console.error(error.message);
    }
};

// Llamar a la función para mostrar los productos dentro del evento DOMContentLoaded
document.addEventListener("DOMContentLoaded", mostrarProductos);


// Función para obtener las imágenes del carrusel
export const getCarouselImgs = async () => {
    try {
        const carouselDoc = await getDoc(doc(db, "imagenes", "carousel"));
        if (carouselDoc.exists()) {
            const carouselData = carouselDoc.data();
            // Procesa los datos del carrusel según sea necesario
            // Por ejemplo, puedes iterar sobre los datos y obtener las URL de las imágenes
            const carouselImgUrls = Object.values(carouselData);
            return carouselImgUrls;
        } else {
            throw new Error("No se encontraron datos del carrusel en Firestore");
        }
    } catch (error) {
        throw new Error("Error al obtener las imágenes del carrusel: " + error.message);
    }
};

// Llama a la función getCarouselImgs dentro del evento DOMContentLoaded
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const carouselImgUrls = await getCarouselImgs();
        // Procesa las URL de las imágenes y actualiza la UI del carrusel
        // Por ejemplo, puedes iterar sobre las URL y agregar las imágenes al carrusel
        const carouselInner = document.getElementById("carousel-inner");
        const carouselIndicators = document.getElementById("carousel-indicators");

        carouselImgUrls.forEach((imageUrl, index) => {
            // Crea un elemento div para la imagen
            const carouselItem = document.createElement("div");
            carouselItem.classList.add("carousel-item");

            // Crea un elemento img para la imagen
            const img = document.createElement("img");
            img.src = imageUrl;
            img.classList.add("d-block", "w-100");

            // Agrega la imagen al elemento div
            carouselItem.appendChild(img);

            // Agrega el elemento div al carrusel
            carouselInner.appendChild(carouselItem);

            // Crea un elemento li para el indicador
            const indicator = document.createElement("li");
            indicator.setAttribute("data-target", "#carouselExampleIndicators");
            indicator.setAttribute("data-slide-to", index.toString());
            if (index === 0) {
                indicator.classList.add("active");
            }

            // Agrega el indicador al elemento ol
            carouselIndicators.appendChild(indicator);
        });

        // Activa el carrusel
        $(".carousel").carousel();
    } catch (error) {
        console.error(error.message);
    }
});
