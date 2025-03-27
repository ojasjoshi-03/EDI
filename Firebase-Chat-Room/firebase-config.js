// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtd14ksd42gd-jd-0_2ojDNDPyMp_ynhw",
  authDomain: "room-chat-ffcd2.firebaseapp.com",
  projectId: "room-chat-ffcd2",
  storageBucket: "room-chat-ffcd2.firebasestorage.app",
  messagingSenderId: "429236530894",
  appId: "1:429236530894:web:b1907698f21f229ff52a9f",
  measurementId: "G-L8DS6FRNRK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const database = getFirestore(app);
