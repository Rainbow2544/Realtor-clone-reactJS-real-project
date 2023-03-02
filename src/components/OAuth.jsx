import React from 'react';
import { useNavigate } from "react-router-dom";
import {FcGoogle} from "react-icons/fc";
import {FaFacebook} from "react-icons/fa";
import {BsApple} from "react-icons/bs";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { db } from "../firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export default function OAuth() {
    const navigate = useNavigate();
    async function onGoogleClick() {
        try {
          const auth = getAuth();
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          const user = result.user;
    
          // check for the user
    
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
        } catch (error) {
          toast.error("Could not authorize with Google");
        }
      }

      async function onFacebookClick() {
        try {
          const auth = getAuth();
          const provider = new FacebookAuthProvider();
          const result = await signInWithPopup(auth, provider);
          const user = result.user;
    
          // check for the user
    
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
        } catch (error) {
          toast.error("Could not authorize with Facebook");
        }
      }
        
    
  return (
    <>
        <button 
            type="button"
            onClick={onGoogleClick} 
            className='flex items-center justify-center bg-red-600 py-3 w-full rounded  text-white hover:bg-red-700 active:bg-red-800 ease-in-out  transition duration-300 '>
            <FcGoogle className=' bg-white text-2xl rounded-full  -translate-x-16'/>
            Continue with Google
        </button>
        <button 
            type="button"
            onClick={onFacebookClick}
            className='flex items-center justify-center bg-blue-600 my-3 py-3 w-full rounded text-white hover:bg-blue-700 active:bg-blue-800 ease-in-out  transition duration-300 '>
            <FaFacebook className=' text-2xl rounded-full  -translate-x-14'/>
            Continue with Facebook
        </button>
        
    </>
    
  )
}
