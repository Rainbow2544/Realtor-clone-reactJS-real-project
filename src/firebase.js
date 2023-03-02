// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkrWWO72sKo5GjD9YqIATraxktcRkVzNk",
  authDomain: "react-real-project-561ee.firebaseapp.com",
  projectId: "react-real-project-561ee",
  storageBucket: "react-real-project-561ee.appspot.com",
  messagingSenderId: "742922576115",
  appId: "1:742922576115:web:8ee96a2a1ba65381639786",
  measurementId: "G-X52NPP1F01"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();