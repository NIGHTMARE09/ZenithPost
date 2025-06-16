import React from 'react';
import { useAuth } from '../context/Authcontext';
export const ProtectedRoute = ({element} : {element : React.ReactNode}) => {
    const {user, loading} = useAuth();
    if(loading){
        return <div className='text-center py-10'>Loading user...</div>;
    } 
    if(!user){
        window.location.href = '/signin';
        return null;
    }

    return element;
};
