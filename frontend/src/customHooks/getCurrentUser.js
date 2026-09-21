import axios from 'axios';
import React, { useEffect } from 'react'
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const getCurrentUser = ()=>{

    const dispatch = useDispatch()

    useEffect(()=>{
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get(serverUrl + "/api/user/getcurrentuser", { withCredentials: true });
                console.log(response.data); // Handle the response data as needed
                dispatch(setUserData(response.data))
            } catch (error) {
                console.error('Error fetching current user:', error);
                dispatch(setUserData(null))
            }
        };
        fetchCurrentUser();
},[])
}

export default getCurrentUser