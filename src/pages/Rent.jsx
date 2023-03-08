import { collection, getDocs, orderBy, query,limit,where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Slider from '../components/Slider';
import Spinner from '../components/Spinner';
import { db } from '../firebase';
import ListingItem from "../components/ListingItem";
import { Link } from "react-router-dom";

export default function Rent() {
    //rent
  const [rentListings, setRentListings] = useState(null);
  useEffect(()=>{
    async function fetchListings(){
      try {
        const docRef = collection(db,"listings");
        const q = query(
          docRef,
          where("type","==", "rent"),
          orderBy("timestamp","desc"),
          limit(4)
        );
        const querySnap = await getDocs(q);
        let listings = [];
        querySnap.forEach((doc)=> {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        })
        setRentListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  },[]);

  return (
    <div>
        <div className=" max-w-6xl mx-auto mt-6 px-3 ">
        { rentListings && rentListings.length > 0 && (
          <div>
            <h2 className="text-2xl text-center font-semibold mb-6">
            Newest listings
            </h2>
            <ul className="sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {rentListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
          </ul>
        </div>
        )}
        </div>
    </div>
  )
}
