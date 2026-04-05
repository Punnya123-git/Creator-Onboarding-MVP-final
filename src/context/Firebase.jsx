import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDk9nMvOHPNx7umWfO0eyuIqCTe1ndL6d0",
    authDomain: "creator-app-cf391.firebaseapp.com",
    projectId: "creator-app-cf391",
    storageBucket: "creator-app-cf391.firebasestorage.app",
    messagingSenderId: "956937793006",
    appId: "1:956937793006:web:37dec7acdf9d5f292fb2ff"
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();