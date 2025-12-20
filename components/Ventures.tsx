
import React from 'react';
import { useData } from '../context/DataContext';
import { Target, Users, Clock, MoreVertical, ChevronRight } from 'lucide-react';

export const Ventures = () => {
  const { ventures } = useData();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Ventures</h2>
          <p className="text-slate-400 text-sm">Strategic projects & ROI</p>
        </div>
        <button className="bg-qg-accent text-qg-dark px-4 py-2 rounded-xl font-semibold hover:bg-emerald-400 transition-colors">
          Launch Venture
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ventures.map(v => (
          <div key={v.id} className="glass-panel p-6 rounded-2xl hover:border-qg-accent/30 transition-all group cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider border ${
                v.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                v.status === 'Planning' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                'bg-slate-500/10 text-slate-400 border-slate-500/20'
              }`}>
                {v.status}
              </span>
              <button className="text-slate-500 hover:text-white"><MoreVertical size={16} /></button>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-1">{v.name}</h3>
            <p className="text-slate-400 text-sm mb-6 h-10">{v.description}</p>

            <div className="space-y-4">
               <div>
                 <div className="flex justify-between text-xs mb-1">
                   <span className="text-slate-400">Progress</span>
                   <span className="text-qg-accent">{v.progress}%</span>
                 </div>
                 <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-qg-accent rounded-full" style={{ width: `${v.progress}%` }}></div>
                 </div>
               </div>

               <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-slate-300 text-xs">
                    <Users size={14} /> {v.teamSize}
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 text-xs">
                    <Target size={14} /> {v.roi}% ROI
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 text-xs">
                    <Clock size={14} /> 4mo
                  </div>
               </div>
            </div>
          </div>
        ))}
        
        {/* Add Card */}
        <div className="glass-panel border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-slate-500 hover:text-qg-accent hover:border-qg-accent/30 transition-all cursor-pointer min-h-[250px]">
           <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
             <Target size={24} />
           </div>
           <span className="font-medium">Initialize New Venture</span>
        </div>
      </div>
    </div>
  );
};
