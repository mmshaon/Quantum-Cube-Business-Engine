
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, Send, X, Sparkles, Mic, Headphones, Globe, Info, User, Search } from 'lucide-react';
import { generateInsight } from '../services/gemini';
import { ChatMessage, UserRole, SuggestedCommand, YusraConfig, YusraGlobalSettings } from '../types';
import { clsx } from 'clsx';
import { LiveVoiceMode } from './LiveVoiceMode';
import { AVAILABLE_YUSRA_COMMANDS, YUSRA_MOCK_COMMAND_RESPONSES } from '../constants';
import { useData } from '../context/DataContext'; // Import Data Context for actual execution

interface YusraChatProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: UserRole;
  yusraRoleConfigs: Record<UserRole, YusraConfig>;
  yusraGlobalSettings?: YusraGlobalSettings;
}

// Simple Markdown renderer (for demo purposes)
const renderMarkdown = (text: string) => {
  // Bold
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Newlines to breaks
  text = text.replace(/\n/g, '<br />');
  // Links
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-qg-accent hover:underline break-all">[$1]</a>');
  // Code blocks (simple, multi-line)
  text = text.replace(/```(.*?)```/gs, '<pre class="bg-slate-800 dark:bg-qg-dark p-2 rounded-md text-xs font-mono overflow-x-auto my-2 text-white">$1</pre>');
  return <div dangerouslySetInnerHTML={{ __html: text }} />;
};

// Sanitize Input
const sanitizeInput = (input: string) => {
    return input.replace(/<[^>]*>?/gm, '');
};

