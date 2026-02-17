import React, { useState, useEffect } from 'react';
import API from './api';
import { Trash2, Edit2, Plus, X } from 'lucide-react';

const AdminFacilityManagement = () => {
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({ name: '', description: '', capacity: 0, pricePerDay: 0 });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchFacilities();
    }, []);

    const fetchFacilities = async () => {
        try {
            const res = await API.get('/bookings/facilities');
            setFacilities(res.data);
            setLoading(false);
        } catch (err) {
            alert('Failed to fetch facilities');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await API.put(`/bookings/facilities/${editingId}`, formData);
                alert('Facility updated!');
            } else {
                await API.post('/bookings/facilities', formData);
                alert('Facility created!');
            }
            fetchFacilities();
            resetForm();
        } catch (err) {
            alert('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this facility?')) return;
        try {
            await API.delete(`/bookings/facilities/${id}`);
            fetchFacilities();
        } catch (err) {
            alert('Failed to delete facility');
        }
    };

    const handleEdit = (facility) => {
        setFormData({
            name: facility.name,
            description: facility.description,
            capacity: facility.capacity,
            pricePerDay: facility.pricePerDay
        });
        setEditingId(facility.id);
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', capacity: 0, pricePerDay: 0 });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="p-6 md:p-10 space-y-8 animate-fade-in pb-24">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Manage Facilities</h1>
                    <p className="text-slate-500">Add, update, or remove community facilities.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus size={18} /> Add Facility
                </button>
            </div>

            {/* Modal/Form */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative shadow-2xl animate-scale-in">
                        <button onClick={resetForm} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                            <X size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-slate-800 mb-6">
                            {editingId ? 'Edit Facility' : 'Add New Facility'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Facility Name</label>
                                <input
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Community Hall"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Price Per Day (₹)</label>
                                    <input
                                        type="number"
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.pricePerDay}
                                        onChange={e => setFormData({ ...formData, pricePerDay: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Capacity</label>
                                    <input
                                        type="number"
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Persons"
                                        value={formData.capacity}
                                        onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                                <textarea
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Details about the facility..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows="3"
                                />
                            </div>

                            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                                {editingId ? 'Update Facility' : 'Create Facility'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facilities.map(f => (
                    <div key={f.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-lg text-slate-800">{f.name}</h3>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(f)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg">
                                    <Edit2 size={18} />
                                </button>
                                <button onClick={() => handleDelete(f.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 mb-4 line-clamp-2">{f.description || "No description provided."}</p>
                        <div className="flex justify-between items-center text-sm font-medium text-slate-700">
                            <span>Capacity: {f.capacity}</span>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">₹{f.pricePerDay}/day</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminFacilityManagement;
