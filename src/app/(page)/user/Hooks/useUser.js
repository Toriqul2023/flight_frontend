'use client'
import axios from "axios";
import { useEffect, useState } from "react";

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("https://testerflight-4.onrender.com/user")
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
      });
  }, [users]);

  return { users, setUsers, loading, error };
}