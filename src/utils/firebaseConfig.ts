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
    apiKey: "AIzaSyDdQdCh-aUdHC34cNxSUiB2P9j4Cp7yX7w",
    authDomain: "geynius-d495d.firebaseapp.com",
    projectId: "geynius-d495d",
    storageBucket: "geynius-d495d.appspot.com",
    messagingSenderId: "1092792481266",
    appId: "1:1092792481266:web:c2bcc6cffe495ab941276b",
    measurementId: "G-J5MEXDELJQ"


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
