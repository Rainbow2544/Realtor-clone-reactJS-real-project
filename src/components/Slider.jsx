import { collection, getDoc, getDocs, orderBy, query,limit } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import SwiperCore, {
    EffectFade,
    Autoplay,
    Navigation,
    Pagination,
  } from "swiper";
import { Swiper,SwiperSlide } from 'swiper/react';
import "swiper/css/bundle";
import Spinner from '../components/Spinner';
import { db } from '../firebase';

export default function Slider() {
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(()=>{
      async function fetchListings(){
        const listingsRef = collection(db,"listings");
        const q = query(listingsRef, orderBy("timestamp","desc"), limit(5));
        const querySnap = await getDocs(q);
  
        let listings = [];
        querySnap.forEach((doc)=>{
          return listings.push({
            id: doc.id,
            data:doc.data(),
          })
        });
        setListings(listings);
        setLoading(false);
      }
      fetchListings();
    }, []);
    if(loading){
      return <Spinner/>;
    }
    if(listings.length === 0){
      return <></>;
    }
  return (
    listings &&(
    <>
        <Swiper
            slidesPerView={1}
            navigation
            pagination={{ type: "progressbar" }}
            effect="fade"
            modules={[EffectFade]}
            autoplay={{ delay: 3000 }}
        >
            {listings.map(({data ,id}) => (
                <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
                    <div className='relative w-full overflow-hidden h-[500px]' 
                        style={{
                            background: `url(${data.imgUrls[0]}) center no-repeat`,
                            backgroundSize: "cover",
                            }}
                    >
                        <p className='absolute max-w-[90%] rounded-br-3xl p-2 font-medium bg-[#54a5d7] opacity-90 text-white left-1 top-3'>
                            {data.name}</p>
                        <p className='absolute max-w-[90%] rounded-br-3xl p-2 font-medium bg-[#d1af66] opacity-90 text-white left-1 bottom-3'>
                            ${data.discountPrice? data.discountPrice:data.regularPrice}
                            {data.type ==="rent"&& "/week"}
                        </p>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    </>
    )
  );
}