import React, { useState, useEffect } from 'react';
import { Shield, Zap, Mic, Terminal, LayoutGrid, Activity, PieChart, TrendingUp, Settings, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';

const YusraMaximumEngine = () => {
  const [isGodMode, setIsGodMode] = useState(false);
  const [activeTab, setActiveTab] = useState('console');
  const [logs, setLogs] = useState(["[INIT] OS Booting...", "[OK] Identity Engine 1.0 Active"]);

  const modules = [
    { id: '1.0', name: 'Identity', icon: Shield },
    { id: '5.0', name: 'Projects', icon: LayoutGrid },
    { id: '7.0', name: 'Finance', icon: TrendingUp },
    { id: '13.0', name: 'Yusra AI', icon: MessageSquare },
    { id: '14.0', name: 'Virtual Worlds', icon: Activity }
  ];

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-700 font-sans p-4 overflow-hidden",
      isGodMode ? "bg-[#0a0202] text-red-100" : "bg-[#02040a] text-[#dff7f0]"
    )}>
      {/* Header Bar */}
      <header className="flex justify-between items-center border-b border-white/5 pb-4 mb-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-[#00FFA3]/10 rounded-lg">
            <Zap className={cn("w-6 h-6", isGodMode ? "text-red-500" : "text-[#00FFA3]")} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-widest uppercase">QCBE OS : Alpha Gen</h1>
            <p className="text-[9px] text-cyan-500 font-mono">AUTHORIZED CREATOR: MOHAMMOD MAYNUL HASAN</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">System Entropy</span>
            <div className="w-24 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
              <motion.div 
                animate={{ width: isGodMode ? "85%" : "20%" }} 
                className={cn("h-full", isGodMode ? "bg-red-600" : "bg-[#00FFA3]")} 
              />
            </div>
          </div>
          <button 
            onClick={() => setIsGodMode(!isGodMode)}
            className={cn(
              "px-6 py-2 rounded-full text-[10px] font-black transition-all border shadow-lg",
              isGodMode 
                ? "bg-red-600 border-red-400 text-white shadow-red-900/40" 
                : "bg-transparent border-white/20 hover:border-[#00FFA3]/50"
            )}
          >
            {isGodMode ? 'GOD MODE: ACTIVE' : 'INITIALIZE GOD MODE'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-120px)]">
        {/* Left Sidebar: Module Tree */}
        <aside className="col-span-2 space-y-3">
          <p className="text-[10px] text-gray-500 font-bold mb-4 tracking-[0.2em] px-2">MODULE TREE</p>
          {modules.map((m) => (
            <motion.div 
              whileHover={{ x: 5 }}
              key={m.id} 
              className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs hover:bg-white/10 transition-all cursor-pointer flex items-center gap-3 group"
            >
              <m.icon size={16} className="text-cyan-400 group-hover:text-[#00FFA3]" />
              <div>
                <p className="text-[8px] opacity-40">{m.id}</p>
                <p className="font-semibold">{m.name}</p>
              </div>
            </motion.div>
          ))}
          <div className="mt-10 p-4 border border-white/5 rounded-2xl bg-gradient-to-b from-transparent to-white/5">
             <Settings size={16} className="text-gray-500 mb-2" />
             <p className="text-[9px] text-gray-500 uppercase">System Config</p>
          </div>
        </aside>

        {/* Center: Yusra Executive Heart */}
        <main className="col-span-7 flex flex-col gap-6">
          <div className={cn(
            "relative flex-1 rounded-3xl p-10 border transition-all duration-500 overflow-hidden",
            isGodMode ? "bg-red-950/10 border-red-500/20 shadow-[0_0_50px_rgba(255,0,0,0.1)]" : "bg-[#0b1220] border-white/5 shadow-2xl"
          )}>
            {/* Waveform Animation */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [20, 100, 20, 50, 20] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                  className={cn("w-1 mx-1 rounded-full", isGodMode ? "bg-red-500" : "bg-[#00FFA3]")}
                />
              ))}
            </div>

            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="text-center">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className={cn(
                    "w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6",
                    isGodMode ? "bg-red-600 shadow-[0_0_60px_rgba(255,0,0,0.4)]" : "bg-[#00FFA3] shadow-[0_0_60px_rgba(0,255,163,0.3)]"
                  )}
                >
                  <Mic size={40} className="text-black" />
                </motion.div>
                <h2 className="text-3xl font-bold tracking-tight italic mb-2">
                  "Good evening, Maynul. How shall we dominate the market today?"
                </h2>
                <p className="text-gray-400 font-medium tracking-wide">
                  মাইনুল, আপনার ব্যবসায়িক সাম্রাজ্য পরিচালনার জন্য আমি প্রস্তুত।
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl p-4 flex items-center">
                    <Terminal size={16} className="text-gray-500 mr-3" />
                    <input 
                      type="text" 
                      placeholder="Input Executive Command..." 
                      className="bg-transparent border-none outline-none w-full text-sm placeholder:text-gray-700"
                    />
                  </div>
                  <button className={cn(
                    "p-4 rounded-2xl transition-all shadow-xl",
                    isGodMode ? "bg-red-600 text-white" : "bg-[#00FFA3] text-black"
                  )}>
                    <Zap size={24} />
                  </button>
                </div>
                <div className="flex justify-center gap-6">
                   <span className="text-[10px] text-gray-500 uppercase flex items-center gap-2"> <div className="w-1.5 h-1.5 bg-[#00FFA3] rounded-full animate-ping"/> Voice Recognition Active</span>
                   <span className="text-[10px] text-gray-500 uppercase">Dual Language Engine: EN/BN</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'LIABILITIES', val: '+12.5%', color: 'text-red-400' },
              { label: 'ACTIVE CUBES', val: '07', color: 'text-white' },
              { label: 'ROI FORECAST', val: '28.4%', color: 'text-[#00FFA3]' }
            ].map(stat => (
              <div key={stat.label} className="bg-[#0b1220] p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                <p className="text-[9px] text-gray-500 font-black mb-1 tracking-widest uppercase">{stat.label}</p>
                <h4 className={cn("text-xl font-black", stat.color)}>{stat.val}</h4>
              </div>
            ))}
          </div>
        </main>

        {/* Right Sidebar: Intelligence Logs */}
        <aside className="col-span-3 flex flex-col gap-6">
          <div className="flex-1 bg-[#0b1220] rounded-3xl p-6 border border-white/5 flex flex-col shadow-inner">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-[#00FFA3]">
                <Activity size={18} />
                <span className="text-xs font-black uppercase tracking-widest">Executive Logs</span>
              </div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
            
            <div className="flex-1 font-mono text-[10px] space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span>
                  <span className={log.includes('[OK]') ? "text-emerald-500" : "text-cyan-600"}>{log}</span>
                </div>
              ))}
              <motion.div 
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-white/40"
              >
                _Waiting for Maynul's command...
              </motion.div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#00FFA3]/10 to-transparent p-6 rounded-3xl border border-[#00FFA3]/10">
            <p className="text-[10px] text-cyan-500 font-bold mb-2">INTELLIGENCE BRIEF</p>
            <p className="text-xs leading-relaxed opacity-80">
              Yusra suggests reviewing **Cube #4** infrastructure. Latency detected in the Financial Core.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default YusraMaximumEngine;
