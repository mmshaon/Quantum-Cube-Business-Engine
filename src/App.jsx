import React, { useState } from 'react';
import { Shield, Zap, Mic, Database, LayoutGrid, Terminal } from 'lucide-react';

const YusraMaximumEngine = () => {
  const [isGodMode, setIsGodMode] = useState(false);

  return (
    <div className="min-h-screen bg-[#02040a] text-[#dff7f0] font-sans p-4 overflow-hidden">
      {/* Header: Identity & Mode */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
        <div>
          <h1 className="text-xl font-black tracking-widest text-[#00FFA3]">QCBE OS v2.0</h1>
          <p className="text-[10px] text-cyan-500 uppercase">Creator: Mohammod Maynul Hasan</p>
        </div>
        <button 
          onClick={() => setIsGodMode(!isGodMode)}
          className={`px-4 py-1 rounded-full text-xs font-bold transition-all border ${isGodMode ? 'bg-red-600 border-red-400' : 'bg-transparent border-white/20'}`}
        >
          {isGodMode ? 'GOD MODE: ACTIVE' : 'INITIALIZE GOD MODE'}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Module Sidebar */}
        <div className="col-span-3 space-y-2">
          <p className="text-[10px] text-gray-500 font-bold mb-4">SYSTEM MODULE TREE</p>
          {['Identity', 'Access Control', 'Project Studio', 'Finance Core', 'Yusra AI'].map(m => (
            <div key={m} className="p-3 bg-[#0b1220] border border-white/5 rounded-lg text-xs hover:border-[#00FFA3]/50 cursor-pointer flex items-center gap-3">
              <LayoutGrid size={14} className="text-cyan-400" /> {m}
            </div>
          ))}
        </div>

        {/* Yusra Main Console */}
        <div className="col-span-6 space-y-6">
          <div className="relative bg-[#0b1220] rounded-2xl p-8 border border-white/5 overflow-hidden">
            {/* Waveform Background Animation Effect */}
            <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
              <div className="w-full h-32 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"></div>
            </div>

            <div className="relative z-10 text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-tr from-cyan-600 to-[#00FFA3] rounded-full mx-auto shadow-[0_0_40px_rgba(0,255,163,0.3)] flex items-center justify-center">
                <Mic size={32} className="text-black" />
              </div>
              <h2 className="text-2xl font-bold italic">"Good evening, Maynul. How shall we scale today?"</h2>
              <p className="text-sm text-gray-400">Bangla: মাইনুল, আজ আমরা কিভাবে ব্যবসা বড় করবো?</p>
            </div>

            <div className="mt-8 flex gap-2">
              <input type="text" placeholder="Send executive order..." className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#00FFA3] outline-none" />
              <button className="bg-[#00FFA3] text-black p-3 rounded-xl hover:scale-105 transition-transform"><Zap /></button>
            </div>
          </div>

          {/* Quick Stats Widget */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#0b1220] p-4 rounded-xl border border-white/5">
              <p className="text-[10px] text-gray-500">LIABILITIES</p>
              <h4 className="text-lg font-bold text-red-400">+12%</h4>
            </div>
            <div className="bg-[#0b1220] p-4 rounded-xl border border-white/5">
              <p className="text-[10px] text-gray-500">ACTIVE CUBES</p>
              <h4 className="text-lg font-bold">04</h4>
            </div>
            <div className="bg-[#0b1220] p-4 rounded-xl border border-white/5">
              <p className="text-[10px] text-gray-500">ROI FORECAST</p>
              <h4 className="text-lg font-bold text-[#00FFA3]">24%</h4>
            </div>
          </div>
        </div>

        {/* Live Logs / God Mode Panel */}
        <div className="col-span-3 bg-[#0b1220] rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-4 text-[#00FFA3]">
            <Terminal size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest">Executive Logs</span>
          </div>
          <div className="space-y-3 font-mono text-[9px] text-cyan-700 h-[450px] overflow-y-auto">
            <div>[INIT] Database Connected...</div>
            <div>[SYNC] Neon Tables Verified...</div>
            <div>[AUTH] Creator Identity Confirmed...</div>
            <div className="text-white/40 italic">Waiting for input...</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YusraMaximumEngine;
