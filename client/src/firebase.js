// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-913ec.firebaseapp.com",
  projectId: "mern-blog-913ec",
  storageBucket: "mern-blog-913ec.firebasestorage.app",
  messagingSenderId: "1085632653020",
  appId: "1:1085632653020:web:14954b983484ed69437619",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);


