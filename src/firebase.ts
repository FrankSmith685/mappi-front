// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCNkyWaU6qBB3osB-uEbhZ7ue_DpE-rK7k",
  authDomain: "mappi-2025.firebaseapp.com",
  projectId: "mappi-2025",
  storageBucket: "mappi-2025.firebasestorage.app",
  messagingSenderId: "710705516371",
  appId: "1:710705516371:web:0259b632b11d4958689ba6",
  measurementId: "G-CNPMKJF955"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account"
});
