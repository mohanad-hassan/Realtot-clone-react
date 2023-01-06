
import { useNavigate } from "react-router-dom";
import {getAuth ,signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../firebase";

export default function OAuth() {
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();


  async function onGoogleClick() {
    try{ 

      const auth = getAuth();
      const result = await signInWithPopup(auth, provider)
      const user = result.user;
      const docRef = doc(db, "users", user.uid);
const docSnap = await getDoc(docRef);
if (!docSnap.exists()) {
  await setDoc(docRef, {
    name: user.displayName,
    email: user.email,
    timestamp: serverTimestamp(),
  });
}

navigate("/");

    }
 
      catch(error){      toast.error("Could not authorize with Google");
    }
  }
  return (
    <button
      type="button"
      onClick={onGoogleClick}
      className="flex items-center justify-center w-full bg-red-700 text-white px-7 py-3 uppercase text-sm font-medium hover:bg-red-800 active:bg-red-900 shadow-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out rounded"
    >
      Continue with Google
    </button>
  );
}