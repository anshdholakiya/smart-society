import React, { useState, useEffect } from 'react';
import AdminBills from '../../components/AdminBills';
import { useAuth } from '../../context/AuthContext';
import { getMyBills } from '../../services/apiServices';

const BillsPage = () => {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user.role === 'resident') {
      setLoading(true);
      getMyBills().then((data) => setBills(data)).finally(() => setLoading(false));
    }
  }, [user.role]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800">Billing & Finances</h2>
      {user.role === 'admin' ? (
        <AdminBills />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-700">My Payment History</h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
              <tr><th className="p-4">Description</th><th className="p-4">Amount</th><th className="p-4">Status</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="3" className="p-6 text-center text-slate-400">Loading bills...</td></tr>
              ) : bills.length === 0 ? (
                <tr><td colSpan="3" className="p-6 text-center text-slate-400">No bills found.</td></tr>
              ) : (
                bills.map(b => (
                  <tr key={b.id} className="border-b last:border-0 hover:bg-slate-50 transition">
                    <td className="p-4">
                      <span className="block font-bold text-slate-700">{b.description || b.month || 'Maintenance Bill'}</span>
                      <span className="text-xs text-slate-500">{b.month}</span>
                    </td>
                    <td className="p-4 font-bold text-slate-700">₹{b.amount}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        b.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {b.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BillsPage;