export const YusraChat: React.FC<YusraChatProps> = ({ isOpen, onClose, userRole, yusraRoleConfigs, yusraGlobalSettings }) => {
  // Chat state initialization with persistence check
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const storedHistory = localStorage.getItem('yusra_chat_history');
      return storedHistory ? JSON.parse(storedHistory) : [{ id: 'welcome', role: 'model', text: 'Hello. I am Yusra, your financial co-pilot. How can I optimize your cash flow today?', timestamp: Date.now() }];
    } catch (e) {
      console.error("Failed to load chat history", e);
      return [{ id: 'welcome', role: 'model', text: 'Hello. I am Yusra, your financial co-pilot. How can I optimize your cash flow today?', timestamp: Date.now() }];
    }
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Context Actions for Command Execution
  const { 
    addTransaction, 
    addLog, 
    updateBudget, 
    budgets, 
    transactions, 
    updateTransaction,
    ventures,
    updateVenture
  } = useData();

  const currentUserYusraConfig = userRole ? yusraRoleConfigs[userRole] : yusraRoleConfigs[UserRole.VIEWER];

  // Persist messages when they change
  useEffect(() => {
    localStorage.setItem('yusra_chat_history', JSON.stringify(messages));
  }, [messages]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    const timer = setTimeout(() => setToast(null), 3000); // Hide toast after 3 seconds
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, toast]); // Re-scroll when messages or toast changes

  useEffect(() => {
    if (isOpen && chatContainerRef.current) {
      // Focus the input when chat opens for better accessibility
      const inputElement = chatContainerRef.current.querySelector('input');
      if (inputElement) {
        inputElement.focus();
      }
    }
  }, [isOpen]);

  // Robust Command Executor
  const executeCommand = async (commandId: string, commandLabel: string) => {
      try {
          setIsLoading(true);
          await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network

          switch (commandId) {
              case 'create_transaction':
                  addTransaction({
                      id: Date.now().toString(),
                      description: "AI Generated Transaction",
                      amount: 150,
                      currency: "USD",
                      category: "AI Services",
                      date: new Date().toISOString().split('T')[0],
                      type: 'expense',
                      status: 'approved'
                  });
                  addLog("Yusra created a mock transaction", 'info');
                  break;
              
              case 'approve_cash_request':
                  // Find a pending transaction to approve (mock logic)
                  const pendingTx = transactions.find(t => t.status === 'pending');
                  if (pendingTx) {
                    updateTransaction(pendingTx.id, { status: 'approved' });
                    addLog(`Yusra approved transaction: ${pendingTx.description}`, 'info');
                  } else {
                    showToast("No pending requests to approve.", 'info');
                    setIsLoading(false);
                    return;
                  }
                  break;

              case 'update_budget_limit':
                  // Find a budget (e.g., Operations) and bump it by 10%
                  const budget = budgets[0];
                  if (budget) {
                    updateBudget(budget.id, { limit: budget.limit * 1.1 });
                    addLog(`Yusra increased budget limit for ${budget.category}`, 'info');
                  }
                  break;

              case 'adjust_venture_progress':
                  // Update the first active venture
                  const activeVenture = ventures.find(v => v.status === 'Active');
                  if (activeVenture) {
                    const newProgress = Math.min(activeVenture.progress + 5, 100);
                    updateVenture(activeVenture.id, { progress: newProgress });
                    addLog(`Yusra updated progress for ${activeVenture.name} to ${newProgress}%`, 'info');
                  }
                  break;

              case 'send_notification':
                  addLog("Yusra broadcasted a system-wide notification", 'info');
                  break;

              case 'generate_report':
                  addLog("Yusra generated a financial report (PDF)", 'info');
                  break;

              default:
                  addLog(`Yusra executed command: ${commandId}`, 'info');
                  break;
          }
          
          const executedMsg: ChatMessage = {
              id: Date.now().toString(),
              role: 'model',
              text: `Command "${commandLabel}" executed successfully!`,
              timestamp: Date.now()
          };
          setMessages(prev => [...prev, executedMsg]);
          showToast(`Command "${commandLabel}" executed.`, 'success');
      } catch (e) {
          console.error(e);
          showToast("Command execution failed.", 'error');
      } finally {
          setIsLoading(false);
      }
  };

  const handleSend = async () => {
    const sanitized = sanitizeInput(input).trim();
    if (!sanitized) {
      showToast("Please enter a valid message.", "info");
      return;
    }
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: sanitized, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    let aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: "I'm having trouble connecting to the neural network or processing your request. Please try again later.", timestamp: Date.now() };
    let suggestedCommand: SuggestedCommand | undefined;

    try {
      // Merge Global Settings into prompt/config if necessary, or use them in generateInsight
      const response = await generateInsight(sanitized, userRole, currentUserYusraConfig);
      let responseText = response.text || "No response generated.";
      let hasGroundingSources = false;

      // Process grounding chunks if available (for Google Search grounding)
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (groundingChunks && groundingChunks.length > 0) {
        console.log('Yusra used Google Search. Sources:');
        let sourcesText = "\n\n**Sources:**\n";
        groundingChunks.forEach((chunk: any, index: number) => {
          if (chunk.web) {
            sourcesText += `${index + 1}. [${chunk.web.title || 'Link'}](${chunk.web.uri})\n`;
          } else if (chunk.maps) {
            sourcesText += `${index + 1}. [${chunk.maps.title || 'Map Link'}](${chunk.maps.uri})\n`;
          }
        });
        responseText += sourcesText;
        hasGroundingSources = true;
      }

      aiMsg = { ...aiMsg, text: responseText, hasGroundingSources: hasGroundingSources }; // Add grounding sources flag

      // --- Mock Command Suggestion Logic (Frontend only for demo) ---
      if (currentUserYusraConfig.canExecuteCommands) {
        for (const mockResponse of YUSRA_MOCK_COMMAND_RESPONSES) {
          if (responseText.toLowerCase().includes(mockResponse.trigger.toLowerCase())) {
            const commandLabel = AVAILABLE_YUSRA_COMMANDS.find(cmd => cmd.id === mockResponse.commandId)?.label || mockResponse.commandId;
            if (currentUserYusraConfig.allowedCommands.includes(mockResponse.commandId)) {
              suggestedCommand = {
                id: mockResponse.commandId,
                label: commandLabel,
                confirmation: mockResponse.confirmation,
                action: () => executeCommand(mockResponse.commandId, commandLabel)
              };
              break;
            } else {
              suggestedCommand = {
                id: 'permission_denied',
                label: `(No permission for ${commandLabel})`,
                confirmation: `I can suggest that, but your current role (${userRole}) does not have permission to execute '${commandLabel}'. Please contact your administrator.`,
                action: () => showToast(`Permission denied for command: ${commandLabel}`, 'error')
              };
              break;
            }
          }
        }
      }
      // --- End Mock Command Suggestion Logic ---

    } catch (error: any) {
      console.error("Yusra Chat Error:", error);
      aiMsg.text = "An unexpected error occurred while processing your request. Please try again or rephrase.";
      aiMsg.isError = true; // Mark as error message
    } finally {
      setMessages(prev => [...prev, aiMsg]);
      if (suggestedCommand) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 2).toString(),
          role: 'model',
          text: suggestedCommand.confirmation,
          timestamp: Date.now(),
          suggestedCommand: suggestedCommand
        }]);
      }
      setIsLoading(false);
    }
  };

  if (isVoiceMode) {
    return <LiveVoiceMode onClose={() => setIsVoiceMode(false)} yusraConfig={currentUserYusraConfig} />;
  }

  if (!isOpen) return null;

  return (
    <div 
      className="fixed bottom-6 right-6 w-96 h-[600px] glass-panel rounded-2xl flex flex-col overflow-hidden z-50 border-qg-accent/30 shadow-[0_0_30px_rgba(0,255,163,0.15)] animate-in slide-in-from-bottom-10 duration-300 bg-slate-50/95 dark:bg-slate-900/90"
      aria-live="polite"
      aria-atomic="true"
      role="dialog"
      aria-modal="true"
      aria-labelledby="yusra-chat-title"
      ref={chatContainerRef}
    >
      {/* Header */}
      <div className="p-4 border-b border-black/5 dark:border-white/10 flex justify-between items-center bg-qg-accent/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-qg-accent to-qg-pink flex items-center justify-center shadow-lg">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h3 id="yusra-chat-title" className="font-semibold text-slate-900 dark:text-white tracking-wide">Yusra AI</h3>
            <span className="text-[10px] text-qg-accent uppercase tracking-wider">Online</span>
          </div>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={() => setIsVoiceMode(true)}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-qg-accent"
            title="Start Live Voice Chat"
            aria-label="Start Live Voice Chat"
          >
            <Headphones size={18} />
          </button>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-slate-500 dark:text-slate-400"
            aria-label="Close Yusra Chat"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Yusra's Active Persona Hint */}
      {currentUserYusraConfig && (
        <div 
          className="flex items-center gap-2 p-2 bg-qg-accent/5 text-qg-accent text-[10px] font-mono border-b border-black/5 dark:border-white/10"
          aria-label={`Yusra's active persona for ${currentUserYusraConfig.role.replace(/([A-Z])/g, ' $1').trim()} role`}
        >
          <Info size={12} />
          <span>Active Persona ({currentUserYusraConfig.role.replace(/([A-Z])/g, ' $1').trim()}): {currentUserYusraConfig.systemPromptAddition.substring(0, 50)}...</span>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div 
          className={clsx(
            "absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-sm font-medium shadow-lg animate-in fade-in slide-in-from-top-4 border",
            toast.type === 'success' && "bg-green-600/80 text-white border-green-700",
            toast.type === 'error' && "bg-red-600/80 text-white border-red-700",
            toast.type === 'info' && "bg-blue-600/80 text-white border-blue-700"
          )}
          role="status"
          aria-live="assertive"
          aria-atomic="true"
        >
          {toast.message}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={clsx("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
            <div 
              className={clsx(
                "max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm backdrop-blur-sm",
                msg.role === 'user' 
                  ? "bg-qg-accent/20 border border-qg-accent/30 text-slate-800 dark:text-white rounded-br-none font-medium" // User Bubble
                  : "bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 rounded-bl-none", // Model Bubble
                msg.isError && "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
              )}
              role="status"
              aria-live={msg.role === 'model' ? "polite" : "off"}
            >
              {msg.hasGroundingSources && (
                <div className="flex items-center gap-1 text-xs text-qg-accent mb-2" aria-label="Yusra is searching the web">
                  <Globe size={12} className="shrink-0" />
                  <span>Searching the web...</span>
                </div>
              )}
              {renderMarkdown(msg.text)}
              {msg.suggestedCommand && (
                <div className="mt-2 pt-2 border-t border-black/5 dark:border-white/10">
                  <button
                    onClick={msg.suggestedCommand.action}
                    className={clsx(
                      "w-full px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors",
                      msg.suggestedCommand.id === 'permission_denied'
                        ? "bg-red-500/10 text-red-400 cursor-not-allowed"
                        : "bg-qg-accent/15 text-qg-accent hover:bg-qg-accent/25"
                    )}
                    disabled={msg.suggestedCommand.id === 'permission_denied'}
                    aria-disabled={msg.suggestedCommand.id === 'permission_denied'}
                    aria-label={msg.suggestedCommand.id === 'permission_denied' ? `Permission denied for ${msg.suggestedCommand.label}` : `Execute ${msg.suggestedCommand.label}`}
                  >
                    {msg.suggestedCommand.id === 'permission_denied' ? 'Permission Denied' : msg.suggestedCommand.label}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start" aria-label="Yusra is typing">
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3 rounded-2xl rounded-bl-none flex gap-1 items-center">
              <span className="w-2 h-2 bg-qg-accent rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-qg-accent rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-qg-accent rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-black/5 dark:border-white/10 bg-white/80 dark:bg-black/20 backdrop-blur-sm">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute left-3 top-3 text-slate-400 pointer-events-none">
               {isLoading ? <Sparkles size={16} className="animate-pulse text-qg-accent" /> : <Search size={16} />}
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isLoading ? "Yusra is thinking..." : "Ask or search..."}
              className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-qg-accent/50 focus:ring-1 focus:ring-qg-accent/50 transition-all placeholder:text-slate-400"
              disabled={isLoading}
              aria-label="Chat input with search capabilities"
            />
            <button 
              type="button"
              onClick={() => setIsVoiceMode(true)}
              className="absolute right-2 top-2 p-1 text-slate-400 hover:text-qg-accent transition-colors"
              title="Switch to Voice Mode"
              aria-label="Switch to Voice Mode"
            >
               <Mic size={16} />
            </button>
          </div>
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-qg-accent text-qg-dark rounded-xl hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
