import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    // apiKey: "AIzaSyAo5iVUyfEfY2fA79fULKMKz0vFdCQi1xE",
    // authDomain: "vibez-2120e.firebaseapp.com",
    // databaseURL: "https://vibez-2120e.firebaseio.com",
    // projectId: "vibez-2120e",
    // storageBucket: "vibez-2120e.appspot.com",
    // messagingSenderId: "902893329566",
    // appId: "1:902893329566:web:7e9484bd398275a603af8f",
    // measurementId: "G-846YPSLLY3"
    apiKey: "AIzaSyCP51qDrQTHIloKsMJH7Qh3comKqQfGIfc",
  authDomain: "airplay-c007d.firebaseapp.com",
  databaseURL: "https://airplay-c007d.firebaseio.com",
  projectId: "airplay-c007d",
  storageBucket: "airplay-c007d.appspot.com",
  messagingSenderId: "254970112011",
  appId: "1:254970112011:web:6612c3ae4bfc088397bf0e",
  measurementId: "G-TLDQQGV7B5"

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
