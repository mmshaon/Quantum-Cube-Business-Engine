
import React, { useState } from 'react';
import { Users, Plus, Search, MoreVertical, Shield, UserCheck, Ban, FileText, Lock, Check, X, ChevronDown, ChevronUp, Key, Edit2, Save, RefreshCcw, Calendar, Filter, Trash2, Sparkles } from 'lucide-react';
import { UserRole, AccessLog, YusraConfig, CustomRole } from '../types';
import { clsx } from 'clsx';
import { AVAILABLE_YUSRA_COMMANDS } from '../constants';

// --- Mock Data ---

const INITIAL_USERS = [
  { id: 'u1', name: 'Admin User', email: 'admin@quantum.glass', role: UserRole.ADMIN, status: 'Active', lastActive: '2 mins ago' },
  { id: 'u2', name: 'Finance Manager', email: 'finance@quantum.glass', role: UserRole.MANAGER, status: 'Active', lastActive: '1 hour ago' },
  { id: 'u3', name: 'Analyst One', email: 'analyst@quantum.glass', role: UserRole.VIEWER, status: 'Suspended', lastActive: '3 days ago', suspensionReason: 'Suspicious Activity', suspensionDuration: 'Indefinite' },
  { id: 'u4', name: 'Project Manager', email: 'project.manager@example.com', role: UserRole.MANAGER, status: 'Active', lastActive: 'Just now' },
];

const INITIAL_LOGS: AccessLog[] = [
  { id: 'log1', userId: 'u1', userName: 'Admin User', action: 'Login', resource: 'Auth System', status: 'Success', timestamp: Date.now() - 120000, ip: '192.168.1.1' },
  { id: 'log2', userId: 'u2', userName: 'Finance Manager', action: 'Create Transaction', resource: 'Ledger', status: 'Success', timestamp: Date.now() - 3600000, ip: '192.168.1.45' },
  { id: 'log3', userId: 'u3', userName: 'Analyst One', action: 'Export Data', resource: 'Reports', status: 'Failed', timestamp: Date.now() - 259200000, ip: '10.0.0.5' },
  { id: 'log4', userId: 'u1', userName: 'Admin User', action: 'Update Settings', resource: 'System Config', status: 'Success', timestamp: Date.now() - 500000, ip: '192.168.1.1' },
  { id: 'log5', userId: 'u3', userName: 'Analyst One', action: 'Access Admin Panel', resource: 'Admin Control', status: 'Denied', timestamp: Date.now() - 260000000, ip: '10.0.0.5' },
  { id: 'log6', userId: 'u2', userName: 'Finance Manager', action: 'Approve Budget', resource: 'Budgets', status: 'Success', timestamp: Date.now() - 7200000, ip: '192.168.1.45' },
  { id: 'log7', userId: 'u1', userName: 'Admin User', action: 'Role Change', resource: 'User Management', status: 'Success', timestamp: Date.now() - 8000000, ip: '192.168.1.1' },
];

const PERMISSIONS_SCHEMA = [
  { id: 'p1', category: 'Financials', actions: ['Read', 'Write', 'Approve'] },
  { id: 'p2', category: 'Design Assets', actions: ['Read', 'Write', 'Upload', 'Delete'] },
  { id: 'p3', category: 'User Management', actions: ['Read', 'Invite', 'Ban'] },
  { id: 'p4', category: 'System Config', actions: ['Read', 'Edit'] },
  { id: 'p5', category: 'HR Management', actions: ['Hire', 'Terminate', 'Review'] },
  { id: 'p6', category: 'IT Admin', actions: ['System Config', 'Security'] },
  { id: 'p7', category: 'Sales', actions: ['Leads', 'Deals', 'Forecast'] },
];

interface UserManagementProps {
  yusraRoleConfigs?: Record<UserRole, YusraConfig>;
  setYusraRoleConfigs?: React.Dispatch<React.SetStateAction<Record<UserRole, YusraConfig>>>;
}

