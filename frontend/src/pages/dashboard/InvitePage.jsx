import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { inviteResident } from '../../services/apiServices';

const InvitePage = () => {
  const [inviteData, setInviteData] = useState({
    name: '', email: '', role: 'resident', wing: '', flatNumber: ''
  });
  const [inviteMsg, setInviteMsg] = useState('');

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteMsg('');
    try {
      await inviteResident(inviteData);
      setInviteMsg('✅ Invitation Sent!');
      setInviteData({ name: '', email: '', role: 'resident', wing: '', flatNumber: '' });
    } catch (err) {
      setInviteMsg('❌ Failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Invite New Resident</h2>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        {inviteMsg && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${
            inviteMsg.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {inviteMsg}
          </div>
        )}
        <form onSubmit={handleInvite} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Resident Name</label>
              <input type="text" placeholder="Ansh Dholakiya" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition" value={inviteData.name} onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })} required />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <input type="email" placeholder="dholakiyaansh1707@gmail.com" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition" value={inviteData.email} onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })} required />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Wing</label>
              <input type="text" placeholder="e.g. A" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition" value={inviteData.wing} onChange={(e) => setInviteData({ ...inviteData, wing: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Flat No.</label>
              <input type="text" placeholder="e.g. 101" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition" value={inviteData.flatNumber} onChange={(e) => setInviteData({ ...inviteData, flatNumber: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2">
            <UserPlus size={20} /> Send Invitation
          </button>
        </form>
      </div>
    </div>
  );
};

export default InvitePage;
