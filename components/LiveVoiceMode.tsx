
import React, { useEffect, useRef, useState } from 'react';
import { X, Mic, MicOff, Activity, Volume2, MessageSquare, Settings2 } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { clsx } from 'clsx';
import { YusraConfig } from '../types';

// --- Audio Helper Functions (Based on Gemini Live API Guidelines) ---

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    // Clamp values to -1 to 1 range before converting to PCM 16
    let s = Math.max(-1, Math.min(1, data[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

// --- Component ---

interface LiveVoiceModeProps {
  onClose: () => void;
  yusraConfig: YusraConfig; // New: Pass current Yusra config
}

export const LiveVoiceMode: React.FC<LiveVoiceModeProps> = ({ onClose, yusraConfig }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentInputTranscription, setCurrentInputTranscription] = useState('');
  const [currentOutputTranscription, setCurrentOutputTranscription] = useState('');
  const [transcriptionHistory, setTranscriptionHistory] = useState<string[]>([]);
  
  // Voice & Rate Settings
  const [selectedVoice, setSelectedVoice] = useState('Kore');
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Refs for Audio State
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null); // New ref for input audio context
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionPromiseRef = useRef<Promise<any> | null>(null); // Use a promise ref for session
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  
  const analyserRef = useRef<AnalyserNode | null>(null); 
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const stopAudio = () => {
    // Stop microphone
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Stop processing
    if (processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current = null;
    }
    if (inputSourceRef.current) {
        inputSourceRef.current.disconnect();
        inputSourceRef.current = null;
    }

    // Stop all playing audio
    sourcesRef.current.forEach(source => {
        try { source.stop(); } catch (e) {}
    });
    sourcesRef.current.clear();

    // Close contexts
    if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
    }
    if (inputContextRef.current) {
        inputContextRef.current.close();
        inputContextRef.current = null;
    }
    
    // Close session
    if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(session => {
          if (session && typeof session.close === 'function') {
            session.close();
          }
        }).catch(e => console.error("Error closing session:", e));
        sessionPromiseRef.current = null; 
    }

    if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
    }

    // Clear analyser and dataArray refs
    analyserRef.current = null;
    dataArrayRef.current = null;

    setIsConnected(false);
    setAiSpeaking(false);
    nextStartTimeRef.current = 0; // Reset start time on stop
    setTranscriptionHistory([]);
    setCurrentInputTranscription('');
    setCurrentOutputTranscription('');
  };

  const startSession = async () => {
    try {
      setError(null);
      // Correctly initialize GoogleGenAI with the API key from process.env.API_KEY
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // 1. Setup Audio Contexts
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass({ sampleRate: 24000 }); // Output rate
      const inputCtx = new AudioContextClass({ sampleRate: 16000 }); // Input rate
      audioContextRef.current = ctx;
      inputContextRef.current = inputCtx;

      // 2. Get User Media
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Setup Analyser for visualization
      const analyser = inputCtx.createAnalyser();
      analyser.fftSize = 64; // Smaller FFT size for chunkier, clearer bars
      analyser.smoothingTimeConstant = 0.6; // Smoother transitions
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

      // Construct system instruction from yusraConfig prop
      const systemInstruction = `You are Yusra, an advanced financial AI assistant for the Quantum Glass Business Cloud. ${yusraConfig.systemPromptAddition} You provide concise, actionable, and data-driven financial insights. You are fluent in English (EN), Bengali (BN), and Arabic (AR). Detect the user's language and respond in the same language/script. Tone: Professional, knowledgeable, yet futuristic.`;

      // 3. Connect to Gemini Live
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: selectedVoice } },
          },
          systemInstruction: systemInstruction, // Use the dynamic system instruction
          inputAudioTranscription: {}, // Enable transcription for user input audio
          outputAudioTranscription: {}, // Enable transcription for model output audio
        },
        callbacks: {
          onopen: () => {
            console.log("Gemini Live Connected");
            setIsConnected(true);
            
            // Start Input Streaming
            const source = inputCtx.createMediaStreamSource(stream);
            inputSourceRef.current = source;
            
            source.connect(analyser); // Connect to analyser
            
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;
            
            processor.onaudioprocess = (e) => {
              if (!isMicOn) return; // Mute logic
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              
              sessionPromiseRef.current?.then((session) => { // Use sessionPromiseRef
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            analyser.connect(processor); // Analyser connects to processor
            processor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            // Process Audio Output
            const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              setAiSpeaking(true);
              // Calculate start time to ensure gapless playback
              nextStartTimeRef.current = Math.max(
                  nextStartTimeRef.current,
                  ctx.currentTime
              );

              const audioBuffer = await decodeAudioData(
                  decode(base64Audio),
                  ctx,
                  24000,
                  1
              );

              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              
              // Apply Playback Rate
              source.playbackRate.value = playbackRate;

              source.onended = () => {
                 sourcesRef.current.delete(source);
                 // Only set speaking to false if no other audio sources are pending/playing
                 if (sourcesRef.current.size === 0 && nextStartTimeRef.current <= ctx.currentTime) {
                    setAiSpeaking(false);
                 }
              };

              source.start(nextStartTimeRef.current);
              // Adjust duration for next start time based on playback rate
              nextStartTimeRef.current += audioBuffer.duration / playbackRate; 
              sourcesRef.current.add(source);
            }

            // Handle Interruption
            const interrupted = msg.serverContent?.interrupted;
            if (interrupted) {
               console.log("Interrupted");
               sourcesRef.current.forEach(s => {
                 try { s.stop(); } catch (e) {} // Ensure stop is called safely
               });
               sourcesRef.current.clear();
               nextStartTimeRef.current = 0;
               setAiSpeaking(false);
               setCurrentInputTranscription('');
               setCurrentOutputTranscription('');
            }

            // Handle Transcriptions
            if (msg.serverContent?.outputTranscription) {
              setCurrentOutputTranscription(prev => prev + msg.serverContent!.outputTranscription!.text);
            } else if (msg.serverContent?.inputTranscription) {
              setCurrentInputTranscription(prev => prev + msg.serverContent!.inputTranscription!.text);
            }

            if (msg.serverContent?.turnComplete) {
              setTranscriptionHistory(prev => [
                ...prev,
                `user:${currentInputTranscription}`,
                `yusra:${currentOutputTranscription}`
              ]);
              setCurrentInputTranscription('');
              setCurrentOutputTranscription('');
            }
          },
          onclose: () => {
            console.log("Gemini Live Closed");
            setIsConnected(false);
            stopAudio();
          },
          onerror: (err) => {
            console.error("Gemini Live Error", err);
            setError("Connection error. Please try again.");
            stopAudio();
          }
        }
      });

      sessionPromiseRef.current = sessionPromise;

    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to initialize voice mode.");
      stopAudio();
    }
  };

  useEffect(() => {
    startSession();
    return () => {
      stopAudio();
    };
  }, [yusraConfig, selectedVoice]); // Restart if config or voice changes


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current || !dataArrayRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      if (!analyserRef.current || !dataArrayRef.current || !ctx) {
        animationRef.current = null;
        return;
      }

      // Ensure analyser and dataArray are ready
      if (analyserRef.current.frequencyBinCount !== dataArrayRef.current.length) {
        dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
      }
      
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 20; 
      const bufferLength = dataArrayRef.current.length;
      const bars = 40; // Number of bars to draw around circle
      const step = (Math.PI * 2) / bars;

      // Draw Circular Visualizer
      ctx.save();
      ctx.translate(centerX, centerY);

      // Draw inner glowing orb
      const avgVolume = dataArrayRef.current.reduce((a, b) => a + b, 0) / bufferLength;
      const scale = 1 + (avgVolume / 255) * 0.5;
      
      ctx.beginPath();
      ctx.arc(0, 0, radius * scale, 0, Math.PI * 2);
      ctx.fillStyle = aiSpeaking ? 'rgba(255, 110, 199, 0.8)' : (isMicOn ? 'rgba(0, 255, 163, 0.5)' : 'rgba(148, 163, 184, 0.2)');
      ctx.shadowBlur = 20;
      ctx.shadowColor = aiSpeaking ? '#FF6EC7' : '#00FFA3';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw radiating bars
      for (let i = 0; i < bars; i++) {
        // Map visualizer bars to frequency data roughly
        const dataIndex = Math.floor((i / bars) * bufferLength);
        const value = dataArrayRef.current[dataIndex];
        const percent = value / 255;
        
        // Dynamic height based on frequency volume
        const barHeight = 10 + (percent * 40); 

        ctx.save();
        ctx.rotate(i * step);

        // Color gradient based on volume intensity
        // Hue swings between accent green (160) and blue (200) or pink (330) if AI speaking
        const hue = aiSpeaking 
          ? 320 + (percent * 40) 
          : 150 + (percent * 60);
        
        ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${0.6 + percent * 0.4})`;
        
        // Draw rounded bar emanating from center
        // Offset by radius so it starts outside the orb
        ctx.beginPath();
        ctx.roundRect(-2, radius + 5, 4, barHeight, 2); 
        ctx.fill();
        
        ctx.restore();
      }
      ctx.restore();

      animationRef.current = requestAnimationFrame(draw);
    };

    // Only start drawing animation if connected
    if (isConnected) {
      if (!animationRef.current) { 
        animationRef.current = requestAnimationFrame(draw);
      }
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isConnected, isMicOn, aiSpeaking]);


  // Toggle Mic Logic (Soft Mute)
  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    // Potentially mute the local stream to prevent echo/feedback if needed
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => (track.enabled = !isMicOn));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-500">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all"
        aria-label="Close Live Voice Chat"
      >
        <X size={24} />
      </button>

      {/* Visualizer Central Hub */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-md">
        
        {/* Orb/Visualizer Container */}
        <div className="relative w-80 h-80 flex items-center justify-center mb-8">
           {/* The Canvas Visualizer Overlay */}
           <canvas ref={canvasRef} width="320" height="320" className="absolute inset-0 z-10" aria-label="Live circular audio visualizer"></canvas>
           
           {/* Static Background Decoration if needed */}
           <div className="absolute inset-0 rounded-full border border-white/5 pointer-events-none"></div>
        </div>

        {/* Status Text */}
        <div className="flex flex-col items-center mb-8">
            <h2 className="text-2xl font-bold text-white tracking-widest mb-1">YUSRA LIVE</h2>
            <p className={clsx(`text-sm font-mono transition-colors`,
              error ? 'text-red-400' : isConnected ? (aiSpeaking ? "text-qg-pink" : (isMicOn ? "text-qg-accent" : "text-slate-400")) : "text-slate-500"
            )}>
              {error ? error : isConnected ? (aiSpeaking ? "SPEAKING..." : (isMicOn ? "LISTENING..." : "MICROPHONE OFF")) : "INITIALIZING..."}
            </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8">
           <button 
             onClick={toggleMic}
             className={clsx(`p-6 rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)]`,
               isMicOn ? 'bg-white/10 text-white hover:bg-white/20 ring-1 ring-white/20' : 'bg-red-500/20 text-red-400 ring-1 ring-red-500/40'
             )}
             aria-label={isMicOn ? "Turn microphone off" : "Turn microphone on"}
           >
             {isMicOn ? <Mic size={32} /> : <MicOff size={32} />}
           </button>
           
           <div className="relative">
              <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={clsx("p-6 rounded-full transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)]", isSettingsOpen ? "bg-qg-accent text-black" : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 ring-1 ring-white/10")}
                aria-label="Voice Settings"
              >
                  <Settings2 size={32} />
              </button>
              
              {isSettingsOpen && (
                <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-black/90 border border-white/10 rounded-xl p-4 w-64 z-50 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-2">
                  <h4 className="text-white font-semibold mb-3">Voice Settings</h4>
                  <div className="mb-4">
                    <label className="text-xs text-slate-400 block mb-1">Voice Persona</label>
                    <select 
                      value={selectedVoice} 
                      onChange={(e) => setSelectedVoice(e.target.value)}
                      className="w-full bg-white/10 border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-qg-accent/50"
                    >
                      {['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'].map(v => (
                        <option key={v} value={v} className="text-black">{v}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Speaking Rate ({playbackRate}x)</label>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="2.0" 
                      step="0.1" 
                      value={playbackRate}
                      onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                      className="w-full accent-qg-accent h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              )}
           </div>
        </div>

        {/* Transcription Display */}
        <div className="mt-12 w-full max-w-lg glass-panel p-4 rounded-xl text-center border border-white/10" aria-live="polite">
            <h4 className="flex items-center justify-center gap-2 text-slate-300 text-xs font-semibold mb-3 uppercase tracking-wider"><MessageSquare size={14} /> Live Transcript</h4>
            <div className="min-h-[80px] max-h-[200px] overflow-y-auto text-sm leading-relaxed text-left space-y-2 scrollbar-thin scrollbar-thumb-white/10 pr-2">
              {transcriptionHistory.map((line, index) => {
                const parts = line.split(':');
                const speaker = parts[0];
                const text = parts.slice(1).join(':');
                return (
                  <p key={index} className={clsx("py-0.5", speaker === 'user' ? "text-slate-400" : "text-qg-accent")}>
                    <span className="font-bold text-xs uppercase opacity-70 mr-2">{speaker}:</span> {text}
                  </p>
                );
              })}
              {currentInputTranscription && (
                <p className="text-white font-medium animate-pulse"><span className="font-bold text-xs uppercase text-slate-500 mr-2">YOU:</span> {currentInputTranscription}</p>
              )}
              {currentOutputTranscription && (
                <p className="text-qg-accent font-medium"><span className="font-bold text-xs uppercase text-qg-accent/70 mr-2">YUSRA:</span> {currentOutputTranscription}</p>
              )}
              {!currentInputTranscription && !currentOutputTranscription && transcriptionHistory.length === 0 && (
                <p className="text-slate-600 text-xs text-center italic py-4">Listening for voice input...</p>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};
