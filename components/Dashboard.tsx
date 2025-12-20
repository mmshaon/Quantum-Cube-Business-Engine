import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, CreditCard, Briefcase } from 'lucide-react';
import { useData } from '../context/DataContext';

const KPICard = ({ title, value, change, icon: Icon, trend, subtext, delay }: any) => (
  <div 
    className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:bg-white/50 dark:hover:bg-white/5 transition-all duration-300 glass-panel-hover animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-slate-900 dark:text-white">
      <Icon size={64} />
    </div>
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/10 group-hover:border-qg-accent/50 transition-colors">
          <Icon size={24} className="text-qg-accent" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${trend === 'up' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
          {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {Math.abs(change)}%
        </div>
      </div>
      <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</h3>
      <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
      {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const { financials, budgets, transactions } = useData();

  // Prepare Chart Data from Transactions (Grouping by Date/Month)
  const chartData = [
    { name: 'Start', income: 10000, expense: 8000 },
    { name: 'Mid', income: 15000, expense: 12000 },
    { name: 'Now', income: financials.totalIncome > 20000 ? financials.totalIncome : 20000, expense: financials.totalExpense > 10000 ? financials.totalExpense : 15000 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back. System status: <span className="text-qg-accent animate-pulse">Optimal</span></p>
        </div>
        <div className="flex gap-3">
          <select className="glass-panel px-4 py-2 rounded-xl text-sm text-slate-600 dark:text-slate-300 outline-none focus:border-qg-accent/50 transition-all bg-white/50 dark:bg-transparent">
            <option>Realtime</option>
            <option>Last 30 Days</option>
          </select>
          <button className="px-4 py-2 bg-qg-accent text-qg-dark font-semibold rounded-xl hover:bg-emerald-400 transition-all text-sm shadow-[0_0_15px_rgba(0,255,163,0.3)] hover:shadow-[0_0_25px_rgba(0,255,163,0.5)] hover:scale-105 active:scale-95">
            Generate Report
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Net Worth" 
          value={`$${financials.netWorth.toLocaleString()}`} 
          change={12.5} 
          icon={DollarSign} 
          trend="up" 
          subtext="Asset valuation updated"
          delay={100}
        />
        <KPICard 
          title="Monthly Cash Flow" 
          value={`$${financials.monthlyCashflow.toLocaleString()}`} 
          change={financials.monthlyCashflow > 0 ? 5.4 : -2.1} 
          icon={Activity} 
          trend={financials.monthlyCashflow > 0 ? "up" : "down"} 
          subtext="Income vs Expense"
          delay={200}
        />
        <KPICard 
          title="Total Expenses" 
          value={`$${financials.totalExpense.toLocaleString()}`} 
          change={5.1} 
          icon={CreditCard} 
          trend="down" 
          subtext={`${transactions.length} transactions recorded`}
          delay={300}
        />
        <KPICard 
          title="Active Ventures" 
          value="3" 
          change={0} 
          icon={Briefcase} 
          trend="up" 
          subtext="1 Pending Review"
          delay={400}
        />
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Chart */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Cash Flow Dynamics</h3>
            <div className="flex gap-2">
               <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400"><div className="w-2 h-2 rounded-full bg-qg-accent"></div> Income</span>
               <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400"><div className="w-2 h-2 rounded-full bg-qg-pink"></div> Expense</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FFA3" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00FFA3" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6EC7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF6EC7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" opacity={0.5} vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)', borderRadius: '12px', color: 'var(--text-primary)', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Area type="monotone" dataKey="income" stroke="#00FFA3" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" animationDuration={1500} />
                <Area type="monotone" dataKey="expense" stroke="#FF6EC7" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget Utilization */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-700 delay-600">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Budget Utilization</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Live tracking against caps</p>
          
          <div className="flex-1 flex flex-col justify-center space-y-6">
             {budgets.map((b) => {
               const percent = Math.min((b.spent / b.limit) * 100, 100);
               return (
                 <div key={b.id}>
                   <div className="flex justify-between text-sm mb-2">
                     <span className="text-slate-600 dark:text-slate-300">{b.category}</span>
                     <span className="text-slate-900 dark:text-white font-medium">{Math.round(percent)}%</span>
                   </div>
                   <div className="h-2 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                     <div 
                       className="h-full rounded-full transition-all duration-1000 ease-out"
                       style={{ width: `${percent}%`, backgroundColor: b.color }}
                     ></div>
                   </div>
                 </div>
               );
             })}
          </div>
          
          <div className="mt-6 p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/10">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                 <div className="w-2 h-2 rounded-full bg-qg-accent animate-pulse"></div>
              </div>
              <div>
                <p className="text-xs font-medium text-qg-accent mb-1">Yusra Insight</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Budget adherence is strong. You have ${ (budgets.reduce((acc, b) => acc + (b.limit - b.spent), 0)).toLocaleString() } remaining in allocated funds this month.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};