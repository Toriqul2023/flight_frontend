'use client'
import axios from "axios";
import { useEffect, useState } from "react";

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:9090/user")
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
      });
  }, []);

  return { users, setUsers, loading, error };
}