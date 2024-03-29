import { initializeApp } from 'firebase/app';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Initialize Firebase
export default firebaseConfig = {
  apiKey: "AIzaSyDfeXvKsfgFHhesqC25rFl5v_7Xy0jC_J0",
  authDomain: "woomigo-2dce0.firebaseapp.com",
  projectId: "woomigo-2dce0",
  storageBucket: "woomigo-2dce0.appspot.com",
  messagingSenderId: "445328369225",
  appId: "1:445328369225:web:9bcdf56c815929d01b8198",
  measurementId: "G-WDFM2GM6NJ"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp, "gs://woo-pic-video-bucket");
export const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
