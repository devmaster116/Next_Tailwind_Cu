import { FirebaseApp, FirebaseOptions, getApp, getApps, initializeApp } from "firebase/app";
import "firebase/auth";
import { getStorage } from "firebase/storage";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { Functions, getFunctions, httpsCallable } from "firebase/functions";

// Format the string environment variable to an object
function parseStringToJson(str:string) {
  // Remove curly braces and trim spaces
  str = str.replace(/^\{|\}$/g, '').trim();

  // Split by commas and handle each key-value pair
  const keyValuePairs = str.split(',');

  // Initialize an empty object to store the result
  const result = {} as FirebaseOptions;

  // Process each key-value pair
  keyValuePairs.forEach(pair => {
    // Split each pair into key and value using the first occurrence of ':'
    const [key, ...valueParts] = pair.split(':');
    const value = valueParts.join(':').trim(); // Join back in case value contains ':'

    // Remove leading and trailing quotes from key and value
    const cleanedKey = key.trim().replace(/^['"](.*)['"]$/, '$1');
    const cleanedValue = value.trim().replace(/^['"](.*)['"]$/, '$1');

    // Add to result object
    result[cleanedKey as keyof FirebaseOptions] = cleanedValue;
  });

  return result;
}
// Parse FIREBASE_CONFIG from environment variable
const firebaseConfigString = process.env.FIREBASE_CONFIG ? process.env.FIREBASE_CONFIG  : process.env.LOCAL_FIREBASE_CONFIG;

let firebaseConfig: FirebaseOptions;

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

let jsonObject: FirebaseOptions;

if(process.env.FIREBASE_CONFIG){
  jsonObject = parseStringToJson((firebaseConfigString as string));

}else{
  jsonObject = firebaseConfigString as FirebaseOptions
}

// Check if firebaseConfig is valid before initializing Firebase app
if (jsonObject) {
  app = !getApps().length ? initializeApp(jsonObject) : getApp();
  auth = getAuth(app);
  functions = getFunctions(app, "australia-southeast1");
  db = getFirestore(app);
} else {
  console.error("Firebase config is not valid.");
  throw Error("Config is not valid.");
}
// Get a reference to the storage service
const storage = getStorage(app);

export { storage };
export { auth, functions, db, httpsCallable };
