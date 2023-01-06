import React from 'react'
import {  useNavigate } from 'react-router'
import { useLocation } from 'react-router'
const Header = () => {
    const navigate =useNavigate()
    const location = useLocation()
   const border = (router) => { 
    if(location?.pathname===router){
        return true
    }
    }
  return (
    <header className='flex justify-between mx-auto max-w-6xl px-4 items-center border py-3 shadow-md bg-white'>
        <div className='cursor-pointer ' onClick={() => { navigate('/') }}>
            <img  src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg" alt="" width={'300rem'} height={'300rem'} />
        </div>
        <div>
            <ul className='flex space-x-7'>
                <li onClick={() => { navigate("/") }} className={`cursor-pointer ${border('/')&& 'border-b-red-400 border-b-4 text-lg'}  `}>Home</li>
                <li  onClick={() => {navigate('/sign-in')  }} className={`cursor-pointer ${border('/sign-in')&& 'border-b-red-400 border-b-4 text-lg'}`}>Signin</li>
                <li onClick={() => {navigate('/offers') }} className={`cursor-pointer ${border('/offers')&& 'border-b-red-400 border-b-4 text-lg'}`}>Offers</li>
            </ul>
        </div>
    </header>
  )
}

export default Header