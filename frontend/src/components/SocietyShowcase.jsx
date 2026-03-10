import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { Building, Phone, MapPin, CheckCircle, Edit3, X } from 'lucide-react';

const SocietyShowcase = ({ user }) => {
    const [society, setSociety] = useState(null);
    const [_loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [newAmenity, setNewAmenity] = useState('');

    const userRole = user?.role; // Use prop

    useEffect(() => {
        fetchSociety();
    }, []);

    const fetchSociety = async () => {
        try {
            const res = await API.get('/society');
            setSociety(res.data);
            setFormData(res.data);
        } catch (_err) {
            setError('Failed to load society details.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('address', formData.address);
            data.append('contactNumber', formData.contactNumber);
            data.append('amenities', JSON.stringify(formData.amenities));
            data.append('wings', JSON.stringify(formData.wings)); // Preserve wings if present

            if (formData.newGalleryFiles) {
                Array.from(formData.newGalleryFiles).forEach(file => {
                    data.append('gallery', file);
                });
            }

            if (formData.removeGalleryIndices) {
                data.append('removeGalleryIndices', JSON.stringify(formData.removeGalleryIndices));
            }

            // We need to set content-type for multipart, usually axios does it automatically if data is FormData
            const res = await API.put('/society', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setSociety(res.data);
            setFormData(res.data); // Reset form data
            setIsEditing(false);
            alert('Society details updated!');
        } catch (_err) {
            console.error(err);
            alert('Failed to update details.');
        }
    };

    const addAmenity = () => {
        if (newAmenity.trim()) {
            setFormData({
                ...formData,
                amenities: [...(formData.amenities || []), newAmenity]
            });
            setNewAmenity('');
        }
    };

    const removeAmenity = (index) => {
        const updated = [...formData.amenities];
        updated.splice(index, 1);
        setFormData({ ...formData, amenities: updated });
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading society details...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="p-6 md:p-10 space-y-8 animate-fade-in pb-24">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Society Showcase</h1>
                    <p className="text-slate-500">Overview of our community and facilities.</p>
                </div>
                {userRole === 'admin' && (
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition"
                    >
                        {isEditing ? <><X size={18} /> Cancel</> : <><Edit3 size={18} /> Edit Details</>}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info Card */}
                <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>

                    {isEditing ? (
                        <div className="space-y-4 text-slate-800">
                            <input
                                className="w-full p-3 rounded-lg"
                                value={formData.name || ''}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Society Name"
                            />
                            <textarea
                                className="w-full p-3 rounded-lg"
                                value={formData.address || ''}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Address"
                            />
                            <input
                                className="w-full p-3 rounded-lg"
                                value={formData.contactNumber || ''}
                                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                                placeholder="Contact Number"
                            />
                        </div>
                    ) : (
                        <>
                            <h2 className="text-4xl font-extrabold mb-4">{society.name}</h2>
                            <div className="space-y-4 text-blue-100">
                                <div className="flex items-start gap-3">
                                    <MapPin className="mt-1 flex-shrink-0" />
                                    <p className="text-lg leading-relaxed">{society.address || "Address not updated yet."}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone />
                                    <p className="text-lg font-medium">{society.contactNumber || "No contact info."}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Amenities Card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Building className="text-rose-500" /> Amenities
                    </h3>

                    <div className="flex flex-wrap gap-3">
                        {isEditing ? (
                            <div className="w-full space-y-3">
                                <div className="flex gap-2">
                                    <input
                                        className="flex-1 p-2 border rounded-lg"
                                        placeholder="Add amenity..."
                                        value={newAmenity}
                                        onChange={(e) => setNewAmenity(e.target.value)}
                                    />
                                    <button onClick={addAmenity} className="bg-green-600 text-white px-3 rounded-lg">+</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.amenities && Array.isArray(formData.amenities) && formData.amenities.map((amenity, idx) => (
                                        <span key={idx} className="bg-slate-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                            {amenity} <X size={14} className="cursor-pointer" onClick={() => removeAmenity(idx)} />
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            society.amenities && Array.isArray(society.amenities) && society.amenities.length > 0 ? (
                                society.amenities.map((amenity, index) => (
                                    <span key={index} className="px-4 py-2 bg-rose-50 text-rose-600 rounded-full text-sm font-semibold flex items-center gap-2">
                                        <CheckCircle size={14} /> {amenity}
                                    </span>
                                ))
                            ) : (
                                <p className="text-slate-400 italic">No amenities listed.</p>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Gallery Section */}
            <div className="mt-12">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Society Gallery</h3>
                {isEditing && (
                    <div className="mb-6 p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <p className="text-sm font-bold text-slate-500 mb-2">Upload New Photos</p>
                        <input
                            type="file"
                            multiple
                            onChange={(e) => {
                                const files = Array.from(e.target.files);
                                setFormData(prev => ({ ...prev, newGalleryFiles: files }));
                            }}
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {society.gallery && society.gallery.length > 0 ? (
                        society.gallery.map((imgUrl, index) => (
                            <div key={index} className="relative group rounded-xl overflow-hidden shadow-md aspect-video">
                                <img src={imgUrl} alt={`Gallery ${index} `} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                {isEditing && (
                                    <button
                                        onClick={() => {
                                            // Mark for deletion
                                            const currentRemoved = formData.removeGalleryIndices || [];
                                            setFormData(prev => ({
                                                ...prev,
                                                removeGalleryIndices: [...currentRemoved, index]
                                            }));
                                            // Visually hide or remove from current view for UX
                                            const tempGallery = [...society.gallery];
                                            tempGallery.splice(index, 1);
                                            setSociety(prev => ({ ...prev, gallery: tempGallery }));
                                        }}
                                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-slate-400 italic py-10">No photos added yet.</p>
                    )}
                </div>
            </div>

            {isEditing && (
                <div className="flex justify-end">
                    <button
                        onClick={handleUpdate}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                    >
                        Save Changes
                    </button>
                </div>
            )}
        </div>
    );
};

export default SocietyShowcase;
