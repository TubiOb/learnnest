import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';


const firebaseConfig = {
  apiKey: "AIzaSyA6TOBZprTDJaz8qS8YEhdRcaybZyukFUk",
  authDomain: "learnnest-df401.firebaseapp.com",
  projectId: "learnnest-df401",
  storageBucket: "learnnest-df401.appspot.com",
  messagingSenderId: "187651218086",
  appId: "1:187651218086:web:9a2a6e53d75d4c28cd3267"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const database = getDatabase(app);