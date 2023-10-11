// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import 'firebase/firestore';
// import 'firebase/database';
// const db = firebase.database();

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdTjesUy7DrTIQ0HbHVNW49AV3CAQNr_g",
  authDomain: "hour-tracker-46429.firebaseapp.com",
  projectId: "hour-tracker-46429",
  storageBucket: "hour-tracker-46429.appspot.com",
  messagingSenderId: "817830071297",
  appId: "1:817830071297:web:e9d67b31566c440f0ac400"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };