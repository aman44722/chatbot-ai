import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1RhNH8Tubk6bBijSpxFJG7_9NpJS5d78",
  authDomain: "chatappdemo-6b235.firebaseapp.com",
  projectId: "chatappdemo-6b235",
  storageBucket: "chatappdemo-6b235.appspot.com",
  messagingSenderId: "1055732117297",
  appId: "1:1055732117297:web:9d8668cf8ceb0f7c8dca10"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db };
