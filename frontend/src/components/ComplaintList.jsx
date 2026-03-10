import React, { useEffect, useState } from 'react';
import { MessageSquare, Trash2, Clock, CheckCircle, Construction, User, AlertCircle, Zap } from 'lucide-react';
import API from '../utils/api';
import { getAuthToken } from '../utils/storage';

const ComplaintList = ({ refreshTrigger }) => {
  const [complaints, setComplaints] = useState([]);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
      } catch (_e) { console.error("Token error", e); }
    }
    fetchComplaints();
  }, [refreshTrigger]);

  const fetchComplaints = async () => {
    try {
      const { data } = await API.get('/complaints');
      setComplaints(data);
    } catch (_err) { console.error("Failed to load complaints"); }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.put(`/complaints/${id}/status`, { status: newStatus });
      fetchComplaints();
    } catch (_err) { alert("Failed to update status"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    try {
      await API.delete(`/complaints/${id}`);
      fetchComplaints();
    } catch (_err) { alert("Failed to delete"); }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'resolved':
        return {
          badge: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200',
          icon: CheckCircle,
          label: 'Resolved'
        };
      case 'in-progress':
        return {
          badge: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200 animate-pulse',
          icon: Zap,
          label: 'In Progress'
        };
      default:
        return {
          badge: 'bg-gradient-to-r from-slate-400 to-slate-600 text-white shadow-lg shadow-slate-200',
          icon: Clock,
          label: 'Pending'
        };
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-3xl shadow-lg border border-slate-200">
      <h3 className="text-2xl font-bold mb-2 flex items-center gap-3 text-slate-800">
        <div className="p-2 bg-blue-500 rounded-xl text-white">
          <MessageSquare size={24} />
        </div>
        Recent Complaints
      </h3>
      <p className="text-slate-600 text-sm mb-8">Track and manage community issues</p>

      <div className="space-y-4">
        {complaints.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-300">
            <AlertCircle size={40} className="mx-auto text-slate-300 mb-2" />
            <p className="text-slate-400 font-semibold">No complaints filed yet</p>
          </div>
        ) : (
          complaints.map((c, idx) => {
            const statusStyle = getStatusStyles(c.status);
            const StatusIcon = statusStyle.icon;

            return (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md hover:shadow-lg transition-all transform hover:scale-102 hover:-translate-y-1 duration-300 group"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-transparent">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition">{c.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 flex-wrap">
                        <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg">
                          <Clock size={14} />
                          {new Date(c.createdAt).toLocaleDateString()}
                        </div>
                        {userRole === 'admin' && c.User && (
                          <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-lg font-semibold">
                            <User size={14} /> {c.User.name} • {c.User.wing}-{c.User.flatNumber}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 whitespace-nowrap ${statusStyle.badge}`}>
                      <StatusIcon size={16} />
                      {statusStyle.label}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Image */}
                    {c.imageUrl && (
                      <div className="relative">
                        <img
                          src={c.imageUrl}
                          alt="Complaint evidence"
                          className="w-32 h-32 object-cover rounded-xl border-2 border-slate-200 shadow-md group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}

                    {/* Description */}
                    <div className="flex-1">
                      <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 italic">
                        "{c.description}"
                      </p>
                    </div>
                  </div>

                  {/* Admin Controls */}
                  {userRole === 'admin' && (
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center gap-3">
                      <select
                        value={c.status}
                        onChange={(e) => handleStatusChange(c.id, e.target.value)}
                        className="text-sm font-bold text-slate-700 bg-white border-2 border-slate-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 cursor-pointer hover:border-blue-300 transition"
                      >
                        <option value="pending">📋 Pending</option>
                        <option value="in-progress">⚡ In Progress</option>
                        <option value="resolved">✓ Resolved</option>
                      </select>

                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-red-600 rounded-lg transition-all transform hover:scale-110 duration-200 shadow-sm hover:shadow-md"
                        title="Delete Complaint"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ComplaintList;