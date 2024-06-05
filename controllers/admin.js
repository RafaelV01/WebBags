import { getAllBags, addBag, deleteBag, getBag, updateBagData, db } from "./data.js";
import { logOut, archivoimg, createUserEmailPassword } from "./global.js";
import { setDoc, collection, doc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const logoutBtn = document.getElementById("logout-btn");
const createBagBtn = document.getElementById("create-bag-btn");
const bagsListElement = document.getElementById("bags-list");

logoutBtn.addEventListener("click", () => {
  logOut().then(() => {
    window.location.href = "..//index.html";
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    bagsListElement.innerHTML = "";

    const bags = await getAllBags();
    renderBags(bags);

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Buscar por nombre";
    const searchBtn = document.createElement("button");
    searchBtn.textContent = "Buscar";
    searchBtn.addEventListener("click", async () => {
      const searchValue = searchInput.value.trim().toLowerCase();
      const filteredBags = bags.filter(bag => bag.name.toLowerCase().includes(searchValue));
      filteredBags.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
      renderBags(filteredBags);
    });

    bagsListElement.appendChild(searchInput);
    bagsListElement.appendChild(searchBtn);
  } catch (error) {
    console.error("Error al obtener la lista de bolsos:", error);
  }
});

createBagBtn.addEventListener("click", async () => {
  const card = document.createElement("div");
  card.className = "card";

  const form = document.createElement("form");

  const table = document.createElement("table");

  const nameRow = table.insertRow();
  const nameLabel = nameRow.insertCell();
  nameLabel.textContent = "Nombre:";
  const nameInputCell = nameRow.insertCell();
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.id = "bag-name";
  nameInput.name = "bagName";
  nameInputCell.appendChild(nameInput);

  const descriptionRow = table.insertRow();
  const descriptionLabel = descriptionRow.insertCell();
  descriptionLabel.textContent = "Descripción:";
  const descriptionInputCell = descriptionRow.insertCell();
  const descriptionInput = document.createElement("input");
  descriptionInput.type = "text";
  descriptionInput.id = "description";
  descriptionInput.name = "description";
  descriptionInputCell.appendChild(descriptionInput);

  const priceRow = table.insertRow();
  const priceLabel = priceRow.insertCell();
  priceLabel.textContent = "Precio:";
  const priceInputCell = priceRow.insertCell();
  const priceInput = document.createElement("input");
  priceInput.type = "number";
  priceInput.id = "price";
  priceInput.name = "price";
  priceInputCell.appendChild(priceInput);

  const imageRow = table.insertRow();
  const imageLabel = imageRow.insertCell();
  imageLabel.textContent = "Imagen:";
  const imageInputCell = imageRow.insertCell();
  const imageInput = document.createElement("input");
  imageInput.type = "file";
  imageInput.id = "fileimg";
  imageInput.name = "fileimg";
  imageInputCell.appendChild(imageInput);

  const createButton = document.createElement("button");
  createButton.textContent = "Crear Bolso";
  createButton.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const urlimagen = document.getElementById('fileimg').files[0];
      let imageUrl = '';
      if (urlimagen) {
        imageUrl = await archivoimg(urlimagen, nameInput.value);
      }

      await addBag(Date.now().toString(), nameInput.value, descriptionInput.value, priceInput.value, imageUrl);
      alert("Bolso creado correctamente.");
      card.remove();
    } catch (error) {
      console.error("Error al crear bolso:", error);
      alert("Error al crear bolso. Consulte la consola para más detalles.");
    }
  });

  form.appendChild(table);
  form.appendChild(createButton);
  card.appendChild(form);
  bagsListElement.appendChild(card);
});

