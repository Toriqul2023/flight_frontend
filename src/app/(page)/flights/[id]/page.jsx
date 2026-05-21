'use client'
import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {
    const params=useParams();
    const[user,setUser]=useState({});
    useEffect(() => {
    axios.get(`http://localhost:9090/flight/${params?.id}`)
      .then(res => setUser(res.data))
      .catch(err => console.log(err));
  }, []);
  return (
    <div>{user?.name}</div>
  )
}

export default page