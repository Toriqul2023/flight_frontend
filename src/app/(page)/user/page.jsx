'use client'

import { useState } from "react";
import axios from "axios";

import UserHeader from "./components/UserHeader";
import UserForm from "./components/UserForm";
import UserCard from "./components/UserCard";
import useUsers from "./Hooks/useUser";

export default function page() {

  const { users, setUsers } = useUsers();

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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

  if (
    !formData.name.trim() ||
    !formData.email.trim() ||
    !formData.phone.trim() ||
    !formData.age
  ) {
    alert("All fields are required!");
    return; 
  }

  try {
    const res = await axios.post("https://testerflight-4.onrender.com/user", formData);
    console.log(res.data)

    setUsers([...users, res.data]);

    setShowForm(false);

    setFormData({
      name: "",
      email: "",
      phone: "",
      age: ""
    });

  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-6 py-10">

      <UserHeader onAddClick={() => setShowForm(!showForm)} />

      {showForm && (
        <UserForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      )}

      <div className="max-w-5xl mx-auto grid gap-5 sm:grid-cols-1 md:grid-cols-2">

        {users.map((data) => (
          <UserCard key={data?.id} data={data} />
        ))}

      </div>
    </div>
  );
}