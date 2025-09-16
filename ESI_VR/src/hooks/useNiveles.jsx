import React, { useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

function Niveles() {
  useEffect(() => {
    const cargarNiveles = async () => {
      try {
        const nivelesRef = collection(db, "Niveles");

        // Se insertan 3 documentos en la colección
        await addDoc(nivelesRef, {
          nivel: 2
        });

        await addDoc(nivelesRef, {
          nivel: 1
        });

        await addDoc(nivelesRef, {
          nivel: 3
        });

        console.log("Niveles agregados con éxito");
      } catch (error) {
        console.error("Error, no se pudieron agregar los niveles.", error);
      }
    };

    cargarNiveles();
  }, []);

  return (
    <div>
      <h1>Colección Niveles</h1>
      <p>Se cargaron 3 documentos en Firestore.</p>
    </div>
  );
}

export default Niveles;