export const UserManagement: React.FC<UserManagementProps> = ({ yusraRoleConfigs, setYusraRoleConfigs }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'logs'>('users');
  const [users, setUsers] = useState(INITIAL_USERS);
  const [logs] = useState<AccessLog[]>(INITIAL_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  
  // User Management State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [detailsUser, setDetailsUser] = useState<typeof INITIAL_USERS[0] | null>(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: UserRole.VIEWER });

  // Logs Filter State
  const [logFilterUser, setLogFilterUser] = useState<string>('All'); 
  const [logFilterStatus, setLogFilterStatus] = useState<string>('All');
  const [logFilterAction, setLogFilterAction] = useState<string>('All');
  const [logStartDate, setLogStartDate] = useState<string>('');
  const [logEndDate, setLogEndDate] = useState<string>('');

  // Roles State
  const [expandedRole, setExpandedRole] = useState<string>('Designer'); 
  const [createdCustomRoles, setCreatedCustomRoles] = useState<CustomRole[]>([]);
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
  const [newCustomRole, setNewCustomRole] = useState<{ name: string, description: string, allowedYusraCommands: string[], permissions: Record<string, string[]> }>({ 
    name: '', 
    description: '', 
    allowedYusraCommands: [],
    permissions: {}
  });
  
  const [customDesignerPermissions, setCustomDesignerPermissions] = useState<Record<string, string[]>>({
    'Design Assets': ['Read', 'Write', 'Delete'] // Updated default permissions to include Delete
  });

  // Role Editing State (System Prompt & Commands)
  const [editingRolePrompt, setEditingRolePrompt] = useState<UserRole | null>(null);
  const [tempSystemPrompt, setTempSystemPrompt] = useState('');
  const [editingRoleCommands, setEditingRoleCommands] = useState<UserRole | null>(null);
  const [tempAllowedCommands, setTempAllowedCommands] = useState<string[]>([]);

  // --- Handlers ---

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const user = {
      id: `u-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'Active',
      lastActive: 'Never'
    };
    setUsers([...users, user]);
    setIsAddUserOpen(false);
    setNewUser({ name: '', email: '', role: UserRole.VIEWER });
  };

  const toggleDesignerPermission = (category: string, action: string) => {
    setCustomDesignerPermissions(prev => {
      const current = prev[category] || [];
      const updated = current.includes(action) 
        ? current.filter(a => a !== action)
        : [...current, action];
      return { ...prev, [category]: updated };
    });
  };
  
  const toggleCustomRolePermission = (roleId: string, category: string, action: string) => {
      setCreatedCustomRoles(prev => prev.map(role => {
          if (role.id === roleId) {
              const currentPerms = role.permissions[category] || [];
              const updatedPerms = currentPerms.includes(action)
                 ? currentPerms.filter(a => a !== action)
                 : [...currentPerms, action];
              return { 
                  ...role, 
                  permissions: { ...role.permissions, [category]: updatedPerms }
              };
          }
          return role;
      }));
  };

  const toggleNewCustomRolePermission = (category: string, action: string) => {
    setNewCustomRole(prev => {
      const currentPerms = prev.permissions[category] || [];
      const updatedPerms = currentPerms.includes(action)
        ? currentPerms.filter(a => a !== action)
        : [...currentPerms, action];
      return { ...prev, permissions: { ...prev.permissions, [category]: updatedPerms } };
    });
  };

  const toggleCustomRoleYusraCommand = (roleId: string, commandId: string) => {
    setCreatedCustomRoles(prev => prev.map(role => {
        if (role.id === roleId) {
            const currentCmds = role.allowedYusraCommands || [];
            const updatedCmds = currentCmds.includes(commandId)
               ? currentCmds.filter(c => c !== commandId)
               : [...currentCmds, commandId];
            return { 
                ...role, 
                allowedYusraCommands: updatedCmds
            };
        }
        return role;
    }));
  };

  const toggleNewCustomRoleCommand = (commandId: string) => {
    setNewCustomRole(prev => {
      const currentCmds = prev.allowedYusraCommands;
      const updatedCmds = currentCmds.includes(commandId)
        ? currentCmds.filter(c => c !== commandId)
        : [...currentCmds, commandId];
      return { ...prev, allowedYusraCommands: updatedCmds };
    });
  };

  const handleCreateCustomRole = (e: React.FormEvent) => {
      e.preventDefault();
      const newRole: CustomRole = {
          id: `role-${Date.now()}`,
          name: newCustomRole.name,
          description: newCustomRole.description,
          permissions: newCustomRole.permissions,
          allowedYusraCommands: newCustomRole.allowedYusraCommands
      };
      setCreatedCustomRoles([...createdCustomRoles, newRole]);
      setIsCreateRoleOpen(false);
      setNewCustomRole({ name: '', description: '', allowedYusraCommands: [], permissions: {} });
      setExpandedRole(newRole.id);
  };

  const handleDeleteCustomRole = (id: string) => {
      setCreatedCustomRoles(prev => prev.filter(r => r.id !== id));
      if (expandedRole === id) setExpandedRole('Designer');
  };

  const handleRowClick = (user: typeof INITIAL_USERS[0]) => {
    setDetailsUser(user);
  };

  // Role Editing Handlers
  const startEditPrompt = (role: UserRole) => {
    if (yusraRoleConfigs) {
      setTempSystemPrompt(yusraRoleConfigs[role].systemPromptAddition);
      setEditingRolePrompt(role);
    }
  };

  const savePrompt = () => {
    if (yusraRoleConfigs && setYusraRoleConfigs && editingRolePrompt) {
      setYusraRoleConfigs(prev => ({
        ...prev,
        [editingRolePrompt]: {
          ...prev[editingRolePrompt],
          systemPromptAddition: tempSystemPrompt
        }
      }));
      setEditingRolePrompt(null);
    }
  };

  const startEditCommands = (role: UserRole) => {
    if (yusraRoleConfigs) {
      setTempAllowedCommands(yusraRoleConfigs[role].allowedCommands);
      setEditingRoleCommands(role);
    }
  };

  const toggleCommand = (cmdId: string) => {
    setTempAllowedCommands(prev => 
      prev.includes(cmdId) ? prev.filter(id => id !== cmdId) : [...prev, cmdId]
    );
  };

  const saveCommands = () => {
    if (yusraRoleConfigs && setYusraRoleConfigs && editingRoleCommands) {
      setYusraRoleConfigs(prev => ({
        ...prev,
        [editingRoleCommands]: {
          ...prev[editingRoleCommands],
          allowedCommands: tempAllowedCommands
        }
      }));
      setEditingRoleCommands(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLogs = logs.filter(log => {
    const matchUser = logFilterUser === 'All' || log.userName === logFilterUser;
    const matchStatus = logFilterStatus === 'All' || log.status === logFilterStatus;
    const matchAction = logFilterAction === 'All' || log.action === logFilterAction;
    
    let matchDate = true;
    const logTime = new Date(log.timestamp).setHours(0,0,0,0);
    if (logStartDate) {
        matchDate = matchDate && logTime >= new Date(logStartDate).setHours(0,0,0,0);
    }
    if (logEndDate) {
        matchDate = matchDate && logTime <= new Date(logEndDate).setHours(0,0,0,0);
    }

    return matchUser && matchStatus && matchAction && matchDate;
  });

  const uniqueActions = Array.from(new Set(logs.map(l => l.action)));

  const userLogs = detailsUser ? logs.filter(l => l.userId === detailsUser.id) : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-slate-400 text-sm">Identity, Access & Security</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'users' && (
            <button 
              onClick={() => setIsAddUserOpen(true)}
              className="bg-qg-accent text-qg-dark px-4 py-2 rounded-xl font-semibold hover:bg-emerald-400 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,163,0.3)]"
            >
              <Plus size={18} /> Invite User
            </button>
          )}
          {activeTab === 'roles' && (
            <button 
              onClick={() => setIsCreateRoleOpen(true)}
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2"
            >
              <Plus size={18} /> Create Role
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10 pb-1">
        <button onClick={() => setActiveTab('users')} className={clsx("px-4 py-2 text-sm font-medium transition-colors border-b-2", activeTab === 'users' ? "text-qg-accent border-qg-accent" : "text-slate-400 border-transparent hover:text-white")}>
          Users
        </button>
        <button onClick={() => setActiveTab('roles')} className={clsx("px-4 py-2 text-sm font-medium transition-colors border-b-2", activeTab === 'roles' ? "text-qg-accent border-qg-accent" : "text-slate-400 border-transparent hover:text-white")}>
          Roles & Permissions
        </button>
        <button onClick={() => setActiveTab('logs')} className={clsx("px-4 py-2 text-sm font-medium transition-colors border-b-2", activeTab === 'logs' ? "text-qg-accent border-qg-accent" : "text-slate-400 border-transparent hover:text-white")}>
          Audit Logs
        </button>
      </div>

      {/* === USERS TAB === */}
      {activeTab === 'users' && (
        <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:border-qg-accent/50 outline-none"
              />
            </div>
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Last Active</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map(user => (
                  <tr 
                    key={user.id} 
                    onClick={() => handleRowClick(user)}
                    className="hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-200">{user.name}</div>
                            <div className="text-xs text-slate-500">{user.email}</div>
                          </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20">
                          <Shield size={12} /> {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={clsx(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs",
                        user.status === 'Active' ? "bg-green-500/10 text-green-400" : 
                        user.status === 'Suspended' ? "bg-red-500/10 text-red-400" : "bg-slate-500/10 text-slate-400"
                      )}>
                          <div className={clsx("w-1.5 h-1.5 rounded-full", user.status === 'Active' ? "bg-green-400" : "bg-red-400")}></div>
                          {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-sm">{user.lastActive}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                            onClick={(e) => { e.stopPropagation(); setDetailsUser(user); }}
                            className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-qg-accent transition-colors" 
                            title="View Details"
                         >
                            <UserCheck size={16} />
                         </button>
                         <button className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-red-400 transition-colors" title="Block User">
                            <Ban size={16} />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* === ROLES TAB === */}
      {activeTab === 'roles' && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Role List */}
              <div className="glass-panel p-4 rounded-2xl space-y-2">
                 <h3 className="text-white font-semibold mb-4 px-2">System Roles</h3>
                 {Object.values(UserRole).map(role => (
                    <div 
                      key={role}
                      className={clsx("p-3 rounded-xl border cursor-pointer transition-all", expandedRole === role ? "bg-qg-accent/10 border-qg-accent" : "bg-white/5 border-transparent hover:bg-white/10")}
                      onClick={() => setExpandedRole(role)}
                    >
                      <div className="flex justify-between items-center">
                          <span className="text-white font-medium">{role}</span>
                      </div>
                    </div>
                 ))}
                 
                 <h3 className="text-white font-semibold mt-6 mb-4 px-2 flex items-center justify-between">
                     <span>Custom Roles</span>
                     <span className="text-xs text-slate-500">{1 + createdCustomRoles.length} defined</span>
                 </h3>
                 
                 <div 
                   className={clsx("p-3 rounded-xl border cursor-pointer transition-all", expandedRole === 'Designer' ? "bg-qg-accent/10 border-qg-accent" : "bg-white/5 border-transparent hover:bg-white/10")}
                   onClick={() => setExpandedRole('Designer')}
                 >
                    <div className="flex justify-between items-center">
                       <span className="text-white font-medium">Designer</span>
                       <span className="text-xs text-slate-500 bg-black/30 px-2 py-0.5 rounded">Default</span>
                    </div>
                 </div>

                 {createdCustomRoles.map(customRole => (
                     <div 
                        key={customRole.id}
                        className={clsx("p-3 rounded-xl border cursor-pointer transition-all", expandedRole === customRole.id ? "bg-qg-accent/10 border-qg-accent" : "bg-white/5 border-transparent hover:bg-white/10")}
                        onClick={() => setExpandedRole(customRole.id)}
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-white font-medium">{customRole.name}</span>
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleDeleteCustomRole(customRole.id); }}
                                className="text-slate-500 hover:text-red-400 p-1"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                 ))}
                 
                 <button 
                    onClick={() => setIsCreateRoleOpen(true)}
                    className="w-full mt-2 py-2 border border-dashed border-white/20 text-slate-400 hover:text-white hover:border-qg-accent/50 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors"
                 >
                    <Plus size={14} /> Create New Role
                 </button>
              </div>

              {/* Permission Matrix / Editor */}
              <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
                 {expandedRole === 'Designer' ? (
                   <>
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2"><Key size={18} className="text-qg-accent"/> Permissions for 'Designer'</h3>
                        <div className="flex gap-2">
                            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded border border-blue-500/30">Custom Role</span>
                        </div>
                     </div>
                     <p className="text-slate-400 text-sm mb-6">Standard Designer role with access to design assets and visual tools.</p>
                     <div className="space-y-6">
                        {PERMISSIONS_SCHEMA.map(category => (
                          <div key={category.id} className="border border-white/10 rounded-xl overflow-hidden">
                             <div className="bg-black/20 p-3 border-b border-white/10">
                                <h4 className="text-sm font-semibold text-slate-200">{category.category}</h4>
                             </div>
                             <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {category.actions.map(action => {
                                   const isChecked = customDesignerPermissions[category.category]?.includes(action);
                                   return (
                                      <label key={action} className="flex items-center gap-2 cursor-pointer group">
                                         <div 
                                           className={clsx(
                                             "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                             isChecked ? "bg-qg-accent border-qg-accent" : "border-slate-600 group-hover:border-slate-400"
                                           )}
                                           onClick={() => toggleDesignerPermission(category.category, action)}
                                         >
                                            {isChecked && <Check size={12} className="text-black" />}
                                         </div>
                                         <span className={clsx("text-sm", isChecked ? "text-white" : "text-slate-400")}>{action}</span>
                                      </label>
                                   );
                                })}
                             </div>
                          </div>
                        ))}
                     </div>
                   </>
                 ) : createdCustomRoles.find(r => r.id === expandedRole) ? (
                    // Logic for New Custom Roles
                    (() => {
                        const customRole = createdCustomRoles.find(r => r.id === expandedRole)!;
                        return (
                            <>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2"><Key size={18} className="text-qg-accent"/> Permissions for '{customRole.name}'</h3>
                                    <div className="flex gap-2">
                                        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded border border-purple-500/30">User Defined</span>
                                    </div>
                                </div>
                                <p className="text-slate-400 text-sm mb-6">{customRole.description || "No description provided."}</p>
                                
                                {/* Standard Permissions */}
                                <div className="space-y-6 mb-8">
                                    {PERMISSIONS_SCHEMA.map(category => (
                                    <div key={category.id} className="border border-white/10 rounded-xl overflow-hidden">
                                        <div className="bg-black/20 p-3 border-b border-white/10">
                                            <h4 className="text-sm font-semibold text-slate-200">{category.category}</h4>
                                        </div>
                                        <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {category.actions.map(action => {
                                                const isChecked = customRole.permissions[category.category]?.includes(action);
                                                return (
                                                    <label key={action} className="flex items-center gap-2 cursor-pointer group">
                                                        <div 
                                                        className={clsx(
                                                            "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                                            isChecked ? "bg-qg-accent border-qg-accent" : "border-slate-600 group-hover:border-slate-400"
                                                        )}
                                                        onClick={() => toggleCustomRolePermission(customRole.id, category.category, action)}
                                                        >
                                                            {isChecked && <Check size={12} className="text-black" />}
                                                        </div>
                                                        <span className={clsx("text-sm", isChecked ? "text-white" : "text-slate-400")}>{action}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    ))}
                                </div>

                                {/* Yusra Command Permissions */}
                                <div className="border border-white/10 rounded-xl overflow-hidden">
                                  <div className="bg-black/20 p-3 border-b border-white/10 flex items-center gap-2">
                                    <Sparkles size={16} className="text-qg-accent" />
                                    <h4 className="text-sm font-semibold text-slate-200">Allowed Yusra AI Commands</h4>
                                  </div>
                                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {AVAILABLE_YUSRA_COMMANDS.map(command => {
                                      const isAllowed = customRole.allowedYusraCommands?.includes(command.id);
                                      return (
                                        <label key={command.id} className="flex items-center gap-3 cursor-pointer bg-white/5 p-2 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                                          <div 
                                            className={clsx(
                                              "w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0",
                                              isAllowed ? "bg-qg-accent border-qg-accent" : "border-slate-600"
                                            )}
                                            onClick={() => toggleCustomRoleYusraCommand(customRole.id, command.id)}
                                          >
                                            {isAllowed && <Check size={12} className="text-black" />}
                                          </div>
                                          <div>
                                            <span className={clsx("text-sm font-medium block", isAllowed ? "text-white" : "text-slate-400")}>{command.label}</span>
                                            <span className="text-xs text-slate-500">{command.description}</span>
                                          </div>
                                        </label>
                                      );
                                    })}
                                  </div>
                                </div>
                            </>
                        );
                    })()
                 ) : (
                   /* Standard System Role Editor (System Prompt & Commands) */
                   <>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Shield size={18} className="text-qg-accent"/> Settings for '{expandedRole}'
                      </h3>
                      <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-600">System Role</span>
                    </div>
                    
                    {yusraRoleConfigs && yusraRoleConfigs[expandedRole as UserRole] ? (
                      <div className="space-y-6">
                        {/* System Prompt Editor */}
                        <div className="border border-white/10 rounded-xl p-4 bg-white/5">
                          <div className="flex justify-between items-center mb-4">
                             <h4 className="font-semibold text-white flex items-center gap-2"><FileText size={16} /> System Prompt Persona</h4>
                             {editingRolePrompt !== expandedRole ? (
                               <button onClick={() => startEditPrompt(expandedRole as UserRole)} className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors"><Edit2 size={16}/></button>
                             ) : (
                               <div className="flex gap-2">
                                 <button onClick={() => setEditingRolePrompt(null)} className="p-1.5 hover:bg-red-500/10 rounded text-red-400 transition-colors"><X size={16}/></button>
                                 <button onClick={savePrompt} className="p-1.5 hover:bg-green-500/10 rounded text-green-400 transition-colors"><Save size={16}/></button>
                               </div>
                             )}
                          </div>
                          {editingRolePrompt === expandedRole ? (
                            <textarea 
                              value={tempSystemPrompt}
                              onChange={(e) => setTempSystemPrompt(e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-qg-accent/50 outline-none min-h-[120px]"
                            />
                          ) : (
                            <p className="text-sm text-slate-300 italic">"{yusraRoleConfigs[expandedRole as UserRole].systemPromptAddition}"</p>
                          )}
                        </div>

                        {/* Allowed Commands Editor */}
                        <div className="border border-white/10 rounded-xl p-4 bg-white/5">
                          <div className="flex justify-between items-center mb-4">
                             <h4 className="font-semibold text-white flex items-center gap-2"><Lock size={16} /> Allowed Commands</h4>
                             {editingRoleCommands !== expandedRole ? (
                               <button onClick={() => startEditCommands(expandedRole as UserRole)} className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors"><Edit2 size={16}/></button>
                             ) : (
                               <div className="flex gap-2">
                                 <button onClick={() => setEditingRoleCommands(null)} className="p-1.5 hover:bg-red-500/10 rounded text-red-400 transition-colors"><X size={16}/></button>
                                 <button onClick={saveCommands} className="p-1.5 hover:bg-green-500/10 rounded text-green-400 transition-colors"><Save size={16}/></button>
                               </div>
                             )}
                          </div>
                          
                          {editingRoleCommands === expandedRole ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {AVAILABLE_YUSRA_COMMANDS.map(cmd => (
                                <label key={cmd.id} className="flex items-center gap-2 cursor-pointer bg-black/20 p-2 rounded-lg border border-white/5">
                                   <input 
                                     type="checkbox" 
                                     checked={tempAllowedCommands.includes(cmd.id)}
                                     onChange={() => toggleCommand(cmd.id)}
                                     className="rounded border-slate-600 text-qg-accent focus:ring-qg-accent bg-black/40"
                                   />
                                   <span className="text-sm text-slate-200">{cmd.label}</span>
                                </label>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {yusraRoleConfigs[expandedRole as UserRole].allowedCommands.length > 0 ? (
                                yusraRoleConfigs[expandedRole as UserRole].allowedCommands.map(cmdId => {
                                  const cmd = AVAILABLE_YUSRA_COMMANDS.find(c => c.id === cmdId);
                                  return (
                                    <span key={cmdId} className="px-2 py-1 bg-blue-500/10 text-blue-300 text-xs rounded border border-blue-500/20">
                                      {cmd?.label || cmdId}
                                    </span>
                                  );
                                })
                              ) : (
                                <span className="text-slate-500 text-sm">No allowed commands.</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-500">Configuration not available for this role.</p>
                    )}
                   </>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* === LOGS TAB === */}
      {activeTab === 'logs' && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
           {/* Filters */}
           <div className="flex flex-col lg:flex-row gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">User</label>
                    <select 
                        value={logFilterUser}
                        onChange={(e) => setLogFilterUser(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm outline-none focus:border-qg-accent"
                    >
                        <option value="All">All Users</option>
                        {INITIAL_USERS.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Status</label>
                    <select 
                        value={logFilterStatus}
                        onChange={(e) => setLogFilterStatus(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm outline-none focus:border-qg-accent"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Success">Success</option>
                        <option value="Failed">Failed</option>
                        <option value="Denied">Denied</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Action</label>
                    <select 
                        value={logFilterAction}
                        onChange={(e) => setLogFilterAction(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm outline-none focus:border-qg-accent"
                    >
                        <option value="All">All Actions</option>
                        {uniqueActions.map(act => <option key={act} value={act}>{act}</option>)}
                    </select>
                  </div>
                  <div>
                     <label className="text-xs text-slate-500 mb-1 block">Date Range</label>
                     <div className="flex gap-1">
                        <input 
                            type="date" 
                            value={logStartDate}
                            onChange={(e) => setLogStartDate(e.target.value)}
                            className="w-1/2 bg-black/20 border border-white/10 rounded-lg p-1 text-white text-xs outline-none focus:border-qg-accent"
                        />
                        <input 
                            type="date" 
                            value={logEndDate}
                            onChange={(e) => setLogEndDate(e.target.value)}
                            className="w-1/2 bg-black/20 border border-white/10 rounded-lg p-1 text-white text-xs outline-none focus:border-qg-accent"
                        />
                     </div>
                  </div>
              </div>
              <div className="flex items-end">
                 <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors h-10 flex items-center gap-2">
                    Export CSV
                 </button>
              </div>
           </div>

           <div className="glass-panel rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                 <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                    <tr>
                       <th className="p-4">Timestamp</th>
                       <th className="p-4">User</th>
                       <th className="p-4">Action</th>
                       <th className="p-4">Resource</th>
                       <th className="p-4">Status</th>
                       <th className="p-4 text-right">IP Address</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {filteredLogs.length > 0 ? filteredLogs.map(log => (
                       <tr key={log.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 text-slate-500 text-xs font-mono">{new Date(log.timestamp).toLocaleString()}</td>
                          <td className="p-4 text-slate-200 font-medium">{log.userName}</td>
                          <td className="p-4 text-slate-300">{log.action}</td>
                          <td className="p-4 text-slate-400 text-sm">{log.resource}</td>
                          <td className="p-4">
                             <span className={clsx(
                                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] uppercase font-bold",
                                log.status === 'Success' ? "bg-green-500/10 text-green-400" : 
                                log.status === 'Failed' ? "bg-yellow-500/10 text-yellow-400" : "bg-red-500/10 text-red-400"
                             )}>
                                {log.status === 'Success' ? <Check size={10} /> : <X size={10} />}
                                {log.status}
                             </span>
                          </td>
                          <td className="p-4 text-right text-slate-500 text-xs font-mono">{log.ip}</td>
                       </tr>
                    )) : (
                       <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-500">No logs found matching filter criteria.</td>
                       </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="glass-panel w-full max-w-md rounded-2xl p-6 animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-white">Invite New User</h3>
                 <button onClick={() => setIsAddUserOpen(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
              </div>
              <form onSubmit={handleAddUser} className="space-y-4">
                 <div>
                    <label className="text-xs text-slate-400 mb-1 block">Full Name</label>
                    <input 
                      type="text" 
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-qg-accent/50 outline-none"
                      required
                    />
                 </div>
                 <div>
                    <label className="text-xs text-slate-400 mb-1 block">Email Address</label>
                    <input 
                      type="email" 
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-qg-accent/50 outline-none"
                      required
                    />
                 </div>
                 <div>
                    <label className="text-xs text-slate-400 mb-1 block">Assign Role</label>
                    <select 
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-qg-accent/50 outline-none"
                    >
                       {Object.values(UserRole).map(role => (
                          <option key={role} value={role}>{role}</option>
                       ))}
                    </select>
                 </div>
                 <div className="pt-2">
                    <button type="submit" className="w-full py-3 bg-qg-accent text-qg-dark font-bold rounded-xl hover:bg-emerald-400 transition-colors">
                       Send Invitation
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Create Role Modal */}
      {isCreateRoleOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-panel w-full max-w-3xl rounded-2xl p-6 animate-in zoom-in-95 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <h3 className="text-xl font-bold text-white">Create Custom Role</h3>
                    <button onClick={() => setIsCreateRoleOpen(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                </div>
                <form onSubmit={handleCreateCustomRole} className="flex-1 overflow-y-auto pr-2">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Role Name</label>
                            <input 
                                type="text" 
                                value={newCustomRole.name}
                                onChange={(e) => setNewCustomRole({...newCustomRole, name: e.target.value})}
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-qg-accent/50 outline-none"
                                placeholder="e.g. Senior Auditor"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Description</label>
                            <input 
                                type="text"
                                value={newCustomRole.description}
                                onChange={(e) => setNewCustomRole({...newCustomRole, description: e.target.value})}
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-qg-accent/50 outline-none"
                                placeholder="Brief description..."
                                required
                            />
                        </div>
                      </div>

                      {/* Permission Matrix */}
                      <div className="border border-white/10 rounded-xl overflow-hidden mt-2">
                         <div className="bg-black/20 p-3 border-b border-white/10 flex items-center gap-2">
                            <Key size={16} className="text-qg-accent" />
                            <h4 className="text-sm font-semibold text-slate-200">Assign System Permissions</h4>
                         </div>
                         <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto">
                            {PERMISSIONS_SCHEMA.map(category => (
                              <div key={category.id} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                                 <h5 className="text-xs font-bold text-slate-400 uppercase mb-2">{category.category}</h5>
                                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {category.actions.map(action => {
                                       const isChecked = newCustomRole.permissions[category.category]?.includes(action);
                                       return (
                                          <label key={action} className="flex items-center gap-2 cursor-pointer group">
                                             <div 
                                               className={clsx(
                                                 "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                                 isChecked ? "bg-qg-accent border-qg-accent" : "border-slate-600 group-hover:border-slate-400"
                                               )}
                                               onClick={() => toggleNewCustomRolePermission(category.category, action)}
                                             >
                                                {isChecked && <Check size={10} className="text-black" />}
                                             </div>
                                             <span className={clsx("text-xs", isChecked ? "text-white" : "text-slate-400")}>{action}</span>
                                          </label>
                                       );
                                    })}
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>
                      
                      {/* Yusra Command Access in Create Modal */}
                      <div className="border border-white/10 rounded-xl overflow-hidden mt-4">
                        <div className="bg-black/20 p-3 border-b border-white/10 flex items-center gap-2">
                           <Sparkles size={16} className="text-qg-accent" />
                           <h4 className="text-sm font-semibold text-slate-200">Allowed Yusra AI Commands</h4>
                        </div>
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[200px] overflow-y-auto">
                           {AVAILABLE_YUSRA_COMMANDS.map(cmd => {
                              const isSelected = newCustomRole.allowedYusraCommands.includes(cmd.id);
                              return (
                                 <label key={cmd.id} className="flex items-center gap-3 cursor-pointer bg-white/5 p-2 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                                    <div 
                                       className={clsx(
                                          "w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0",
                                          isSelected ? "bg-qg-accent border-qg-accent" : "border-slate-600"
                                       )}
                                       onClick={() => toggleNewCustomRoleCommand(cmd.id)}
                                    >
                                       {isSelected && <Check size={12} className="text-black" />}
                                    </div>
                                    <span className={clsx("text-sm", isSelected ? "text-white" : "text-slate-400")}>{cmd.label}</span>
                                 </label>
                              );
                           })}
                        </div>
                      </div>
                    </div>
                    <div className="pt-6 mt-2">
                        <button type="submit" className="w-full py-3 bg-qg-accent text-qg-dark font-bold rounded-xl hover:bg-emerald-400 transition-colors">
                            Create Role & Define System Permissions
                        </button>
                    </div>
                </form>
            </div>
          </div>
      )}

      {/* User Details Modal */}
      {detailsUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="glass-panel w-full max-w-3xl rounded-2xl p-0 animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="relative h-32 bg-gradient-to-r from-blue-600 to-purple-600 shrink-0">
                 <button onClick={() => setDetailsUser(null)} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"><X size={18}/></button>
                 <div className="absolute -bottom-10 left-8 w-20 h-20 rounded-full border-4 border-[#05050F] bg-slate-800 flex items-center justify-center text-2xl font-bold text-white">
                    {detailsUser.name.charAt(0)}
                 </div>
              </div>
              
              <div className="pt-12 px-8 pb-6 shrink-0">
                 <div className="flex justify-between items-start mb-4">
                    <div>
                       <h3 className="text-2xl font-bold text-white">{detailsUser.name}</h3>
                       <p className="text-slate-400">{detailsUser.email}</p>
                    </div>
                    <span className={clsx(
                      "px-3 py-1 rounded-full text-sm font-medium border",
                      detailsUser.status === 'Active' ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                    )}>
                       {detailsUser.status}
                    </span>
                 </div>

                 <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                       <p className="text-xs text-slate-500 uppercase mb-1">Role</p>
                       <p className="text-white font-medium flex items-center gap-2"><Shield size={14} className="text-qg-accent"/> {detailsUser.role}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                       <p className="text-xs text-slate-500 uppercase mb-1">Last Active</p>
                       <p className="text-white font-medium">{detailsUser.lastActive}</p>
                    </div>
                 </div>
              </div>

              {/* Access Logs in Modal */}
              <div className="px-8 pb-8 flex-1 overflow-hidden flex flex-col">
                 <h4 className="text-white font-semibold mb-3 flex items-center gap-2"><FileText size={16} className="text-qg-pink"/> Full Access History</h4>
                 <div className="bg-white/5 rounded-xl border border-white/10 flex-1 overflow-y-auto">
                   <table className="w-full text-left text-sm">
                     <thead className="bg-black/20 text-slate-400 sticky top-0">
                       <tr>
                         <th className="p-3 pl-4">Time</th>
                         <th className="p-3">Action</th>
                         <th className="p-3">Status</th>
                         <th className="p-3 text-right pr-4">IP</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                       {userLogs.length > 0 ? userLogs.map(log => (
                         <tr key={log.id} className="hover:bg-white/5">
                           <td className="p-3 pl-4 text-slate-500 text-xs font-mono">{new Date(log.timestamp).toLocaleString()}</td>
                           <td className="p-3 text-slate-200">{log.action} <span className="text-slate-500 text-xs">on {log.resource}</span></td>
                           <td className="p-3">
                             <span className={clsx(
                                "px-2 py-0.5 rounded text-[10px] uppercase font-bold",
                                log.status === 'Success' ? "bg-green-500/10 text-green-400" : 
                                log.status === 'Failed' ? "bg-yellow-500/10 text-yellow-400" : "bg-red-500/10 text-red-400"
                             )}>{log.status}</span>
                           </td>
                           <td className="p-3 pr-4 text-right text-slate-500 text-xs font-mono">{log.ip}</td>
                         </tr>
                       )) : (
                         <tr><td colSpan={4} className="p-4 text-center text-slate-500">No activity logs found.</td></tr>
                       )}
                     </tbody>
                   </table>
                 </div>
                 
                 <div className="mt-4 flex justify-end gap-3 shrink-0">
                    <button className="px-4 py-2 text-slate-300 hover:text-white text-sm transition-colors">Reset Password</button>
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors border border-white/10">Download Report</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
