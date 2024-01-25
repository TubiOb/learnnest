import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';


const firebaseConfig = {
  apiKey: "AIzaSyClmaNExEnbBT2vkET6OgbibVUwZmRvl-0",
  authDomain: "learnnest-3cb0b.firebaseapp.com",
  projectId: "learnnest-3cb0b",
  storageBucket: "learnnest-3cb0b.appspot.com",
  messagingSenderId: "209551083186",
  appId: "1:209551083186:web:16c34b9dc9ff5d6c1b6bab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const database = getDatabase(app);