import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAa8eSZyi1ZCF-N9DwYm-aCldmp3TL6lJg",
    authDomain: "geynius-d495d.firebaseapp.com",
    projectId: "geynius-d495d",
    storageBucket: "geynius-d495d.appspot.com",
    messagingSenderId: "1092792481266",
    appId: "1:1092792481266:web:6c3e72884c23b9a641276b",
    measurementId: "G-B7XB221K0D"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 
export const googleProvider = new GoogleAuthProvider();
export const registerWithEmail = createUserWithEmailAndPassword;
export const loginWithEmail = signInWithEmailAndPassword;
export const loginWithGoogle = signInWithPopup;

import { sendPasswordResetEmail } from "firebase/auth";
import { getStorage } from "firebase/storage";

export const resetPassword = async (auth: any, email: string) => {
  return sendPasswordResetEmail(auth, email);
};
