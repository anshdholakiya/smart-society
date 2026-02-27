import React, { useState, useEffect } from 'react';
import API from './api';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

const AdminBookingRequests = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await API.get('/bookings/all');
            setBookings(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await API.put(`/bookings/${id}/status`, { status });
            fetchBookings(); // Refresh
        } catch (err) {
            alert('Failed to update status');
        }
    };

    return (
        <div className="p-6 md:p-10 space-y-8 animate-fade-in pb-24">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Booking Requests</h1>
                <p className="text-slate-500">Approve or reject resident facility bookings.</p>
            </div>

            <div className="space-y-4">
                {bookings.length === 0 ? (
                    <div className="text-center p-10 text-slate-500 bg-white rounded-2xl">
                        No booking requests found.
                    </div>
                ) : (
                    bookings.map(b => (
                        <div key={b.id} className="bg-white border border-slate-100 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between shadow-sm gap-4">
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{b.Facility?.name}</h3>
                                    <p className="text-sm text-slate-500">
                                        {new Date(b.date).toDateString()} • <span className="font-semibold">{b.User?.name}</span> ({b.User?.wing}-{b.User?.flatNumber})
                                    </p>
                                    <p className="text-xs text-slate-600 font-medium mt-1">
                                        {b.days} Days • Total: ₹{b.totalPrice}
                                    </p>
                                    <p className="text-xs text-slate-400">"{b.purpose}"</p>
                                </div>
                            </div>

                            <div className="flex gap-2 w-full md:w-auto justify-end">
                                {b.status === 'pending' ? (
                                    <>
                                        <button
                                            onClick={() => updateStatus(b.id, 'approved')}
                                            className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-bold hover:bg-green-200 transition"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => updateStatus(b.id, 'rejected')}
                                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-bold hover:bg-red-200 transition"
                                        >
                                            Reject
                                        </button>
                                    </>
                                ) : (
                                    <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${b.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {b.status === 'approved' && <CheckCircle size={14} />}
                                        {b.status === 'rejected' && <XCircle size={14} />}
                                        {b.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminBookingRequests;
