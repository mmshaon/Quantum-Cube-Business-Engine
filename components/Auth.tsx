
import React, { useState } from 'react';
import { signIn, signUp, resetPassword } from '../services/firebase';
import { Lock, Mail, User, ArrowRight, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Auth = () => {
  const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    // Simulate a minimum loading time for UX consistency (fast but noticeable)
    const minLoadTime = new Promise(resolve => setTimeout(resolve, 600));

    try {
      if (view === 'login') {
        await Promise.all([signIn(email, password), minLoadTime]);
      } else if (view === 'signup') {
        await Promise.all([signUp(email, password, name), minLoadTime]);
      } else if (view === 'forgot') {
        await Promise.all([resetPassword(email), minLoadTime]);
        setSuccessMsg('Reset link sent to your email.');
        setIsLoading(false);
      }
    } catch (err: any) {
      await minLoadTime;
      setError(err.message || "Authentication failed. Check your credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Content Container */}
      <div className="w-full max-w-md z-10 p-6 animate-in zoom-in-95 duration-500">
        
        {/* Logo & Branding */}
        <div className="flex flex-col items-center mb-10 animate-float">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-qg-accent to-blue-600 flex items-center justify-center shadow-[0_0_50px_rgba(0,255,163,0.4)] mb-6 border border-white/20">
            <div className="w-10 h-10 bg-white rounded-md transform rotate-45 shadow-inner"></div>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-widest font-mono">QUANTUM</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-[1px] w-8 bg-qg-accent"></div>
            <p className="text-qg-accent text-xs tracking-[0.3em] uppercase">Business OS</p>
            <div className="h-[1px] w-8 bg-qg-accent"></div>
          </div>
        </div>

        {/* Auth Card */}
        <div className="glass-panel rounded-[2rem] p-8 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          {/* Ambient Light inside card */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-qg-accent/20 blur-[60px] rounded-full pointer-events-none"></div>
          
          {/* Tabs */}
          <div className="flex gap-2 mb-8 p-1 bg-black/20 rounded-xl border border-white/5">
             <button 
                onClick={() => { setView('login'); setError(''); }} 
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${view === 'login' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
             >
               Login
             </button>
             <button 
                onClick={() => { setView('signup'); setError(''); }} 
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${view === 'signup' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
             >
               Register
             </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {view === 'signup' && (
              <div className="relative group animate-in slide-in-from-left-4 duration-300">
                <User className="absolute left-4 top-4 text-slate-500 group-focus-within:text-qg-accent transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-qg-accent/50 focus:ring-1 focus:ring-qg-accent/50 transition-all placeholder:text-slate-600 text-sm"
                />
              </div>
            )}

            <div className="relative group animate-in slide-in-from-left-4 duration-300 delay-75">
              <Mail className="absolute left-4 top-4 text-slate-500 group-focus-within:text-qg-accent transition-colors" size={20} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-qg-accent/50 focus:ring-1 focus:ring-qg-accent/50 transition-all placeholder:text-slate-600 text-sm"
              />
            </div>

            {view !== 'forgot' && (
              <div className="relative group animate-in slide-in-from-left-4 duration-300 delay-150">
                <Lock className="absolute left-4 top-4 text-slate-500 group-focus-within:text-qg-accent transition-colors" size={20} />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-qg-accent/50 focus:ring-1 focus:ring-qg-accent/50 transition-all placeholder:text-slate-600 text-sm"
                />
              </div>
            )}

            {/* Messages */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-xs animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
             
            {successMsg && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-3 text-green-400 text-xs animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-qg-accent to-emerald-400 text-qg-dark font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,255,163,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4 group relative overflow-hidden"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                   <div className="w-4 h-4 border-2 border-qg-dark border-t-transparent rounded-full animate-spin" />
                   <span className="text-sm">Processing...</span>
                </div>
              ) : (
                <>
                  <span className="relative z-10">{view === 'login' ? 'Initialize Session' : view === 'signup' ? 'Create Identity' : 'Send Reset Link'}</span>
                  <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex justify-between items-center text-xs text-slate-400">
             {view === 'login' ? (
               <button onClick={() => setView('forgot')} className="hover:text-qg-accent transition-colors">Forgot Credentials?</button>
             ) : (
               <button onClick={() => setView('login')} className="hover:text-qg-accent transition-colors">Back to Login</button>
             )}
             <div className="flex items-center gap-1.5">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               <span>System Online</span>
             </div>
          </div>
        </div>
        
        <div className="mt-8 text-center opacity-50 hover:opacity-100 transition-opacity duration-500">
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">Secure Connection • End-to-End Encrypted</p>
        </div>
      </div>
    </div>
  );
};
