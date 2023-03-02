import { useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import OAuth from "../components/OAuth";

import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {db} from "../firebase"
import { serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { toast } from "react-toastify";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = formData;
  const [showPassword, setShowPassword] = useState(false);
  

  function onChangeHandler(event){
    console.log(event.target.value);
    setFormData((prevState)=>({
      ...prevState,
      [event.target.id]: event.target.value,
    }));
  }

  async function onSubmit(event){
    event.preventDefault();
    
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      updateProfile(auth.currentUser,{displayName: name});
      const user = userCredential.user;
      const formDataCopy = {...formData};
      delete formDataCopy.password;//is dangerous to store password in DB and hash directly
      formDataCopy.timestamp = serverTimestamp();

      // Add a new document in collection "users"
      await setDoc(doc(db,"users", user.uid),formDataCopy);

      toast.success("Sign up is successful!");
      navigate("/");
    } catch (error) {
      
      toast.error("Something went wrong with the registration");
    }
      
  }
  return (
    
    <section>
    <h1 className="text-3xl text-center mt-6 font-bold">Welcome to join us today!</h1>
    <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
      <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
        <img src='https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1373&q=80' 
          alt='signUp'
          className='w-full rounded-2xl'/>
      </div>
      <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
        <form onSubmit={onSubmit}>
          <input
            type="text"
            id='name'
            value={name}
            onChange={onChangeHandler}
            placeholder="Enter your name"
            className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out'
          />
          <input 
            type="email"
            id='email'
            value={email}
            onChange={onChangeHandler}
            placeholder="Enter your email"
            className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out'
          />
          <div className="relative mb-6">
          <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={onChangeHandler}
              placeholder="Password"
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
            />
            {showPassword ? (
              <AiFillEyeInvisible
                className="absolute right-3 top-3 text-xl cursor-pointer"
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            ) : (
              <AiFillEye
                className="absolute right-3 top-3 text-xl cursor-pointer"
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            )}
          </div>
          <div>
            <div className='flex justify-between'>
            <p>Don't have a account?</p>
            
            <Link 
              to="/sign-up"
              className='  text-red-500 hover:text-red-700 transition ease-in-out'
            >  
            Join us today!
            </Link>
            </div>
            
            
            <Link 
              to="/forget-password"
              className=' text-blue-500 hover:text-blue-700 transition ease-in-out'
            >
              Forgot password?
            </Link>
            
          </div>
          <button type='submit'
            className='w-full bg-blue-600 text-white px-3 py-3 my-3 rounded shadow-md hover:bg-blue-700 ease-in-out hover:shadow-lg active:bg-blue-800'>
              Sign up
            </button>
          <div className='flex items-center my-4 before:border-t before:flex-1 before:border-black after:border-t after:flex-1 after:border-black'>
            <p className="text-center font-semibold mx-4">OR</p>
          </div>
          <OAuth />
        </form>
        
      </div>
    </div>
  </section>
  )
}