async function deleteBagData(bagId) {
  console.log("Tratando de borrar");

  try {
    await deleteBag(bagId);
    alert("Bolso eliminado.");
    location.reload();
  } catch (error) {
    console.error("Error al eliminar datos del bolso:", error.code);

    switch (error.code) {
      case 'permission-denied':
        alert("Permisos insuficientes para eliminar el bolso.");
        break;
      case 'not-found':
        alert("Bolso no encontrado.");
        break;
      default:
        alert("Error al eliminar bolso: " + error.message);
        break;
    }
  }
}

async function editBag(bagId) {
  const bagData = await getBag(bagId);

  const card = document.createElement("div");
  card.className = "card";

  const form = document.createElement("form");

  const nameLabel = document.createElement("label");
  nameLabel.textContent = "Nombre:";
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.value = bagData.name || '';
  nameInput.id = "edit-bag-name";
  nameInput.name = "editBagName";

  const descriptionLabel = document.createElement("label");
  descriptionLabel.textContent = "Descripción:";
  const descriptionInput = document.createElement("input");
  descriptionInput.type = "text";
  descriptionInput.value = bagData.description || '';
  descriptionInput.id = "edit-description";
  descriptionInput.name = "editdescription";

  const priceLabel = document.createElement("label");
  priceLabel.textContent = "Precio:";
  const priceInput = document.createElement("input");
  priceInput.type = "number";
  priceInput.value = bagData.price || '';
  priceInput.id = "edit-price";
  priceInput.name = "editPrice";

  const imageLabel = document.createElement("label");
  imageLabel.textContent = "Imagen:";
  const imageInput = document.createElement("input");
  imageInput.type = "file";
  imageInput.id = "edit-fileimg";
  imageInput.name = "editFileimg";

  const updateButton = document.createElement("button");
  updateButton.textContent = "Actualizar";
  updateButton.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const newData = {};
  
      if (nameInput.value.trim() !== '') {
        newData.name = nameInput.value;
      }
      if (descriptionInput.value.trim() !== '') {
        newData.description = descriptionInput.value;
      }
      if (priceInput.value.trim() !== '') {
        newData.price = priceInput.value;
      }
  
      const newImage = document.getElementById('edit-fileimg').files[0];
      if (newImage) {
        const imageURL = await archivoimg(newImage, bagData.name);
        newData.imageUrl = imageURL;
      }
  
      if (Object.keys(newData).length !== 0) {
        await updateBagData(bagId, newData);
        alert("Datos del bolso actualizados correctamente.");
        location.reload();
      } else {
        alert("No se han realizado cambios.");
      }
    } catch (error) {
      console.error("Error al actualizar datos del bolso:", error.message);
      alert("Error al actualizar datos del bolso. Consulte la consola para más detalles.");
    }
  });

  form.appendChild(nameLabel);
  form.appendChild(nameInput);
  form.appendChild(descriptionLabel);
  form.appendChild(descriptionInput);
  form.appendChild(priceLabel);
  form.appendChild(priceInput);
  form.appendChild(imageLabel);
  form.appendChild(imageInput);
  form.appendChild(updateButton);
  card.appendChild(form);

  bagsListElement.appendChild(card);
}

function renderBags(bags) {
  bagsListElement.innerHTML = "";
  bags.forEach((bag) => {
    const listItem = document.createElement("li");
    listItem.className = "bag-list-item";

    if (bag.imageUrl) {
      const bagImage = document.createElement("img");
      bagImage.src = bag.imageUrl;
      bagImage.alt = `Imagen de ${bag.name}`;
      bagImage.className = "bag-image";
      listItem.appendChild(bagImage);
    }

    const bagInfo = document.createElement("div");
    bagInfo.textContent = `ID: ${bag.id}, Nombre: ${bag.name}, Descripción: ${bag.description}, Precio: ${bag.price}`;
    bagInfo.className = "bag-info";

    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.className = "edit-button";
    editButton.addEventListener("click", () => editBag(bag.id));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", () => deleteBagData(bag.id));

    listItem.appendChild(bagInfo);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    bagsListElement.appendChild(listItem);
  });
}


