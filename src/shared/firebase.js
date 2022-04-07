import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCqjqeI6lxjg0YQQGHse4wtkqpeq3t43pc",
  authDomain: "image-community-d6934.firebaseapp.com",
  projectId: "image-community-d6934",
  storageBucket: "image-community-d6934.appspot.com",
  messagingSenderId: "738893838546",
  appId: "1:738893838546:web:824c58e4004be6134d550b",
  measurementId: "G-5NDGPQ5NHL",
};

firebase.initializeApp(firebaseConfig);

// 다른 파일에서 Firebase 가지고 와서 써야 돼.

const auth = firebase.auth();

export {auth};