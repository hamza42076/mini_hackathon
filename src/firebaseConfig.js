// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,createUserWithEmailAndPassword ,signInWithEmailAndPassword} from "firebase/auth";
import { getFirestore,collection,addDoc,getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZo54gw02DVu-yf76zE0Sm-NMP0_86tTU",
  authDomain: "mini-hackaton-eb6c8.firebaseapp.com",
  projectId: "mini-hackaton-eb6c8",
  storageBucket: "mini-hackaton-eb6c8.firebasestorage.app",
  messagingSenderId: "566429128341",
  appId: "1:566429128341:web:06d5fb27f26174aeb46d9c",
  measurementId: "G-2E8TZ1SECB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);