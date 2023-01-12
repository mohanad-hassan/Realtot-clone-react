import React from 'react'
import { Outlet } from 'react-router'
import { Navigate } from 'react-router-dom'
import { useAuthStatus } from '../hooks/useAuthStatus'
import Loading from './Loading'
const PrivateRoute = () => {
    const {loggedIn,checkingStatus} = useAuthStatus()
    if(checkingStatus) {
        return <Loading></Loading>
    }
  return loggedIn?<Outlet/>:<Navigate to={'/sign-in'}/>
}

export default PrivateRoute