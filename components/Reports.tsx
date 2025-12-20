
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { FileText, Download, Filter, Calendar, FileSpreadsheet, Printer } from 'lucide-react';
import { APP_NAME } from '../constants';

export const Reports = () => {
  const { transactions, financials, budgets } = useData();
  const [reportType, setReportType] = useState<'income' | 'balance' | 'budget'>('income');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 print:space-y-0">
      {/* Header - Hidden on Print */}
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-white">Reports & Analytics</h2>
          <p className="text-slate-400 text-sm">Generate financial statements</p>
        </div>
        <div className="flex gap-2">
           <button onClick={handlePrint} className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl border border-white/10 transition-colors flex items-center gap-2">
             <Printer size={18} /> Print / PDF
           </button>
           <button className="bg-qg-accent text-qg-dark px-4 py-2 rounded-xl font-semibold hover:bg-emerald-400 transition-colors flex items-center gap-2">
             <Download size={18} /> Export CSV
           </button>
        </div>
      </div>

      {/* Controls - Hidden on Print */}
      <div className="flex gap-4 p-1 bg-white/5 rounded-xl border border-white/10 w-fit print:hidden">
         <button 
           onClick={() => setReportType('income')}
           className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${reportType === 'income' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
         >
           Income Statement
         </button>
         <button 
           onClick={() => setReportType('balance')}
           className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${reportType === 'balance' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
         >
           Balance Sheet
         </button>
         <button 
           onClick={() => setReportType('budget')}
           className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${reportType === 'budget' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
         >
           Budget Performance
         </button>
      </div>

      {/* Report Preview Area (Printable) */}
      <div className="glass-panel bg-white text-black p-10 rounded-xl min-h-[800px] shadow-2xl print:shadow-none print:rounded-none print:p-0 print:w-full print:h-auto print:bg-white print:text-black print:border-0 mx-auto max-w-[210mm]">
         {/* Report Header */}
         <div className="border-b-2 border-slate-800 pb-6 mb-8 flex justify-between items-end">
            <div>
               <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-wide mb-2">{APP_NAME}</h1>
               <p className="text-slate-500 text-sm">Financial Report: {reportType.replace('-', ' ').toUpperCase()}</p>
            </div>
            <div className="text-right text-sm text-slate-500">
               <p>Generated: {new Date().toLocaleDateString()}</p>
               <p>Time: {new Date().toLocaleTimeString()}</p>
               <p>User: Admin</p>
            </div>
         </div>

         {/* Report Content */}
         <div className="space-y-8">
            
            {/* Summary Section */}
            <div className="grid grid-cols-3 gap-4 mb-8">
               <div className="p-4 bg-slate-100 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase font-bold">Total Revenue</p>
                  <p className="text-xl font-mono font-bold text-slate-900">${financials.totalIncome.toLocaleString()}</p>
               </div>
               <div className="p-4 bg-slate-100 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase font-bold">Total Expenses</p>
                  <p className="text-xl font-mono font-bold text-red-600">${financials.totalExpense.toLocaleString()}</p>
               </div>
               <div className="p-4 bg-slate-100 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase font-bold">Net Income</p>
                  <p className={`text-xl font-mono font-bold ${financials.totalIncome - financials.totalExpense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${(financials.totalIncome - financials.totalExpense).toLocaleString()}
                  </p>
               </div>
            </div>

            {/* Detailed Table */}
            <h3 className="font-bold text-lg text-slate-800 border-b border-slate-300 pb-2 mb-4">Transaction Detail</h3>
            <table className="w-full text-left text-sm">
               <thead className="bg-slate-100 text-slate-600 border-b border-slate-300">
                  <tr>
                     <th className="p-3 font-bold">Date</th>
                     <th className="p-3 font-bold">Description</th>
                     <th className="p-3 font-bold">Category</th>
                     <th className="p-3 font-bold text-right">Amount</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-200">
                  {transactions.map(t => (
                     <tr key={t.id}>
                        <td className="p-3 text-slate-500">{t.date}</td>
                        <td className="p-3 text-slate-900">{t.description}</td>
                        <td className="p-3 text-slate-600"><span className="px-2 py-0.5 bg-slate-100 rounded text-xs border border-slate-200">{t.category}</span></td>
                        <td className={`p-3 text-right font-mono ${t.type === 'income' ? 'text-green-600' : 'text-slate-900'}`}>
                           {t.type === 'income' ? '+' : '-'}{t.currency} {t.amount.toLocaleString()}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>

            {/* Footer Note */}
            <div className="mt-12 pt-4 border-t border-slate-200 text-xs text-slate-400 text-center">
               <p>This document is electronically generated by {APP_NAME}. No signature required.</p>
               <p>Confidential • Internal Use Only</p>
            </div>
         </div>
      </div>
      
      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .glass-panel, .glass-panel * {
            visibility: visible;
          }
          .glass-panel {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20mm;
            box-shadow: none;
            background: white !important;
            color: black !important;
            border: none;
          }
          /* Hide scrollbars and backgrounds */
          .quantum-bg { display: none; }
        }
      `}</style>
    </div>
  );
};
