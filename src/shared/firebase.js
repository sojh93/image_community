import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";

// apiKey를 위에 export const apiKey로 빼줄 경우 아래 config에서 apiKey:apiKey 로 해줘야함.
// export const apiKey = "AIzaSyCqjqeI6lxjg0YQQGHse4wtkqpeq3t43pc"

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

const apiKey = firebaseConfig.apiKey;
const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();
const realtime = firebase.database();

export {auth, apiKey, firestore, storage, realtime};