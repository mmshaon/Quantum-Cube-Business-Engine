import React, { useState } from 'react';
import { Shield, Zap, Mic, Terminal, LayoutGrid, Activity, Box, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const dummyData = [{v:400},{v:1200},{v:900},{v:2400},{v:1800},{v:3000}];

const YusraMaximumEngine = () => {
  const [isGodMode, setIsGodMode] = useState(false);

  return (
    <div className={`min-h-screen transition-all duration-700 p-4 font-sans ${isGodMode ? 'bg-[#0a0000]' : 'bg-[#02040a]'} text-white overflow-hidden`}>
      <header className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isGodMode ? 'bg-red-600 shadow-[0_0_20px_red]' : 'bg-[#00FFA3] shadow-lg'}`}>
            <Box className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase leading-none text-[#00FFA3]">QCBE OS v2.1</h1>
            <p className="text-[9px] text-cyan-500 font-mono mt-1">CREATOR: MOHAMMOD MAYNUL HASAN</p>
          </div>
        </div>
        <button onClick={() => setIsGodMode(!isGodMode)} className={`px-8 py-2 rounded-full text-[10px] font-black border transition-all ${isGodMode ? 'bg-red-600 border-red-400' : 'bg-transparent border-white/20 hover:border-[#00FFA3]'}`}>
          {isGodMode ? 'GOD MODE: ACTIVE' : 'INITIALIZE GOD MODE'}
        </button>
      </header>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-120px)]">
        <aside className="col-span-2 space-y-2">
          <p className="text-[10px] text-gray-600 font-black mb-4 tracking-[0.3em] px-2">SYSTEM TREE</p>
          {['1.0 Identity', '5.0 Projects', '7.0 Finance', '13.0 Yusra AI'].map(m => (
            <div key={m} className="p-3 bg-white/5 rounded-xl text-[10px] border border-transparent hover:border-cyan-500/30 flex items-center gap-2 cursor-pointer transition-all">
              <Target size={14} className="text-cyan-500" /> {m}
            </div>
          ))}
        </aside>

        <main className="col-span-7 space-y-6">
          <div className={`relative h-2/3 rounded-[2.5rem] p-10 border transition-all duration-500 overflow-hidden ${isGodMode ? 'bg-red-950/10 border-red-500/30' : 'bg-[#0b1220] border-white/5'}`}>
             <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none gap-1">
                {[...Array(20)].map((_, i) => (
                  <motion.div key={i} animate={{ height: isGodMode ? [20, 100, 20] : [10, 40, 10] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.05 }} className={`w-1 rounded-full ${isGodMode ? 'bg-red-500' : 'bg-cyan-500'}`} />
                ))}
             </div>
             <div className="relative z-10 text-center h-full flex flex-col justify-between">
                <div>
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 4 }} className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 ${isGodMode ? 'bg-red-600 shadow-[0_0_50px_red]' : 'bg-[#00FFA3] shadow-lg'}`}>
                    <Mic size={40} className="text-black" />
                  </motion.div>
                  <h2 className="text-2xl font-bold italic mb-2 tracking-tight">"Maynul, all cubes are synchronized. Systems optimal."</h2>
                  <p className="text-xs text-gray-500">মাইনুল, আপনার সিস্টেম এখন পূর্ণাঙ্গ রূপে সক্রিয়।</p>
                </div>
                <div className="h-24 opacity-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dummyData}><Area type="monotone" dataKey="v" stroke={isGodMode ? "#ff0000" : "#00ffa3"} fill={isGodMode ? "#ff0000" : "#00ffa3"} fillOpacity={0.1} /></AreaChart>
                  </ResponsiveContainer>
                </div>
             </div>
          </div>
          <div className="grid grid-cols-3 gap-4 h-1/3">
             {['ROI: 28.4%', 'Cubes: 12', 'Latency: 2ms'].map(s => (
               <div key={s} className="bg-white/5 p-4 rounded-3xl border border-white/5 flex items-center justify-center font-bold text-sm text-cyan-400">{s}</div>
             ))}
          </div>
        </main>

        <aside className="col-span-3 flex flex-col gap-4 h-full overflow-hidden">
          <div className="flex-1 bg-black/40 rounded-[2rem] p-6 border border-white/5 overflow-hidden">
             <div className="flex items-center gap-2 mb-4 text-[#00FFA3] text-[10px] font-black tracking-widest uppercase"><Terminal size={14}/> Executive Logs</div>
             <div className="space-y-2 font-mono text-[9px] opacity-60 overflow-y-auto">
                <div className="text-emerald-500">[OK] Handshake Verified.</div>
                <div className="text-cyan-400">[OS] Identity Engine v2.1 Active.</div>
                <div>[DB] Table Projects Ready.</div>
                <div className="animate-pulse">_Listening for command...</div>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default YusraMaximumEngine;
