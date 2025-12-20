
import React, { useState } from 'react';
import { Sparkles, UploadCloud, FileText, Image, File as FileIcon, CheckCircle, XCircle, Settings, UserCheck, BarChart3, Brain, Lightbulb, TrendingUp, DollarSign, Clock, ChevronDown, ChevronUp, User, Eye, Search, Filter, RefreshCw, Mic, MicOff, AlertTriangle, Sliders, Save, X, CheckSquare, Square, Command, Copy, Download, Upload } from 'lucide-react';
import { TrainingDocument, TrainingDocumentType, UserRole, YusraConfig, YusraGlobalSettings } from '../types';
import { uploadTrainingData } from '../services/gemini';
import { AVAILABLE_YUSRA_COMMANDS } from '../constants';
import { clsx } from 'clsx';

const getFileIcon = (type: TrainingDocumentType) => {
  switch (type) {
    case TrainingDocumentType.DOCUMENT: return <FileText size={20} />;
    case TrainingDocumentType.TEXT: return <FileText size={20} />;
    case TrainingDocumentType.IMAGE: return <Image size={20} />;
    default: return <FileIcon size={20} />;
  }
};

const getFileTypeFromMime = (mimeType: string): TrainingDocumentType => {
  if (mimeType.includes('text/plain')) return TrainingDocumentType.TEXT;
  if (mimeType.includes('image/')) return TrainingDocumentType.IMAGE;
  if (mimeType.includes('application/pdf') || mimeType.includes('application/msword') || mimeType.includes('application/vnd.openxmlformats-officedocument')) return TrainingDocumentType.DOCUMENT;
  return TrainingDocumentType.OTHER;
};

interface YusraControlHubProps {
  yusraRoleConfigs: Record<UserRole, YusraConfig>;
  setYusraRoleConfigs: React.Dispatch<React.SetStateAction<Record<UserRole, YusraConfig>>>;
  trainingDocs: TrainingDocument[];
  setTrainingDocs: React.Dispatch<React.SetStateAction<TrainingDocument[]>>;
  currentUserRole: UserRole;
  yusraGlobalSettings: YusraGlobalSettings;
  setYusraGlobalSettings: React.Dispatch<React.SetStateAction<YusraGlobalSettings>>;
}

