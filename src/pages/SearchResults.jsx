import ListingItem from '../components/ListingItem';
import { collection, query, where, orderBy,getDocs,limit,startAfter } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import Spinner from '../components/Spinner';
import {db} from '../firebase';

export default function SearchResults() {
    const {searchTerm} = useParams();
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastFetchedListing, setLastFetchListing] = useState(null);

    
    useEffect(()=>{
        async function fetchListings(){
          try {
            console.log(searchTerm);
            const docRef = collection(db,"listings");
            const q = query(
              docRef,
              where( "address",">=",`${searchTerm}`),
              orderBy('address'),
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
            setListings(listings);
            setLoading(false);
          } catch (error) {
            //console.log(error);
            toast.error("Could not fetch listing");
          }
        }
        fetchListings();
      },[searchTerm]);
    
      async function fetchMoreListings(){
        try {
          const docRef = collection(db,"listings");
          const q = query(
            docRef,
            where( "address",">=",`${searchTerm}`),
            orderBy("address"),
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
          setListings((prevState) => [...prevState, ...listings]);
          setLoading(false);
        } catch (error) {
            //console.log(error);
            toast.error("Could not fetch listing");
        }
      }
    if(loading){
        return <Spinner/>;
    }
    
    
  return (
    <div>
        <h2 className="text-2xl text-center font-semibold my-6">
                Search result of "{searchTerm}""
                </h2>
        {listings && listings.length > 0 ? 
        <div className='mt-5'>
            <ul className="sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {listings.map((listing) => (
                    <ListingItem 
                        key={listing.id}
                        id={listing.id}
                        listing={listing.data}
                    />
                ))}
            </ul>
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
        </div>
            :
            (<div >
                <div className='flex items-center justify-center w-full h-[450px] '>
                <img src="https://th.bing.com/th/id/R.d3c5adb648849c1d586bc6c506f1c5ec?rik=su4GTlkhAGHYxA&riu=http%3a%2f%2fkundenservice.freenet.de%2fresources%2fimages%2ficon_noresult.png&ehk=90pYIJdTRRWWD5F1Cz9Y6lp7QawDKvvW6X3L6SMWPz0%3d&risl=&pid=ImgRaw&r=0" 
                    alt='no-results'
                    className=' w-[60%] h-[450px]'
                />
                </div>
                <div>
                <h2 className='text-xl text-center'>
                    There is no result from your search.
                    <br/>
                    You can browser our 
                    <a href="/sell" className='text-blue-500 font-semibold underline'> Buy </a>
                    or
                    <a href="/rent" className='text-blue-500 font-semibold underline'> Rent </a> 
                    pages to know more information.
                </h2>
                </div>
            </div>)
        }
    </div>
  )
}
