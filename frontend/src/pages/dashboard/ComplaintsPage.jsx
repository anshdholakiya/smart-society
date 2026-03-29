import React, { useState } from 'react';
import FileComplaint from '../../components/FileComplaint';
import ComplaintList from '../../components/ComplaintList';
import { useAuth } from '../../context/AuthContext';

const ComplaintsPage = () => {
  const { user } = useAuth();
  const [complaintRefresh, setComplaintRefresh] = useState(0);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Complaints & Issues</h2>
      </header>
      {user.role === 'resident' && (
        <FileComplaint onComplaintFiled={() => setComplaintRefresh(prev => prev + 1)} />
      )}
      <ComplaintList refreshTrigger={complaintRefresh} userRole={user.role} />
    </div>
  );
};

export default ComplaintsPage;
