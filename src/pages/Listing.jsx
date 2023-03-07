import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import Spinner from '../components/Spinner';
import {db} from '../firebase';
import { doc, getDoc } from "firebase/firestore";
import {Swiper, SwiperSlide} from "swiper/react";
import SwiperCore, {
    EffectFade,
    Autoplay,
    Navigation,
    Pagination,
  } from "swiper";
import "swiper/css/bundle";
import {
    FaShare,
    FaBed,
    FaBath,
    FaParking,
    FaChair,
  } from "react-icons/fa";
  import {MdLocationOn}from "react-icons/md";

export default function Listing() {
    const params  = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);
    SwiperCore.use([Autoplay, Navigation, Pagination]);
    useEffect(()=>{
        async function fetchListing(){
            
            const docRef = doc(db, "listings", params.listingId);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                setListing(docSnap.data());
                setLoading(false);
            }
        }
        fetchListing();
    },[params.listingId]);
    if(loading){
        return <Spinner/>;
    }
  return (
    <main>
        <Swiper
            slidesPerView={1}
            navigation
            pagination={{ type: "progressbar" }}
            effect="fade"
            modules={[EffectFade]}
            autoplay={{ delay: 3000 }}
        >
            {listing.imgUrls.map((url,index) => (
                <SwiperSlide key={index}>
                    <div className='relative w-full overflow-hidden h-[500px]' 
                        style={{
                            background: `url(${listing.imgUrls[index]}) center no-repeat`,
                            backgroundSize: "cover",
                            }}
                    >
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
        <div
            className="fixed bottom-[25%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center"
            onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setShareLinkCopied(true);
            setTimeout(() => {
                setShareLinkCopied(false);
            }, 1000);
            }}
        >
            <FaShare className="text-lg text-slate-500" />
      </div>
      {shareLinkCopied &&  (
        <p className="fixed bottom-[21%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2">
          Link Copied
        </p>
      )}

      <div className='flex flex-col p-4 m-4 max-w-6xl md:flex-row lg:mx-auto rounded-lg shadow-lg bg-white lg:space-x-5'>
        <div className=" w-full">
            <p className="text-2xl font-bold mb-3 text-blue-800">{listing.name}</p>
            <p className="text-lg font-bold mb-3 ">   
             $ {listing.offer
                ? listing.discountedPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : listing.regularPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                {listing.type === "rent" ? " / week" : ""}
            </p>
            <p className="flex items-center mt-6 mb-3 font-semibold">
            <MdLocationOn className="text-green-700 mr-1" />
            {listing.address}
          </p>
          <div className="flex justify-start items-center space-x-4 w-[75%]">
            <p className="bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md">
              {listing.type === "rent" ? "Rent" : "Sell"}
            </p>
            {listing.offer && (
              <p className="w-full max-w-[200px] bg-green-800 rounded-md p-1 text-white text-center font-semibold shadow-md">
                ${+listing.regularPrice - +listing.discountedPrice} discount
              </p>
            )}
          </div>
          <p className='my-4'>
            <span className=' font-semibold'>Description: </span>
            {listing.description}
          </p>

          <div className='flex sm:space-x-12 space-x-2 font-semibold'>
            <div>
            <FaBed className="absolute mt-[2px] text-md"/>
            <p className='ml-5 text-sm'>{listing.bedrooms > 1 ? `${listing.bedrooms} Beds`:"1 Bed"}</p>
            </div>
            <div>
            <FaBath className="absolute  text-md"/>
            <p className='ml-5 text-sm'>{listing.bathrooms > 1 ? `${listing.bathrooms} Baths`:"1 Bath"}</p>
            </div>
            <div>
            <FaParking className="absolute mt-[1px] text-lg"/>
            <p className='ml-5 text-sm'>{listing.parking ? "Parking spot" : "No parking"}</p>
            </div>
            <div>
            <FaChair className="absolute mt-[1px] text-md"/>
            <p className='ml-5 text-sm'>{listing.furnished ? "Furnished" : "No furnished"}</p>
            </div>
          </div>
          <button className='my-3 p-3 text-white font-semibold bg-blue-600 w-full rounded-md shadow-md hover:shadow-lg hover:bg-blue-700 active:bg-blue-800 active:shadow-xl transition duration-200 ease-in-out'>
                Contact Landlord
            </button>
            
        </div>
        <div className="bg-pink-300 overflow-x-hidden w-full h-[200px] md:h-[400px] md:mt-0 md:ml-2">why
        
        </div>
      </div>
    </main>
  )
}
