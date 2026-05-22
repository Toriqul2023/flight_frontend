'use client'

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();

  const [user, setUser] = useState({
    id: "",
    name: "",
    email: ""
  });

  const [flights, setFlights] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookingError, setBookingError] = useState("");
  const [seat, setSeat] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem("id");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    if (!id || !name || !email) {
      alert("Please login first to access the dashboard!");
      router.push("/login");
      return;
    }

    setUser({
      id: id,
      name: name,
      email: email
    });

    axios.get("http://localhost:9090/flight")
      .then(res => {
        setFlights(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });

  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    alert("Logged out successfully!");
    router.push("/login");
  };

  const handleBooking = (flight) => {
    setSelectedFlight(flight);
    setShowModal(true);
  };

  const confirmBooking = async () => {
    if (!seat) {
      alert("Please assign a seat before confirming!");
      return;
    }

    try {
      const bookingData = {
        userId: user.id,
        flightId: selectedFlight.id,
        seat: seat
      };

      const res = await axios.post(
        "http://localhost:9090/booking",
        bookingData
      );

      alert("Booking Success");
      console.log(res.data);
      setShowModal(false);
      setSeat("");
    } catch (error) {
      console.log(error);
      alert("Booking Failed");
    }
  };

  if (loading && !user.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 font-sans antialiased">

      {/* Navbar - Responsive px-4 on mobile, px-8 on desktop */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-4 sm:px-8 py-4 sm:py-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          
          {/* Logo Title Section */}
          <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600/20 p-2 sm:p-2.5 rounded-xl border border-indigo-500/30 backdrop-blur-md">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-200">
                  AeroReserve
                </h1>
                <p className="text-[10px] sm:text-xs text-indigo-300 font-medium tracking-widest uppercase">Flight Booking Portal</p>
              </div>
            </div>
            
            {/* Guest/User badge specifically for Mobile layout */}
            <div className="sm:hidden bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md text-right">
              <h2 className="font-bold text-slate-100 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                {user.name.split(' ')[0]} {/* প্রথম অংশটি দেখাবে জায়গা বাঁচাতে */}
              </h2>
            </div>
          </div>

          {/* Action Buttons & Desktop profile container */}
          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto border-t border-white/10 pt-3 md:pt-0 md:border-none">
            
            {/* My Bookings Button - Full width on small mobile, auto on desktop */}
            <button
              onClick={() => router.push('/booking')}
              className="flex-1 md:flex-none justify-center bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-indigo-300 hover:text-white font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>My Bookings</span>
            </button>

            {/* User details container - Hidden on phone layout */}
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-md shadow-inner text-right hidden sm:block max-w-[200px] lg:max-w-none">
              <h2 className="font-bold text-slate-100 text-sm flex items-center justify-end gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                Hello, {user.name}
              </h2>
              <p className="text-[11px] text-indigo-200/70 font-medium mt-0.5 truncate">{user.email}</p>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="flex-1 md:flex-none justify-center bg-red-500/10 hover:bg-red-600 border border-red-500/20 hover:border-red-600 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-red-400 hover:text-white font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 shadow-lg"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>

        </div>
      </div>

      {/* Hero Banner with Airplane Graphic - Fully Responsive flex direction adjustments */}
      <div className="max-w-7xl mx-auto mt-4 sm:mt-8 px-4 sm:px-5">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          <div className="space-y-3 sm:space-y-4 max-w-xl relative z-10 text-center md:text-left items-center md:items-start flex flex-col">
            <span className="bg-white/20 text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-md">
              Premium Sky Travel
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Discover Your Next Grand Destination
            </h2>
            <p className="text-indigo-100 text-xs sm:text-sm md:text-base font-light max-w-md md:max-w-none">
              Explore dynamic routes, lock down premium custom seating alignments, and secure verified ticketing in real-time.
            </p>
          </div>
          <div className="w-full max-w-[240px] sm:max-w-[300px] md:max-w-[420px] relative drop-shadow-2xl opacity-90 hover:opacity-100 transition-opacity duration-300">
            <img 
              src="https://thumbs.dreamstime.com/b/passenger-airliner-flight-17934723.jpg" 
              alt="Modern Commercial Airplane Passenger Jet Illustration" 
              className="w-full object-contain transform md:-rotate-6 scale-105 md:scale-110"
            />
          </div>
        </div>
      </div>

      {/* Flight Section */}
      <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              Available Flights
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Select a route below to begin your reservation pipeline</p>
          </div>
          <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100 self-start sm:self-auto">
            {flights.length} Routes Found
          </div>
        </div>

        {/* Dynamic Flight Cards Grid - Responsive Grid (1 column on mobile, 2 on tablet, 3 on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {flights.map((flight) => (
            <div
              key={flight.id}
              className="bg-white rounded-2xl sm:rounded-3xl shadow-md hover:shadow-2xl border border-slate-100 overflow-hidden transform hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="bg-slate-50 p-5 sm:p-6 border-b border-dashed border-slate-200 relative">
                <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-slate-50/70 border-r border-slate-200 rounded-full z-10"></div>
                <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-slate-50/70 border-l border-slate-200 rounded-full z-10"></div>

                <div className="flex justify-between items-start mb-4">
                  <span className="bg-indigo-50 text-indigo-700 text-xs font-extrabold px-2.5 py-1.5 rounded-xl uppercase tracking-wider border border-indigo-100">
                    {flight.name}
                  </span>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fare Price</p>
                    <p className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {flight.price} <span className="text-xs font-bold text-slate-500">TK</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Origin</p>
                    <p className="text-lg font-extrabold text-slate-800 tracking-tight mt-0.5 truncate">{flight.from}</p>
                  </div>
                  
                  <div className="flex-[1.2] flex flex-col items-center px-1 relative">
                    <div className="w-full border-t-2 border-dashed border-slate-300 absolute top-1/2 -translate-y-1/2"></div>
                    <div className="bg-slate-50 p-1 rounded-full relative z-10 border border-slate-200 text-slate-400 group-hover:text-indigo-500 transform group-hover:rotate-45 transition-all duration-500">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                      </svg>
                    </div>
                  </div>

                  <div className="flex-1 text-right min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Destination</p>
                    <p className="text-lg font-extrabold text-slate-800 tracking-tight mt-0.5 truncate">{flight.to}</p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6 bg-white space-y-4 flex-grow flex flex-col justify-between">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 bg-slate-50/60 p-3 rounded-xl sm:rounded-2xl border border-slate-100">
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 truncate">
                      <svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      Date
                    </p>
                    <p className="text-xs font-bold text-slate-700 truncate">{flight.date}</p>
                  </div>
                  <div className="space-y-0.5 pl-2 sm:pl-3 border-l border-slate-200 min-w-0">
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 truncate">
                      <svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      Time
                    </p>
                    <p className="text-xs font-bold text-slate-700 truncate">{flight.time}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleBooking(flight)}
                  className="w-full bg-slate-900 text-white font-semibold py-3 px-4 rounded-xl shadow-md group-hover:bg-indigo-600 transition-all duration-200 flex items-center justify-center gap-2 text-sm tracking-wide"
                >
                  Configure Reservation
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Backdrop Modal - Added full modal width capping and mobile padding setup */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center z-50 p-4 transition-all animate-fade-in">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-transform duration-300">
            
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-5 sm:p-6 text-white relative">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Confirm Booking
              </h2>
              <p className="text-indigo-200 text-xs font-medium mt-1">Please confirm details and select a seat placement</p>
              
              <div className="absolute right-6 bottom-4 text-indigo-500/30 opacity-40 pointer-events-none hidden sm:block">
                <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                </svg>
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-4 sm:space-y-5">
              <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-4 border border-slate-100 space-y-2.5">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-slate-400 font-medium">Selected Liner:</span>
                  <span className="font-bold text-slate-800 uppercase tracking-wider">{selectedFlight?.name}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm items-center pt-2 border-t border-slate-200/60">
                  <span className="text-slate-400 font-medium">Flight Vector:</span>
                  <span className="font-extrabold text-indigo-600 tracking-tight">
                    {selectedFlight?.from} &rarr; {selectedFlight?.to}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">
                  Assign Airframe Seat
                </label>
                <div className="relative">
                  <select
                    value={seat}
                    onChange={(e) => setSeat(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 p-3 sm:p-3.5 pr-10 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none shadow-sm cursor-pointer"
                  >
                    <option value="" className="text-slate-400 font-medium">
                      Select Seat Assignment...
                    </option>
                    <option value="A1">Row A - Seat 1 (Window)</option>
                    <option value="A2">Row A - Seat 2 (Middle)</option>
                    <option value="A3">Row A - Seat 3 (Aisle)</option>
                    <option value="B1">Row B - Seat 1 (Window)</option>
                    <option value="B2">Row B - Seat 2 (Aisle)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4 pt-2">
                <button
                  onClick={confirmBooking}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all tracking-wide"
                >
                  Confirm Pass
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-sm border border-slate-200/60 active:scale-[0.98] transition-all tracking-wide"
                >
                  Cancel
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Page;