import React, { useState, useEffect } from 'react';
import { YusraProvider, useYusra } from './context/YusraContext';
import { Shield, Zap, Mic, Terminal, LayoutGrid, Activity, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const YusraConsole = () => {
  const { isGodMode, setIsGodMode, identity } = useYusra();
  const [terminalText, setTerminalText] = useState("Initializing Yusra Engine...");

  useEffect(() => {
    setTimeout(() => {
      setTerminalText(`[SUCCESS] Identity Confirmed: ${identity.creator}'s Virtual CEO.`);
    }, 2000);
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-1000 p-4 ${isGodMode ? 'bg-[#120101]' : 'bg-[#02040a]'} text-white font-sans overflow-hidden`}>
      {/* Background Virtual Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(${isGodMode ? 'red' : '#00ffa3'} 1px, transparent 1px), linear-gradient(90deg, ${isGodMode ? 'red' : '#00ffa3'} 1px, transparent 1px)`, backgroundSize: '40px 40px', transform: 'perspective(500px) rotateX(60deg)', transformOrigin: 'top' }}>
      </div>

      <header className="relative z-10 flex justify-between items-center border-b border-white/5 pb-4 mb-8">
        <div className="flex items-center gap-3">
          <Cpu className={isGodMode ? "text-red-500" : "text-[#00FFA3]"} />
          <div>
            <h1 className="text-xl font-black uppercase tracking-widest">QCBE OS v2.3</h1>
            <p className="text-[9px] text-cyan-500 font-mono">AUTHORIZED: {identity.creator}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsGodMode(!isGodMode)}
          className={`px-8 py-2 rounded-full text-[10px] font-black border transition-all ${isGodMode ? 'bg-red-600 border-red-400 shadow-[0_0_30px_rgba(255,0,0,0.5)]' : 'bg-transparent border-white/20 hover:border-[#00FFA3]'}`}
        >
          {isGodMode ? 'GOD MODE: ACTIVE' : 'INITIALIZE GOD MODE'}
        </button>
      </header>

      <main className="relative z-10 grid grid-cols-12 gap-8 h-[calc(100vh-160px)]">
        <div className="col-span-8 flex flex-col gap-6">
          <div className={`flex-1 rounded-[3rem] p-12 border transition-all duration-700 ${isGodMode ? 'bg-black/60 border-red-500/30' : 'bg-[#0b1220]/80 border-white/10'}`}>
            <div className="text-center space-y-6">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 4 }} className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center ${isGodMode ? 'bg-red-600 shadow-[0_0_50px_red]' : 'bg-[#00FFA3] shadow-[0_0_50px_#00ffa366]'}`}>
                <Mic size={40} className="text-black" />
              </motion.div>
              <h2 className="text-4xl font-black italic tracking-tight">
                "Welcome back, Maynul. I am Yusra. Your empire is ready."
              </h2>
              <p className="text-gray-400 italic">"মাইনুল, আমি ইউসরা। আপনার ব্যবসায়িক সাম্রাজ্য এখন পূর্ণাঙ্গ সক্রিয়।"</p>
            </div>

            <div className="mt-12 flex gap-4">
              <input type="text" placeholder="Specify your executive command..." className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#00FFA3]" />
              <button className={`p-4 rounded-2xl ${isGodMode ? 'bg-red-600' : 'bg-[#00FFA3] text-black'} font-bold`}><Zap /></button>
            </div>
          </div>
        </div>

        <div className="col-span-4 flex flex-col gap-6">
          <div className="flex-1 bg-black/40 rounded-[2.5rem] p-6 border border-white/5 font-mono text-[10px]">
            <div className="flex items-center gap-2 mb-4 text-[#00FFA3] border-b border-white/5 pb-2">
              <Terminal size={14} /> <span>EXECUTIVE LOGS</span>
            </div>
            <div className="space-y-2 opacity-60">
              <div className="text-emerald-500">{terminalText}</div>
              <div>[SYNC] Section 6: God Mode Protocol Loaded.</div>
              <div>[SYNC] Module 13.0: Identity Verified.</div>
              <div>[STATUS] Virtual CEO: Online.</div>
              <div className="animate-pulse">_Listening for Maynul's voice...</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const App = () => (
  <YusraProvider>
    <YusraConsole />
  </YusraProvider>
);

export default App;
