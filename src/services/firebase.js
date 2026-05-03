import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBBIm5bA_UDNKpLSUOV3VWJqR6jlL4dDvI",
    authDomain: "mr-embalagens.firebaseapp.com",
    projectId: "mr-embalagens",
    storageBucket: "mr-embalagens.firebasestorage.app",
    messagingSenderId: "1061293403647",
    appId: "1:1061293403647:web:14bbc57ddbda0a05b98bca"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);