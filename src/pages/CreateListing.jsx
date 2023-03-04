import { useState } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";


export default function CreateListing() {
    const navigate = useNavigate();
    const auth = getAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: "rent",
        name: "",
        bedrooms: 1,
        bathroom: 1,
        parking: false,
        furnished: false,
        address: "",
        description: "",
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        latitude: 0,
        longitude: 0,
        images: {},

    });
    const {
        type,
        name,
        bedrooms,
        bathrooms,
        parking,
        address,
        furnished,
        description,
        offer,
        regularPrice,
        discountedPrice,
        latitude,
        longitude,
        images,
    } = formData;


    function onSubmit(event){
        event.preventDefault();
        
    }
    function onChangeHandler(event){
        let bool;
        if(event.target.value === "true"){
            bool = false;
        }else{
            bool = true;
        }
    }


    if (loading) {
        return <Spinner />;
      }
  return (
    <main className="max-w-md px-2 mx-auto">
        <h1 className="text-3xl text-center mt-6 font-bold">Create a Listing</h1>
        <form onSubmit={onSubmit}>
            <p className=" font-semibold mt-6 text-lg">Sell / Rent</p>
            <div className="flex space-x-10 mb-3">
                <button 
                    type="button"
                    id="type"
                    value="sell"
                    onClick={onChangeHandler}
                    className={`py-2 rounded shadow-md transition duration-150 ease-in-out w-full  hover:shadow-lg focus:shadow-lg active:shadow-lg ${
                        type === "rent" ? "bg-stone-100 text-black": "bg-slate-600 text-white"
                    }`}
                >Sell</button>
                <button 
                    type="button"
                    id="type"
                    value="rent"
                    onClick={onChangeHandler}
                    className={`py-2 rounded shadow-md transition duration-150 ease-in-out w-full hover:shadow-lg focus:shadow-lg active:shadow-lg ${
                        type === "sell" ? "bg-stone-100 text-black": "bg-slate-600 text-white"
                    }`}
                >Rent</button>
            </div>

            <div>
                <p className=" font-semibold mt-6 text-lg">Name</p>
                <input 
                    type="text"
                    id="name"
                    value={name}
                    placeholder="Enter your name"
                    onChange={onChangeHandler}
                    maxLength="25"
                    minLength="4"
                    required
                    className="w-full text-xl rounded"/>
            </div>
            <div className="flex space-x-8">
                <div className="w-[50%]">
                <p className=" font-semibold mt-6 text-lg">Bedrooms</p>
                <input 
                    type="number"
                    id="bedrooms"
                    value={bedrooms}
                    placeholder="1"
                    min="1"
                    max="99"
                    required
                    onChange={onChangeHandler}
                    className="rounded"
                />
                </div>
                <div className="w-[50%]">
                <p className=" font-semibold mt-6 text-lg">Bathrooms</p>
                <input 
                    type="number"
                    id="bathrooms"
                    value={bathrooms}
                    placeholder="1"
                    min="1"
                    max="99"
                    onChange={onChangeHandler}
                    className="rounded"
                />
                </div>
            </div>
            
            <p className=" font-semibold mt-6 text-lg">Parking</p>
            <div className="flex space-x-10 mb-3">
                <button 
                    type="button"
                    id="parking"
                    value={true}
                    onClick={onChangeHandler}
                    className={`py-2 rounded shadow-md transition duration-150 ease-in-out w-full  hover:shadow-lg focus:shadow-lg active:shadow-lg ${
                        parking === false ? "bg-stone-100 text-black": "bg-slate-600 text-white"
                    }`}
                >Yes</button>
                <button 
                    type="button"
                    id="parking"
                    value={false}
                    onClick={onChangeHandler}
                    className={`py-2 rounded shadow-md transition duration-150 ease-in-out w-full hover:shadow-lg focus:shadow-lg active:shadow-lg ${
                        parking === true ? "bg-stone-100 text-black": "bg-slate-600 text-white"
                    }`}
                >No</button>
            </div>
            
            <p className=" font-semibold mt-6 text-lg">Furnished</p>
            <div className="flex space-x-10 mb-3">
                <button 
                    type="button"
                    id="furnished"
                    value={true}
                    onClick={onChangeHandler}
                    className={`py-2 rounded shadow-md transition duration-150 ease-in-out w-full  hover:shadow-lg focus:shadow-lg active:shadow-lg ${
                        furnished === false ? "bg-stone-100 text-black": "bg-slate-600 text-white"
                    }`}
                >Yes</button>
                <button 
                    type="button"
                    id="furnished"
                    value={false}
                    onClick={onChangeHandler}
                    className={`py-2 rounded shadow-md transition duration-150 ease-in-out w-full hover:shadow-lg focus:shadow-lg active:shadow-lg ${
                        furnished === true ? "bg-stone-100 text-black": "bg-slate-600 text-white"
                    }`}
                >No</button>
            </div>

            <p className=" font-semibold mt-6 text-lg">Address</p>
            <textarea 
                type="text"
                id="address"
                value={address}
                onChange={onChangeHandler}
                placeholder="Enter your address"
                required
                className="w-full px-4 py-2 text-xl rounded"
            />

            <p className=" font-semibold mt-6 text-lg">Description</p>
            <textarea 
                type="text"
                id="description"
                value={description}
                onChange={onChangeHandler}
                placeholder="Enter your description"
                required
                className="w-full px-4 py-2 text-xl rounded"
            />

            <p className=" font-semibold mt-6 text-lg">Offer</p>
            <div className="flex space-x-10 mb-3">
                <button 
                    type="button"
                    id="offer"
                    value={true}
                    onClick={onChangeHandler}
                    className={`py-2 rounded shadow-md transition duration-150 ease-in-out w-full  hover:shadow-lg focus:shadow-lg active:shadow-lg ${
                        offer === false ? "bg-stone-100 text-black": "bg-slate-600 text-white"
                    }`}
                >Yes</button>
                <button 
                    type="button"
                    id="offer"
                    value={false}
                    onClick={onChangeHandler}
                    className={`py-2 rounded shadow-md transition duration-150 ease-in-out w-full hover:shadow-lg focus:shadow-lg active:shadow-lg ${
                        offer === true ? "bg-stone-100 text-black": "bg-slate-600 text-white"
                    }`}
                >No</button>
            </div>
            
            <p className=" font-semibold mt-6 text-lg">Regular price</p>
            <div className="flex space-x-5">
                
                <input
                    type="number"
                    id="regularPrice"
                    value={regularPrice}
                    onChange={onChangeHandler}
                    
                    min="1"
                    max="9999999999"
                    required
                    className="rounded"
                />
                {type === "rent" && (
                    <div className="">
                    <p className="text-xl mt-2 w-full whitespace-nowrap">$ / Month</p>
                    </div>
                )}
            </div>
            {offer && (
                <div>
                    <p className=" font-semibold mt-6 text-lg">Discounted price</p>
                    <div className="flex space-x-5">
                        
                        <input
                            type="number"
                            id="discountedPrice"
                            value={discountedPrice}
                            onChange={onChangeHandler}
                            
                            min="1"
                            max="9999999999"
                            required
                            className="rounded"
                        />
                        {type === "rent" && (
                            <div className="">
                            <p className="text-xl mt-2 w-full whitespace-nowrap">$ / Month</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        <div>
            <p className=" font-semibold mt-6 text-lg">Images</p>
            <p className="text-gray-600">
            The first image will be the cover (max allowed to upload 6 images)
          </p>
          <input
            type="file"
            id="images"
            onChange={onChangeHandler}
            accept=".jpg, .png, .jpeg"
            multiple
            required
            className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600"
          />
        </div>

        <button
            type="submit"
            className="w-full py-3 my-6 text-md shadow-md text-white rounded bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:shadow-lg action:bg-blue-800"
        >
            Submit
        </button>
            
            
        </form>
    </main>
  )
}
