import React, { useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

function Profesores() {
  useEffect(() => {
    const cargarProfesores = async () => {
      try {
        const profesoresRef = collection(db, "Profesores");

        // Se insertan 3 documentos en la colección
        await addDoc(profesoresRef, {
          nombre: "Juan Pérez",
          materia: "Matemáticas",
          experiencia: 10
        });

        await addDoc(profesoresRef, {
          nombre: "María López",
          materia: "Historia",
          experiencia: 7
        });

        await addDoc(profesoresRef, {
          nombre: "Carlos Sánchez",
          materia: "Física",
          experiencia: 12
        });

        console.log("Profesores agregados con éxito");
      } catch (error) {
        console.error("Error, no se pudieron agregar los profesores.", error);
      }
    };

    cargarProfesores();
  }, []);

  return (
    <div>
      <h1>Colección Profesores</h1>
      <p>Se cargaron 3 documentos en Firestore.</p>
    </div>
  );
}

export default Profesores;
