'use client'

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // নেভিগেশনের জন্য useRouter ইমপোর্ট করা হলো

const Page = () => {
  const router = useRouter(); // router ইনিশিয়ালাইজেশন

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
  const [loading, setLoading] = useState(true); // লোডিং স্টেট

  useEffect(() => {
    const id = localStorage.getItem("id");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    // 🔒 রুট প্রোটেকশন চেক: ডাটা না থাকলে সরাসরি লগইন পেজে পাঠিয়ে দেবে
    if (!id || !name || !email) {
      alert("Please login first to access the dashboard!");
      router.push("/login"); // আপনার লগইন পেজের রাউট পাথ এখানে দিন
      return;
    }

    setUser({
      id: id,
      name: name,
      email: email
    });

    // ইউজার ভ্যালিড থাকলে তবেই ফ্লাইট ডাটা ফেচ হবে
    axios.get("https://testerflight-4.onrender.com/flight")
      .then(res => {
        setFlights(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });

  }, [router]);

  // 🚪 লগআউট হ্যান্ডেলার ফাংশন
  const handleLogout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    alert("Logged out successfully!");
    router.push("/login"); // লগআউট শেষে রিডাইরেক্ট
  };

  // book button click
  const handleBooking = (flight) => {
    setSelectedFlight(flight);
    setShowModal(true);
  };

  // confirm booking
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
        "https://testerflight-4.onrender.com/booking",
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

  // রিডাইরেক্ট হওয়া বা ডাটা ফেচিং ট্র্যাকিং এর সময় আনঅথরাইজড কন্টেন্ট ফ্ল্যাকার রোধে লোডিং স্ক্রিন
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
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto flex justify-between items-center relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600/20 p-2.5 rounded-xl border border-indigo-500/30 backdrop-blur-md">
              {/* Inline SVG Airplane Icon */}
              <svg className="w-7 h-7 text-indigo-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-200">
                AeroReserve
              </h1>
              <p className="text-xs text-indigo-300 font-medium tracking-widest uppercase">Flight Booking Portal</p>
            </div>
          </div>

          {/* User Status & Logout Button Container */}
          <div className="flex items-center gap-4">
            <div className="bg-white/5 border border-white/10 px-5 py-2.5 rounded-2xl backdrop-blur-md shadow-inner text-right hidden sm:block">
              <h2 className="font-bold text-slate-100 text-sm md:text-base flex items-center justify-end gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
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

      {/* Hero Banner with Airplane Graphic */}
      <div className="max-w-7xl mx-auto mt-8 px-5">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl relative z-10">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-md">
              Premium Sky Travel
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Discover Your Next Grand Destination
            </h2>
            <p className="text-indigo-100 text-sm md:text-base font-light">
              Explore dynamic routes, lock down premium custom seating alignments, and secure verified ticketing in real-time.
            </p>
          </div>
          <div className="w-full max-w-[340px] md:max-w-[420px] relative drop-shadow-2xl opacity-90 hover:opacity-100 transition-opacity duration-300">
            <img 
              src="https://thumbs.dreamstime.com/b/passenger-airliner-flight-17934723.jpg" 
              alt="Modern Commercial Airplane Passenger Jet Illustration" 
              className="w-full object-contain transform -rotate-6 scale-110"
            />
          </div>
        </div>
      </div>

      {/* Flight Section */}
      <div className="max-w-7xl mx-auto py-12 px-5">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              Available Flights
            </h2>
            <p className="text-sm text-slate-500 mt-1">Select a route below to begin your reservation pipeline</p>
          </div>
          <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100">
            {flights.length} Routes Found
          </div>
        </div>

        {/* Dynamic Flight Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {flights.map((flight) => (
            <div
              key={flight.id}
              className="bg-white rounded-3xl shadow-md hover:shadow-2xl border border-slate-100 overflow-hidden transform hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Card Header Background design mimicry of ticket header */}
              <div className="bg-slate-50 p-6 border-b border-dashed border-slate-200 relative">
                {/* Boarding Pass cutouts left & right */}
                <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-slate-50/70 border-r border-slate-200 rounded-full z-10"></div>
                <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-slate-50/70 border-l border-slate-200 rounded-full z-10"></div>

                <div className="flex justify-between items-start mb-4">
                  <span className="bg-indigo-50 text-indigo-700 text-xs font-extrabold px-3 py-1.5 rounded-xl uppercase tracking-wider border border-indigo-100">
                    {flight.name}
                  </span>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Fare Price</p>
                    <p className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {flight.price} <span className="text-xs font-bold text-slate-500">TK</span>
                    </p>
                  </div>
                </div>

                {/* Main Route Segment display */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Origin</p>
                    <p className="text-xl font-extrabold text-slate-800 tracking-tight mt-0.5">{flight.from}</p>
                  </div>
                  
                  {/* Decorative flight line art connector */}
                  <div className="flex-[1.5] flex flex-col items-center px-2 relative">
                    <div className="w-full border-t-2 border-dashed border-slate-300 absolute top-1/2 -translate-y-1/2"></div>
                    <div className="bg-slate-50 p-1.5 rounded-full relative z-10 border border-slate-200 text-slate-400 group-hover:text-indigo-500 transform group-hover:rotate-45 transition-all duration-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                      </svg>
                    </div>
                  </div>

                  <div className="flex-1 text-right">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Destination</p>
                    <p className="text-xl font-extrabold text-slate-800 tracking-tight mt-0.5">{flight.to}</p>
                  </div>
                </div>
              </div>

              {/* Card Footer Details */}
              <div className="p-6 bg-white space-y-4 flex-grow flex flex-col justify-between">
                <div className="grid grid-cols-2 gap-4 bg-slate-50/60 p-3.5 rounded-2xl border border-slate-100">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      Departure Date
                    </p>
                    <p className="text-xs font-bold text-slate-700">{flight.date}</p>
                  </div>
                  <div className="space-y-0.5 pl-3 border-l border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      Boarding Time
                    </p>
                    <p className="text-xs font-bold text-slate-700">{flight.time}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleBooking(flight)}
                  className="w-full bg-slate-900 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md group-hover:bg-indigo-600 transition-all duration-200 flex items-center justify-center gap-2 tracking-wide"
                >
                  Configure Reservation
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Backdrop Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center z-50 p-4 transition-all animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-transform duration-300">
            
            {/* Modal Header Banner */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-white relative">
              <h2 className="text-2xl font-black tracking-tight">
                Confirm Booking
              </h2>
              <p className="text-indigo-200 text-xs font-medium mt-1">Please confirm details and select an seat placement</p>
              
              <div className="absolute right-6 bottom-4 text-indigo-500/30 opacity-40">
                <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                </svg>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">Selected Liner:</span>
                  <span className="font-bold text-slate-800 uppercase tracking-wider">{selectedFlight?.name}</span>
                </div>
                <div className="flex justify-between text-sm items-center pt-2 border-t border-slate-200/60">
                  <span className="text-slate-400 font-medium">Flight Vector:</span>
                  <span className="font-extrabold text-indigo-600 tracking-tight">
                    {selectedFlight?.from} &rarr; {selectedFlight?.to}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                  Assign Airframe Seat
                </label>
                <div className="relative">
                  <select
                    value={seat}
                    onChange={(e) => setSeat(e.target.value)}
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 text-slate-800 p-3.5 pr-10 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none shadow-sm transition-all cursor-pointer"
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

              <div className="flex gap-4 pt-2">
                <button
                  onClick={confirmBooking}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all tracking-wide"
                >
                  Confirm Pass
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-4 rounded-xl border border-slate-200/60 active:scale-[0.98] transition-all tracking-wide"
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