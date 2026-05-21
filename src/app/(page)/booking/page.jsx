'use client'

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // নেভিগেশনের জন্য useRouter ইমপোর্ট করা হলো

const BookingListPage = () => {
  const router = useRouter(); // router ইনিশিয়ালের জন্য

  const [user, setUser] = useState({
    id: "",
    name: "",
    email: ""
  });

  const [bookings, setBookings] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. LocalStorage থেকে ইউজার ডাটা নেওয়া
    const id = localStorage.getItem("id");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    // যদি কোনো ডাটা না থাকে, তারমানে ইউজার লগইন করা নেই। তাকে রিডাইরেক্ট করা হবে।
    if (!id || !name || !email) {
      alert("Please login first to access this page!");
      router.push("/login"); // আপনার লগইন পেজের রাউটে নিয়ে যাবে
      return;
    }

    const currentUser = {
      id: id,
      name: name,
      email: email
    };
    setUser(currentUser);

    // 2. ডেটা ফেচিং (ফ্লাইট এবং বুকিং লিস্ট)
    const fetchData = async () => {
      try {
        // সব ফ্লাইটের ডাটা নিয়ে আসা (ম্যাচিং করার জন্য)
        const flightRes = await axios.get("https://testerflight-4.onrender.com/flight");
        setFlights(flightRes.data);

        // সব বুকিং নিয়ে আসা
        const bookingRes = await axios.get("https://testerflight-4.onrender.com/booking");
        
        // শুধুমাত্র বর্তমান লগইন থাকা ইউজারের বুকিংগুলো ফিল্টার করা
        const userBookings = bookingRes.data.filter(
          (b) => String(b.userId) === String(currentUser.id)
        );
        setBookings(userBookings);

      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // লগআউট হ্যান্ডেল করার ফাংশন
  const handleLogout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    alert("Logged out successfully!");
    router.push("/login"); // লগআউট শেষে লগইন পেজে ট্রান্সফার
  };

  // বুকিং আইটেমের সাথে ফ্লাইটের বিস্তারিত তথ্য মেলানোর হেল্পার ফাংশন
  const getFlightDetails = (flightId) => {
    return flights.find((f) => String(f.id) === String(flightId)) || {};
  };

  // লগইন ছাড়া রিডাইরেক্ট হওয়ার আগ পর্যন্ত বা ডাটা লোড হওয়ার সময় ব্ল্যাঙ্ক স্ক্রিন এড়ানো
  if (loading && !user.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 font-sans antialiased">
      {/* Navbar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-8 py-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto flex justify-between items-center relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600/20 p-2.5 rounded-xl border border-indigo-500/30 backdrop-blur-md">
              <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-200">
                AeroReserve
              </h1>
              <p className="text-xs text-indigo-300 font-medium tracking-widest uppercase">My Bookings Panel</p>
            </div>
          </div>

          {/* User Profile & Logout Button Area */}
          <div className="flex items-center gap-4">
            <div className="bg-white/5 border border-white/10 px-5 py-2.5 rounded-2xl backdrop-blur-md shadow-inner text-right hidden sm:block">
              <h2 className="font-bold text-slate-100 text-sm md:text-base flex items-center justify-end gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                Hello, {user.name}
              </h2>
              <p className="text-xs text-indigo-200/70 font-medium mt-0.5">
                {user.email}
              </p>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-600 border border-red-500/20 hover:border-red-600 px-4 py-2.5 rounded-xl text-red-400 hover:text-white font-bold text-sm transition-all duration-200 flex items-center gap-2 shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto py-12 px-5">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            Your Reserved Itineraries
          </h2>
          <p className="text-sm text-slate-500 mt-1">Review your active boarding passes and custom airframe seat assignments</p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-medium">Loading your reservations...</p>
          </div>
        ) : bookings.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-xl mx-auto mt-8">
            <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800">No Bookings Found</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">You haven't locked down any tickets yet. Head back to the flight portal to initialize a pipeline.</p>
          </div>
        ) : (
          /* Bookings List Display */
          <div className="space-y-6">
            {bookings.map((booking) => {
              const flight = getFlightDetails(booking.flightId);
              return (
                <div 
                  key={booking.id}
                  className="bg-white rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 flex flex-col md:flex-row justify-between items-stretch"
                >
                  {/* Left Side: Route & Main Info */}
                  <div className="p-6 md:p-8 flex-grow flex flex-col justify-between border-b md:border-b-0 md:border-r border-dashed border-slate-200 relative">
                    
                    <div className="hidden md:block absolute -right-3 -top-3 w-6 h-6 bg-slate-50/70 border-b border-slate-200 rounded-full"></div>
                    <div className="hidden md:block absolute -right-3 -bottom-3 w-6 h-6 bg-slate-50/70 border-t border-slate-200 rounded-full"></div>

                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                      <span className="bg-indigo-50 text-indigo-700 text-xs font-extrabold px-3 py-1.5 rounded-xl uppercase tracking-wider border border-indigo-100">
                        {flight.name || `Flight ID: ${booking.flightId}`}
                      </span>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <span>Booking ID:</span>
                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold">{booking.id}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-6 max-w-md">
                      <div className="flex-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Origin</p>
                        <p className="text-xl md:text-2xl font-black text-slate-800 tracking-tight mt-0.5">{flight.from || "N/A"}</p>
                      </div>
                      
                      <div className="flex-1 flex flex-col items-center px-4 relative">
                        <div className="w-full border-t-2 border-dashed border-slate-200 absolute top-1/2 -translate-y-1/2"></div>
                        <div className="bg-white p-1 text-indigo-500 relative z-10 border border-slate-100 rounded-full">
                          <svg className="w-4 h-4 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                          </svg>
                        </div>
                      </div>

                      <div className="flex-1 text-right">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Destination</p>
                        <p className="text-xl md:text-2xl font-black text-slate-800 tracking-tight mt-0.5">{flight.to || "N/A"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Departure Date</p>
                        <p className="text-xs font-bold text-slate-700 mt-0.5">{flight.date || "Pending"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Boarding Time</p>
                        <p className="text-xs font-bold text-slate-700 mt-0.5">{flight.time || "Pending"}</p>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Passenger</p>
                        <p className="text-xs font-bold text-slate-700 mt-0.5 truncate">{user.name}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Ticket Stub */}
                  <div className="bg-slate-50/50 p-6 md:p-8 flex flex-col justify-center items-center md:w-64 text-center shrink-0 min-h-[160px]">
                    <div className="space-y-1 mb-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Assigned Seat</p>
                      <div className="inline-block bg-gradient-to-br from-indigo-600 to-indigo-800 text-white font-black text-3xl px-6 py-2.5 rounded-2xl shadow-md tracking-tight min-w-[90px]">
                        {booking.seat || "N/A"}
                      </div>
                    </div>
                    
                    <div className="w-full text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Verified Booking
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingListPage;