'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Flights() {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:9090/flight")
      .then(res => setFlights(res.data))
      .catch(err => console.log(err));
  }, []);

  

  return (
    <div>
      <h2>Flight List</h2>

      {flights.map((f) => (
        <div key={f.id} style={{ border: "1px solid gray", margin: 10, padding: 10 }}>

          <h2>{f?.name}</h2>
          <h3>{f.from} → {f.to}</h3>
          <h3>Date {f?.date}</h3>
          <p>Price: {f?.price} BDT</p>
          <Link href={`/flights/${f.id}`}>Go</Link>
        </div>
      ))}
    </div>
  );
}