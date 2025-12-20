
import React from 'react';
import { useData } from '../context/DataContext';
import { Shield, Activity, Users, Database, Server, Lock } from 'lucide-react';

export const AdminControl = () => {
  const { logs } = useData();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Shield className="text-qg-pink" /> Control Room
        </h2>
        <p className="text-slate-400 text-sm">System administration & logs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="glass-panel p-4 rounded-xl border-l-4 border-green-500">
            <div className="flex items-center justify-between">
               <div>
                  <p className="text-slate-400 text-xs uppercase">System Status</p>
                  <p className="text-white font-bold">Operational</p>
               </div>
               <Activity className="text-green-500" />
            </div>
         </div>
         <div className="glass-panel p-4 rounded-xl border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
               <div>
                  <p className="text-slate-400 text-xs uppercase">Active Users</p>
                  <p className="text-white font-bold">12</p>
               </div>
               <Users className="text-blue-500" />
            </div>
         </div>
         <div className="glass-panel p-4 rounded-xl border-l-4 border-qg-yellow">
            <div className="flex items-center justify-between">
               <div>
                  <p className="text-slate-400 text-xs uppercase">Database Load</p>
                  <p className="text-white font-bold">14%</p>
               </div>
               <Database className="text-qg-yellow" />
            </div>
         </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-white/5">
           <h3 className="font-semibold text-white">System Event Log</h3>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
           <table className="w-full text-left text-sm">
              <thead className="bg-black/20 text-slate-400">
                 <tr>
                    <th className="p-3 pl-6">Timestamp</th>
                    <th className="p-3">Severity</th>
                    <th className="p-3">Event</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                 {logs.map(log => (
                    <tr key={log.id} className="hover:bg-white/5">
                       <td className="p-3 pl-6 text-slate-500 font-mono text-xs">
                          {new Date(log.timestamp).toLocaleTimeString()}
                       </td>
                       <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                             log.severity === 'info' ? 'bg-blue-500/10 text-blue-400' :
                             log.severity === 'warning' ? 'bg-yellow-500/10 text-yellow-400' :
                             'bg-red-500/10 text-red-400'
                          }`}>
                             {log.severity}
                          </span>
                       </td>
                       <td className="p-3 text-slate-200">{log.event}</td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Server size={18} /> Server Actions</h3>
            <div className="space-y-3">
               <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-slate-300 transition-colors text-left px-4">Clear Cache</button>
               <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-slate-300 transition-colors text-left px-4">Restart Services</button>
               <button className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-sm text-red-400 transition-colors text-left px-4 border border-red-500/20">Emergency Shutdown</button>
            </div>
         </div>
         <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Lock size={18} /> Security</h3>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg mb-3">
               <span className="text-sm text-slate-300">2FA Enforcement</span>
               <div className="w-10 h-5 bg-qg-accent rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-black rounded-full"></div>
               </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
               <span className="text-sm text-slate-300">Public Registration</span>
               <div className="w-10 h-5 bg-slate-600 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
