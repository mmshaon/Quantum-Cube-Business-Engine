import React from 'react';
import { Bell, Globe, Moon, Sun, Shield, Smartphone, Volume2 } from 'lucide-react';
import { clsx } from 'clsx';

interface SettingsProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">System Settings</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Preferences & Configuration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance */}
        <div className="glass-panel p-6 rounded-2xl">
           <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              {isDarkMode ? <Moon size={20} className="text-qg-accent" /> : <Sun size={20} className="text-amber-500" />} 
              Appearance
           </h3>
           <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                 <span className="text-slate-700 dark:text-slate-300">Dark Mode</span>
                 <div 
                   onClick={toggleTheme}
                   className={clsx(
                     "w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300",
                     isDarkMode 
                       ? "bg-qg-accent shadow-[0_0_10px_rgba(0,255,163,0.3)]" 
                       : "bg-slate-300"
                   )}
                 >
                    <div className={clsx(
                      "absolute top-1 w-4 h-4 bg-white dark:bg-black rounded-full shadow-md transition-all duration-300",
                      isDarkMode ? "right-1" : "left-1"
                    )}></div>
                 </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                 <span className="text-slate-700 dark:text-slate-300">Glass Effects</span>
                 <div className="w-12 h-6 bg-qg-accent rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white dark:bg-black rounded-full"></div>
                 </div>
              </div>
           </div>
        </div>

        {/* Notifications */}
        <div className="glass-panel p-6 rounded-2xl">
           <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Bell size={20} className="text-qg-pink" /> Notifications
           </h3>
           <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <span className="text-slate-700 dark:text-slate-300 text-sm">Transaction Alerts</span>
                 <div className="w-10 h-5 bg-slate-300 dark:bg-slate-700 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                 </div>
              </div>
              <div className="flex items-center justify-between">
                 <span className="text-slate-700 dark:text-slate-300 text-sm">Budget Warnings</span>
                 <div className="w-10 h-5 bg-qg-pink rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                 </div>
              </div>
              <div className="flex items-center justify-between">
                 <span className="text-slate-700 dark:text-slate-300 text-sm">Weekly Reports</span>
                 <div className="w-10 h-5 bg-slate-300 dark:bg-slate-700 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                 </div>
              </div>
           </div>
        </div>

        {/* Regional */}
        <div className="glass-panel p-6 rounded-2xl">
           <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Globe size={20} className="text-blue-500 dark:text-blue-400" /> Region & Language
           </h3>
           <div className="space-y-3">
              <div>
                 <label className="text-xs text-slate-500 block mb-1">Display Language</label>
                 <select className="w-full bg-white/50 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-lg p-2 text-slate-900 dark:text-white text-sm outline-none focus:border-blue-400">
                    <option>English (US)</option>
                    <option>Arabic (AR)</option>
                    <option>Bengali (BN)</option>
                 </select>
              </div>
              <div>
                 <label className="text-xs text-slate-500 block mb-1">Primary Currency</label>
                 <select className="w-full bg-white/50 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-lg p-2 text-slate-900 dark:text-white text-sm outline-none focus:border-blue-400">
                    <option>USD ($)</option>
                    <option>SAR (﷼)</option>
                    <option>EUR (€)</option>
                 </select>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};