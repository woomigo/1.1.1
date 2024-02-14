// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfeXvKsfgFHhesqC25rFl5v_7Xy0jC_J0",
  authDomain: "woomigo-2dce0.firebaseapp.com",
  projectId: "woomigo-2dce0",
  storageBucket: "woomigo-2dce0.appspot.com",
  messagingSenderId: "445328369225",
  appId: "1:445328369225:web:9bcdf56c815929d01b8198",
  measurementId: "G-WDFM2GM6NJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);