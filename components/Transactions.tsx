
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Plus, Search, ArrowUpRight, ArrowDownLeft, MoreHorizontal, Check, AlertCircle, Sparkles, ArrowRight, X, Edit2 } from 'lucide-react';
import { analyzeTransaction } from '../services/gemini';
import { Transaction } from '../types';

export const Transactions = () => {
  const { transactions, addTransaction, updateTransaction } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [filter, setFilter] = useState('all');
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('SAR'); // Default currency SAR
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('Uncategorized');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAIAnalysis = async () => {
    if (!description || !amount) return;
    setIsAnalyzing(true);
    const result = await analyzeTransaction(description, Number(amount));
    setCategory(result.category);
    setIsAnalyzing(false);
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date) return;
    setShowConfirmation(true);
  };

  const handleEdit = (t: Transaction) => {
    setEditingId(t.id);
    setDescription(t.description);
    setAmount(t.amount.toString());
    setCurrency(t.currency);
    setType(t.type);
    setCategory(t.category);
    setDate(t.date);
    setIsModalOpen(true);
  };

  const handleFinalConfirm = () => {
    if (editingId) {
      updateTransaction(editingId, {
        description,
        amount: Number(amount),
        type,
        category,
        currency,
        date,
        status: 'approved'
      });
    } else {
      addTransaction({
        id: Date.now().toString(),
        description,
        amount: Number(amount),
        type,
        category,
        currency,
        date,
        status: 'approved'
      });
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowConfirmation(false);
    setEditingId(null);
    setDescription('');
    setAmount('');
    setCurrency('SAR');
    setCategory('Uncategorized');
    setType('expense');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const filteredData = transactions.filter(t => filter === 'all' || t.type === filter);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Transactions</h2>
          <p className="text-slate-400 text-sm">Real-time ledger</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-qg-accent text-qg-dark px-4 py-2 rounded-xl font-semibold hover:bg-emerald-400 transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> New Entry
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:border-qg-accent/50 outline-none"
          />
        </div>
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
          <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filter === 'all' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}>All</button>
          <button onClick={() => setFilter('income')} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filter === 'income' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}>Income</button>
          <button onClick={() => setFilter('expense')} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filter === 'expense' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}>Expense</button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4">Description</th>
              <th className="p-4">Category</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Amount</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredData.map(t => (
              <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${t.type === 'income' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {t.type === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                    </div>
                    <span className="font-medium text-slate-200">{t.description}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded-md bg-white/5 text-xs text-slate-300 border border-white/10">
                    {t.category}
                  </span>
                </td>
                <td className="p-4 text-slate-400 text-sm">{t.date}</td>
                <td className={`p-4 text-right font-mono font-medium ${t.type === 'income' ? 'text-green-400' : 'text-slate-200'}`}>
                  {t.type === 'income' ? '+' : '-'}{t.currency} {t.amount.toLocaleString()}
                </td>
                <td className="p-4 text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] uppercase font-bold ${
                    t.status === 'approved' ? 'bg-green-500/10 text-green-400' : 
                    t.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {t.status === 'approved' && <Check size={10} />}
                    {t.status}
                  </span>
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button 
                    onClick={() => handleEdit(t)}
                    className="p-1 hover:bg-white/10 rounded text-slate-500 hover:text-qg-accent transition-colors"
                    title="Edit Transaction"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button className="p-1 hover:bg-white/10 rounded text-slate-500 hover:text-white">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <div className="p-12 text-center text-slate-500">No transactions found.</div>
        )}
      </div>

      {/* Add/Edit Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 animate-in zoom-in-95 relative">
            
            {/* Confirmation View */}
            {showConfirmation ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <AlertCircle size={32} className="text-qg-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{editingId ? 'Update Transaction' : 'Confirm Entry'}</h3>
                  <p className="text-slate-400 text-sm mt-1">Please review the details before saving.</p>
                </div>

                <div className="bg-black/40 rounded-xl p-5 border border-white/10 space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="text-slate-400 text-sm">Amount</span>
                    <span className={`text-xl font-mono font-bold ${type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                      {type === 'income' ? '+' : '-'}{currency} {Number(amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Description</span>
                      <span className="text-slate-200 font-medium">{description}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Category</span>
                      <span className="text-qg-accent">{category}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Date</span>
                      <span className="text-slate-200">{date}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Type</span>
                      <span className="text-slate-200 capitalize">{type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleFinalConfirm}
                    className="flex-1 py-3 bg-qg-accent text-qg-dark font-bold rounded-xl hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(0,255,163,0.2)] flex items-center justify-center gap-2"
                  >
                    {editingId ? 'Update' : 'Confirm'} <Check size={18} />
                  </button>
                </div>
              </div>
            ) : (
              /* Form View */
              <form onSubmit={handleInitialSubmit} className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                   <h3 className="text-xl font-bold text-white">{editingId ? 'Edit Transaction' : 'Add Transaction'}</h3>
                   <button type="button" onClick={closeModal} className="text-slate-500 hover:text-white">
                     <X size={20} />
                   </button>
                </div>
                
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Description</label>
                  <input 
                    type="text" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-qg-accent/50 outline-none focus:ring-1 focus:ring-qg-accent/50 transition-all"
                    placeholder="e.g. Server Costs"
                  />
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-slate-400 mb-1 block">Amount</label>
                    <div className="flex">
                      <select 
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="bg-black/20 border border-white/10 border-r-0 rounded-l-xl p-3 text-white outline-none text-sm w-20 focus:border-qg-accent/50 focus:ring-1 focus:ring-qg-accent/50 transition-all"
                      >
                        <option value="SAR">SAR</option>
                        <option value="USD">USD</option>
                        <option value="BDT">BDT</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                      <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        className="w-full bg-black/20 border border-white/10 rounded-r-xl p-3 text-white focus:border-qg-accent/50 outline-none focus:ring-1 focus:ring-qg-accent/50 transition-all"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                     <label className="text-xs text-slate-400 mb-1 block">Type</label>
                     <select 
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-qg-accent/50 focus:ring-1 focus:ring-qg-accent/50 transition-all"
                     >
                       <option value="expense">Expense</option>
                       <option value="income">Income</option>
                     </select>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Date</label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-qg-accent/50 outline-none focus:ring-1 focus:ring-qg-accent/50 transition-all"
                  />
                </div>
                
                <div className="relative">
                  <label className="text-xs text-slate-400 mb-1 block">Category</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="flex-1 bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-qg-accent/50 outline-none focus:ring-1 focus:ring-qg-accent/50 transition-all"
                    />
                    <button 
                      type="button" 
                      onClick={handleAIAnalysis}
                      disabled={isAnalyzing || !description}
                      className="p-3 bg-qg-pink/20 text-qg-pink border border-qg-pink/30 rounded-xl hover:bg-qg-pink/30 disabled:opacity-50 transition-colors"
                      title="Auto-Categorize with Yusra"
                    >
                      {isAnalyzing ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Sparkles size={20} />}
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={closeModal}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-qg-accent text-qg-dark font-bold rounded-xl hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(0,255,163,0.2)] flex items-center justify-center gap-2"
                  >
                    Next <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
