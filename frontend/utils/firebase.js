// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {getAuth, GoogleAuthProvider} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "loginvirtualcourses-f614b.firebaseapp.com",
  projectId: "loginvirtualcourses-f614b",
  storageBucket: "loginvirtualcourses-f614b.firebasestorage.app",
  messagingSenderId: "851708642789",
  appId: "1:851708642789:web:0599ad149550f33823db0c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth, provider}