import React, { useState, useRef } from 'react';
import { Camera, Upload, Coins, Clipboard, CheckCircle, ArrowRight, Star, RefreshCw, AlertCircle, Info, Flame, Eye, Sparkles } from 'lucide-react';
import { AnalysisResult } from '../types';

interface InteractiveScannerProps {
  onAnalyzeStart?: () => void;
  onAnalyzeSuccess?: (result: AnalysisResult) => void;
}

// Preset gallery items for rapid demonstration
const PRESETS = [
  {
    id: 'polaroid',
    name: 'Vintage Polaroid',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80',
    tag: 'Classic'
  },
  {
    id: 'gameboy',
    name: 'Game Boy Color',
    image: 'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?auto=format&fit=crop&w=400&q=80',
    tag: 'Liquid Gold'
  },
  {
    id: 'silverring',
    name: 'Artisan Sterling Ring',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80',
    tag: 'Estate Find'
  },
  {
    id: 'jordans',
    name: 'Air Jordan 1 Chicago',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
    tag: 'Ultra Hype'
  }
];

export default function InteractiveScanner() {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [uploadedBase64, setUploadedBase64] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [scanning, setScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<string>('');
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isDemo, setIsDemo] = useState(true);
  const [currentPlatform, setCurrentPlatform] = useState<'ebay' | 'poshmark' | 'mercari' | 'fb'>('ebay');
  const [copied, setCopied] = useState(false);
  const [postingState, setPostingState] = useState<'idle' | 'posting' | 'success'>('idle');
  const [postProgress, setPostProgress] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Play a beautiful synthetic audio tick or beep on scanning to create tactile "WOW"
  const playSound = (freq: number, type: OscillatorType, duration: number) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // AudioContext blocked or unsupported
    }
  };

  // Trigger analysis sequence
  const startAnalysis = async (presetId: string | null, customImgBase64: string | null) => {
    if (scanning) return;
    setScanning(true);
    setResult(null);
    setPostingState('idle');
    
    // Play sci-fi power up tone
    playSound(220, 'sine', 0.2);
    setTimeout(() => playSound(440, 'sine', 0.3), 150);
    
    const steps = [
      'Initializing optical lens feedback...',
      'Isolating foreground object boundaries...',
      'Extracting physical tarnish and hallmark signatures...',
      'Matching silhouette against 42 historic marketplace indices...',
      'Calculating localized sell-through ratios...',
      'Generating high-converting SEO marketing listings...'
    ];

    // Scan animation steps
    let currentStep = 0;
    setScanStatus(steps[0]);
    setScanStep(0);
    
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setScanStatus(steps[currentStep]);
        setScanStep(currentStep);
        // Play click tick
        playSound(800 + (currentStep * 100), 'triangle', 0.05);
      } else {
        clearInterval(interval);
      }
    }, 800);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: customImgBase64,
          galleryPresetId: presetId
        })
      });

      const resData = await response.json();
      
      // Pad out the last bit of loading screen so user sees the cool telemetry finish
      setTimeout(() => {
        clearInterval(interval);
        if (resData.success) {
          setResult(resData.data);
          setIsDemo(resData.isDemo);
          // Set primary recommended platform as default selected tab
          const keys: ('ebay' | 'poshmark' | 'mercari' | 'fb')[] = ['ebay', 'poshmark', 'mercari', 'fb'];
          const recItem = keys.find(k => resData.data[`${k}ListingReady`]) || 'ebay';
          setCurrentPlatform(recItem);
          
          // Play satisfaction tone
          playSound(523.25, 'sine', 0.15); // C5
          setTimeout(() => playSound(659.25, 'sine', 0.15), 100); // E5
          setTimeout(() => playSound(783.99, 'sine', 0.3), 200);  // G5
        } else {
          setScanStatus('Analysis failed. Please verify image details and retry.');
        }
        setScanning(false);
      }, Math.max(0, 4800 - (currentStep * 800)));

    } catch (err) {
      clearInterval(interval);
      setScanStatus('Appraisal network timeout. Running in offline mode.');
      setScanning(false);
    }
  };

  const handleSelectPreset = (id: string, imgUrl: string) => {
    setSelectedPreset(id);
    setUploadedBase64(null);
    setPreviewUrl(imgUrl);
    startAnalysis(id, null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setUploadedBase64(base64);
      setPreviewUrl(base64);
      setSelectedPreset(null);
      startAnalysis(null, base64);
    };
    reader.readAsDataURL(file);
  };

  const triggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  const triggerCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.description);
    setCopied(true);
    playSound(1000, 'sine', 0.08);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerMultiPlatformPublish = () => {
    if (!result || postingState !== 'idle') return;
    setPostingState('posting');
    
    const platforms = [];
    if (result.ebayListingReady) platforms.push('eBay US');
    if (result.poshmarkListingReady) platforms.push('Poshmark');
    if (result.mercariListingReady) platforms.push('Mercari');
    if (result.fbListingReady) platforms.push('Facebook Marketplace');
    
    if (platforms.length === 0) platforms.push('eBay US', 'Mercari');

    let currentIdx = 0;
    setPostProgress(`Connecting to ${platforms[0]} API rails...`);
    playSound(400, 'square', 0.1);

    const interval = setInterval(() => {
      currentIdx++;
      if (currentIdx < platforms.length) {
        setPostProgress(`Listing active on ${platforms[currentIdx - 1]}! Uploading schema to ${platforms[currentIdx]}...`);
        playSound(440, 'triangle', 0.1);
      } else {
        clearInterval(interval);
        setPostProgress(`Successfully live on all ${platforms.length} platforms! Syncing active inventory...`);
        setPostingState('success');
        // Double success ring
        playSound(600, 'sine', 0.1);
        setTimeout(() => playSound(900, 'sine', 0.25), 100);
      }
    }, 1500);
  };

  const resetAll = () => {
    setResult(null);
    setSelectedPreset(null);
    setUploadedBase64(null);
    setPreviewUrl(null);
    setPostingState('idle');
  };

  return (
    <div id="scanner-sandbox" className="w-full bg-[#0E0E0E] border border-zinc-800/80 rounded-3xl overflow-hidden shadow-2xl relative">
      {/* Dynamic scan glow strip */}
      {scanning && (
        <div className="absolute top-0 left-0 w-full h-[6px] bg-[#D1FF00] shadow-[0_0_15px_#D1FF00] animate-pulse z-20"></div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* Left Side: Photo stage or Scanner Viewport (5 Cols) */}
        <div className="lg:col-span-5 bg-black border-r border-zinc-900/60 flex flex-col items-center justify-between p-6 relative select-none">
          
          {/* Sourcing camera aesthetics */}
          <div className="absolute top-4 left-4 flex items-center space-x-2 text-xs font-mono text-[#D1FF00]/85 tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-[#D1FF00] animate-ping"></span>
            <span>SNAP-CAM v2.4</span>
          </div>
          
          <div className="absolute top-4 right-4 text-xs font-mono text-zinc-500">
            {scanning ? 'ISO 1200' : 'STBY'}
          </div>

          <div className="w-full flex-1 flex flex-col items-center justify-center py-8">
            {!previewUrl ? (
              /* State: Empty / Waiting for Image */
              <div className="flex flex-col items-center text-center p-6 max-w-sm">
                <div className="h-20 w-20 rounded-2xl bg-[#0E0E0E] border border-zinc-800 flex items-center justify-center text-[#D1FF00] shadow-inner mb-6 relative group cursor-pointer" onClick={triggerUploadClick}>
                  <div className="absolute inset-0 bg-[#D1FF00]/5 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Camera className="w-10 h-10 group-hover:scale-110 transition-transform text-[#D1FF00]" />
                </div>
                <h3 className="text-white font-black text-lg uppercase tracking-tight leading-snug">Experience the Appraisal</h3>
                <p className="text-zinc-400 text-xs mt-2 mb-6">
                  Select a sourced treasure below, upload a photo, or snap a picture with your camera to see real-time fair market appraisals.
                </p>

                {/* Upload Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button 
                    onClick={triggerUploadClick}
                    className="flex-1 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl text-xs font-bold tracking-wide transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-[#D1FF00]" />
                    <span>Upload Image</span>
                  </button>
                  <button 
                    onClick={triggerCameraClick}
                    className="flex-1 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl text-xs font-bold tracking-wide transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-[#D1FF00]" />
                    <span>Use Camera</span>
                  </button>
                </div>

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <input 
                  type="file" 
                  ref={cameraInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  capture="environment" 
                  className="hidden" 
                />
              </div>
            ) : (
              /* State: Image Selected or Scanning */
              <div className="w-full h-full max-h-[380px] flex items-center justify-center relative rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-900">
                <img 
                  src={previewUrl} 
                  alt="Item to scan" 
                  className={`w-full h-full object-contain select-none transition-filter duration-700 ${scanning ? 'blur-[1px] brightness-75' : ''}`}
                  referrerPolicy="no-referrer"
                />

                {/* Cyber Scanner Overlay Elements */}
                {scanning && (
                  <>
                    <div className="absolute inset-0 bg-[#D1FF00]/5 pointer-events-none"></div>
                    {/* Running horizontal sweep lines */}
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-[#D1FF00] shadow-[0_0_12px_rgba(209,255,0,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                    {/* Aesthetic corners */}
                    <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#D1FF00]"></div>
                    <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#D1FF00]"></div>
                    <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#D1FF00]"></div>
                    <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#D1FF00]"></div>
                    
                    {/* Scanning Text Console Box */}
                    <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 border border-[#D1FF00]/30 rounded-xl p-3 font-mono text-[10px] text-[#D1FF00] shadow-lg text-left">
                      <div className="flex justify-between text-[9px] text-[#D1FF00]/60 pb-1.5 border-b border-[#D1FF00]/10 mb-1.5 font-bold uppercase tracking-wider">
                        <span>Analysis Diagnostics</span>
                        <span className="animate-pulse">Active ({Math.round((scanStep + 1)/6*100)}%)</span>
                      </div>
                      <div className="text-zinc-350">SYSTEM: {scanStatus}</div>
                      <div className="text-[10px] text-zinc-500 mt-1 flex gap-1">
                        <span className={scanStep >= 1 ? "text-[#D1FF00]" : ""}>● OBJ</span>
                        <span className={scanStep >= 3 ? "text-[#D1FF00]" : ""}>● META</span>
                        <span className={scanStep >= 4 ? "text-[#D1FF00]" : ""}>● PRICE</span>
                        <span className={scanStep >= 5 ? "text-[#D1FF00]" : ""}>● COPY</span>
                      </div>
                    </div>
                  </>
                )}
                
                {/* Result overlay checkbox */}
                {!scanning && result && (
                  <div className="absolute top-3 left-3 bg-[#D1FF00]/95 text-black font-black px-3 py-1 rounded-none text-[10px] uppercase tracking-wider flex items-center space-x-1 shadow-lg">
                    <CheckCircle className="w-3.5 h-3.5 fill-none stroke-[3]" />
                    <span>Appraisal Complete</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom presets chooser */}
          <div className="w-full pt-4 border-t border-zinc-900">
            <div className="text-zinc-500 text-xs font-bold tracking-wider mb-3 flex items-center justify-between">
              <span className="uppercase">CHOOSE A DEMO SOURCE ITEM</span>
              {previewUrl && (
                <button 
                  onClick={resetAll} 
                  className="text-[#D1FF00] hover:text-[#c2ed00] flex items-center space-x-1 cursor-pointer font-bold"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Camera</span>
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p.id, p.image)}
                  disabled={scanning}
                  className={`group relative rounded-xl overflow-hidden border transition-all h-20 text-left ${
                    selectedPreset === p.id 
                    ? 'border-[#D1FF00] ring-2 ring-[#D1FF00]/30 bg-zinc-900' 
                    : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                  } ${scanning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent flex flex-col justify-end p-2 md:p-2.5">
                    <span className="text-[7.5px] font-black tracking-widest uppercase text-[#D1FF00] drop-shadow-sm">{p.tag}</span>
                    <span className="text-[10px] font-bold text-white truncate max-w-full drop-shadow-md leading-none mt-0.5">{p.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Analysis Display Panels (7 Cols) */}
        <div className="lg:col-span-12 xl:col-span-7 bg-[#050505] p-6 md:p-8 flex flex-col justify-between overflow-y-auto border-t lg:border-t-0 border-zinc-900">
          {!scanning && !result ? (
            /* Blank state */
            <div className="h-full flex flex-col items-center justify-center py-12 text-center max-w-md mx-auto">
              
              {/* Appraisal interruption warning callout */}
              {scanStatus && (scanStatus.includes('failed') || scanStatus.includes('timeout')) && (
                <div className="w-full mb-6 bg-red-950/20 border border-red-500/20 rounded-2xl p-4 flex items-start space-x-3 text-red-200 animate-fade-in text-left">
                  <div className="bg-red-500/10 p-2 rounded-xl text-red-400 mt-0.5 shrink-0">
                    <Info className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] leading-relaxed">
                    <span className="font-extrabold uppercase text-red-400 block mb-0.5 tracking-wider">Appraisal Connection Note</span>
                    {scanStatus}
                    <p className="mt-1.5 text-zinc-400 leading-normal">
                      The AI provider might feel temporary high traffic load. You can click retry, or tap any of the pre-baked inventory items below to instantly preview the full appraisal dashboard experience!
                    </p>
                  </div>
                </div>
              )}

              <div className="h-16 w-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-6">
                <Sparkles className="w-8 h-8 text-[#D1FF00]" />
              </div>
              <h4 className="text-white font-black text-lg uppercase tracking-tight">AI Appraisal Workspace</h4>
              <p className="text-zinc-400 text-xs mt-2">
                Once you upload a picture or click our presets, the advanced Gemini 3.5 appraisal model executes structural valuation and writes your optimized listing copywriter templates automatically.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3 w-full max-w-xs">
                <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/80 text-left">
                  <span className="text-xs font-bold text-[#D1FF00] block mb-0.5">Step 1</span>
                  <span className="text-[11px] text-zinc-400 leading-none">Snap a thrift item</span>
                </div>
                <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/80 text-left">
                  <span className="text-xs font-bold text-[#D1FF00] block mb-0.5">Step 2</span>
                  <span className="text-[11px] text-zinc-400 leading-none">Multipost in 1-Click</span>
                </div>
              </div>
            </div>
          ) : scanning ? (
            /* Loading screen */
            <div className="h-full flex flex-col items-center justify-center py-20">
              <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 border-4 border-zinc-900 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#D1FF00] border-t-transparent rounded-full animate-spin"></div>
                <Coins className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-[#D1FF00] animate-pulse" />
              </div>
              <h4 className="text-white font-black uppercase text-base tracking-widest animate-pulse">Running Scan Diagnostics...</h4>
              <p className="text-zinc-405 text-xs mt-3 text-center max-w-sm leading-relaxed">
                Evaluating physical specifications, matching demand indexes, and formulating high-conversion postings across platforms.
              </p>
              
              <div className="w-full max-w-sm bg-zinc-900 rounded-full h-1.5 mt-8 overflow-hidden">
                <div 
                  className="bg-[#D1FF00] h-1.5 rounded-full transition-all duration-300" 
                  style={{ width: `${((scanStep + 1) / 6) * 100}%` }}
                ></div>
              </div>
            </div>
          ) : (
            /* Active Appraisal Success Content */
            <div className="space-y-6 animate-fade-in">
              
              {/* Demo Mode Notice Banner */}
              {isDemo && (
                <div className="bg-[#D1FF00]/10 border border-[#D1FF00]/25 rounded-2xl p-4 flex items-start space-x-3 text-zinc-200">
                  <Info className="w-5 h-5 shrink-0 text-[#D1FF00] mt-0.5" />
                  <div className="text-xs leading-relaxed text-left">
                    <span className="font-extrabold uppercase text-[#D1FF00] block mb-0.5 tracking-wide">SANDBOX DEMO PLATFORM ACTIVE</span>
                    This appraisal utilizes a pre-bundled simulated schema representation. For continuous real AI evaluations on your own live custom uploads, configure your <span className="font-black text-white underline">GEMINI_API_KEY</span> in Settings &gt; Secrets in the side menu.
                  </div>
                </div>
              )}

              {/* Header Box */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
                <div className="text-left">
                  <span className="text-[#D1FF00] text-[10px] font-bold uppercase tracking-widest block mb-1">Identified Item</span>
                  <h2 className="text-white text-xl md:text-2xl font-black uppercase tracking-tight">{result?.itemName}</h2>
                </div>
                
                {/* Demand Level Pill */}
                <div className="flex items-center space-x-3 self-start sm:self-center">
                  <div className={`p-4 rounded-xl flex flex-col items-center text-center shadow-lg border ${
                    result?.demandScore && result.demandScore >= 85 
                    ? 'border-[#D1FF00]/30 bg-zinc-900/60 text-[#D1FF00]' 
                    : 'border-amber-500/20 bg-amber-950/20 text-amber-400'
                  }`}>
                    <div className="flex items-center space-x-1">
                      <Flame className="w-3.5 h-3.5 fill-current text-[#D1FF00]" />
                      <span className="text-[9px] font-black uppercase tracking-widest leading-none">Demand Rating</span>
                    </div>
                    <span className="text-2xl font-black mt-1 leading-none">{result?.demandScore ? `${result.demandScore}%` : '80%'}</span>
                    <span className="text-[9px] font-bold mt-1 tracking-wide uppercase leading-none">{result?.demandStatus}</span>
                  </div>
                </div>
              </div>

              {/* Fair Market Pricing Bento Grid */}
              <div className="grid grid-cols-3 gap-3 bg-zinc-900/40 p-4 border border-zinc-800/80 rounded-2xl">
                <div className="text-center p-2">
                  <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block mb-1">Low Value</span>
                  <span className="text-white text-base md:text-lg font-bold">${result?.lowPrice}</span>
                </div>
                <div className="text-center p-2 bg-[#D1FF00]/10 rounded-xl border border-[#D1FF00]/30 shadow-inner">
                  <span className="text-[#D1FF00] text-[10px] uppercase font-black tracking-wider block mb-1">Avg Sale Price</span>
                  <span className="text-[#D1FF00] text-lg md:text-xl font-black">${result?.avgPrice}</span>
                </div>
                <div className="text-center p-2">
                  <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block mb-1">Max Value</span>
                  <span className="text-white text-base md:text-lg font-bold">${result?.highPrice}</span>
                </div>
              </div>

              {/* Demand Insights Description */}
              <p className="text-zinc-300 text-xs leading-relaxed italic bg-zinc-900/40 py-3.5 px-4 rounded-xl border-l-[3px] border-[#D1FF00] text-left">
                "{result?.demandDescription}"
              </p>

              {/* Listing Tab Section */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-white text-[10px] font-bold uppercase tracking-wider">Generated Copywrite</span>
                  <button 
                    onClick={copyToClipboard}
                    className="py-1 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 text-xs text-zinc-300 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer font-bold"
                  >
                    <Clipboard className="w-3.5 h-3.5 text-[#D1FF00]" />
                    <span>{copied ? 'Copied!' : 'Copy API Copy'}</span>
                  </button>
                </div>

                <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 relative select-text">
                  <p className="text-zinc-200 text-xs leading-relaxed whitespace-pre-line text-left">
                    {result?.description}
                  </p>
                  
                  {/* Digitalized Hashtags */}
                  <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-zinc-850">
                    {result?.hashtags.map((h, i) => (
                      <span key={i} className="text-[10px] font-mono font-bold text-[#D1FF00] bg-zinc-950 py-1 px-2.5 rounded-md">
                        #{h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Multiplatform One-Click Posting Staging Board */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center justify-between pb-1 border-b border-zinc-900">
                  <span className="text-white text-[10px] font-bold uppercase tracking-widest">Multi-Platform Listing Board</span>
                  <span className="text-zinc-500 text-[9px] font-mono">Select client view config</span>
                </div>

                {/* Staging Tabs */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'ebay', name: 'eBay US', active: result?.ebayListingReady },
                    { id: 'poshmark', name: 'Poshmark', active: result?.poshmarkListingReady },
                    { id: 'mercari', name: 'Mercari', active: result?.mercariListingReady },
                    { id: 'fb', name: 'FB Marketplace', active: result?.fbListingReady },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setCurrentPlatform(tab.id as any)}
                      className={`py-2 px-1 md:px-2 rounded-xl text-xs font-bold tracking-wide border transition-all truncate flex flex-col items-center justify-center space-y-1.5 select-none pointer-events-auto cursor-pointer ${
                        currentPlatform === tab.id
                        ? 'bg-[#D1FF00] border-[#D1FF00] text-black shadow-lg shadow-[#D1FF00]/10'
                        : tab.active
                          ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-white'
                          : 'bg-zinc-950 border-zinc-900 text-zinc-650 hover:text-zinc-500'
                      }`}
                    >
                      <span className="font-extrabold uppercase text-[10px] tracking-tight">{tab.name}</span>
                      <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded ${
                        currentPlatform === tab.id
                        ? 'bg-black text-[#D1FF00] font-extrabold'
                        : tab.active
                          ? 'bg-[#D1FF00]/10 text-[#D1FF00]'
                          : 'bg-zinc-900 text-zinc-700'
                      }`}>
                        {tab.active ? 'Ready' : 'Not Opt'}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Live Preview details dynamically showing configured layouts */}
                <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-4 text-xs space-y-3 text-left">
                  <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase tracking-widest pb-2 border-b border-zinc-905">
                    <span>Listing Channel Render Engine</span>
                    <span className="text-[#D1FF00] font-bold">API Mode Secured</span>
                  </div>

                  {currentPlatform === 'ebay' && (
                    <div className="space-y-1.5">
                      <div><strong className="text-zinc-400 font-medium">Auto-Condition:</strong> <span className="text-white font-semibold">Preowned (Graded Good)</span></div>
                      <div><strong className="text-zinc-400 font-medium">Pricing:</strong> <span className="text-white font-semibold">Buy It Now: ${result?.avgPrice} | Allow Offers: True</span></div>
                      <div><strong className="text-zinc-400 font-medium">Shipping Template:</strong> <span className="text-[#D1FF00] font-bold">USPS Ground Advantage (Weight calculated automatically)</span></div>
                    </div>
                  )}
                  {currentPlatform === 'poshmark' && (
                    <div className="space-y-1.5">
                      <div><strong className="text-zinc-400 font-medium font-bold">Category:</strong> <span className="text-white font-semibold">Collectibles & Accessories</span></div>
                      <div><strong className="text-zinc-400 font-medium">Listing Model:</strong> <span className="text-white font-semibold">Buy Mode Pricing Set at max expected margin of ${result?.highPrice}</span></div>
                      <div><strong className="text-zinc-400 font-medium">Buyer Shipping Charge:</strong> <span className="text-white font-semibold">Flat rate $7.97 paid by customer</span></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
