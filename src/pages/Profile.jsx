import { useEffect, useState } from "react";
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
import {FaHome} from "react-icons/fa";
import ListingItem from "../components/ListingItem";

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;
  const [changeDetail, setChangeDetail] = useState(false);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(()=>{
    async function fetchUserListings(){
      const listingRef = collection(db, "listings");
      const q = query(listingRef, where("userRef","==",auth.currentUser.uid),
      orderBy("timestamp","desc"));
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((docSnap) => {
        return listings.push({
          id: docSnap.id,
          data: docSnap.data(),
        })
      });
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);

  async function onDelete(listingID){
    if(window.confirm("Are you sure you want to delete?")){
      await deleteDoc(doc(db,"listings",listingID));
      
      const updateListings = listings.filter(
        (listing) => listing.id !== listingID
      );
      setListings(updateListings);
      toast.success("Successfully deleted the listing");
    }
  }

  function onEdit(listingID){
    navigate(`/edit-listing/${listingID}`);
  }
  return (
    <>
      <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <div className=" w-[50%]  mt-6 px-3">
          <h1 className="text-3xl  mt-6 font-bold">{name}</h1>
          <h2 className="text-md  mt-6 font-bold">Email:  {email}</h2>
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
          
          <Link
              to="/create-listing"
              className="flex justify-center items-center"
            >
            <button 
              type="submit"
              className="w-full flex justify-center items-center rounded my-4 py-2 px-7 text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800  duration-300 ease-in-out">
              <FaHome className="mr-2 p-1  text-3xl"/>
                Sell or rent your home
            </button>
          </Link>
          
        </div>
      </section>

      <div className=" max-w-6xl mx-auto mt-6 px-3 ">
        
      {!loading && listings.length > 0 && (
          <>
            <h2 className="text-2xl text-center font-semibold mb-6">
              My Listings
            </h2>
            <ul className="sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
          </ul>
        </>
        )}
            
      </div>
    </>
  );
}
