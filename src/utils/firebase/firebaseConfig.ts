import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1vYNd_1bHe-e6zkJax-oOIsqzKSDa-cI",
  authDomain: "live-chat-app-b7c90.firebaseapp.com",
  databaseURL: "https://live-chat-app-b7c90-default-rtdb.firebaseio.com",
  projectId: "live-chat-app-b7c90",
  storageBucket: "live-chat-app-b7c90.appspot.com",
  messagingSenderId: "423673315991",
  appId: "1:423673315991:web:58dce4e944c82591935fd2",
  measurementId: "G-9P6RJWWLPV",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();
export { auth, firestore };
