// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqEGY7SClDIBIEFuKEDIWXsGWdPyNyha4",
  authDomain: "wsm-clone-ad6b5.firebaseapp.com",
  projectId: "wsm-clone-ad6b5",
  storageBucket: "wsm-clone-ad6b5.appspot.com",
  messagingSenderId: "826732808522",
  appId: "1:826732808522:web:45189193293d8ce5e819b3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
