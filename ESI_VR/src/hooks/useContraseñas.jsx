import React, { useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

function Contraseñas() {
  useEffect(() => {
    const cargarContraseñas = async () => {
      try {
        const contraseñasRef = collection(db, "Profesores");

        // Se insertan 3 documentos en la colección
        await addDoc(contraseñasRef, {
        contraseña: 12345678
        });

        await addDoc(contraseñasRef, {
          contraseña:87654321
        });

        await addDoc(contraseñasRef, {
          contraseña: 12348765
        });

        console.log("Contraseñas agregadas con éxito");
      } catch (error) {
        console.error("Error, no se pudieron agregar las contraseñas.", error);
      }
    };

    cargarContraseñas();
  }, []);

  return (
    <div>
      <h1>Colección Contraseñas</h1>
      <p>Se cargaron 3 documentos en Firestore.</p>
    </div>
  );
}

export default Profesores;
