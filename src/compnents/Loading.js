import React from 'react'
import { ScaleLoader } from 'react-spinners'
const Loading = () => {
  return <div className='flex w-[100vw] h-[100vh] bg-black bg-opacity-50 items-center justify-center '>  <p className=' m-6 text-6xl'>Loading</p>
    <ScaleLoader className=' m-6 text-6x' color="#36d7b7"></ScaleLoader>  

  </div>
}

export default Loading