export const YusraControlHub: React.FC<YusraControlHubProps> = ({ yusraRoleConfigs, setYusraRoleConfigs, trainingDocs, setTrainingDocs, currentUserRole, yusraGlobalSettings, setYusraGlobalSettings }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [manualSelectedType, setManualSelectedType] = useState<TrainingDocumentType | null>(null);
  const [documentDescription, setDocumentDescription] = useState('');
  
  // Filter and Search State
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Role Editor State
  const [editingRoleCommands, setEditingRoleCommands] = useState<UserRole | null>(null);
  const [tempAllowedCommands, setTempAllowedCommands] = useState<string[]>([]);
  const [editingRolePrompt, setEditingRolePrompt] = useState<UserRole | null>(null);
  const [tempSystemPrompt, setTempSystemPrompt] = useState<string>('');
  
  // Role Specific Settings Editor State
  const [editingRoleSettings, setEditingRoleSettings] = useState<UserRole | null>(null);
  const [tempRoleSettings, setTempRoleSettings] = useState<Partial<YusraGlobalSettings>>({});

  const [settingsSaveMessage, setSettingsSaveMessage] = useState<string | null>(null);

  // General Settings State
  const [isGeneralSettingsOpen, setIsGeneralSettingsOpen] = useState(false);

  // Voice Input State
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  const showSaveMessage = (message: string) => {
    setSettingsSaveMessage(message);
    setTimeout(() => setSettingsSaveMessage(null), 3000);
  };

  // --- Handlers ---

  const handleVoiceAnnotate = () => {
    if (isVoiceListening) {
      setIsVoiceListening(false);
      return;
    }
    setIsVoiceListening(true);
    
    // Mock Voice Recognition Logic leveraging "Live Voice Mode" concept
    setTimeout(() => {
      const mockDescriptions = [
        "Financial Analysis Q3 2024 - Confidential",
        "Meeting Notes: Strategic Alignment",
        "Invoice #4421 - Vendor Payment",
        "Project Neon Blueprints"
      ];
      const randomDesc = mockDescriptions[Math.floor(Math.random() * mockDescriptions.length)];
      
      // Auto-detect type based on description keywords
      let detectedType = TrainingDocumentType.OTHER;
      const lowerDesc = randomDesc.toLowerCase();
      if (lowerDesc.includes('report') || lowerDesc.includes('invoice') || lowerDesc.includes('notes') || lowerDesc.includes('contract')) {
        detectedType = TrainingDocumentType.DOCUMENT;
      } else if (lowerDesc.includes('blueprint') || lowerDesc.includes('design') || lowerDesc.includes('logo') || lowerDesc.includes('mockup')) {
        detectedType = TrainingDocumentType.IMAGE;
      } else {
        detectedType = TrainingDocumentType.TEXT;
      }

      setDocumentDescription(randomDesc);
      setManualSelectedType(detectedType);
      setIsVoiceListening(false);
      showSaveMessage("Voice annotation applied & type detected.");
    }, 2000);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    processFiles(Array.from(files));
    if (event.target) event.target.value = ''; // Clear input
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (!files || files.length === 0) return;
    processFiles(Array.from(files));
  };

  const processFiles = async (files: File[]) => {
    setIsUploading(true);
    setUploadError(null);

    const newDocs: TrainingDocument[] = [];
    for (const file of files) {
      const docType = manualSelectedType || getFileTypeFromMime(file.type);
      const newDoc: TrainingDocument = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: file.name,
        type: docType,
        description: documentDescription,
        uploadedBy: 'Admin User',
        uploadDate: Date.now(),
        status: 'pending',
        sizeBytes: file.size,
        fileUrl: URL.createObjectURL(file),
        originalFile: file,
      };
      newDocs.push(newDoc);
    }
    setTrainingDocs(prev => [...newDocs, ...prev]);

    for (const doc of newDocs) {
      await simulateUploadProcess(doc);
    }
    
    setIsUploading(false);
    setManualSelectedType(null);
    setDocumentDescription('');
  };

  const simulateUploadProcess = async (doc: TrainingDocument) => {
    setTrainingDocs(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'processing' } : d));
    
    let result;
    if (doc.originalFile) {
        result = await uploadTrainingData(doc.originalFile);
    } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
        result = { success: true, message: 'Reprocessed successfully (mock)' };
    }

    if (result.success) {
      setTrainingDocs(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'processed' } : d));
    } else {
      setTrainingDocs(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'error' } : d));
      if (doc.originalFile) setUploadError(result.message);
    }
  };

  const handleReprocess = async (doc: TrainingDocument) => {
    await simulateUploadProcess(doc);
  };

  const preventDefaults = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // --- Filters ---
  const filteredDocs = trainingDocs.filter(doc => {
    const matchesType = activeFilter === 'All' || 
                        (activeFilter === 'Documents' && doc.type === TrainingDocumentType.DOCUMENT) ||
                        (activeFilter === 'Images' && doc.type === TrainingDocumentType.IMAGE) ||
                        (activeFilter === 'Text' && doc.type === TrainingDocumentType.TEXT);
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  // --- Visual Helpers ---
  const getStatusColor = (status: TrainingDocument['status']) => {
    switch (status) {
      case 'processed': return 'text-green-400';
      case 'processing': return 'text-yellow-400';
      case 'pending': return 'text-blue-400';
      case 'error': return 'text-red-400';
    }
  };

  const getStatusIcon = (status: TrainingDocument['status']) => {
    switch (status) {
      case 'processed': return <CheckCircle size={16} />;
      case 'processing': return <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" role="status" aria-label="Processing indicator" />;
      case 'pending': return <Clock size={16} />;
      case 'error': return <AlertTriangle size={16} />;
    }
  };

  // --- Role Editor Handlers ---
  const resetEditors = () => {
    setEditingRoleCommands(null);
    setEditingRolePrompt(null);
    setEditingRoleSettings(null);
  };

  const handleEditCommands = (role: UserRole) => {
    resetEditors();
    setEditingRoleCommands(role);
    setTempAllowedCommands([...yusraRoleConfigs[role].allowedCommands]);
  };

  const handleToggleCommand = (commandId: string) => {
    setTempAllowedCommands(prev => prev.includes(commandId) ? prev.filter(id => id !== commandId) : [...prev, commandId]);
  };

  const handleSelectAllCommands = () => {
    setTempAllowedCommands(AVAILABLE_YUSRA_COMMANDS.map(c => c.id));
  };

  const handleDeselectAllCommands = () => {
    setTempAllowedCommands([]);
  };

  const handleSaveCommands = (role: UserRole) => {
    setYusraRoleConfigs(prev => ({ ...prev, [role]: { ...prev[role], allowedCommands: tempAllowedCommands } }));
    setEditingRoleCommands(null);
    showSaveMessage(`Command permissions saved for ${role}!`);
  };

  const handleEditPrompt = (role: UserRole) => {
    resetEditors();
    setEditingRolePrompt(role);
    setTempSystemPrompt(yusraRoleConfigs[role].systemPromptAddition);
  };

  const handleSavePrompt = (role: UserRole) => {
    setYusraRoleConfigs(prev => ({ ...prev, [role]: { ...prev[role], systemPromptAddition: tempSystemPrompt } }));
    setEditingRolePrompt(null);
    showSaveMessage("System prompt saved!");
  };

  // New Handlers for Role-Specific Settings
  const handleEditRoleSettings = (role: UserRole) => {
    resetEditors();
    setEditingRoleSettings(role);
    // Initialize with existing override or default global settings
    setTempRoleSettings(yusraRoleConfigs[role].globalSettingsOverride || {
       temperature: yusraGlobalSettings.temperature,
       responseVerbosity: yusraGlobalSettings.responseVerbosity,
       topP: yusraGlobalSettings.topP,
       topK: yusraGlobalSettings.topK
    });
  };

  const handleSaveRoleSettings = (role: UserRole) => {
    setYusraRoleConfigs(prev => ({
       ...prev,
       [role]: {
         ...prev[role],
         globalSettingsOverride: tempRoleSettings
       }
    }));
    setEditingRoleSettings(null);
    showSaveMessage(`Role settings for ${role} updated!`);
  };

  const handleToggleCanExecuteCommands = (role: UserRole) => {
    setYusraRoleConfigs(prev => ({ ...prev, [role]: { ...prev[role], canExecuteCommands: !prev[role].canExecuteCommands } }));
    showSaveMessage(`Command execution for ${role} updated.`);
  };

  // --- Advanced Role Management Handlers ---
  
  const handleCopyConfig = (targetRole: UserRole, sourceRole: UserRole) => {
    if (targetRole === sourceRole) return;
    setYusraRoleConfigs(prev => ({
      ...prev,
      [targetRole]: {
        ...prev[targetRole],
        systemPromptAddition: prev[sourceRole].systemPromptAddition,
        allowedCommands: [...prev[sourceRole].allowedCommands],
        globalSettingsOverride: prev[sourceRole].globalSettingsOverride ? { ...prev[sourceRole].globalSettingsOverride } : undefined,
        canExecuteCommands: prev[sourceRole].canExecuteCommands
      }
    }));
    showSaveMessage(`Configuration copied from ${sourceRole} to ${targetRole}.`);
  };

  const handleExportConfig = (role: UserRole) => {
    const config = yusraRoleConfigs[role];
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `yusra-config-${role}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showSaveMessage(`Config for ${role} exported.`);
  };

  const handleImportConfig = (role: UserRole, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedConfig = JSON.parse(e.target?.result as string);
        // Basic validation could go here
        setYusraRoleConfigs(prev => ({
          ...prev,
          [role]: {
            ...prev[role],
            ...importedConfig,
            id: prev[role].id, // Preserve ID and Role
            role: role
          }
        }));
        showSaveMessage(`Config imported successfully for ${role}.`);
      } catch (err) {
        console.error("Import failed", err);
        showSaveMessage("Import failed: Invalid JSON.");
      }
    };
    reader.readAsText(file);
    if (event.target) event.target.value = '';
  };


  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-qg-accent" /> Yusra Control Hub
          </h2>
          <p className="text-slate-400 text-sm">Train Yusra and manage AI configurations</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
            <User size={16} /> Current Role: <span className="text-qg-accent font-medium">{currentUserRole.replace(/([A-Z])/g, ' $1').trim()}</span>
        </div>
      </div>

      {settingsSaveMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-sm font-medium shadow-lg bg-green-600/80 text-white border-green-700 animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <CheckCircle size={16} />
          {settingsSaveMessage}
        </div>
      )}

      {/* General Settings (Default Global) */}
      <div className="glass-panel p-6 rounded-2xl">
         <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsGeneralSettingsOpen(!isGeneralSettingsOpen)}>
           <h3 className="text-lg font-semibold text-white flex items-center gap-2">
             <Sliders size={20} className="text-qg-yellow" /> Default Global Settings
           </h3>
           {isGeneralSettingsOpen ? <ChevronUp size={20} className="text-slate-400"/> : <ChevronDown size={20} className="text-slate-400"/>}
         </div>
         
         {isGeneralSettingsOpen && (
           <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Default Verbosity</label>
                <select 
                  value={yusraGlobalSettings.responseVerbosity}
                  onChange={(e) => setYusraGlobalSettings({...yusraGlobalSettings, responseVerbosity: e.target.value as any})}
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-qg-accent/50 outline-none"
                >
                   <option value="brief">Brief (Concise)</option>
                   <option value="standard">Standard (Balanced)</option>
                   <option value="detailed">Detailed (Comprehensive)</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Default Creativity (Temp: {yusraGlobalSettings.temperature})</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1" 
                  value={yusraGlobalSettings.temperature}
                  onChange={(e) => setYusraGlobalSettings({...yusraGlobalSettings, temperature: parseFloat(e.target.value)})}
                  className="w-full accent-qg-accent"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Top K (Randomness): {yusraGlobalSettings.topK}</label>
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  step="1" 
                  value={yusraGlobalSettings.topK}
                  onChange={(e) => setYusraGlobalSettings({...yusraGlobalSettings, topK: parseInt(e.target.value)})}
                  className="w-full accent-qg-accent"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Top P (Probability): {yusraGlobalSettings.topP}</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05" 
                  value={yusraGlobalSettings.topP}
                  onChange={(e) => setYusraGlobalSettings({...yusraGlobalSettings, topP: parseFloat(e.target.value)})}
                  className="w-full accent-qg-accent"
                />
              </div>
           </div>
         )}
      </div>

      {/* Role-Based Assistance Configuration */}
      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <UserCheck size={20} className="text-blue-400" /> Role-Based Assistance
        </h3>
        <p className="text-slate-400 text-sm mb-6">Customize Yusra's persona, access, and global setting overrides based on user roles.</p>

        <div className="space-y-4">
          {Object.values(UserRole).map((role) => (
            <div key={role} className="border border-white/5 rounded-xl overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-black/20 gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-qg-accent font-medium text-sm">{role.replace(/([A-Z])/g, ' $1').trim()}</span>
                  {currentUserRole === role && (
                    <span className="px-2 py-0.5 rounded-full bg-qg-accent/20 text-qg-accent text-[10px] flex items-center gap-1">
                      <User size={10} /> Your Role
                    </span>
                  )}
                  {yusraRoleConfigs[role].globalSettingsOverride && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] flex items-center gap-1 border border-blue-500/30">
                          <Sliders size={10} /> Custom Settings
                      </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <div className="flex items-center gap-2 mr-2 border-r border-white/10 pr-4">
                    <span className="text-xs text-slate-400 hidden md:inline">Enable Commands:</span>
                    <button
                      onClick={() => handleToggleCanExecuteCommands(role)}
                      className={clsx(
                        "relative w-10 h-5 rounded-full transition-colors duration-200",
                        yusraRoleConfigs[role].canExecuteCommands ? "bg-qg-accent" : "bg-slate-700"
                      )}
                      title="Toggle Global Command Execution"
                    >
                      <span className={clsx("absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-200", yusraRoleConfigs[role].canExecuteCommands ? "translate-x-5" : "translate-x-0.5")} />
                    </button>
                  </div>
                  
                  <div className="flex gap-2 w-full sm:w-auto justify-end">
                    <button onClick={() => handleEditPrompt(role)} className="px-3 py-1 text-xs text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1">
                        <Brain size={14} /> Prompt {editingRolePrompt === role ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <button onClick={() => handleEditCommands(role)} className="px-3 py-1 text-xs text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1">
                        <Command size={14} /> Commands {editingRoleCommands === role ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <button onClick={() => handleEditRoleSettings(role)} className="px-3 py-1 text-xs text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1">
                        <Sliders size={14} /> Settings {editingRoleSettings === role ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    
                    {/* Advanced Actions Dropdown/Group */}
                    <div className="flex items-center gap-1 pl-2 border-l border-white/10">
                        <button 
                           onClick={() => handleExportConfig(role)}
                           className="p-1.5 text-slate-400 hover:text-qg-accent hover:bg-white/10 rounded transition-colors"
                           title="Export Config"
                        >
                           <Download size={14} />
                        </button>
                        <label className="p-1.5 text-slate-400 hover:text-qg-accent hover:bg-white/10 rounded transition-colors cursor-pointer" title="Import Config">
                           <Upload size={14} />
                           <input type="file" className="hidden" accept=".json" onChange={(e) => handleImportConfig(role, e)} />
                        </label>
                    </div>
                  </div>
                </div>
              </div>

              {editingRolePrompt === role && (
                <div className="p-4 bg-black/40 border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex justify-between items-center mb-3">
                     <h4 className="text-white font-medium">System Prompt for {role}:</h4>
                     <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Copy from:</span>
                        <select 
                          className="bg-black/40 border border-white/10 rounded text-xs text-slate-300 p-1 outline-none"
                          onChange={(e) => handleCopyConfig(role, e.target.value as UserRole)}
                          value=""
                        >
                           <option value="" disabled>Select Role...</option>
                           {Object.values(UserRole).filter(r => r !== role).map(r => (
                              <option key={r} value={r}>{r}</option>
                           ))}
                        </select>
                     </div>
                  </div>
                  <textarea value={tempSystemPrompt} onChange={(e) => setTempSystemPrompt(e.target.value)} rows={6} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-qg-accent/50 outline-none resize-y"></textarea>
                  <div className="flex justify-end gap-3 mt-4">
                    <button onClick={resetEditors} className="px-4 py-2 text-sm rounded-lg border border-white/10 text-slate-300 hover:bg-white/10">Cancel</button>
                    <button onClick={() => handleSavePrompt(role)} className="px-4 py-2 text-sm bg-qg-accent text-qg-dark font-semibold rounded-lg hover:bg-emerald-400 flex items-center gap-2"><Save size={14} /> Save Prompt</button>
                  </div>
                </div>
              )}

              {editingRoleCommands === role && (
                <div className="p-4 bg-black/40 border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
                     <h4 className="text-white font-medium">Allowed Commands for {role}:</h4>
                     <div className="flex gap-3">
                        <button onClick={handleSelectAllCommands} className="text-xs text-qg-accent hover:underline flex items-center gap-1 font-medium"><CheckSquare size={14}/> Select All</button>
                        <button onClick={handleDeselectAllCommands} className="text-xs text-slate-400 hover:text-white hover:underline flex items-center gap-1"><Square size={14}/> Deselect All</button>
                     </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4 max-h-[300px] overflow-y-auto pr-2">
                    {AVAILABLE_YUSRA_COMMANDS.map(command => {
                      const isChecked = tempAllowedCommands.includes(command.id);
                      return (
                        <label 
                          key={command.id} 
                          className={clsx(
                            "flex flex-col gap-1 p-3 rounded-lg border cursor-pointer transition-all select-none",
                            isChecked 
                              ? "bg-qg-accent/10 border-qg-accent/30 hover:bg-qg-accent/15" 
                              : "bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10"
                          )}
                        >
                          <div className="flex items-center gap-2 text-slate-200 text-sm font-medium">
                            <div 
                              className={clsx(
                                "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                isChecked ? "bg-qg-accent border-qg-accent" : "border-slate-500 bg-black/20"
                              )}
                            >
                              {isChecked && <CheckCircle size={12} className="text-black" />}
                            </div>
                            <span className={isChecked ? "text-white" : "text-slate-400"}>{command.label}</span>
                          </div>
                          <p className="text-xs text-slate-500 ml-6">{command.description}</p>
                        </label>
                      );
                    })}
                  </div>
                  <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
                    <button onClick={resetEditors} className="px-4 py-2 text-sm rounded-lg border border-white/10 text-slate-300 hover:bg-white/10">Cancel</button>
                    <button onClick={() => handleSaveCommands(role)} className="px-4 py-2 text-sm bg-qg-accent text-qg-dark font-semibold rounded-lg hover:bg-emerald-400 flex items-center gap-2"><Save size={14} /> Save Permissions</button>
                  </div>
                </div>
              )}

              {editingRoleSettings === role && (
                 <div className="p-4 bg-black/40 border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
                    <h4 className="text-white font-medium mb-3">Override Global Settings for {role}:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="text-sm text-slate-400 mb-2 block">
                              Verbosity
                              {tempRoleSettings.responseVerbosity !== yusraGlobalSettings.responseVerbosity && (
                                  <span className="ml-2 text-[10px] bg-qg-accent/20 text-qg-accent px-1.5 py-0.5 rounded">Overridden</span>
                              )}
                          </label>
                          <select 
                            value={tempRoleSettings.responseVerbosity || yusraGlobalSettings.responseVerbosity}
                            onChange={(e) => setTempRoleSettings({...tempRoleSettings, responseVerbosity: e.target.value as any})}
                            className={clsx(
                                "w-full bg-black/20 border rounded-xl p-3 text-white text-sm focus:border-qg-accent/50 outline-none transition-all",
                                tempRoleSettings.responseVerbosity !== yusraGlobalSettings.responseVerbosity ? "border-qg-accent/50" : "border-white/10"
                            )}
                          >
                             <option value="brief">Brief</option>
                             <option value="standard">Standard</option>
                             <option value="detailed">Detailed</option>
                          </select>
                       </div>
                       <div>
                          <label className="text-sm text-slate-400 mb-2 block">
                              Creativity (Temp: {tempRoleSettings.temperature ?? yusraGlobalSettings.temperature})
                              {tempRoleSettings.temperature !== undefined && tempRoleSettings.temperature !== yusraGlobalSettings.temperature && (
                                  <span className="ml-2 text-[10px] bg-qg-accent/20 text-qg-accent px-1.5 py-0.5 rounded">Overridden</span>
                              )}
                          </label>
                          <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.1" 
                            value={tempRoleSettings.temperature ?? yusraGlobalSettings.temperature}
                            onChange={(e) => setTempRoleSettings({...tempRoleSettings, temperature: parseFloat(e.target.value)})}
                            className="w-full accent-qg-accent"
                          />
                       </div>
                       <div>
                           <label className="text-sm text-slate-400 mb-2 block">
                               Top K (Randomness): {tempRoleSettings.topK ?? yusraGlobalSettings.topK}
                               {tempRoleSettings.topK !== undefined && tempRoleSettings.topK !== yusraGlobalSettings.topK && (
                                  <span className="ml-2 text-[10px] bg-qg-accent/20 text-qg-accent px-1.5 py-0.5 rounded">Overridden</span>
                              )}
                           </label>
                           <input 
                             type="range" 
                             min="1" 
                             max="100" 
                             step="1" 
                             value={tempRoleSettings.topK ?? yusraGlobalSettings.topK}
                             onChange={(e) => setTempRoleSettings({...tempRoleSettings, topK: parseInt(e.target.value)})}
                             className="w-full accent-qg-accent"
                           />
                       </div>
                       <div>
                           <label className="text-sm text-slate-400 mb-2 block">
                               Top P (Probability): {tempRoleSettings.topP ?? yusraGlobalSettings.topP}
                               {tempRoleSettings.topP !== undefined && tempRoleSettings.topP !== yusraGlobalSettings.topP && (
                                  <span className="ml-2 text-[10px] bg-qg-accent/20 text-qg-accent px-1.5 py-0.5 rounded">Overridden</span>
                              )}
                           </label>
                           <input 
                             type="range" 
                             min="0" 
                             max="1" 
                             step="0.05" 
                             value={tempRoleSettings.topP ?? yusraGlobalSettings.topP}
                             onChange={(e) => setTempRoleSettings({...tempRoleSettings, topP: parseFloat(e.target.value)})}
                             className="w-full accent-qg-accent"
                           />
                       </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={resetEditors} className="px-4 py-2 text-sm rounded-lg border border-white/10 text-slate-300 hover:bg-white/10">Cancel</button>
                        <button onClick={() => handleSaveRoleSettings(role)} className="px-4 py-2 text-sm bg-qg-accent text-qg-dark font-semibold rounded-lg hover:bg-emerald-400 flex items-center gap-2"><Save size={14} /> Save Overrides</button>
                    </div>
                 </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Knowledge Base Upload Section */}
      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <UploadCloud size={20} className="text-qg-pink" /> Knowledge Base Upload
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
           <div>
            <label htmlFor="manual-type-select" className="text-xs text-slate-400 mb-1 block">Document Type (Optional)</label>
            <select
                id="manual-type-select"
                value={manualSelectedType || ''}
                onChange={(e) => setManualSelectedType(e.target.value as TrainingDocumentType || null)}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-qg-accent/50 outline-none focus:ring-1 focus:ring-qg-accent/50 transition-all"
            >
                <option value="">Auto-Detect</option>
                {Object.values(TrainingDocumentType).map((type) => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
            </select>
           </div>
           <div className="relative">
             <label htmlFor="doc-desc" className="text-xs text-slate-400 mb-1 block">Description (Optional)</label>
             <div className="flex gap-2">
                 <input 
                    id="doc-desc"
                    type="text"
                    value={documentDescription}
                    onChange={(e) => setDocumentDescription(e.target.value)}
                    placeholder="e.g. Q3 Financial Report"
                    className="flex-1 bg-black/20 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-qg-accent/50 outline-none focus:ring-1 focus:ring-qg-accent/50 transition-all"
                 />
                 <button
                    onClick={handleVoiceAnnotate}
                    className={clsx(
                        "p-3 rounded-xl border transition-all flex items-center justify-center gap-2",
                        isVoiceListening 
                            ? "bg-red-500/20 border-red-500/50 text-red-400 animate-pulse" 
                            : "bg-black/20 border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                    title="Voice Annotate: Dictate type and description"
                 >
                    {isVoiceListening ? <MicOff size={18} /> : <Mic size={18} />}
                 </button>
             </div>
           </div>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={preventDefaults}
          onDragEnter={preventDefaults}
          onDragLeave={preventDefaults}
          className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-qg-accent/30 transition-colors bg-black/20 cursor-pointer"
        >
          <input
            type="file"
            id="knowledge-upload"
            multiple
            className="hidden"
            onChange={handleFileUpload}
            accept=".txt,.doc,.docx,.pdf,.png,.jpg,.jpeg"
          />
          <label htmlFor="knowledge-upload" className="cursor-pointer block">
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-2 border-qg-accent border-t-transparent rounded-full animate-spin mb-2"></div>
                <span className="text-slate-400">Processing files...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <UploadCloud size={32} className="text-slate-500" />
                <span className="text-slate-300">Drag & drop files here, or click to browse</span>
                <span className="text-xs text-slate-500">Supports TXT, DOC, PDF, PNG, JPG</span>
              </div>
            )}
          </label>
          {uploadError && <p className="text-red-400 text-xs mt-2">{uploadError}</p>}
        </div>

        {/* Document Filters & Search */}
        <div className="mt-8 mb-4 flex flex-col md:flex-row gap-4 justify-between items-end">
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10 w-full md:w-auto">
                {['All', 'Documents', 'Images', 'Text'].map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={clsx(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 md:flex-none",
                            activeFilter === filter ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-white"
                        )}
                    >
                        {filter}
                    </button>
                ))}
            </div>
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-white text-sm focus:border-qg-accent/50 outline-none"
                />
            </div>
        </div>

        {/* Uploaded Documents List */}
        <div className="glass-panel rounded-lg overflow-hidden border border-white/5">
            <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-slate-400 border-b border-white/5">
                    <tr>
                        <th className="p-3 pl-4">File Name</th>
                        <th className="p-3">Type</th>
                        <th className="p-3 hidden md:table-cell">Description</th>
                        <th className="p-3">Date</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {filteredDocs.length > 0 ? (
                        filteredDocs.map(doc => (
                            <tr key={doc.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-3 pl-4 text-slate-200">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-white/5 text-slate-400">
                                            {getFileIcon(doc.type)}
                                        </div>
                                        <span className="font-medium">{doc.name}</span>
                                    </div>
                                </td>
                                <td className="p-3 text-slate-400 capitalize">{doc.type}</td>
                                <td className="p-3 text-slate-500 text-xs hidden md:table-cell max-w-[150px] truncate" title={doc.description}>
                                    {doc.description || '-'}
                                </td>
                                <td className="p-3 text-slate-500 text-xs">{new Date(doc.uploadDate).toLocaleDateString()}</td>
                                <td className="p-3">
                                    <div className={clsx(
                                        "flex items-center justify-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium mx-auto w-fit",
                                        getStatusColor(doc.status).replace('text-', 'bg-') + '/10',
                                        getStatusColor(doc.status)
                                    )}>
                                        {getStatusIcon(doc.status)}
                                        <span className="capitalize">{doc.status}</span>
                                    </div>
                                </td>
                                <td className="p-3 text-center">
                                    <div className="flex justify-center gap-2">
                                        {doc.status === 'processed' && doc.fileUrl && (
                                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-400 hover:text-qg-accent hover:bg-white/10 rounded-lg transition-colors" title="View File">
                                                <Eye size={16} />
                                            </a>
                                        )}
                                        {doc.status === 'error' && (
                                            <button 
                                                onClick={() => handleReprocess(doc)}
                                                className="p-1.5 text-slate-400 hover:text-qg-accent hover:bg-white/10 rounded-lg transition-colors"
                                                title="Re-process Document"
                                            >
                                                <RefreshCw size={16} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-500">
                                No documents found matching your filters.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};
