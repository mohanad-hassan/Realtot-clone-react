import React from 'react'
import { useParams } from 'react-router'
import {doc,getDoc} from 'firebase/firestore'
import {db} from '../firebase'
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css/bundle";
import {
  FaShare,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
} from "react-icons/fa";


const Listing = () => {
    SwiperCore.use([Autoplay, Navigation, Pagination]);

    const params = useParams()
    const [loading,setLoading]  = React.useState(true)
    const [listing,setListing]  = React.useState({})
    const [shareLinkCopied, setShareLinkCopied] = React.useState(false);
    React.useEffect(() => { 
       async function fetchListing ()  { 
        setLoading(true)

            const docref = doc(db,'listings',params.listing)
const docsnap = await getDoc(docref)
if (docsnap.exists()) {
    setListing(docsnap.data());
    setLoading(false);
  }
         }
fetchListing()
     },[params.listing])
     if(loading) {return <p>Loading</p>}
  return (
    <main>{listing?.name}
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[EffectFade]}
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full overflow-hidden h-[300px]"
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className="fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <FaShare className="text-lg text-slate-500" />
      </div>
      {shareLinkCopied && (
        <p className="fixed top-[23%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2">
          Link Copied
        </p>
      )}
    </main>
  )
}

export default Listing