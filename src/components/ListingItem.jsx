import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import {Link, useNavigate} from "react-router-dom";
import {MdLocationOn} from "react-icons/md";
import { list } from 'firebase/storage';
import {FaTrash} from 'react-icons/fa';
import {AiFillEdit} from 'react-icons/ai';
import { useAuthStatus } from '../hooks/useAuthStatus';
import Spinner from './Spinner';

export default function ListingItem({listing, id, onEdit, onDelete}) {
    const [isLiked,setIsLiked] = useState(false);
    const {loggedIn, checkingStatus} = useAuthStatus();
    const navigate = useNavigate();
    
    function toggleLike(){
        if (loggedIn) {
            setIsLiked((prev)=> !prev);
          }
        else{
            navigate("/log-in");
        }
        
    }
    if (checkingStatus) {
        return <Spinner />;
      }
    
  return (
    <li className='relative flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-[10px]'>
        <Link className="contents" to={`/${listing.type}/${id}`}>
        
            <img 
                className='h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in'
                loading="lazy"
                src={listing.imgUrls[0]} 
                alt=""/>
            <Moment className=' absolute top-2 left-2 py-1 px-1 text-white font-semibold shadow-lg bg-blue-600 rounded-lg' 
            fromNow> 
            {listing.timestamp?.toDate()}
            </Moment> 
            
        
        
            <div className='w-full p-[10px]'>
                <div className='flex items-center space-x-1'>
                    <MdLocationOn className='text-2xl text-green-600' ></MdLocationOn>
                    <p className="font-semibold text-sm mb-[2px] text-gray-600 truncate">{listing.address}</p>
            
                </div>
                <p className='font-semibold text-xl mb-[2px] truncate'>{listing.name}</p>
                <p className="text-[#457b9d] mt-2 font-semibold">${listing.offer ? 
                listing.discountedPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : listing.regularPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                {listing.type === "rent" && " / week"}
                </p>

                <div className="flex items-center mt-[10px] space-x-3">
                    <p className="font-bold text-xs">{listing.bedrooms > 1 ? `${listing.bedrooms} beds` : "1 bed"} </p>
                    <p className="font-bold text-xs">{listing.bathrooms > 1 ? `${listing.bathrooms} baths` : "1 bath"}</p>
                    
                </div>
                
            </div>
        </Link>
        
        <button
            onClick={toggleLike}
            className="w-8 h-8 absolute right-3 top-2 text-white  focus:outline-none "
            >
            <svg
                className={`w-full h-full absolute top-0 left-0 transition-transform ${
                isLiked ? 'scale-100' : 'scale-95'
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill={isLiked ? 'red' : 'transparent'}
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 21.35l-1.997-1.804C5.3 15.34 2 12.206 2 8.5 2 5.5 4.5 3 7.5 3c1.848 0 3.53.987 4.5 2.5C13.97 3.987 15.652 3 17.5 3 20.5 3 23 5.5 23 8.5c0 3.706-3.3 6.84-8.003 11.046L12 21.35z"
                />
            </svg>
            <svg
                className={`w-full h-full absolute top-0 left-0 transition-transform ${
                isLiked ? 'scale-95' : 'scale-100'
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="transparent"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 21.35l-1.997-1.804C5.3 15.34 2 12.206 2 8.5 2 5.5 4.5 3 7.5 3c1.848 0 3.53.987 4.5 2.5C13.97 3.987 15.652 3 17.5 3 20.5 3 23 5.5 23 8.5c0 3.706-3.3 6.84-8.003 11.046L12 21.35z"
                />
            </svg>
        </button>
        
        {onDelete && 
        <FaTrash 
        className='absolute bottom-2 right-2 text-orange-500 cursor-pointer' 
        onClick={()=> onDelete(listing.id)}
        />}
        {onEdit && 
        <AiFillEdit 
        className='absolute bottom-2 right-8 cursor-pointer'
        onClick={()=> onEdit(listing.id)}
        />}
        
        
    </li>
  );
}
