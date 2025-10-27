import React, { useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

function Alumnos() {
  useEffect(() => {
    const cargarAlumnos = async () => {
      try {
        const alumnosRef = collection(db, "Alumnos");

        // Se insertan 3 documentos en la colección
        await addDoc(alumnosRef, {
          nombre: "Juan Gomez",
          curso: "5to grado"
        });

        await addDoc(alumnosRef, {
          nombre: "Ana Fran",
          curso: "2do grado"
        });

        await addDoc(alumnosRef, {
          nombre: "Omar Perez",
          curso: "3er grado"
        });

        console.log("Alumnos agregados con éxito");
      } catch (error) {
        console.error("Error, no se pudieron agregar los alumnos.", error);
      }
    };

    cargarAlumnos();
  }, []);

  return (
    <div>
      <h1>Colección Alumnos</h1>
      <p>Se cargaron 3 documentos en Firestore.</p>
    </div>
  );
}

export default Alumnos;
