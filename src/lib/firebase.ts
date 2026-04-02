import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCRnKhINNJhgIEo6JxxqEjaVTlU1TSpZ2M",
  authDomain: "cryptochat-d9549.firebaseapp.com",
  projectId: "cryptochat-d9549",
  storageBucket: "cryptochat-d9549.firebasestorage.app",
  messagingSenderId: "442870378718",
  appId: "1:442870378718:web:6f90f4e04497a52959d24f",
  measurementId: "G-GN7S1TXJ57",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

