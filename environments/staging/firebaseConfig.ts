import { getApp, getApps, initializeApp } from "firebase/app";
import "firebase/auth";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyDFfARCeYAuSuOg5iHZwEkQ2T2iCbKcLrc",
  authDomain: "homebite-practice-v2.firebaseapp.com",
  databaseURL: "https://homebite-practice-v2-default-rtdb.firebaseio.com",
  projectId: "homebite-practice-v2",
  storageBucket: "homebite-practice-v2.appspot.com",
  messagingSenderId: "351662589375",
  appId: "1:351662589375:web:8b4a19c6b81583a7d14d0a",
  measurementId: "G-M5WTB7J5W8",
};

// const app = initializeApp(firebaseConfig);
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const functions = getFunctions(app, "australia-southeast1");
const db = getFirestore(app);

export { auth, functions, db, httpsCallable };
