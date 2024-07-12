import { FirebaseApp, FirebaseOptions, getApp, getApps, initializeApp } from "firebase/app";
import "firebase/auth";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { Functions, getFunctions, httpsCallable } from "firebase/functions";

// Parse FIREBASE_CONFIG from environment variable
const firebaseConfigString = process.env.FIREBASE_CONFIG ? process.env.FIREBASE_CONFIG  : process.env.LOCAL_FIREBASE_CONFIG;

let firebaseConfig: FirebaseOptions | undefined;

if (firebaseConfigString) {
  try {
    firebaseConfig = firebaseConfigString as FirebaseOptions;
  } catch (error) {
    console.error("Error parsing Firebase config:", error);
  }
}

let app: FirebaseApp;
let auth: Auth;
let functions: Functions;
let db: Firestore;

// Check if firebaseConfig is valid before initializing Firebase app
if (firebaseConfig) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  functions = getFunctions(app, "australia-southeast1");
  db = getFirestore(app);
} else {
  console.error("Firebase config is not valid.");
  throw Error("Config is not valid.");
}

export { auth, functions, db, httpsCallable };
