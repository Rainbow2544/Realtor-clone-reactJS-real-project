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


  //sell
  const [saleListings, setSaleListings] = useState(null);
  useEffect(()=>{
    async function fetchListings(){
      try {
        const docRef = collection(db,"listings");
        const q = query(
          docRef,
          where("type","==", "sell"),
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
        setSaleListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  },[]);
  return (
    <div>
      <Slider/>

      <div className=" max-w-6xl mx-auto mt-6 px-3 ">
        
      { offerListings && offerListings.length > 0 && (
          <div>
            <h2 className="text-2xl ml-3 font-semibold mb-6">
            Recent offers
            </h2>
            <ul className="sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {offerListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
          </ul>
        </div>
        )}
            
        { rentListings && rentListings.length > 0 && (
          <div className='mt-10'>
            <h2 className="text-2xl ml-3 font-semibold mb-2">
            Houses for Rent
            </h2>
            <Link to="/rent">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                Show more places for rent
              </p>
            </Link>
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

        { saleListings && saleListings.length > 0 && (
            <div className='mt-10'>
              <h2 className="text-2xl ml-3 font-semibold mb-2">
                Houses for Sale
              </h2>
              <Link to="/sell">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                Show more places for sale
              </p>
            </Link>
              <ul className="sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {saleListings.map((listing) => (
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
