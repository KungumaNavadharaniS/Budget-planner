import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
const firebaseConfig = {

    apiKey: "AIzaSyA7aUcowSWU8xI08Jz9aWKjVKBxwxnIXAE",
    authDomain: "budget-planner-3320c.firebaseapp.com",
    projectId: "budget-planner-3320c",
    storageBucket: "budget-planner-3320c.firebasestorage.app",
    messagingSenderId: "458825684135",
    appId: "1:458825684135:web:9b35a9e8dfcf39c0b53782",
    measurementId: "G-WTXYVR868W"

};;
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);









