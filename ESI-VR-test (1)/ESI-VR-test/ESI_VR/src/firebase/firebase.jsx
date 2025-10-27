// Importar SDKs de Firebase
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Configuración de la App web
const firebaseConfig = {
  apiKey: "AIzaSyCaTzLFw89B-iTMqK_20nDX2ceSNakqYEg",
  authDomain: "esivr-72915.firebaseapp.com",
  projectId: "esivr-72915",
  storageBucket: "esivr-72915.firebasestorage.app",
  messagingSenderId: "140713675854",
  appId: "1:140713675854:web:43cecec20a320c1d8a471f"
};

// Iniciar Firebase
const app = initializeApp(firebaseConfig);

// Exportar Firestore
export const db = getFirestore(app);

// Exportar Auth
export const auth = getAuth(app);

// Persistencia: para mantener la sesión activa
setPersistence(auth, browserLocalPersistence);

// Proveedor de Google
export const googleProvider = new GoogleAuthProvider();