import React, { useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

function Correos() {
  useEffect(() => {
    const cargarCorreos = async () => {
      try {
        const correosRef = collection(db, "Correos");

        // Se insertan 3 documentos en la colección
        await addDoc(correosRef, {
          correo: "paper123@gmail.com"
        });

        await addDoc(correosRef, {
          correo: "5678@gmail.com"
        });

        await addDoc(correosRef, {
          correo: "1234@gmail.com"
        });

        // Correos agregados exitosamente
      } catch (error) {
        console.error("Error al agregar correos:", error);
      }
    };

    cargarCorreos();
  }, []);

  return (
    <div>
      <h1>Colección Correos</h1>
      <p>Se cargaron 3 documentos en Firestore.</p>
    </div>
  );
}

export default  Correos;
