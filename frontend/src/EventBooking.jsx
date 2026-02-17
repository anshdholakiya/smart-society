import React, { useEffect, useState } from 'react';
import API from './api';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

const EventBooking = ({ user }) => {
    const [facilities, setFacilities] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [allBookings, setAllBookings] = useState([]); // Admin
    const [loading, setLoading] = useState(true);

    const isAdmin = user?.role === 'admin';

    // Booking Form State
    const [date, setDate] = useState('');
    const [days, setDays] = useState(1);
    const [selectedFacility, setSelectedFacility] = useState('');
    const [purpose, setPurpose] = useState('');

    // Facility Creation State (Admin)
    const [newFacility, setNewFacility] = useState({ name: '', description: '', capacity: 0, pricePerDay: 0 });
    const [showFacilityForm, setShowFacilityForm] = useState(false);

    useEffect(() => {
        fetchData(isAdmin);
    }, [isAdmin]);

    const fetchData = async (admin) => {
        try {
            const promises = [
                API.get('/bookings/facilities'),
                API.get('/bookings/my')
            ];
            if (admin) promises.push(API.get('/bookings/all'));

            const [facRes, myRes, allRes] = await Promise.all(promises);
            setFacilities(facRes.data);
            setMyBookings(myRes.data);
            if (allRes) setAllBookings(allRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async (e) => {
        e.preventDefault();
        try {
            await API.post('/bookings', { facilityId: selectedFacility, date, purpose, days });
            alert('Booking request sent successfully!');
            fetchData(isAdmin);
            setDate('');
            setDays(1);
            setPurpose('');
            setSelectedFacility('');
        } catch (err) {
            alert(err.response?.data?.message || 'Booking failed');
        }
    };

    const handleCreateFacility = async (e) => {
        e.preventDefault();
        try {
            await API.post('/bookings/facilities', newFacility);
            alert('Facility created successfully!');
            setNewFacility({ name: '', description: '', capacity: 0, pricePerDay: 0 });
            setShowFacilityForm(false);
            fetchData(isAdmin); // Refresh facilities list
        } catch (err) {
            alert('Failed to create facility');
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await API.put(`/bookings/${id}/status`, { status });
            fetchData(true);
        } catch (err) {
            alert('Failed to update status');
        }
    };

    return (
        <div className="p-6 md:p-10 space-y-8 animate-fade-in pb-24">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Event Booking</h1>
                    <p className="text-slate-500">
                        {isAdmin ? "Manage facilities and approve requests." : "Reserve community halls and facilities."}
                    </p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => setShowFacilityForm(!showFacilityForm)}
                        className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition"
                    >
                        {showFacilityForm ? 'Close Form' : '+ Add Facility'}
                    </button>
                )}
            </div>

            {/* Admin Facility Creation Form */}
            {isAdmin && showFacilityForm && (
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-inner mb-6">
                    <h3 className="font-bold text-slate-700 mb-4">Add New Facility</h3>
                    <form onSubmit={handleCreateFacility} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input placeholder="Facility Name (e.g. Gym)" className="p-3 border rounded-xl" value={newFacility.name} onChange={e => setNewFacility({ ...newFacility, name: e.target.value })} required />
                        <input placeholder="Price Per Day (₹)" type="number" className="p-3 border rounded-xl" value={newFacility.pricePerDay} onChange={e => setNewFacility({ ...newFacility, pricePerDay: e.target.value })} />
                        <input placeholder="Capacity (Persons)" type="number" className="p-3 border rounded-xl" value={newFacility.capacity} onChange={e => setNewFacility({ ...newFacility, capacity: e.target.value })} />
                        <input placeholder="Description" className="p-3 border rounded-xl" value={newFacility.description} onChange={e => setNewFacility({ ...newFacility, description: e.target.value })} />
                        <button className="col-span-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">Create Facility</button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Booking Form - HIDDEN FOR ADMIN */}
                {!isAdmin && (
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-fit">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">New Booking</h2>
                        <form onSubmit={handleBook} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-500 mb-1">Select Facility</label>
                                <select
                                    className="w-full p-3 bg-slate-50 border rounded-xl"
                                    value={selectedFacility}
                                    onChange={(e) => setSelectedFacility(e.target.value)}
                                    required
                                >
                                    <option value="">-- Choose --</option>
                                    {facilities.length > 0 ? facilities.map(f => (
                                        <option key={f.id} value={f.id}>{f.name} (Capacity: {f.capacity}) - ₹{f.pricePerDay}/day</option>
                                    )) : <option disabled>No facilities available</option>}
                                </select>
                                {selectedFacility && (
                                    <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-800 flex justify-between items-center">
                                        <span><strong>Max Capacity:</strong> {facilities.find(f => f.id.toString() === selectedFacility.toString())?.capacity} Persons</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-500 mb-1">Date</label>
                                <input
                                    type="date"
                                    className="w-full p-3 bg-slate-50 border rounded-xl"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 mb-1">No. of Days</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full p-3 bg-slate-50 border rounded-xl"
                                        value={days}
                                        onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 mb-1">Est. Price</label>
                                    <div className="w-full p-3 bg-slate-100 border rounded-xl text-slate-700 font-bold">
                                        ₹{selectedFacility ? (facilities.find(f => f.id.toString() === selectedFacility.toString())?.pricePerDay * days) : 0}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-500 mb-1">Purpose/Event Name</label>
                                <input
                                    type="text"
                                    className="w-full p-3 bg-slate-50 border rounded-xl"
                                    placeholder="Birthday Party, Meeting..."
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
                                    required
                                />
                            </div>

                            <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                                Request Booking
                            </button>
                        </form>
                    </div>
                )}

                {/* Bookings List */}
                <div className={`space-y-8 ${isAdmin ? 'col-span-3' : 'lg:col-span-2'}`}>

                    {/* Admin Approval Section */}
                    {isAdmin && (
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-4">All Booking Requests</h2>
                            <div className="space-y-4">
                                {allBookings.map(b => (
                                    <div key={b.id} className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
                                                <Calendar size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800">{b.Facility?.name}</h3>
                                                <p className="text-sm text-slate-500">
                                                    {new Date(b.date).toDateString()} • <span className="font-semibold">{b.User?.name}</span> ({b.User?.wing}-{b.User?.flatNumber})
                                                </p>
                                                <p className="text-xs text-slate-400">"{b.purpose}"</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {b.status === 'pending' ? (
                                                <>
                                                    <button onClick={() => updateStatus(b.id, 'approved')} className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-bold hover:bg-green-200">Approve</button>
                                                    <button onClick={() => updateStatus(b.id, 'rejected')} className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-bold hover:bg-red-200">Reject</button>
                                                </>
                                            ) : (
                                                <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${b.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {b.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div> {/* Closes the grid container */}

            {/* My Bookings Section - HIDDEN FOR ADMIN */}
            {!isAdmin && (
                <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-4">My Bookings</h2>
                    {myBookings.length === 0 ? (
                        <div className="bg-slate-50 rounded-xl p-8 text-center text-slate-500">
                            No bookings found.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {myBookings.map(b => (
                                <div key={b.id} className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800">
                                                {b.Facility ? b.Facility.name : <span className="text-slate-400 italic font-normal text-sm">(Deleted Facility)</span>}
                                            </h3>
                                            <p className="text-sm text-slate-500">{new Date(b.date).toDateString()} • {b.purpose}</p>
                                        </div>
                                    </div>

                                    <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2
                        ${b.status === 'approved' ? 'bg-green-100 text-green-700' :
                                            b.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {b.status === 'approved' && <CheckCircle size={14} />}
                                        {b.status === 'rejected' && <XCircle size={14} />}
                                        {b.status === 'pending' && <Clock size={14} />}
                                        {b.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EventBooking;
