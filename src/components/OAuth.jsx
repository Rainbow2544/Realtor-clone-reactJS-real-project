import React from 'react';
import { useNavigate } from "react-router-dom";
import {FcGoogle} from "react-icons/fc";

export default function OAuth() {
    const navigate = useNavigate();
  return (
    
    <button className='flex items-center justify-center bg-red-600 py-3 w-full rounded  text-white hover:bg-red-700 active:bg-red-800 ease-in-out  transition duration-300 '>
        <FcGoogle className=' bg-white text-2xl rounded-full  -translate-x-20'/>
        Continue with Google
    </button>
  )
}
