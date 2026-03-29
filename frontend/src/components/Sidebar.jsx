import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  Users,
  Receipt,
  MessageSquare,
  LogOut,
  Shield,
  User,
  UserPlus,
  Building,
  Calendar,
  Bell
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0 shadow-2xl z-50">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Shield size={24} className="text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-wide">Smart Society</h1>
          <p className="text-xs text-slate-400">Society Manager</p>
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">

        <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Overview
        </div>

        <NavItem icon={<Home size={20} />} label="Dashboard" to="/dashboard" end={true} />
        <NavItem icon={<Bell size={20} />} label="Notices" to="/dashboard/notices" />
        <NavItem icon={<MessageSquare size={20} />} label="Complaints" to="/dashboard/complaints" />

        {user.role === 'admin' && (
          <>
            <div className="px-3 mt-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Admin Controls
            </div>
            <NavItem icon={<Users size={20} />} label="Manage Society" to="/dashboard/manage-society" />
            <NavItem icon={<Building size={20} />} label="Facilities" to="/dashboard/facilities" />
            <NavItem icon={<Calendar size={20} />} label="Booking Requests" to="/dashboard/bookings" />
            <NavItem icon={<UserPlus size={20} />} label="Invite Residents" to="/dashboard/invite" />
            <NavItem icon={<Receipt size={20} />} label="Billing System" to="/dashboard/admin-bills" />
            <NavItem icon={<Users size={20} />} label="Directory" to="/dashboard/residents" />
          </>
        )}

        {user.role === 'resident' && (
          <>
            <div className="px-3 mt-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Resident Menu
            </div>
            <NavItem icon={<Users size={20} />} label="Society Info" to="/dashboard/society" />
            <NavItem icon={<Calendar size={20} />} label="Events" to="/dashboard/events" />
            <NavItem icon={<Receipt size={20} />} label="My Bills" to="/dashboard/bills" />
          </>
        )}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) => `flex items-center gap-3 mb-4 cursor-pointer hover:bg-slate-800 p-2 rounded-lg transition group ${isActive ? 'bg-slate-800' : ''}`}
        >
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 overflow-hidden border border-slate-700 shadow-sm group-hover:border-blue-500 transition-colors">
            {user.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={20} />
            )}
          </div>
          <div className="overflow-hidden completely-transparent">
            <p className="text-sm font-bold truncate group-hover:text-blue-400 transition-colors">{user.name}</p>
            <p className="text-xs text-slate-500 truncate capitalize">{user.role}</p>
          </div>
        </NavLink>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white py-2 rounded-lg transition-all duration-300 text-sm font-medium"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
};

const NavItem = ({ icon, label, to, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) => `w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </NavLink>
);

export default Sidebar;