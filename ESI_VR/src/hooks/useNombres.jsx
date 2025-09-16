import React, { useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

function Nombres() {
  useEffect(() => {
    const cargarNombres = async () => {
      try {
        const nombresRef = collection(db, "Nombres");

        // Se insertan 3 documentos en la colección
        await addDoc(nombresRef, {
          nombre: "Juan Pérez",
        });

        await addDoc(nombresRef, {
          nombre: "María López",
        });

        await addDoc(nombresRef, {
          nombre: "Carlos Sánchez",
        });

        console.log("Nombres agregados con éxito");
      } catch (error) {
        console.error("Error, no se pudieron agregar los Nombress.", error);
      }
    };

    cargarNombres();
  }, []);

  return (
    <div>
      <h1>Colección Nombres</h1>
      <p>Se cargaron 3 documentos en Firestore.</p>
    </div>
  );
}

export default Nombres;
