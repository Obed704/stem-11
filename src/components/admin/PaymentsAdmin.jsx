import React, { useEffect, useState } from "react";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payments`)
      .then((res) => res.json())
      .then(setPayments)
      .catch(console.error);
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">All Donations</h1>
      <table className="w-full bg-white rounded-lg shadow-lg border-collapse">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Payment Type</th>
            <th className="p-3">Provider</th>
            <th className="p-3">Status</th>
            <th className="p-3">Message</th>
            <th className="p-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p._id} className="border-b hover:bg-gray-50">
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.email}</td>
              <td className="p-3">${p.amount}</td>
              <td className="p-3">{p.paymentType}</td>
              <td className="p-3">{p.provider}</td>
              <td className="p-3">{p.status}</td>
              <td className="p-3">{p.message || "-"}</td>
              <td className="p-3">{new Date(p.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPayments;
