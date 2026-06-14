import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCkf6Ui9m3amieZSVUaiL6JWsCQ8Sb0kAE",
  authDomain: "doctor-hub-97ff6.firebaseapp.com",
  projectId: "doctor-hub-97ff6",
  storageBucket: "doctor-hub-97ff6.firebasestorage.app",
  messagingSenderId: "531559894854",
  appId: "1:531559894854:web:d81edb2d61dd2caf5a5f47",
  measurementId: "G-JWEC6ZC9FC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
