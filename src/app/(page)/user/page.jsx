'use client'

import { useState, useEffect } from "react";
import axios from "axios";

import UserHeader from "./components/UserHeader";
import UserForm from "./components/UserForm";
import UserCard from "./components/UserCard";
import useUsers from "./Hooks/useUser";

export default function page() {

  const { users, setUsers } = useUsers();

  const [showForm, setShowForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

 
  useEffect(() => {
    const AdminStatus = localStorage.getItem("isAdmin");
   
    if (AdminStatus === "true") {
      setIsAdmin(true);
    }
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    age: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // সিকিউরিটির জন্য সাবমিট করার সময় আরেকবার চেক
    if (!isAdmin) {
      alert("Unauthorized action!");
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()||
      !formData.phone.trim() ||
      !formData.age
    ) {
      alert("All fields are required!");
      return; 
    }

    try {
      const res = await axios.post("https://testerflight-4.onrender.com/user", formData);
      console.log(res.data)

      setUsers(prev=> [...prev, res.data]);

      setShowForm(false);

      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        age: ""
      });

    } catch (err) {
      alert(err.response?.data || "An error occurred while saving the user.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-indigo-500 selection:text-white antialiased">
      {/* Premium Top Gradient Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-sm" />

      <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        
        {/* Header Section Container - Conditional Render optimized */}
        {isAdmin && (
          <div className="mb-8 bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 backdrop-blur-md bg-white/90 relative overflow-hidden animate-fadeIn">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
           <UserHeader onAddClick={() => setShowForm(!showForm)} />
          </div>
        )}

        {/* Form Container with smooth drop-down presentation */}
        {showForm && isAdmin && (
          <div className="mb-8 p-6 sm:p-8 bg-white rounded-2xl shadow-xl border border-slate-100/80 transition-all duration-300 ease-in-out transform animate-fadeIn relative">
            <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-indigo-500 to-violet-600 rounded-l-2xl" />
            <UserForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
          </div>
        )}

        {/* Dynamic User Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Registered Directories
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage and view active system client profiles</p>
          </div>
          
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* এডমিন মোড একটিভ থাকলে একটি ছোট ভিজ্যুয়াল ব্যাজ দেখাবে */}
            {isAdmin && (
              <span className="text-[10px] uppercase font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-xl shadow-sm">
                Admin Mode
              </span>
            )}
            <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3.5 py-2 rounded-xl border border-indigo-100 shadow-inner">
              {users ? users.length : 0} Members Active
            </div>
          </div>
        </div>

        {/* Main Grid Section */}
        <main className="relative">
          {users && users.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {users.map((data) => (
                <div 
                  key={data.id} 
                  className="bg-white rounded-2xl border border-slate-100/80 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-indigo-100 flex flex-col justify-between group overflow-hidden"
                >
                  <div className="p-1.5 flex-grow">
                    <UserCard data={data} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Elegant Empty State */
            <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 space-y-4">
                <div className="mx-auto h-14 w-14 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 shadow-sm">
                  <svg 
                    className="h-7 w-7 text-indigo-400 animate-pulse" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">No Profiles Available</h3>
                  <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">Get started by creating a brand new verified client record above.</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}