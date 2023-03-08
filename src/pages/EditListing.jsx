import { useState,useEffect } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
  } from "firebase/storage";
  import {v4 as uuidv4} from "uuid";
import { collection, doc,getDoc, updateDoc,serverTimestamp } from "firebase/firestore";
 

export default function EditListing() {
    const [geolocationEnable, setGeolocationEnable] = useState(true);
    const navigate = useNavigate();
    const auth = getAuth();
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState(null);
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

    //get the params from react, i.e. get the value from urls
    const params = useParams();

    useEffect(() => {
        if (listing && listing.userRef !== auth.currentUser.uid) {
          toast.error("You can't edit this listing");
          navigate("/");
        }
      }, [auth.currentUser.uid, listing, navigate]);

    useEffect(()=> {
        setLoading(true);
        async function fetchListing(){
            const docRef = doc(db,"listings", params.listingId);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists() ){
                setListing(docSnap.data());
                setFormData({...docSnap.data()});
                setLoading(false);
            }
            else{
                navigate('/');
                toast.error("Listing does not exist.");
            }
        }
        fetchListing()
    },[navigate, params.listingId]);

    
    function onChangeHandler(event){
        let updatedValue = event.target.value;
        if (updatedValue === "true" || updatedValue == "false") {
            updatedValue = JSON.parse(updatedValue);
        }
        //update the files(images)
        if(event.target.files){
            setFormData((preState)=>({
                ...preState,
                images:event.target.files
            }));
        }
        //update text/boolean/number
        if(!event.target.files){
            setFormData((preState)=>({
                ...preState,
                [event.target.id]: updatedValue
            }));
        }
    }

    async function onSubmit(event){
        event.preventDefault();
        setLoading(true);
        if(discountedPrice >= regularPrice){
            setLoading(false);
            toast.error("The discount price needs to be smaller than the regular price.");
            
        }
        if(images.length > 6){
            setLoading(false);
            toast.error("Only a maximum of 6 images is allowed.");
            
        }

        let geolocation = {};
        let location;
        if(geolocationEnable){
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
            );
            const data = await response.json();
            console.log(data);
            //if data.results[0] exist, then check if geometry.location.lat exist
            //otherwise output 0
            geolocation.lat = data.results[0] ?.geometry.location.lat ?? 0;
            geolocation.lng = data.results[0] ?.geometry.location.lng ?? 0;

            location = data.status === "ZERO_RESULTS" && undefined;
            if (location === undefined) {
                setLoading(false);
                toast.error("please enter a correct address");
                
              }
        } else {
            geolocation.lat = latitude;
            geolocation.lng = longitude;
        }

        async function storeImage(image){
            return new Promise((resolve, reject) => {
                const storage = getStorage();
                const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
                const storageRef = ref(storage, filename);
                const uploadTask = uploadBytesResumable(storageRef, image);
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                      // Observe state change events such as progress, pause, and resume
                      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                      const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                      console.log("Upload is " + progress + "% done");
                      switch (snapshot.state) {
                        case "paused":
                          console.log("Upload is paused");
                          break;
                        case "running":
                          console.log("Upload is running");
                          break;
                      }
                    },
                    (error) => {
                      // Handle unsuccessful uploads
                      reject(error);
                    },
                    () => {
                      // Handle successful uploads on complete
                      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                      });
                    }
                  );
            });
        }
        const imgUrls = await Promise.all(
            [...images].map((image)=> storeImage(image))
        ).catch((error)=>{
            setLoading(false);
            toast.error("Images are not uploaded");
            
        });
    
        const formDataCopy = {
            ...formData,
            imgUrls,
            geolocation,
            timestamp: serverTimestamp(),
            userRef: auth.currentUser.uid,
        };
        delete formDataCopy.images;//already have the imgUrls
        !formDataCopy.offer && delete formDataCopy.discountedPrice;
        delete formDataCopy.latitude;//because geolocation already have
        delete formDataCopy.longitude;//because geolocation already have
        
        const docRef = doc(db, "listings", params.listingId);
        await updateDoc(docRef, formDataCopy);
        setLoading(false);
        toast.success("Listing edited successful.");
        navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    }

    if (loading) {
        return <Spinner />;
      }
return (
    <main className="max-w-md px-2 mx-auto">
        <h1 className="text-3xl text-center mt-6 font-bold">Edit Listing</h1>
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
                    maxLength="60"
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

            {!geolocationEnable && (
                <div className="flex ">
                    <div className="w-[50%]">
                        <p className=" font-semibold mt-6 text-lg">Latitude</p>
                        <input 
                            type="number"
                            id="latitude"
                            value={latitude}
                            onChange={onChangeHandler}
                            required
                            min="-90"
                            max="90"
                            className="rounded"
                        />
                    </div>
                    <div className="w-[50%]">
                        <p className=" font-semibold mt-6 text-lg">Longitude</p>
                        <input 
                            type="number"
                            id="longitude"
                            value={longitude}
                            onChange={onChangeHandler}
                            required
                            min="-180"
                            max="180"
                            className="rounded"
                        />
                    </div>
                </div>
            ) }

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
                    <p className="text-xl mt-2 w-full whitespace-nowrap">$ / Week</p>
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
                            <p className="text-xl mt-2 w-full whitespace-nowrap">$ / Week</p>
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
