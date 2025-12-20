import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LayoutDashboard, Wallet, PieChart, Target, Layers, Settings, FileText, ShieldAlert, Menu, MessageSquare, Bell, Image, LogOut, Users, Sun, Moon } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Budgets } from './components/Budgets';
import { Ventures } from './components/Ventures';
import { Goals } from './components/Goals';
import { AdminControl } from './components/AdminControl';
import { YusraChat } from './components/YusraChat';
import { DesignVersionControl } from './components/DesignVersionControl';
import { Auth } from './components/Auth';
import { Reports } from './components/Reports';
import { UserManagement } from './components/UserManagement';
import { Settings as SettingsComponent } from './components/Settings';
import { YusraControlHub } from './components/YusraControlHub'; // Import new component
import { APP_NAME, NAVIGATION_ITEMS, YUSRA_DEFAULT_CONFIGS } from './constants';
import { auth, subscribeToAuthChanges, logout } from './services/firebase';
import { DataProvider } from './context/DataContext';
import { clsx } from 'clsx';
import { UserRole, YusraConfig, TrainingDocument, YusraGlobalSettings } from './types'; // Import UserRole and YusraConfig

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={clsx(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      active 
        ? "bg-qg-accent/10 text-qg-accent neon-text-green border border-qg-accent/20" 
        : "text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
    )}
  >
    <Icon size={20} className={clsx("transition-colors", active && "text-qg-accent drop-shadow-[0_0_5px_rgba(0,255,163,0.5)]")} />
    <span className="font-medium">{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-qg-accent shadow-[0_0_8px_#00FFA3]"></div>}
  </button>
);

const Layout = ({ children, user, onLogout, activeTab, setActiveTab, yusraRoleConfigs, setYusraRoleConfigs, trainingDocs, setTrainingDocs, yusraGlobalSettings, isDarkMode, toggleTheme }: { 
  children?: React.ReactNode, 
  user: any, 
  onLogout: () => void, 
  activeTab: string, 
  setActiveTab: (t: string) => void,
  yusraRoleConfigs: Record<UserRole, YusraConfig>,
  setYusraRoleConfigs: React.Dispatch<React.SetStateAction<Record<UserRole, YusraConfig>>>,
  trainingDocs: TrainingDocument[],
  setTrainingDocs: React.Dispatch<React.SetStateAction<TrainingDocument[]>>,
  yusraGlobalSettings: YusraGlobalSettings,
  isDarkMode: boolean,
  toggleTheme: () => void
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden selection:bg-qg-accent/30 selection:text-white">
      {/* Sidebar */}
      <aside className={clsx(
        "fixed md:relative w-72 h-full z-40 glass-panel md:border-r md:border-white/5 flex flex-col transition-transform duration-300",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-qg-accent to-blue-600 flex items-center justify-center shadow-lg shadow-qg-accent/20">
            <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
          </div>
          <div>
            <h1 className="font-bold text-slate-900 dark:text-white tracking-wider">QUANTUM</h1>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 tracking-[0.2em] uppercase">Business Cloud</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto scrollbar-none">
          {NAVIGATION_ITEMS.map((item) => (
            <SidebarItem 
              key={item.id}
              icon={item.icon} 
              label={item.label} 
              active={activeTab === item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }} 
            />
          ))}
        </nav>

        <div className="p-4 m-4 rounded-2xl bg-gradient-to-b from-black/5 to-transparent dark:from-white/5 border border-black/5 dark:border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <img src={user?.photoURL || 'https://ui-avatars.com/api/?name=User&background=random'} alt="User" className="w-10 h-10 rounded-full border-2 border-qg-accent/30" />
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.displayName || 'Quantum User'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
              <p className="text-xs text-qg-accent truncate capitalize">Role: {user?.role?.replace(/([A-Z])/g, ' $1').trim() || 'Unknown'}</p>
            </div>
          </div>
          <div className="flex gap-2">
             <button 
              onClick={toggleTheme}
              className="flex-1 py-2 text-xs font-medium bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 rounded-lg transition-colors flex items-center justify-center gap-2 border border-black/5 dark:border-transparent"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button 
              onClick={onLogout}
              className="flex-1 py-2 text-xs font-medium bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 rounded-lg transition-colors flex items-center justify-center gap-2 border border-black/5 dark:border-transparent"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 glass-panel border-b border-white/10 flex items-center justify-between px-4 shrink-0">
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-600 dark:text-slate-300">
            <Menu />
          </button>
          <span className="font-bold text-slate-900 dark:text-white">Quantum Glass</span>
          <button className="text-slate-600 dark:text-slate-300">
            <Bell size={20} />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </div>

        {/* Floating AI Button */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="fixed bottom-6 right-6 md:right-10 w-14 h-14 bg-qg-accent text-qg-dark rounded-full shadow-[0_0_20px_rgba(0,255,163,0.4)] flex items-center justify-center hover:scale-110 transition-transform z-50 group"
        >
          <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />
        </button>

        {/* Pass user.role and yusraRoleConfigs to YusraChat */}
        <YusraChat 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
          userRole={user.role as UserRole} 
          yusraRoleConfigs={yusraRoleConfigs}
          yusraGlobalSettings={yusraGlobalSettings}
        />
      </main>
    </div>
  );
};

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('theme');
    return stored ? stored === 'dark' : true; // Default to dark
  });

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const [yusraRoleConfigs, setYusraRoleConfigs] = useState<Record<UserRole, YusraConfig>>(() => {
    try {
      const storedConfigs = localStorage.getItem('yusraRoleConfigs');
      return storedConfigs ? JSON.parse(storedConfigs) : YUSRA_DEFAULT_CONFIGS;
    } catch (e) {
      console.error("Failed to load yusraRoleConfigs from localStorage", e);
      return YUSRA_DEFAULT_CONFIGS;
    }
  });
  const [trainingDocs, setTrainingDocs] = useState<TrainingDocument[]>(() => {
    try {
      const storedDocs = localStorage.getItem('trainingDocs');
      return storedDocs ? JSON.parse(storedDocs) : [];
    } catch (e) {
      console.error("Failed to load trainingDocs from localStorage", e);
      return [];
    }
  });

  // Global Yusra Settings Persistence
  const [yusraGlobalSettings, setYusraGlobalSettings] = useState<YusraGlobalSettings>(() => {
    try {
      const storedSettings = localStorage.getItem('yusraGlobalSettings');
      return storedSettings ? JSON.parse(storedSettings) : {
        responseVerbosity: 'standard',
        temperature: 0.7,
        topK: 64,
        topP: 0.95
      };
    } catch (e) {
      return {
        responseVerbosity: 'standard',
        temperature: 0.7,
        topK: 64,
        topP: 0.95
      };
    }
  });

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currUser) => {
      // Simulate a slight aesthetic delay for the 'system initialization' effect
      setTimeout(() => {
        setUser(currUser);
        setLoading(false);
      }, 1500);
    });
    return () => unsubscribe();
  }, []);

  // Persist yusraRoleConfigs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('yusraRoleConfigs', JSON.stringify(yusraRoleConfigs));
    } catch (e) {
      console.error("Failed to save yusraRoleConfigs to localStorage", e);
    }
  }, [yusraRoleConfigs]);

  // Persist trainingDocs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('trainingDocs', JSON.stringify(trainingDocs));
    } catch (e) {
      console.error("Failed to save trainingDocs to localStorage", e);
    }
  }, [trainingDocs]);

  // Persist global settings
  useEffect(() => {
    localStorage.setItem('yusraGlobalSettings', JSON.stringify(yusraGlobalSettings));
  }, [yusraGlobalSettings]);


  if (loading) {
    return (
      <div className="min-h-screen bg-[#05050F] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#05050F] to-[#05050F]"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 border-4 border-white/10 rounded-full flex items-center justify-center mb-8 relative">
             <div className="absolute inset-0 border-4 border-qg-accent/50 rounded-full border-t-transparent animate-spin"></div>
             <div className="w-16 h-16 bg-qg-accent/10 rounded-full animate-pulse"></div>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-widest animate-pulse">QUANTUM CUBE</h2>
          <p className="text-qg-accent text-sm mt-2 font-mono">INITIALIZING NEURAL INTERFACE...</p>
          
          <div className="w-64 h-1 bg-white/10 rounded-full mt-6 overflow-hidden">
            <div className="h-full bg-qg-accent animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <DataProvider>
      <Router>
        <Layout 
          user={user} 
          onLogout={logout} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          yusraRoleConfigs={yusraRoleConfigs} 
          setYusraRoleConfigs={setYusraRoleConfigs}
          trainingDocs={trainingDocs}
          setTrainingDocs={setTrainingDocs}
          yusraGlobalSettings={yusraGlobalSettings}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        >
           {activeTab === 'dashboard' && <Dashboard />}
           {activeTab === 'transactions' && <Transactions />}
           {activeTab === 'budgets' && <Budgets />}
           {activeTab === 'ventures' && <Ventures />}
           {activeTab === 'goals' && <Goals />}
           {activeTab === 'designs' && <DesignVersionControl />}
           {activeTab === 'reports' && <Reports />}
           {activeTab === 'users' && (
             <UserManagement 
               yusraRoleConfigs={yusraRoleConfigs}
               setYusraRoleConfigs={setYusraRoleConfigs}
             />
           )}
           {activeTab === 'settings' && <SettingsComponent isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}
           {activeTab === 'admin' && <AdminControl />}
           {activeTab === 'yusra-control' && (
             <YusraControlHub 
               yusraRoleConfigs={yusraRoleConfigs} 
               setYusraRoleConfigs={setYusraRoleConfigs} 
               trainingDocs={trainingDocs}
               setTrainingDocs={setTrainingDocs}
               currentUserRole={user.role as UserRole}
               yusraGlobalSettings={yusraGlobalSettings}
               setYusraGlobalSettings={setYusraGlobalSettings}
             />
           )}
        </Layout>
      </Router>
    </DataProvider>
  );
}

export default App;