import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA8CApxvvn0aiMqP8LAMJw2xwxA1c-CAEI",
  authDomain: "niveshak-2645d.firebaseapp.com",
  projectId: "niveshak-2645d",
  storageBucket: "niveshak-2645d.firebasestorage.app",
  messagingSenderId: "1055963991761",
  appId: "1:1055963991761:web:22243a61d2a138ed587ff0",
  measurementId: "G-H4E359QLHN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
