import React from 'react';
import Moment from 'react-moment';
import {Link} from "react-router-dom";
import {MdLocationOn} from "react-icons/md";
import { list } from 'firebase/storage';
import {FaTrash} from 'react-icons/fa';
import {AiFillEdit} from 'react-icons/ai';

export default function listingItem({listing, id, onEdit, onDelete}) {
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
                    <p className="font-bold text-xs">{listing.bathroom > 1 ? `${listing.bathroom} baths` : "1 bath"}</p>
                    
                </div>
                
            </div>
        </Link>
        
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
