import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  authDomain: "pantry-tracker-3b98a.firebaseapp.com",
  projectId: "pantry-tracker-3b98a",
  storageBucket: "pantry-tracker-3b98a.appspot.com",
  messagingSenderId: "599962030956",
  appId: "1:599962030956:web:acb31548f59d643cc2d949",
  measurementId: "G-23Y57MCXSK"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { firestore, storage };
