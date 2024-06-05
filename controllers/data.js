import { app } from "./global.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const db = getFirestore(app);

export { db }; 

export const getAllBags = async () => {
  const bagsSnapshot = await getDocs(collection(db, "bags"));
  const bagsList = [];
  bagsSnapshot.forEach((doc) => {
    bagsList.push({ id: doc.id, ...doc.data() }); 
  });
  return bagsList;
};

export const addBag = async (id, name, description, price, imageUrl) => 
  await setDoc(doc(collection(db, "bags"), id), {
    id: id,
    name: name,
    description: description,
    price: price,
    imageUrl: imageUrl 
  });

export const getBag = async (id) => await getDoc(doc(db, "bags", id));

export const deleteBag = async (id) => 
  await deleteDoc(doc(db, "bags", id));

export const updateBagData = async (id, newData) => {
  try {
    const bagRef = doc(db, "bags", id);
    await updateDoc(bagRef, newData);
    console.log("Datos del bolso actualizados correctamente.");
    return true;
  } catch (error) {
    console.error("Error al actualizar datos del bolso:", error);
    return false;
  }
};

export const getAllUsers = async () => {
  const usersSnapshot = await getDocs(collection(db, "users"));
  const usersList = [];
  usersSnapshot.forEach((doc) => {
    usersList.push({ id: doc.id, ...doc.data() }); // Incluye el ID del documento
  });
  return usersList;
};

export const addData = async (id, fullName, email, cc, imageUrl) => 
  await setDoc(doc(collection(db, "users"), id), {
    id: id,
    fullName: fullName,
    email: email,
    adm: false,
    cc: cc,
    imageUrl: imageUrl // Agrega la URL de la imagen
  });

// Función para obtener datos de un usuario específico
export const getData = async (id) => await getDoc(doc(db, "users", id));

// Función para eliminar datos de un usuario
export const deleteDataUser = async (id) => 
  await deleteDoc(doc(db, "users", id));

// Función para actualizar datos de un usuario
export const updateUserData = async (id, newData) => {
  try {
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, newData);
    console.log("Datos de usuario actualizados correctamente.");
    return true;
  } catch (error) {
    console.error("Error al actualizar datos del usuario:", error);
    return false;
  }
};
