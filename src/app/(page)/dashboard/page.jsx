'use client'

import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Page = () => {

  const [user, setUser] = useState({
    name: "",
    email: ""
  });

  const [flights, setFlights] = useState([]);

  useEffect(() => {

    // localStorage থেকে user info নেওয়া
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    setUser({
      name: name || "",
      email: email || ""
    });

    // flight data fetch
    axios.get("http://localhost:9090/flight")
      .then(res => setFlights(res.data))
      .catch(err => console.log(err));

  }, []);



  return (

    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <div className="bg-black text-white px-8 py-5 shadow-md flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-bold">
            Flight Booking System
          </h1>
        </div>

        <div className="text-right">
          <h2 className="font-semibold">
            Hello, {user.name}
          </h2>

          <p className="text-sm text-indigo-100">
            {user.email}
          </p>
        </div>

      </div>

      {/* Flight Section */}
      <div className="max-w-7xl mx-auto py-10 px-5">

        <h2 className="text-3xl font-bold mb-8 text-gray-800">
          Available Flights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {flights.map((flight) => (

            <div
              key={flight.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition duration-300"
            >

              {/* Airline */}
              <div className="mb-4">

                <h3 className="text-2xl font-bold text-indigo-600">
                  {flight.name}
                </h3>

                <p className="text-gray-500">
                  Flight Price: {flight.price}
                </p>

              </div>

              {/* Route */}
              <div className="space-y-2 mb-5">

                <div className="flex justify-between">

                  <span className="font-semibold text-black">
                    From
                  </span>

                   <span className='text-black'>{ flight.from}</span> 

                </div>

                <div className="flex justify-between">

                  <span className="font-semibold text-black">
                    To
                  </span>

                   <span className='text-black'>{ flight.to}</span> 

                </div>

                <div className="flex justify-between">

                  <span className="font-semibold text-black">
                    Date
                  </span>

                   <span className='text-black'>{ flight.date}</span> 

                </div>

                <div className="flex justify-between">

                  <span className="font-semibold text-black">
                    Time
                  </span>

                  <span className='text-black'>
                    {flight.time}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="font-semibold text-black">
                    Price
                  </span>

                  <span className="text-green-600 font-bold">
                   <span className='text-green-600'>{ flight.price}</span> 
                  </span>

                </div>

              </div>

              {/* Button */}
              <button
                onClick={() => handleBooking(flight)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
              >
                Book Now
              </button>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default Page;