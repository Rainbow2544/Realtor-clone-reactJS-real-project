import { collection, getDocs, orderBy, query,limit,where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Slider from '../components/Slider';
import Spinner from '../components/Spinner';
import { db } from '../firebase';
import ListingItem from "../components/ListingItem";
import { Link } from "react-router-dom";

export default function Home() {
  //offers
  const [offerListings, setOfferListings] = useState(null);
  useEffect(()=>{
    async function fetchListings(){
      try {
        // get reference
        const listingsRef = collection(db,"listings");
        // create the query
        const q = query(
          listingsRef, 
          where("offer", "==", true),
          orderBy("timestamp","desc"), 
          limit(4));
        // execute the query
        const querySnap = await getDocs(q);

        let listings = [];
        querySnap.forEach((doc)=>{
          return listings.push({
            id: doc.id,
            data:doc.data(),
          })
        });
        setOfferListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);
  
  //rent


  //sell

  return (
    <div>
      
      <Slider/>
    </div>
  )
}
