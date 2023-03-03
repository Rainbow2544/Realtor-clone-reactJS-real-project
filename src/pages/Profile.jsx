import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { getAuth, updateProfile } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;
  const [changeDetail, setChangeDetail] = useState(false);
  

  function onChangeHandler(event) {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }));
  }

  async function onSubmit(){
    try {
      if(auth.currentUser.displayName != name){
        //update display name in firebase auth
        await updateProfile(auth.currentUser,{
          displayName: name,
        });
        //update display name in firestore
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef,{
          name,
        });
      }
      toast.success("Your user name updated successful");
    } catch (error) {
      toast.error("Could not update your user name");
    }
  }

  return (
    <>
    
      <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <div className=" w-[50%]  mt-6 px-3">
          <h1 className="text-2xl  mt-6 font-bold">Name:  {name}</h1>
          <h1 className="text-2xl  mt-6 font-bold">Email:  {email}</h1>
          <form>
            <input 
                type="text"
                id='name'
                value={name}
                disabled={!changeDetail}
                onChange={onChangeHandler}
                placeholder="Enter your name"
                className= {`my-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out 
                ${
                  changeDetail && "bg-red-200 focus:bg-red-200"
                }`}
              />
            Want to change your user name?
            <span
              onClick={() => {
                changeDetail && onSubmit();
                setChangeDetail((prevState) => !prevState);
              }}
              className="text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer"
            >
              {changeDetail ? "Apply change" : "Edit here"}
            </span>
          </form>

          
          
        </div>
      </section>
    </>
  )
}
