import React, { useState, useEffect } from 'react';
import { Shield, Zap, Mic, Terminal, LayoutGrid, Activity, TrendingUp, MessageSquare, BarChart3, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Week 1', roi: 400 }, { name: 'Week 2', roi: 700 },
  { name: 'Week 3', roi: 1200 }, { name: 'Week 4', roi: 2100 }
];

const YusraMaximumEngine = () => {
  const [isGodMode, setIsGodMode] = useState(false);
  const [strategyOutput, setStrategyOutput] = useState("Awaiting Creator's objective...");

  const generateStrategy = () => {
    setStrategyOutput("ANALYZING MARKET DATA... [OK] Cube #4 Reallocation Advised. 15% growth predicted in Q1.");
  };

  return (
    <div className={`min-h-screen transition-all duration-1000 p-4 font-sans ${isGodMode ? 'bg-[#0a0000]' : 'bg-[#02040a]'} text-white`}>
      {/* Top Identity Bar */}
      <header className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded ${isGodMode ? 'bg-red-600' : 'bg-cyan-500'}`}>
            <Zap className="w-5 h-5 text-black" />
          </div>
          <h1 className="text-xl font-black uppercase tracking-widest">QCBE Alpha Gen v2.0</h1>
        </div>
        <button 
          onClick={() => { setIsGodMode(!isGodMode); generateStrategy(); }}
          className={`px-6 py-2 rounded-full text-[10px] font-bold border transition-all ${isGodMode ? 'bg-red-600 border-red-400 shadow-[0_0_20px_red]' : 'border-white/20 hover:border-cyan-400'}`}
        >
          {isGodMode ? 'GOD MODE: ACTIVE' : 'INITIALIZE GOD MODE'}
        </button>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Module Sidebar */}
        <aside className="col-span-2 space-y-2">
          <p className="text-[10px] text-gray-500 font-bold mb-4 px-2">SYSTEM MODULES</p>
          {['Identity 1.0', 'Projects 5.0', 'Finance 7.0', 'Virtual 14.0'].map(m => (
            <div key={m} className="p-3 bg-white/5 rounded-xl text-[10px] border border-transparent hover:border-cyan-500/30 cursor-pointer flex items-center gap-2">
              <LayoutGrid size={14} className="text-cyan-400" /> {m}
            </div>
          ))}
        </aside>

        {/* Center: Strategy Studio */}
        <main className="col-span-7 space-y-6">
          <div className={`p-8 rounded-3xl border transition-all ${isGodMode ? 'bg-red-950/10 border-red-500/20' : 'bg-[#0b1220] border-white/5'}`}>
            <div className="flex flex-col items-center text-center gap-4">
              <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 3 }} className={`w-20 h-20 rounded-full flex items-center justify-center ${isGodMode ? 'bg-red-600' : 'bg-cyan-500'}`}>
                <Mic size={32} className="text-black" />
              </motion.div>
              <h2 className="text-2xl font-bold italic">"Good evening, Maynul. Strategy Studio is live."</h2>
              <p className="text-sm text-gray-400 max-w-md">{strategyOutput}</p>
            </div>
            
            <div className="mt-8 h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip contentStyle={{ backgroundColor: '#0b1220', border: 'none' }} />
                  <Line type="monotone" dataKey="roi" stroke={isGodMode ? '#ff0000' : '#00ffa3'} strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
             <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[9px] text-gray-500">MARKET CAP</p>
                <h4 className="text-lg font-bold text-cyan-400">$4.2M</h4>
             </div>
             <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[9px] text-gray-500">RISK INDEX</p>
                <h4 className="text-lg font-bold text-emerald-400">LOW</h4>
             </div>
             <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[9px] text-gray-500">OS HEALTH</p>
                <h4 className="text-lg font-bold text-orange-400">99%</h4>
             </div>
          </div>
        </main>

        {/* Right Sidebar: Intelligence Brief */}
        <aside className="col-span-3 space-y-4">
          <div className="bg-white/5 p-6 rounded-3xl border border-white/5 h-[400px] flex flex-col">
            <h3 className="text-xs font-bold mb-4 flex items-center gap-2 text-cyan-400">
              <Activity size={14}/> LIVE EXECUTIVE LOGS
            </h3>
            <div className="flex-1 text-[9px] font-mono space-y-2 opacity-60 overflow-y-auto">
              <div>[SYSTEM] Handshake with Neon DB...</div>
              <div>[OK] Table Projects Verified.</div>
              <div>[OK] Table Invoices Verified.</div>
              <div className="text-cyan-400">[USER] Mohammod Maynul Hasan Verified.</div>
              <div className="animate-pulse">_Waiting for orders...</div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-r from-cyan-900/20 to-transparent rounded-2xl border border-cyan-500/20">
             <Globe size={16} className="mb-2 text-cyan-400" />
             <p className="text-[10px] font-bold">GLOBAL REACH</p>
             <p className="text-[9px] opacity-60">Ready for Middle-East Expansion (Module 15.2)</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default YusraMaximumEngine;
