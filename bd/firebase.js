// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBONMV_kgaZ8NdbQdmOdt7BPLEVNU56Nxg",
  authDomain: "pokeapimoriel.firebaseapp.com",
  projectId: "pokeapimoriel",
  storageBucket: "pokeapimoriel.appspot.com",
  messagingSenderId: "772075542721",
  appId: "1:772075542721:web:20883e2d5d34b8ef2f1c40"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export the initialized Firebase app and authentication module
export { app, auth, db };
