
import React from 'react';
import { useData } from '../context/DataContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, AlertTriangle, Plus } from 'lucide-react';

export const Budgets = () => {
  const { budgets } = useData();
  const totalBudget = budgets.reduce((acc, b) => acc + b.limit, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const percentUsed = Math.round((totalSpent / totalBudget) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Budgets & Allocation</h2>
          <p className="text-slate-400 text-sm">Fiscal planning</p>
        </div>
        <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl border border-white/10 transition-colors flex items-center gap-2">
          <Plus size={18} /> Adjust Limits
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overview Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-qg-accent/5 to-transparent pointer-events-none"></div>
          <div className="w-48 h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {/* Fixed: Type casting budgets to any[] to resolve Recharts type incompatibility */}
                <Pie
                  data={budgets as any[]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="limit"
                >
                  {budgets.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#05050F', borderColor: '#333', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-3xl font-bold text-white">{percentUsed}%</span>
               <span className="text-xs text-slate-400 uppercase tracking-widest">Used</span>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-slate-400">Total Budget Cap</p>
            <p className="text-2xl font-bold text-white">${totalBudget.toLocaleString()}</p>
          </div>
        </div>

        {/* Budget List */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-6">
          <h3 className="text-lg font-semibold text-white">Category Breakdown</h3>
          <div className="space-y-5">
            {budgets.map(b => {
              const p = Math.round((b.spent / b.limit) * 100);
              const isOver = p > 90;
              return (
                <div key={b.id} className="group">
                  <div className="flex justify-between text-sm mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: b.color }}></span>
                      <span className="text-slate-200 font-medium">{b.category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">${b.spent.toLocaleString()} / ${b.limit.toLocaleString()}</span>
                      {isOver && <AlertTriangle size={14} className="text-red-400 animate-pulse" />}
                    </div>
                  </div>
                  <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 relative"
                      style={{ width: `${Math.min(p, 100)}%`, backgroundColor: b.color }}
                    >
                       <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-1">
                    <span className={`text-xs ${isOver ? 'text-red-400' : 'text-slate-500'}`}>{p}% Used</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="p-4 bg-qg-accent/10 border border-qg-accent/20 rounded-2xl flex items-center gap-4">
        <div className="p-3 bg-qg-accent/20 rounded-full text-qg-accent">
          <TrendingUp size={24} />
        </div>
        <div>
           <h4 className="text-white font-medium">Forecasting Insight</h4>
           <p className="text-sm text-slate-300">Based on current burn rate, Operations budget will be exhausted by day 24. Recommend transferring surplus from Marketing.</p>
        </div>
        <button className="ml-auto px-4 py-2 bg-qg-accent text-qg-dark rounded-lg text-sm font-bold">Auto-Reallocate</button>
      </div>
    </div>
  );
};
