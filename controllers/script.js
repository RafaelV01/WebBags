import { getAllBags } from "./data.js"; // Asegúrate de que esta función exista en tu archivo data.js

document.addEventListener("DOMContentLoaded", async () => {
    const productsListElement = document.getElementById("products-list");

    try {
        const bags = await getAllBags(); // Asegúrate de que esta función devuelva una lista de bolsos
        renderBags(bags);
    } catch (error) {
        console.error("Error al obtener la lista de bolsos:", error);
    }

    function renderBags(bags) {
        productsListElement.innerHTML = "";
        bags.forEach(bag => {
            const listItem = document.createElement("li");
            listItem.className = "product-list-item";

            if (bag.imageUrl) {
                const bagImage = document.createElement("img");
                bagImage.src = bag.imageUrl;
                bagImage.alt = `Imagen de ${bag.name}`;
                bagImage.className = "product-image";
                listItem.appendChild(bagImage);
            }

            const bagInfo = document.createElement("div");
            bagInfo.textContent = `Nombre: ${bag.name}, Precio: $${bag.price}`;
            bagInfo.className = "product-info";

            const detailsButton = document.createElement("button");
            detailsButton.textContent = "Detalles";
            detailsButton.className = "details-button";
            detailsButton.addEventListener("click", () => showProductDetails(bag.name, bag.description, `$${bag.price}`, bag.imageUrl));

            listItem.appendChild(bagInfo);
            listItem.appendChild(detailsButton);

            productsListElement.appendChild(listItem);
        });
    }
});
