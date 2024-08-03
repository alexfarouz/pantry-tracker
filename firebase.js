// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCR4wjATYdzZJn9QAUvO3wvku3qz3NItUo",
  authDomain: "pantry-tracker-3b98a.firebaseapp.com",
  projectId: "pantry-tracker-3b98a",
  storageBucket: "pantry-tracker-3b98a.appspot.com",
  messagingSenderId: "599962030956",
  appId: "1:599962030956:web:acb31548f59d643cc2d949",
  measurementId: "G-23Y57MCXSK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}