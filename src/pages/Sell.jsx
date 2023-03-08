import { collection, getDocs, orderBy, query,limit,where,startAfter } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Slider from '../components/Slider';
import Spinner from '../components/Spinner';
import { db } from '../firebase';
import ListingItem from "../components/ListingItem";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Sell() {
    
  const [saleListings, setSaleListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchListing] = useState(null);
  useEffect(()=>{
    async function fetchListings(){
      try {
        const docRef = collection(db,"listings");
        const q = query(
          docRef,
          where("type","==", "sell"),
          orderBy("timestamp","desc"),
          limit(8)
        );
        const querySnap = await getDocs(q);
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchListing(lastVisible);
        let listings = [];
        querySnap.forEach((doc)=> {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        })
        setSaleListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Could not fetch listing");
      }
    }
    fetchListings();
  },[]);

  async function fetchMoreListings(){
    try {
      const docRef = collection(db,"listings");
      const q = query(
        docRef,
        where("type","==", "sell"),
        orderBy("timestamp","desc"),
        startAfter(lastFetchedListing),
        limit(4)
      );
      const querySnap = await getDocs(q);
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchListing(lastVisible);
      let listings = [];
      querySnap.forEach((doc)=> {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })
      setSaleListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error("Could not fetch listing");
    }
  }
  

  return (
    <div>
          <div className=" max-w-6xl mx-auto mt-6 px-3 ">
          { loading ? (<Spinner />) :
            saleListings && saleListings.length > 0 ? (
            <>
              <div>
                <h2 className="text-2xl text-center font-semibold mb-6">
                Newest listings of sale
                </h2>
                <ul className="sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {saleListings.map((listing) => (
                    <ListingItem
                      key={listing.id}
                      id={listing.id}
                      listing={listing.data}
                    />
                  ))}
                </ul>
              </div>

              {lastFetchedListing && (
                <div className="flex justify-center items-center">
                  <button
                    onClick={fetchMoreListings}
                    className="bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6 hover:border-slate-600 rounded transition duration-150 ease-in-out"
                  >
                    Load more
                  </button>
                </div>
              )}
          
            </>
          ) :(
            <p>There are no current houses for sale.</p>
          )}
          </div>
      </div>
  )
}

