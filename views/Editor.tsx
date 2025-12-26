
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { STYLES } from '../constants';
import { User, Asset, Folder } from '../types';
import { GoogleGenAI } from "@google/genai";

interface EditorProps {
  user: User | null;
  onGenerate: () => void;
  onUpgrade: () => void;
}

interface HistoryState {
  assets: Asset[];
  folders: Folder[];
  selectedStyle: string;
  intensity: number;
}

const Editor: React.FC<EditorProps> = ({ user, onGenerate, onUpgrade }) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'ai'>('edit');
  
  // Persisted States
  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem('pablo_assets');
    return saved ? JSON.parse(saved) : [
      { id: '1', url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', name: 'Main_Shot_01.mp4', duration: '0:14', status: 'ready', type: 'video' },
      { id: '2', url: 'https://picsum.photos/300/200?random=2', name: 'Scene_B_05.jpg', duration: 'IMG', status: 'ready', type: 'image' }
    ];
  });
  
  const [folders, setFolders] = useState<Folder[]>(() => {
    const saved = localStorage.getItem('pablo_folders');
    return saved ? JSON.parse(saved) : [{ id: 'default', name: 'Project Media' }];
  });

  const [selectedStyle, setSelectedStyle] = useState(() => localStorage.getItem('pablo_style') || STYLES[0].id);
  const [intensity, setIntensity] = useState(() => Number(localStorage.getItem('pablo_intensity')) || 75);

  // Undo/Redo History
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // AI State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model'; text: string; sources?: any[] }[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [thinkingMode, setThinkingMode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Persistence Sync
  useEffect(() => {
    localStorage.setItem('pablo_assets', JSON.stringify(assets));
    localStorage.setItem('pablo_folders', JSON.stringify(folders));
    localStorage.setItem('pablo_style', selectedStyle);
    localStorage.setItem('pablo_intensity', intensity.toString());
  }, [assets, folders, selectedStyle, intensity]);

  // History Recording
  const commitToHistory = (newState: Partial<HistoryState>) => {
    const fullState: HistoryState = {
      assets: newState.assets ?? assets,
      folders: newState.folders ?? folders,
      selectedStyle: newState.selectedStyle ?? selectedStyle,
      intensity: newState.intensity ?? intensity,
    };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(fullState);
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setAssets(prevState.assets);
      setFolders(prevState.folders);
      setSelectedStyle(prevState.selectedStyle);
      setIntensity(prevState.intensity);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setAssets(nextState.assets);
      setFolders(nextState.folders);
      setSelectedStyle(nextState.selectedStyle);
      setIntensity(nextState.intensity);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Asset Actions
  const deleteAsset = (id: string) => {
    const newAssets = assets.filter(a => a.id !== id);
    setAssets(newAssets);
    commitToHistory({ assets: newAssets });
  };

  const renameAsset = (id: string) => {
    const name = prompt("Enter new name:");
    if (name) {
      const newAssets = assets.map(a => a.id === id ? { ...a, name } : a);
      setAssets(newAssets);
      commitToHistory({ assets: newAssets });
    }
  };

  const createFolder = () => {
    const name = prompt("Folder name:");
    if (name) {
      const newFolders = [...folders, { id: Date.now().toString(), name }];
      setFolders(newFolders);
      commitToHistory({ folders: newFolders });
    }
  };

  const moveAsset = (assetId: string, folderId: string) => {
    const newAssets = assets.map(a => a.id === assetId ? { ...a, folderId } : a);
    setAssets(newAssets);
    commitToHistory({ assets: newAssets });
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newAssets: Asset[] = Array.from(files).map((file, index) => ({
      id: Date.now().toString() + index,
      url: URL.createObjectURL(file),
      name: file.name,
      duration: file.type.startsWith('video') ? '--:--' : 'IMG',
      status: 'ready',
      type: file.type.startsWith('video') ? 'video' : 'image',
      folderId: 'default'
    }));
    const updatedAssets = [...newAssets, ...assets];
    setAssets(updatedAssets);
    commitToHistory({ assets: updatedAssets });
  };

  // Preview Filter Calculation
  const previewFilter = useMemo(() => {
    const opacity = intensity / 100;
    switch (selectedStyle) {
      case 'cyberpunk': return `hue-rotate(${intensity}deg) saturate(${1 + opacity}) contrast(${1 + opacity * 0.5})`;
      case 'oil-painting': return `sepia(${opacity * 0.5}) saturate(${1 + opacity}) blur(${opacity * 2}px)`;
      case 'anime': return `brightness(${1 + opacity * 0.2}) saturate(${1 + opacity * 0.8})`;
      case 'claymation': return `contrast(${1 + opacity}) grayscale(${opacity * 0.2})`;
      default: return 'none';
    }
  }, [selectedStyle, intensity]);

  // AI Functions
  const callGeminiChat = async () => {
    if (!user?.isPremium && user?.role !== 'OWNER') return;
    if (!chatInput.trim()) return;
    const newMessage = { role: 'user' as const, text: chatInput };
    setChatMessages(prev => [...prev, newMessage]);
    setChatInput('');
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const modelName = thinkingMode ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
      const config: any = { tools: [{ googleSearch: {} }] };
      if (thinkingMode) config.thinkingConfig = { thinkingBudget: 32768 };
      const response = await ai.models.generateContent({ model: modelName, contents: chatInput, config });
      setChatMessages(prev => [...prev, { role: 'model', text: response.text || "No response.", sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'model', text: "Error connecting to Gemini." }]);
    } finally { setIsAiLoading(false); }
  };

  // Fix: Added startTranscription function to handle voice-to-text input using the Live API
  const startTranscription = async () => {
    if (isTranscribing) {
      setIsTranscribing(false);
      return;
    }

    setIsTranscribing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 16000});
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              
              const bytes = new Uint8Array(int16.buffer);
              let binary = '';
              for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              const base64Data = btoa(binary);

              sessionPromise.then((session) => {
                session.sendRealtimeInput({ 
                  media: { data: base64Data, mimeType: 'audio/pcm;rate=16000' } 
                });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message) => {
            if (message.serverContent?.inputTranscription) {
              setChatInput(prev => prev + message.serverContent!.inputTranscription!.text);
            }
          },
          onerror: () => setIsTranscribing(false),
          onclose: () => setIsTranscribing(false)
        },
        config: {
          responseModalities: ['AUDIO' as any],
          inputAudioTranscription: {},
        }
      });
    } catch (e) {
      console.error(e);
      setIsTranscribing(false);
    }
  };

  // Added generateImage function for AI image generation via gemini-3-pro-image-preview
  const generateImage = async () => {
    if (!user?.isPremium && user?.role !== 'OWNER') return;
    if (!imagePrompt.trim()) return;
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: imagePrompt }] },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
            imageSize: imageSize as any
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          const newAsset: Asset = {
            id: Date.now().toString(),
            url: `data:${part.inlineData.mimeType};base64,${base64Data}`,
            name: `AI_Gen_${Date.now()}.png`,
            duration: 'IMG',
            status: 'ai-generated',
            type: 'image',
            folderId: 'default'
          };
          const updatedAssets = [newAsset, ...assets];
          setAssets(updatedAssets);
          commitToHistory({ assets: updatedAssets });
        }
      }
    } catch (e) {
      console.error("Image generation error:", e);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <header className="h-16 border-b border-white/5 px-6 flex items-center justify-between bg-[#141118] shrink-0 z-50">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <h2 className="text-sm font-bold leading-none">Studio: {user?.name}</h2>
            <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">{user?.isPremium ? 'Premium Active' : 'Free Tier'}</span>
          </div>
          <div className="h-8 w-px bg-white/5 mx-2"></div>
          <div className="flex gap-2">
            <button onClick={undo} disabled={historyIndex <= 0} className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 disabled:opacity-30 transition-all">
              <span className="material-symbols-outlined text-sm">undo</span>
            </button>
            <button onClick={redo} disabled={historyIndex >= history.length - 1} className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 disabled:opacity-30 transition-all">
              <span className="material-symbols-outlined text-sm">redo</span>
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex bg-black/20 p-1 rounded-lg border border-white/5">
             <button onClick={() => setActiveTab('edit')} className={`px-4 py-1 rounded text-xs font-bold transition-all ${activeTab === 'edit' ? 'bg-primary text-white shadow-lg' : 'text-gray-500'}`}>EDITOR</button>
             <button onClick={() => setActiveTab('ai')} className={`px-4 py-1 rounded text-xs font-bold transition-all ${activeTab === 'ai' ? 'bg-primary text-white shadow-lg' : 'text-gray-500'}`}>AI HUB</button>
           </div>
           <button onClick={onGenerate} className="h-9 px-6 rounded-lg bg-primary hover:bg-[#7a25d0] text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-2">
             Render Project
             <span className="material-symbols-outlined text-sm">magic_button</span>
           </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <aside className="w-80 border-r border-white/5 bg-[#1a1420] flex flex-col shrink-0">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Media Explorer</h3>
            <div className="flex gap-2">
              <button onClick={createFolder} className="material-symbols-outlined text-gray-500 hover:text-white text-lg">create_new_folder</button>
              <button onClick={() => fileInputRef.current?.click()} className="material-symbols-outlined text-gray-500 hover:text-white text-lg">add_box</button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
            <input type="file" multiple className="hidden" ref={fileInputRef} onChange={(e) => handleFiles(e.target.files)} />
            
            {folders.map(folder => (
              <div key={folder.id} className="space-y-3">
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="material-symbols-outlined text-sm">folder_open</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">{folder.name}</span>
                  </div>
                  <span className="text-[8px] text-gray-700 font-bold">{assets.filter(a => a.folderId === folder.id || (folder.id === 'default' && !a.folderId)).length} items</span>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {assets.filter(a => a.folderId === folder.id || (folder.id === 'default' && !a.folderId)).map(asset => (
                    <AssetItem 
                      key={asset.id} 
                      asset={asset} 
                      onDelete={deleteAsset} 
                      onRename={renameAsset} 
                      folders={folders} 
                      onMove={moveAsset} 
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col bg-[#111] overflow-hidden">
          {activeTab === 'edit' ? (
            <div className="flex-1 flex flex-col p-6 overflow-hidden">
               <div className="flex-1 bg-black rounded-3xl border border-white/5 relative overflow-hidden flex items-center justify-center shadow-2xl">
                 <div className="absolute inset-0 bg-cover bg-center opacity-50 blur-xl scale-110" style={{backgroundImage: `url('https://picsum.photos/1200/800?random=4')`}}></div>
                 <div className="relative z-10 w-full h-full flex items-center justify-center p-8">
                    <div className="relative group overflow-hidden rounded-2xl border border-white/10 shadow-3xl bg-black max-w-4xl w-full aspect-video">
                       <img 
                          src="https://picsum.photos/1200/800?random=4" 
                          className="w-full h-full object-cover transition-all duration-500" 
                          style={{ filter: previewFilter }}
                       />
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                          <button className="size-20 rounded-full bg-primary/80 backdrop-blur-md flex items-center justify-center border border-white/20 hover:scale-105 transition-transform shadow-2xl">
                            <span className="material-symbols-outlined text-white text-5xl ml-1 filled-icon">play_arrow</span>
                          </button>
                       </div>
                       <div className="absolute bottom-4 left-4 right-4 h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-1/3"></div>
                       </div>
                    </div>
                 </div>
               </div>
               
               <div className="h-40 mt-6 bg-[#1a1420] rounded-2xl border border-white/5 p-6 flex flex-col shadow-inner">
                  <div className="flex items-center justify-between text-[10px] text-gray-500 border-b border-white/5 pb-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-sm">videocam</span> 
                      <span className="font-black uppercase tracking-widest">Master Production Timeline</span>
                    </div>
                    <div className="flex gap-4">
                      <span>00:00:14:12</span>
                      <span className="text-primary font-bold">4K 60FPS</span>
                    </div>
                  </div>
                  <div className="flex-1 bg-black/40 border border-white/5 rounded-xl relative overflow-hidden">
                    <div className="absolute left-[15%] top-2 bottom-2 w-[40%] bg-primary/20 border border-primary/40 rounded-lg flex items-center px-4 overflow-hidden">
                        <div className="flex gap-0.5 opacity-20 mr-4">
                          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="w-1 h-8 bg-white"></div>)}
                        </div>
                        <span className="text-[10px] font-black text-primary/80 uppercase tracking-tighter truncate">Main_Cinema_Sequence_v2.mp4</span>
                    </div>
                    <div className="absolute left-[15%] top-0 bottom-0 w-px bg-white/20 z-10"></div>
                  </div>
               </div>
            </div>
          ) : (
            <div className="flex-1 flex p-6 gap-6 overflow-hidden">
              <div className="flex-1 flex flex-col gap-6">
                {!user?.isPremium && (
                  <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-10 text-center">
                    <div className="size-20 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 mb-6">
                      <span className="material-symbols-outlined text-4xl filled-icon">diamond</span>
                    </div>
                    <h2 className="text-3xl font-black mb-4">Premium AI Toolkit</h2>
                    <p className="text-gray-400 max-w-md mb-8">Unlock the power of Gemini 3 Pro for advanced image generation and intelligent chat assistants.</p>
                    <button onClick={onUpgrade} className="px-8 py-4 rounded-2xl bg-primary hover:bg-[#7a25d0] font-black shadow-xl shadow-primary/30 transition-all flex items-center gap-2">
                      Upgrade to Premium Now
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </div>
                )}
                
                <div className="flex-1 bg-[#1a1420] rounded-3xl border border-white/5 flex flex-col overflow-hidden shadow-2xl">
                  <div className="p-5 border-b border-white/5 flex justify-between items-center bg-black/20">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">psychology</span>
                      <span className="text-xs font-bold uppercase tracking-widest">Gemini Creator Assistant</span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className={`text-[10px] font-black tracking-widest ${thinkingMode ? 'text-primary' : 'text-gray-600'}`}>DEEP THINKING</span>
                      <div onClick={() => setThinkingMode(!thinkingMode)} className={`w-8 h-4 rounded-full border transition-all relative ${thinkingMode ? 'bg-primary border-primary' : 'bg-white/5 border-white/10'}`}>
                        <div className={`absolute top-0.5 size-2.5 rounded-full bg-white transition-all ${thinkingMode ? 'right-0.5' : 'left-0.5'}`}></div>
                      </div>
                    </label>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-5 rounded-3xl text-sm ${msg.role === 'user' ? 'bg-primary/20 border border-primary/30' : 'bg-white/5 border border-white/5'}`}>
                          <p className="leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
                          {msg.sources && (
                            <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                              {msg.sources.map((s: any, idx: number) => (
                                <a key={idx} href={s.web?.uri || s.maps?.uri} target="_blank" className="text-[9px] bg-white/5 px-2 py-1 rounded text-primary hover:bg-white/10 transition-colors">
                                  {s.web?.title || s.maps?.title || 'Grounding Source'}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {isAiLoading && <div className="flex justify-start"><div className="bg-white/5 border border-white/5 p-4 rounded-2xl animate-pulse"><div className="flex gap-2"><div className="size-2 rounded-full bg-primary"></div><div className="size-2 rounded-full bg-primary"></div><div className="size-2 rounded-full bg-primary"></div></div></div></div>}
                    <div ref={chatEndRef}></div>
                  </div>

                  <div className="p-4 border-t border-white/5 flex gap-3">
                    <button onClick={startTranscription} className={`size-12 rounded-2xl border flex items-center justify-center transition-all ${isTranscribing ? 'bg-red-500 border-red-500 text-white animate-pulse' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}>
                      <span className="material-symbols-outlined">mic</span>
                    </button>
                    <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && callGeminiChat()} placeholder="Command the AI assistant..." className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 text-sm outline-none focus:ring-2 focus:ring-primary/50" />
                    <button onClick={callGeminiChat} className="size-12 rounded-2xl bg-primary hover:bg-[#7a25d0] flex items-center justify-center shadow-lg shadow-primary/20"><span className="material-symbols-outlined">send</span></button>
                  </div>
                </div>
              </div>

              <div className="w-80 flex flex-col gap-6">
                 <div className="bg-[#1a1420] rounded-3xl border border-white/5 p-6 space-y-6 shadow-xl">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                      <span className="material-symbols-outlined text-yellow-500 filled-icon">magic_button</span>
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Generative Lab</h3>
                    </div>
                    <textarea value={imagePrompt} onChange={(e) => setImagePrompt(e.target.value)} placeholder="Describe your vision..." className="w-full h-28 bg-black/40 border border-white/10 rounded-2xl p-4 text-xs outline-none focus:ring-2 focus:ring-primary/50 resize-none font-medium" />
                    <div className="grid grid-cols-2 gap-3">
                       <select value={imageSize} onChange={(e: any) => setImageSize(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] outline-none font-bold uppercase tracking-widest">{['1K', '2K', '4K'].map(s => <option key={s} value={s}>{s} Resolution</option>)}</select>
                       <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] outline-none font-bold uppercase tracking-widest">{['1:1', '16:9', '9:16', '3:4', '4:3'].map(r => <option key={r} value={r}>{r} Aspect</option>)}</select>
                    </div>
                    <button onClick={generateImage} className="w-full h-12 bg-primary hover:bg-[#7a25d0] rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/30">
                      Forge Content
                    </button>
                 </div>
              </div>
            </div>
          )}
        </main>

        {/* Properties Sidebar (Edit mode only) */}
        {activeTab === 'edit' && (
          <aside className="w-80 border-l border-white/5 bg-[#1a1420] flex flex-col shrink-0 overflow-y-auto">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Configuration</h3>
            </div>
            
            <div className="p-8 flex flex-col gap-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Intensity Control</label>
                  <span className="text-xs text-primary font-black px-2 py-1 bg-primary/10 rounded-lg">{intensity}%</span>
                </div>
                <div className="relative pt-2">
                  <input 
                    type="range" 
                    value={intensity} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setIntensity(val);
                      commitToHistory({ intensity: val });
                    }} 
                    className="w-full accent-primary h-1.5 bg-black/40 rounded-full appearance-none cursor-pointer outline-none" 
                  />
                  <div className="flex justify-between mt-3 text-[8px] font-black text-gray-700 uppercase tracking-widest">
                    <span>Subtle</span>
                    <span>Midway</span>
                    <span>Maximal</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Atmospheric Style</label>
                <div className="grid grid-cols-2 gap-4">
                  {STYLES.map(style => (
                    <div 
                      key={style.id} 
                      onClick={() => {
                        setSelectedStyle(style.id);
                        commitToHistory({ selectedStyle: style.id });
                      }} 
                      className={`cursor-pointer group rounded-2xl overflow-hidden border-2 transition-all p-1 ${selectedStyle === style.id ? 'border-primary bg-primary/10 shadow-lg' : 'border-transparent bg-white/5 hover:bg-white/10'}`}
                    >
                      <div className="aspect-square rounded-xl bg-cover bg-center overflow-hidden mb-2 relative">
                         <img src={style.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                         {selectedStyle === style.id && <div className="absolute inset-0 bg-primary/20 flex items-center justify-center"><span className="material-symbols-outlined text-white">check_circle</span></div>}
                      </div>
                      <div className="px-2 pb-1">
                        <p className="text-[9px] font-black uppercase tracking-tighter truncate text-center">{style.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-8 border-t border-white/5">
                {[
                  { id: 'denoise', label: 'Adaptive Denoising', icon: 'graphic_eq', active: true },
                  { id: 'upscale', label: 'Ultra Res Upscaling', icon: '4k', active: false }
                ].map(opt => (
                  <div key={opt.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <span className={`material-symbols-outlined text-xl ${opt.active ? 'text-primary' : 'text-gray-500'}`}>{opt.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">{opt.label}</span>
                    </div>
                    <div className={`w-9 h-5 rounded-full relative transition-all ${opt.active ? 'bg-primary' : 'bg-white/10'}`}>
                       <div className={`absolute top-1 size-3 bg-white rounded-full transition-all ${opt.active ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-auto p-8 border-t border-white/5">
               <button onClick={() => commitToHistory({ intensity: 75, selectedStyle: STYLES[0].id })} className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all">
                 <span className="material-symbols-outlined text-sm">restart_alt</span>
                 Purge Overrides
               </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

interface AssetItemProps {
  asset: Asset;
  onDelete: (id: string) => void;
  onRename: (id: string) => void;
  onMove: (assetId: string, folderId: string) => void;
  folders: Folder[];
}

const AssetItem: React.FC<AssetItemProps> = ({ asset, onDelete, onRename, folders, onMove }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (asset.type === 'video' && videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered, asset.type]);

  return (
    <div 
      className="relative group rounded-2xl bg-black/40 border border-white/5 overflow-hidden transition-all hover:border-primary/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setShowOptions(false); }}
    >
      <div className="aspect-video relative overflow-hidden bg-gray-900">
        {asset.type === 'video' ? (
          <video 
            ref={videoRef}
            src={asset.url} 
            muted 
            loop 
            className={`w-full h-full object-cover transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-60'}`}
          />
        ) : (
          <img 
            src={asset.url} 
            alt={asset.name} 
            className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-110' : 'opacity-60'}`} 
          />
        )}
        
        {/* Larger Preview Overlay */}
        {isHovered && asset.type === 'image' && (
           <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-2 z-50 pointer-events-none animate-in fade-in duration-300">
             <img src={asset.url} className="w-full h-full object-contain rounded-lg" />
           </div>
        )}

        <div className="absolute top-2 left-2 flex gap-1">
          <span className="px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[8px] font-black uppercase text-white/80">{asset.duration}</span>
        </div>
        
        {/* Playback Indicator */}
        {asset.type === 'video' && isHovered && (
          <div className="absolute bottom-2 left-2 flex items-center gap-2">
             <div className="size-1.5 rounded-full bg-red-500 animate-pulse"></div>
             <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">Live Preview</span>
          </div>
        )}
      </div>

      <div className="p-3 flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-gray-300 truncate leading-none mb-1">{asset.name}</p>
          <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">{asset.status}</p>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="size-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-sm">more_vert</span>
          </button>
          
          {showOptions && (
            <div className="absolute right-0 bottom-full mb-2 w-40 bg-[#1a1420] border border-white/10 rounded-xl shadow-2xl p-1.5 z-50 animate-in slide-in-from-bottom-2">
              <button onClick={() => onRename(asset.id)} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 text-[10px] font-bold text-gray-300">
                <span className="material-symbols-outlined text-sm">edit</span> Rename
              </button>
              <div className="h-px bg-white/5 my-1"></div>
              <p className="px-2 py-1 text-[8px] font-black text-gray-600 uppercase tracking-widest">Move to</p>
              {folders.map(f => (
                <button key={f.id} onClick={() => { onMove(asset.id, f.id); setShowOptions(false); }} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 text-[10px] font-bold text-gray-400">
                   <span className="material-symbols-outlined text-sm">drive_file_move</span> {f.name}
                </button>
              ))}
              <div className="h-px bg-white/5 my-1"></div>
              <button onClick={() => onDelete(asset.id)} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-red-500/10 text-[10px] font-bold text-red-400">
                <span className="material-symbols-outlined text-sm">delete</span> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;
