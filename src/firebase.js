import firebase from "firebase/compat/app";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAfVufzZ-2-pGrvlyxTLRrHyTnnBvSSHwY",
  authDomain: "instagram-clone-2076d.firebaseapp.com",
  projectId: "instagram-clone-2076d",
  storageBucket: "instagram-clone-2076d.appspot.com",
  messagingSenderId: "679743423893",
  appId: "1:679743423893:web:131b68c747a0cf1b30a29c"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

export { db, auth, storage }