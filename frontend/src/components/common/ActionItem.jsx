import React from 'react';

const ActionItem = ({ title, status, priority }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:bg-white hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer">
    <div className="flex items-center gap-4">
      <div className={`w-3 h-3 rounded-full ring-2 ring-white shadow-sm ${
        priority === 'High' ? 'bg-red-500' : priority === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
      }`} />
      <span className="font-semibold text-slate-700">{title}</span>
    </div>
    <span className={`text-xs font-bold px-2 py-1 rounded border ${
      status === 'Overdue' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-100 text-slate-500 border-slate-200'
    }`}>
      {status}
    </span>
  </div>
);

export default ActionItem;
