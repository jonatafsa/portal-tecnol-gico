// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLjZWuVZTBQ5zlz79yP5fzMeHP2nJfyJ0",
  authDomain: "js-portal-tecnologico.firebaseapp.com",
  projectId: "js-portal-tecnologico",
  storageBucket: "js-portal-tecnologico.appspot.com",
  messagingSenderId: "468054274779",
  appId: "1:468054274779:web:e3dd800117075392e752fe",
  measurementId: "G-E3STXG84NQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app