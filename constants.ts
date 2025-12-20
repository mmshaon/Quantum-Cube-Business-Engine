
import { LayoutDashboard, Wallet, PieChart, Target, Layers, Settings, FileText, ShieldAlert, Image, Sparkles } from 'lucide-react';
import { UserRole, YusraConfig } from './types';

export const APP_NAME = "Quantum Glass";
export const APP_VERSION = "Alpha Gen 1.0";

export const CURRENCY_SYMBOL = "$"; // Or SAR as per PDF

export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: Wallet },
  { id: 'budgets', label: 'Budgets & Cashflow', icon: PieChart },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'ventures', label: 'Ventures', icon: Layers },
  { id: 'designs', label: 'Design Assets', icon: Image },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'yusra-control', label: 'Yusra Control Hub', icon: Sparkles }, // New Yusra Control Hub
  { id: 'admin', label: 'Control Room', icon: ShieldAlert },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const MOCK_TRANSACTIONS = [
  { id: '1', description: 'Cloud Infrastructure', amount: 1200.00, currency: 'USD', date: '2023-10-25', type: 'expense', category: 'Technology', status: 'approved' },
  { id: '2', description: 'Client Retainer - Alpha', amount: 5000.00, currency: 'USD', date: '2023-10-24', type: 'income', category: 'Sales', status: 'approved' },
  { id: '3', description: 'Office Supplies', amount: 150.50, currency: 'USD', date: '2023-10-23', type: 'expense', category: 'Operations', status: 'pending' },
  { id: '4', description: 'Q3 Bonus Payout', amount: 12000.00, currency: 'USD', date: '2023-10-20', type: 'expense', category: 'Payroll', status: 'approved' },
  { id: '5', description: 'Venture Capital Seed', amount: 50000.00, currency: 'USD', date: '2023-10-15', type: 'income', category: 'Investment', status: 'approved' },
] as const;

export const MOCK_VENTURES = [
  { id: 'v1', name: 'Project Neon', status: 'Active', roi: 12.5, budget: 100000, spent: 45000 },
  { id: 'v2', name: 'Cyber Logistics', status: 'Planning', roi: 0, budget: 50000, spent: 1200 },
  { id: 'v3', name: 'Quantum Retail', status: 'Active', roi: 8.2, budget: 75000, spent: 68000 },
] as const;

export const AVAILABLE_YUSRA_COMMANDS = [
  { id: 'create_transaction', label: 'Create Transaction', description: 'Adds a new entry to the financial ledger.' },
  { id: 'update_budget_limit', label: 'Update Budget Limit', description: 'Modifies the spending cap for a specific category.' },
  { id: 'approve_cash_request', label: 'Approve Cash Request', description: 'Authorizes pending financial requests.' },
  { id: 'generate_report', label: 'Generate Report', description: 'Compiles financial data into a downloadable format.' },
  { id: 'adjust_venture_progress', label: 'Adjust Venture Progress', description: 'Updates the completion percentage of strategic projects.' },
  { id: 'send_notification', label: 'Send Notification', description: 'Broadcasts system alerts to specific users.' },
  { id: 'retrieve_audit_logs', label: 'Retrieve Audit Logs', description: 'Accesses secure system event history.' },
  { id: 'manage_user_roles', label: 'Manage User Roles', description: 'Modifies user access levels and permissions.' },
  { id: 'run_analysis_report', label: 'Run Analysis Report', description: 'Executes deep-dive AI analysis on financial trends.' },
  { id: 'optimize_cashflow', label: 'Optimize Cashflow', description: 'Suggests reallocation of funds for better liquidity.' },
];

// Mock responses that trigger command suggestions in YusraChat
export const YUSRA_MOCK_COMMAND_RESPONSES = [
  {
    trigger: "I can create a transaction",
    commandId: "create_transaction",
    confirmation: "Would you like me to proceed with creating a new transaction for $100 USD?"
  },
  {
    trigger: "I can approve the cash request",
    commandId: "approve_cash_request",
    confirmation: "Shall I approve the pending cash request?"
  },
  {
    trigger: "I can generate a financial report",
    commandId: "generate_report",
    confirmation: "I can generate a financial report for you. Which type would you like?"
  },
  {
    trigger: "I can update the budget limit",
    commandId: "update_budget_limit",
    confirmation: "Should I update the budget limit for you?"
  },
  {
    trigger: "I can adjust venture progress",
    commandId: "adjust_venture_progress",
    confirmation: "I can adjust the progress for your venture. Which one would you like to update?"
  },
];

// Initial configuration for Yusra based on roles
export const YUSRA_DEFAULT_CONFIGS: Record<UserRole, YusraConfig> = {
  [UserRole.SUPER_ADMIN]: {
    id: 'config-sa',
    role: UserRole.SUPER_ADMIN,
    systemPromptAddition: "You have full administrative context and can advise on system-wide optimizations, security, and advanced configurations. You have override capabilities for suggestions.",
    canExecuteCommands: true,
    allowedCommands: AVAILABLE_YUSRA_COMMANDS.map(cmd => cmd.id), // All commands
  },
  [UserRole.ADMIN]: {
    id: 'config-a',
    role: UserRole.ADMIN,
    systemPromptAddition: "You have full administrative context and can advise on system-wide optimizations, security, and advanced configurations.",
    canExecuteCommands: true,
    allowedCommands: AVAILABLE_YUSRA_COMMANDS.filter(cmd => cmd.id !== 'manage_user_roles').map(cmd => cmd.id), // Most commands
  },
  [UserRole.MANAGER]: {
    id: 'config-m',
    role: UserRole.MANAGER,
    systemPromptAddition: "You are a strategic manager. Focus on team performance, project ROI, budget adherence, and high-level financial planning. Provide actionable recommendations for growth and efficiency.",
    canExecuteCommands: true,
    allowedCommands: ['create_transaction', 'update_budget_limit', 'approve_cash_request', 'generate_report', 'adjust_venture_progress', 'send_notification', 'run_analysis_report', 'optimize_cashflow'],
  },
  [UserRole.CONTRIBUTOR]: {
    id: 'config-c',
    role: UserRole.CONTRIBUTOR,
    systemPromptAddition: "You are an operational contributor. Assist with task management, data entry verification, and day-to-day transaction analysis. Provide precise, task-oriented guidance.",
    canExecuteCommands: true,
    allowedCommands: ['create_transaction', 'adjust_venture_progress', 'send_notification'],
  },
  [UserRole.DESIGNER]: {
    id: 'config-d',
    role: UserRole.DESIGNER,
    systemPromptAddition: "You are a creative design assistant. Focus on visual aesthetics, user experience (UX), brand consistency, and design system integrity. Provide feedback on asset organization and versioning.",
    canExecuteCommands: true,
    allowedCommands: ['send_notification', 'generate_report'],
  },
  [UserRole.VIEWER]: {
    id: 'config-v',
    role: UserRole.VIEWER,
    systemPromptAddition: "You are a viewer. Provide read-only insights, summaries, and explanations of current data and reports. Do not suggest actions or modifications.",
    canExecuteCommands: false,
    allowedCommands: [], // No commands
  },
};
