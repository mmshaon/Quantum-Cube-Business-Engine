
import React from 'react';
import { useData } from '../context/DataContext';
import { Trophy, Calendar, AlertCircle } from 'lucide-react';

export const Goals = () => {
  const { goals } = useData();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Strategic Goals</h2>
          <p className="text-slate-400 text-sm">Objectives & Key Results</p>
        </div>
      </div>

      <div className="space-y-4">
        {goals.map(g => {
           const percent = Math.min(Math.round((g.currentAmount / g.targetAmount) * 100), 100);
           return (
             <div key={g.id} className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6">
                {/* Circular Progress */}
                <div className="relative w-24 h-24 shrink-0">
                   <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1e293b" strokeWidth="3" />
                      <path 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                        fill="none" 
                        stroke={g.status === 'On Track' ? '#00FFA3' : '#FF6EC7'} 
                        strokeWidth="3" 
                        strokeDasharray={`${percent}, 100`} 
                      />
                   </svg>
                   <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                     {percent}%
                   </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                   <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                     <h3 className="text-xl font-bold text-white">{g.title}</h3>
                     <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold w-fit mx-auto md:mx-0 ${g.status === 'On Track' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                       {g.status}
                     </span>
                   </div>
                   <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1"><Trophy size={14} className="text-qg-yellow"/> Target: ${g.targetAmount.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Calendar size={14}/> Due: {g.deadline}</span>
                   </div>
                </div>

                <div className="w-full md:w-auto flex flex-col gap-2">
                   <div className="text-right">
                      <p className="text-xs text-slate-500">Current</p>
                      <p className="text-lg font-mono text-white">${g.currentAmount.toLocaleString()}</p>
                   </div>
                   {g.status === 'At Risk' && (
                     <div className="flex items-center gap-2 text-xs text-qg-pink bg-qg-pink/10 px-3 py-1.5 rounded-lg">
                        <AlertCircle size={12} /> Needs Attention
                     </div>
                   )}
                </div>
             </div>
           )
        })}
      </div>
    </div>
  );
};
