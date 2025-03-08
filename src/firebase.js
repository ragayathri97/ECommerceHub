import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDfMzh4IYeD3L0O7NDSg_yeyH6F4RExzvQ",
  authDomain: "ecommercehub-ad1de.firebaseapp.com",
  projectId: "ecommercehub-ad1de",
  storageBucket: "ecommercehub-ad1de.firebasestorage.app",
  messagingSenderId: "52420995270",
  appId: "1:52420995270:web:26f4086a080adeca950fc7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);