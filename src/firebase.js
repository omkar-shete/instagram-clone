// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
// import 'firebase/compat/auth/updateProfile';
import 'firebase/compat/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgcuOIUKUbOSkrjgOXzdXyzyWC-LF4_r4",
  authDomain: "instagram-clone-c4f01.firebaseapp.com",
  projectId: "instagram-clone-c4f01",
  storageBucket: "instagram-clone-c4f01.appspot.com",
  messagingSenderId: "929756215490",
  appId: "1:929756215490:web:dee3e5f9db9a823d6f235b"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export default db;
export {auth, storage} ;