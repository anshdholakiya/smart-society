import React, { useState, useEffect } from 'react';
import { Wallet, Users, AlertTriangle, TrendingUp, Shield, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getStats } from '../../services/apiServices';
import StatCard from '../../components/common/StatCard';
import ActionItem from '../../components/common/ActionItem';
import FinancialChart from '../../components/FinancialChart';

const OverviewPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCollected: 0,
    totalPending: 0,
    totalResidents: 0,
    activeIssues: 0,
    myBalance: 0,
    lastPayment: 0,
    lastPaymentDate: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (err) {
        console.error("Stats API error");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (loading) return <div className="animate-pulse">Loading overview data...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border border-slate-800">
        <div className="relative z-10">
          <h3 className="text-3xl font-bold mb-2">Society Overview</h3>
          <p className="text-slate-400">
            {user.role === 'admin'
              ? `You have ₹${(stats.totalPending || 0).toLocaleString()} in pending dues.`
              : `Welcome back. You have ${stats.activeIssues || 0} active support tickets.`}
          </p>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
          <Shield size={200} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {user.role === 'admin' ? (
          <>
            <StatCard title="Total Collection" value={`₹${(stats.totalCollected || 0).toLocaleString()}`} icon={<Wallet className="text-green-500" />} trend="Lifetime" />
            <StatCard title="Pending Dues" value={`₹${(stats.totalPending || 0).toLocaleString()}`} icon={<AlertTriangle className="text-amber-500" />} trend="Urgent" color="text-amber-600" />
            <StatCard title="Total Residents" value={stats.totalResidents || 0} icon={<Users className="text-blue-500" />} trend="Occupancy" />
            <StatCard title="Active Issues" value={stats.activeIssues || 0} icon={<MessageSquare className="text-rose-500" />} trend="Open Tickets" color="text-rose-600" />
          </>
        ) : (
          <>
            <StatCard title="Pending Dues" value={`₹${(stats.myBalance || 0).toLocaleString()}`} icon={<Wallet className="text-blue-500" />} trend="Outstanding" color={stats.myBalance > 0 ? "text-red-500" : "text-slate-800"} />
            <StatCard title="Last Payment" value={`₹${(stats.lastPayment || 0).toLocaleString()}`} icon={<TrendingUp className="text-green-500" />} trend={stats.lastPaymentDate ? new Date(stats.lastPaymentDate).toLocaleDateString() : 'None'} />
            <StatCard title="My Complaints" value={stats.activeIssues || 0} icon={<MessageSquare className="text-amber-500" />} trend="Pending" />
            <StatCard title="Total Paid" value={`₹${(stats.totalSpent || 0).toLocaleString()}`} icon={<Shield className="text-green-500" />} trend="Lifetime" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <FinancialChart stats={stats} />
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-full max-h-[350px] overflow-y-auto">
          <h4 className="font-bold text-slate-800 mb-6 text-lg">Urgent Action Items</h4>
          <div className="space-y-4">
            {stats.totalPending > 0 && (
              <ActionItem title={`Collect Pending Dues (₹${stats.totalPending.toLocaleString()})`} status="High Priority" priority="High" />
            )}
            {stats.activeIssues > 0 && (
              <ActionItem title={`Resolve ${stats.activeIssues} Open Complaints`} status="Pending" priority="Medium" />
            )}
            {user.role === 'admin' && new Date().getDate() <= 5 && (
              <ActionItem title="Generate Monthly Bills" status="Scheduled" priority="High" />
            )}
            {stats.totalPending === 0 && stats.activeIssues === 0 && (
              <div className="text-slate-400 italic p-4 text-center bg-slate-50 rounded-xl">All caught up! No urgent actions.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
