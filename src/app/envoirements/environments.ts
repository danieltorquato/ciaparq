// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOzbOtM2wPoAss0GnRY-hE51Ym5UdlCIg",
  authDomain: "cia-parq.firebaseapp.com",
  projectId: "cia-parq",
  storageBucket: "cia-parq.appspot.com",
  messagingSenderId: "33505503974",
  appId: "1:33505503974:web:47fef6581abd934549a927",
  measurementId: "G-6861V6TG7L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
