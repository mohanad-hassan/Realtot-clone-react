import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAq5JcHm7tGbmOFWAJ_XA3C2uccNLO7P6g",
  authDomain: "realtor-76075.firebaseapp.com",
  projectId: "realtor-76075",
  storageBucket: "realtor-76075.appspot.com",
  messagingSenderId: "1004672383802",
  appId: "1:1004672383802:web:62b70cafcb4de67c29ae03"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth =getAuth(app)
