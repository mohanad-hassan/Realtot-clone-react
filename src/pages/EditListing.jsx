import React from 'react'
import Loading from '../compnents/Loading'
import {  toast } from 'react-toastify'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    serverTimestamp,
    updateDoc,
  } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { db,storage } from "../firebase";

import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';

const EditListing = () => {
  const navigate= useNavigate()
  const [formData,setFormData] = React.useState({type:'rent',name:'mo',bedrooms:3,bathrooms:4,parking:'false',furnished:true,address:'',description:'',offer:true,regularPrice:0,discountedPrice:0,
  latitude:0,
  longitude:0,images:{}})
  const [geolocationEnabled, setGeolocationEnabled] = React.useState(false); 


  const {type,name,bedrooms,bathrooms,parking,furnished,address,description,offer,regularPrice,discountedPrice,
    latitude,images,
    longitude,} = formData;

    const [loading, setLoading] = React.useState(false);
const params = useParams()
const [listing,setListing] = React.useState()
const auth= getAuth()

React.useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error("You can't edit this listing");
      navigate("/");
    }
  }, [auth.currentUser.uid, listing, navigate]);

React.useEffect(() => {
    setLoading(true);
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listing);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setFormData({ ...docSnap.data() });
        setLoading(false);
      } else {
        navigate("/");
        toast.error("Listing does not exist");
      }
    }
    fetchListing();
    setLoading(false)
  }, [navigate, params.listing]);





  function onChange(e) {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    // Text/Boolean/Number
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value, // boolean or e.target.value , if the first is false it will choose the second one 
      }));
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true)

    if (+discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.error("Discounted price needs to be less than regular price");
      return;
    }
    
    if (images.length > 6) {
      setLoading(false);
      toast.error("maximum 6 images are allowed");
      return;
    }

 let geolocation = {};
    let location;
    if (geolocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
      );
      const data = await response.json();
      console.log(data);
      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

      location = data.status === "ZERO_RESULTS" && undefined;
