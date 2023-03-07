import { doc, getDoc } from "firebase/firestore";
import { useState,useEffect } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase";

export default function Contact({ userRef, listing }) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(()=>{
        async function getLandlord(){
            const docRef = doc(db,"users",userRef);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                setLandlord(docSnap.data());
            }
            else{
                toast.error("Could not get landlord information");
            }
        }
        getLandlord();
    },[userRef]);
    function onChangeHandler(event) {
        setMessage(event.target.value);
      }
    return (
        <>
            {landlord !== null && (
                <div className="flex flex-col w-full mt-8 text-slate-600">
                    <p>
                    Contact {landlord.name} for the {listing.name.toLowerCase()}
                    </p>
                    <div className="mt-3 mb-6">
                    <textarea
                        name="message"
                        id="message"
                        rows="3"
                        value={message}
                        onChange={onChangeHandler}
                        className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
                    ></textarea>
                    </div>
                    <a
                        href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}
                    >
                        <button
                            className='my-3 p-3 items-center text-white font-semibold bg-blue-600 w-full rounded-md shadow-md hover:shadow-lg hover:bg-blue-700 active:bg-blue-800 active:shadow-xl transition duration-200 ease-in-out'
                        >
                            Send message
                        </button>
                        </a>
                </div>
                
            )}
        </>
    );
}