setLoading(false)
      if (location === undefined) {
        setLoading(false);
        toast.error("please enter a correct address");
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }

    //upload images to firestore 
    async function storeImage(image) {
      return new Promise((resolve, reject) => {
const auth = getAuth()
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
            console.log('errrror')
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
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });
const auth = getAuth()
    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;    const docRef = doc(db, "listings", params.listing);

     await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success("Listing created");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);

  }


  if (loading) {
    return <Loading />;
  }
  return (
    <main className='  p-3 m-3 max-w-3xl mx-auto'>
      <p className='text-center text-4xl'>Edit Listing
      </p>
      <form onSubmit={onSubmit}>
        {/* sell or rent */}
        <div>
          <p className='text-2xl'>Sell or Rent</p>
          <div>
            <button onClick={onChange} id='type' value={'sell'} type='button' className={`text-xl bg-white w-[35%] mr-4 rounded-xl p-2 mt-2  ${type==='sell'?'bg-blue-500 text-white':''}`}>Sell</button>
            <button onClick={onChange} id='type' value={'rent'} type='button' className={`text-xl bg-white w-[35%] mr-4 rounded-xl p-2 mt-2 ${type==='rent'?'bg-blue-500 text-white':''} `}>Rent</button>
          </div>
        </div>
        {/* Name  */}
        <div className='my-6'>
          <p className='text-2xl my-3'>Name</p>
          <input
          type="text"
          id="name"
          value={name}
          onChange={onChange}
          placeholder="Name"
          maxLength="32"
          minLength="10"
          required
          className="w-full px-4 py-2 text-xl  border-2 text-gray-700  bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-slate-700 focus:bg-white focus:border-blue-600 mb-6 outline-none 2xl"
        />
        </div>
        {/* beds and baths */}
        <div className='flex space-x-6 my-6'>
          <div>
            <p className='text-2xl'>BedRooms</p>
            <input id='bedrooms' value={bedrooms}  onChange={onChange} type="number"  className={'text-2xl my-2 text-center rounded-2xl border-2 transition duration-150 ease-in-out focus:text-slate-700 focus:bg-white focus:border-blue-600 mb-6 outline-none'} min={2} max={25} />
          </div>
          <div>
            <p className='text-2xl'>BathRooms</p>
            <input onChange={onChange} value={bathrooms} id='bathrooms' type="number"  className={'text-2xl my-2 text-center rounded-2xl border-2 transition duration-150 ease-in-out focus:text-slate-700 focus:bg-white focus:border-blue-600 mb-6 outline-none'} min={2} max={25} />
          </div>
        </div>
        {/* ParkingSpot  */}
        <div className='my-6'>
          <p className='text-2xl'>Parking Spot</p>
          <div>
            <button onClick={onChange} id='parking' value={true} type='button' className={`text-xl bg-white w-[35%] mr-4 rounded-xl p-2 mt-2  ${parking?'bg-blue-500 text-white':''}`}>YES</button>
            <button onClick={onChange} id='parking' value={false} type='button' className={`text-xl bg-white w-[35%] mr-4 rounded-xl p-2 mt-2 ${!parking?'bg-blue-500 text-white':''} `}>NO</button>
          </div>
        </div>
        {/* Furnished */}
        <div>
          <p className='text-2xl'>Furnished</p>
          <div className='my-6'>
            <button onClick={onChange} id='furnished' value={true} type='button' className={`text-xl bg-white w-[35%] mr-4 rounded-xl p-2 mt-2  ${furnished?'bg-blue-500 text-white':''}`}>YES</button>
            <button onClick={onChange} id='furnished' value={false} type='button' className={`text-xl bg-white w-[35%] mr-4 rounded-xl p-2 mt-2 ${!furnished?'bg-blue-500 text-white':''} `}>NO</button>
          </div>
        </div>
        {/* ADRESS */}
        <div>
          <p className='text-2xl my-6'>ADDRESS</p>
          <textarea
          type="text"
          id="address"
          value={address}
          onChange={onChange}
          placeholder="Address"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out border-2 focus:text-gray-700 focus:bg-white focus:border-blue-600 mb-6 outline-none"
        />
        </div>

        {/* longitude and latitude  */}
        {!geolocationEnabled && (
          <div className="flex space-x-6 justify-start mb-6">
            <div className="">
              <p className="text-lg font-semibold">Latitude</p>
              <input
                type="number"
                id="latitude"
                value={latitude}
                onChange={onChange}
                required
                min="-90"
                max="90"
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-2 border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-blue-600 text-center outline-none"
              />
            </div>
            <div className="">
              <p className="text-lg font-semibold">Longitude</p>
              <input
                type="number"
                id="longitude"
                value={longitude}
                onChange={onChange}
                required
                min="-180"
                max="180"
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-2 border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-blue-600 text-center outline-none"
              />
            </div>
          </div>
        )}
        {/* description */}
        <p className="text-lg font-semibold">Description</p>
        <textarea
          type="text"
          id="description"
          value={description}
          onChange={onChange}
          placeholder="Description"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white  border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 border-2 focus:bg-white focus:border-blue-600 mb-6 outline-none"
        />
        {/* offer */}
        <div>
          <p className='text-2xl'> Offer</p>
          <div>
            <button onClick={onChange} id='offer' value={true} type='button' className={`text-xl bg-white w-[35%] mr-4 rounded-xl p-2 mt-2  ${offer?'bg-blue-500 text-white':''}`}>yes</button>
            <button onClick={onChange} id='offer' value={false} type='button' className={`text-xl bg-white w-[35%] mr-4 rounded-xl p-2 mt-2 ${!offer?'bg-blue-500 text-white':''} `}>no</button>
            </div>
            <div className="flex items-center mb-6">
          <div className="">
            <p className="text-lg font-semibold">Regular price</p>
            <div className="flex w-full justify-center items-center space-x-6">
              <input
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onChange}
                min="50"
                max="400000000"
                required
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
              />
              {type === "rent" && (
                <div className="">
                  <p className="text-md w-full whitespace-nowrap">$ / Month</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {offer && (
          <div className="flex items-center mb-6">
            <div className="">
              <p className="text-lg font-semibold">Discounted price</p>
              <div className="flex w-full justify-center items-center space-x-6">
                <input
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onChange}
                  min="50"
                  max="400000000"
                  required={offer}
                  className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
                />
                {type === "rent" && (
                  <div className="">
                    <p className="text-md w-full whitespace-nowrap">
                      $ / Month
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
            </div>
            {/* Adding images  */}
            <div>
              <p className='text-2xl'>Images</p>
              <input
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg,.png,.jpeg"
            multiple
            required
            className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600"
          />
        </div>
        <button
          type="submit"
          className="my-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Edit Listing
        </button>
      </form>

      </main>
  )
}

export default EditListing