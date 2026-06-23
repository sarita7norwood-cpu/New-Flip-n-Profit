import React, { useState } from 'react';
import { Sparkles, DollarSign, Flame, ArrowRight, Search, Compass, HelpCircle, TrendingUp, Coins, ChevronDown, ShieldCheck, Layers, Smartphone, SmartphoneNfc, AppWindow, Gift, Heart, ArrowUp, Send, Terminal, X, Activity } from 'lucide-react';
import InteractiveScanner from './components/InteractiveScanner';
import FlipperProfitCalculator from './components/FlipperProfitCalculator';
import BlogHub from './components/BlogHub';
import LiveFeed from './components/LiveFeed';

export default function App() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Google Cloud Run Trigger status
  const [triggerModalOpen, setTriggerModalOpen] = useState(false);
  const [triggerLoading, setTriggerLoading] = useState(false);
  const [triggerResult, setTriggerResult] = useState<any>(null);
  const [triggerError, setTriggerError] = useState<string | null>(null);

  const handleTriggerRunService = async () => {
    setTriggerLoading(true);
    setTriggerError(null);
    setTriggerResult(null);
    playNavChime();
    try {
      const response = await fetch('/api/trigger-run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setTriggerResult(data);
      } else {
        setTriggerError(data.error || `HTTP ${response.status}: ${data.statusText || 'Execution failed'}`);
        if (data) {
          setTriggerResult(data);
        }
      }
    } catch (err: any) {
      setTriggerError(err?.message || 'Network connectivity error fetching api/trigger-run');
    } finally {
      setTriggerLoading(false);
    }
  };

  // Sound generator for clicks
  const playNavChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.012, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {}
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
    playNavChime();
  };

  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      playNavChime();
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-between selection:bg-[#D1FF00] selection:text-black font-sans overflow-x-hidden antialiased relative">
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#D1FF00] rounded-full blur-[160px] opacity-15 pointer-events-none"></div>
      
      {/* 1. Header Navigation */}
      <header className="sticky top-0 bg-[#0A0A0A]/85 backdrop-blur-md border-b border-zinc-900 z-40 px-6 md:px-12 py-6 flex items-center justify-between">
        {/* Brand logo in Artistic style */}
        <div className="flex items-center space-x-2.5 group cursor-pointer" onClick={() => handleNavClick('hero-section')}>
          <div className="text-2xl font-black tracking-tighter italic text-white">FLIP N <span className="text-[#D1FF00]">PROFIT.</span></div>
          <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase font-black border border-zinc-900 px-1.5 py-0.5 rounded">AI</span>
        </div>

        {/* Desktop Menu links in Artistic text properties */}
        <nav className="hidden md:flex items-center space-x-8 text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-400">
          <button onClick={() => handleNavClick('scanner-sandbox')} className="hover:text-[#D1FF00] transition-all cursor-pointer">Live Scanner</button>
          <button onClick={() => handleNavClick('calculator-section')} className="hover:text-[#D1FF00] transition-all cursor-pointer">Fee Calculator</button>
          <button onClick={() => handleNavClick('blog-hub')} className="hover:text-[#D1FF00] transition-all cursor-pointer">Thrift University</button>
          <button onClick={() => handleNavClick('faq-section')} className="hover:text-[#D1FF00] transition-all cursor-pointer">FAQ</button>
        </nav>

        {/* CTA Launch Boxes & Service Trigger Buttons */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => {
              setTriggerModalOpen(true);
              playNavChime();
            }}
            className="flex items-center space-x-1 border border-[#D1FF00] bg-[#D1FF00]/5 hover:bg-[#D1FF00] hover:text-black text-[#D1FF00] px-4.5 py-2 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer rounded"
          >
            <Activity className="w-3 h-3 animate-pulse" />
            <span>Developer Run</span>
          </button>

          <button 
            onClick={() => handleNavClick('scanner-sandbox')}
            className="hidden sm:block border border-white/60 hover:border-[#D1FF00] hover:bg-[#D1FF00] hover:text-black text-white px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
          >
            <span>Try Sourcing API</span>
          </button>
        </div>
      </header>

      {/* Main Core Elements */}
      <main className="flex-1 space-y-24 pb-20">
        
        {/* 2. Brand Hero Section */}
        <section id="hero-section" className="relative px-6 pt-16 md:pt-24 pb-8 max-w-7xl mx-auto text-center space-y-8">
          
          {/* Glowing artistic light spots */}
          <div className="absolute top-1/4 left-1/4 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#D1FF00]/5 blur-[100px] pointer-events-none -z-10 animate-pulse"></div>

          {/* Social validation bubble matching neon styling */}
          <div className="inline-flex items-center space-x-2 bg-zinc-900/60 border border-zinc-800/80 rounded-full px-4.5 py-2 text-xs text-[#D1FF00] font-bold shadow-inner leading-none mx-auto scale-95 md:scale-100">
            <Flame className="w-3.5 h-3.5 fill-current text-[#D1FF00] animate-bounce" />
            <span className="tracking-wide">THE #1 HIGH-FIDELITY TOOLKIT FOR FLIPPERS</span>
          </div>

          {/* Typography headers */}
          <div className="max-w-3xl mx-auto space-y-5">
            <div className="relative inline-block">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-[#D1FF00] font-black text-8xl opacity-5 leading-none select-none">FLIPNPROFIT</div>
              <h1 className="text-4xl md:text-[85px] font-black text-white tracking-tighter leading-[0.9] text-center uppercase">
                Turn Thrift Junk into <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D1FF00] via-[#D1FF00] to-white">
                  Marketplace Gold.
                </span>
              </h1>
            </div>
            <p className="text-zinc-400 text-sm md:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
              Snap a photo of any item while sourcing. Flip n Profit instantly estimates real-time market value, gauges reseller velocity demand, writes optimized professional sales copies, and lists across 4 platforms with 1 click.
            </p>
          </div>

          {/* Action elements */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto pt-2">
            <button 
              onClick={() => handleNavClick('scanner-sandbox')}
              className="w-full sm:w-auto bg-[#D1FF00] text-black font-black py-5 px-10 text-xs uppercase tracking-wider hover:scale-105 transition-all shadow-[0_0_40px_rgba(209,255,0,0.25)] flex justify-center items-center space-x-2 cursor-pointer"
            >
              <span>Start Scanning Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleNavClick('calculator-section')}
              className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-black py-5 px-10 text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              <span>Profit cost calculator</span>
            </button>
          </div>

          {/* Real-time platform KPI metrics panel */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10">
            {[
              { label: 'Time Saved Listing', val: '4 Seconds', desc: 'Down from 15 minutes' },
              { label: 'Average Multiplier', val: '4.2x ROI', desc: 'Calculated sourcing averages' },
              { label: 'Marketplaces Live', val: '4 Supported', desc: 'eBay, Poshmark, Mercari, FB' },
              { label: 'Active Flipper Scans', val: '+450,000', desc: 'Real-time database records' }
            ].map((k) => (
              <div key={k.label} className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-5 text-left transition-all hover:border-[#D1FF00]/40">
                <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">{k.label}</span>
                <span className="text-white text-xl md:text-2xl font-black block mt-1 tracking-tight">{k.val}</span>
                <span className="text-zinc-400 text-[9.5px] mt-1 block font-mono">{k.desc}</span>
              </div>
            ))}
          </div>

        </section>

        {/* 3. The Interactive Holographic Scanner (Anchor View) */}
        <section className="px-6 md:px-12 max-w-7xl mx-auto space-y-6">
          <div className="flex items-center space-x-3 pb-3 border-b border-zinc-900">
            <span className="text-[#D1FF00] font-mono font-bold text-sm">01 /</span>
            <h2 className="text-white text-xs font-black uppercase tracking-[0.2em] text-zinc-405">Interactive Appraisal Sandbox</h2>
          </div>
          <InteractiveScanner />
        </section>

        {/* 4. Live Global Activity Feed & Arbitrage Bento */}
        <section className="px-6 md:px-12 max-w-7xl mx-auto space-y-6">
          <div className="flex items-center space-x-3 pb-3 border-b border-zinc-900">
            <span className="text-[#D1FF00] font-mono font-bold text-sm">02 /</span>
            <h2 className="text-white text-xs font-black uppercase tracking-[0.2em] text-zinc-405">Platform Arbitrage Multi-Feeds</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Live rolling feed (7 cols) */}
            <div className="lg:col-span-12 xl:col-span-7">
              <LiveFeed />
            </div>

            {/* Platform Strategy Arbitrage board (5 cols) */}
            <div className="lg:col-span-12 xl:col-span-5 bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 shadow-xl flex flex-col justify-between text-left">
              <div className="space-y-4">
                <div className="flex items-center space-x-2.5">
                  <Layers className="w-5 h-5 text-[#D1FF00]" />
                  <h3 className="text-white text-sm font-black tracking-tight uppercase">Why Multiposting Wins 80% More Sales</h3>
                </div>
                
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Different buyers search different ecosystems. A collectible analog camera will sit for months locally inside FB Marketplace but prompt a fierce bidding war on eBay within 4 hours. By listing on all 4 platform engines simultaneously, you maximize search liquidity instantly.
                </p>

                <div className="space-y-4 pt-2">
                  {[
                    { head: 'eBay US Integration', body: 'Best for specific vintage collectibles, niche electronics, rare board games.' },
                    { head: 'Poshmark Closet Sync', body: 'Best for designer shoes, outerwear, luxury handbags, premium accessories.' },
                    { head: 'Mercari Instant Lists', body: 'Best for lightweight retro plastic toys, video games, nostalgic items.' },
                    { head: 'Facebook Local Circles', body: 'Best for fragile antiques, heavy items, quick same-day local cash pickups.' }
                  ].map((p, index) => (
                    <div key={index} className="flex items-start space-x-3 bg-zinc-950 p-3.5 rounded-xl border border-zinc-900 hover:border-[#D1FF00]/30 transition-colors">
                      <ShieldCheck className="w-4.5 h-4.5 text-[#D1FF00] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white font-black text-xs block leading-tight tracking-wide">{p.head}</span>
                        <span className="text-[11px] text-zinc-400 mt-0.5 block">{p.body}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Cost & Profit Compare Calculator */}
        <section className="px-6 md:px-12 max-w-7xl mx-auto space-y-6">
          <div className="flex items-center space-x-3 pb-3 border-b border-zinc-900">
            <span className="text-[#D1FF00] font-mono font-bold text-sm">03 /</span>
            <h2 className="text-white text-xs font-black uppercase tracking-[0.2em] text-zinc-405">Platform pricing Fee Comparator</h2>
          </div>
          <FlipperProfitCalculator />
        </section>

        {/* 6. Curated Strategics Flipper Blogs */}
        <section className="px-6 md:px-12 max-w-7xl mx-auto space-y-6">
          <div className="flex items-center space-x-3 pb-3 border-b border-zinc-900">
            <span className="text-[#D1FF00] font-mono font-bold text-sm">04 /</span>
            <h2 className="text-white text-xs font-black uppercase tracking-[0.2em] text-zinc-405">Academy Sourcing & Strategy Blog</h2>
          </div>
          <BlogHub />
        </section>

        {/* 7. Comprehensive FAQ accordion */}
        <section id="faq-section" className="px-6 md:px-12 max-w-4xl mx-auto space-y-6 text-left relative">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-[#D1FF00]/5 blur-[90px] pointer-events-none"></div>

          <div className="text-center space-y-2 pb-6">
            <span className="text-[#D1FF00] text-xs font-black uppercase tracking-widest">Pricing & Technology</span>
            <h2 className="text-white text-2xl md:text-3xl font-black tracking-tight uppercase">Got Questions? We Have Answers.</h2>
            <p className="text-zinc-400 text-xs md:text-sm">
              Explore how the advanced physical scan engine streamlines listing friction immediately.
            </p>
          </div>

          <div className="space-y-3.5 relative z-10">
            {[
              {
                q: 'How does the Flip n Profit image analyzer accurately estimate resale values?',
                a: 'Flip n Profit sends the high-resolution image to our server-side appraisal model integrated with Google Gemini. It analyzes geometric profiles, hallmark indices, and text details on the item. It matches these tags against real-time completed sales databases from eBay, Mercari, and active listings to formulate a precise pricing average and demand indicator.'
              },
              {
                q: 'What makes this tool have a better "1-Click Outposter" than other list managers?',
                a: 'Traditional tools require manual copying or cumbersome extensions. Flip n Profit pre-configures and formats separate, custom-styled listings optimized for the specific audiences on eBay, Poshmark, Mercari, and FB Marketplace in parallel. Tapping publish triggers a background batch schema push to connected marketplace API gateways.'
              },
              {
                q: 'Does Flip n Profit handle the calculated shipping costs and platform commissions automatically?',
                a: 'Yes. Our integrated profit calculation models automatically fetch up-to-date commission formulas for each platform (including recent updates like Mercari\'s zero-seller fee schedule and standard eBay variable category fees) and deducts standard regional shipping classes to compute your true net earnings.'
              },
              {
                q: 'How do I unlock custom appraisals on my own real photo uploads?',
                a: 'By default, the homepage sandbox runs in a high-fidelity Demo Mode to let you try things. You can upload any image and receive a beautiful template appraisal. To unlock live, infinite real AI evaluations on your custom personal objects, simply open Settings > Secrets from the AI Studio Workspace side menu and provide your GEMINI_API_KEY!'
              }
            ].map((faq, index) => (
              <div 
                key={index} 
                className="bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 px-5 py-4.5 rounded-2xl transition-all h-auto cursor-pointer"
                onClick={() => toggleFaq(index)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-white font-black text-xs sm:text-sm leading-snug">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#D1FF00] shrink-0 transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : ''}`} />
                </div>
                {activeFaq === index && (
                  <p className="text-zinc-350 text-xs sm:text-sm leading-relaxed mt-3.5 pt-3.5 border-t border-zinc-900 animate-fade-in text-left">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>

        </section>

        {/* 8. Bottom CTA Block */}
        <section className="px-6 max-w-5xl mx-auto pt-10">
          <div className="relative rounded-3xl bg-zinc-900/80 border border-zinc-800/80 p-8 md:p-12 text-center space-y-6 overflow-hidden shadow-2xl">
            {/* Ambient Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#D1FF00]/5 blur-[80px] pointer-events-none -z-10"></div>

            <div className="max-w-2xl mx-auto space-y-3">
              <h2 className="text-white text-2xl md:text-3xl font-black tracking-tighter leading-tight uppercase">
                Stop Leaving Money <br /> On Second-Hand Shelves.
              </h2>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed max-w-md mx-auto">
                Join a dynamic network of smart resellers utilizing automated visual appraisals to spot sourcing opportunities faster.
              </p>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => handleNavClick('scanner-sandbox')}
                className="mx-auto bg-[#D1FF00] text-black font-black py-5 px-10 rounded-none tracking-widest uppercase hover:scale-105 transition-all shadow-[0_0_40px_rgba(209,255,0,0.25)] text-xs flex justify-center items-center space-x-2 cursor-pointer"
              >
                <span>Appraise Your First Item</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* 9. Minimal Handcrafted Footer with Vertical Knowledge Hub block structure */}
      <footer className="border-t border-zinc-900 bg-[#0A0A0A] flex flex-col md:flex-row items-stretch select-none">
        <div className="w-full md:w-[15%] border-b md:border-b-0 md:border-r border-zinc-850 flex items-center justify-center p-6 bg-zinc-900/40">
          <div className="md:rotate-180 md:[writing-mode:vertical-rl] font-black text-xs uppercase tracking-[0.5em] text-zinc-500">
            THE KNOWLEDGE HUB
          </div>
        </div>
        <div className="flex-grow p-8 flex flex-col sm:flex-row sm:items-center justify-between text-zinc-500 text-xs font-mono gap-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#D1FF00]" />
            <span className="text-white font-extrabold font-sans">Flip n Profit © 2026.</span>
            <span>Crafted for high-margin resellers.</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Gift className="w-3.5 h-3.5 text-rose-500" />
              <span className="font-sans text-zinc-400">Recommend to a Friend</span>
            </span>
            <span className="text-zinc-800">|</span>
            <span>Security API Secured</span>
          </div>
        </div>
      </footer>

      {/* Developer Trigger Modal Overlay */}
      {triggerModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in text-left">
          <div className="bg-[#0D0D0D] border border-zinc-900 rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(209,255,0,0.15)] flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-900 flex items-center justify-between bg-zinc-950/55">
              <div className="flex items-center space-x-3 text-left">
                <Terminal className="w-5 h-5 text-[#D1FF00]" />
                <div>
                  <h3 className="text-white text-xs font-black tracking-widest uppercase">Cloud Run Invocation Panel</h3>
                  <span className="text-[9px] font-mono text-zinc-500 block mt-0.5 uppercase tracking-wider">Validated via OIDC Identity Token Bearer Header</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setTriggerModalOpen(false);
                  playNavChime();
                }}
                className="text-zinc-500 hover:text-white p-1 rounded-lg border border-zinc-900 bg-zinc-950 hover:border-zinc-800 transition-colors cursor-pointer"
                title="Close console"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
              
              {/* Shell Command Card */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider font-mono">Shell Equivalent Trigger</span>
                  <span className="text-[9px] font-mono text-[#D1FF00] font-extrabold uppercase bg-[#D1FF00]/10 px-2 py-0.5 rounded">POST Payload</span>
                </div>
                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 font-mono text-[10.5px] leading-relaxed text-zinc-300 relative overflow-x-auto select-text scrollbar-thin text-left">
                  <div className="text-zinc-600 select-none pb-1.5 font-sans italic"># Sends authentic identity tokens with developer identity payloads</div>
                  <span className="text-[#D1FF00]">curl</span> -X POST <span className="text-zinc-400">"https://flip-n-profit-newest-black-n-green-1041474638199.us-east1.run.app"</span> \<br />
                  &nbsp;&nbsp;-H <span className="text-zinc-400">"Authorization: bearer $(gcloud auth print-identity-token)"</span> \<br />
                  &nbsp;&nbsp;-H <span className="text-zinc-400">"Content-Type: application/json"</span> \<br />
                  &nbsp;&nbsp;-d <span className="text-zinc-400">'{"{"} "name": "Developer" {"}"}'</span>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button 
                  onClick={handleTriggerRunService}
                  disabled={triggerLoading}
                  className={`w-full sm:w-auto bg-[#D1FF00] hover:bg-[#D2FF30] text-black font-black py-4 px-8 text-xs uppercase tracking-widest transition-all rounded cursor-pointer shadow-[0_0_20px_rgba(209,255,0,0.15)] flex justify-center items-center space-x-2 ${triggerLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Send className={`w-3.5 h-3.5 ${triggerLoading ? 'animate-bounce' : ''}`} />
                  <span>{triggerLoading ? 'Pinging Service...' : 'Ping Cloud Run Endpoint'}</span>
                </button>
                <button 
                  onClick={() => {
                    setTriggerResult(null);
                    setTriggerError(null);
                    playNavChime();
                  }}
                  disabled={triggerLoading || (!triggerResult && !triggerError)}
                  className="w-full sm:w-auto bg-zinc-950 border border-zinc-900 hover:border-zinc-850 text-zinc-450 hover:text-white py-4 px-6 text-xs uppercase tracking-wider transition-all rounded cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Clear Terminal
                </button>
              </div>

              {/* Status Output Console */}
              <div className="space-y-2 pt-1 text-left">
                <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider font-mono block">Terminal Console Output</span>
                
                {triggerLoading && (
                  <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex flex-col items-center justify-center font-mono text-zinc-400 space-y-3">
                    <div className="h-6 w-6 rounded-full border-2 border-t-[#D1FF00] border-zinc-850 animate-spin"></div>
                    <p className="text-[10px] uppercase tracking-widest text-[#D1FF00] animate-pulse">Requesting OIDC identity token & dispatching payloads...</p>
                  </div>
                )}

                {!triggerLoading && !triggerResult && !triggerError && (
                  <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 text-center font-mono text-zinc-600 text-[11px]">
                    Console idle. Tap "Ping Cloud Run Endpoint" to fire the secure sync token.
                  </div>
                )}

                {triggerError && (
                  <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-4 text-left font-mono text-[11px] leading-normal text-red-200">
                    <span className="text-red-400 font-extrabold uppercase text-[9px] block mb-1">☠️ [TRANSPORT TIMEOUT OR AUTH CONNECTION ERROR]</span>
                    {triggerError}
                  </div>
                )}

                {triggerResult && (
                  <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 font-mono text-[11px] leading-relaxed text-zinc-300 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                      <div className="flex items-center space-x-2">
                        <span className={`h-2 w-2 rounded-full ${triggerResult.success ? 'bg-emerald-500' : 'bg-rose-500 animate-ping'}`}></span>
                        <span className="font-extrabold uppercase text-[9px] text-zinc-500">HTTP Code:</span>
                        <span className={`font-black ${triggerResult.success ? 'text-emerald-400' : 'text-rose-450'}`}>
                          {triggerResult.status} {triggerResult.statusText || (triggerResult.success ? 'OK' : 'Error')}
                        </span>
                      </div>
                      <span className="text-[9.5px] text-zinc-550">Method: POST</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-zinc-600 uppercase text-[9px] block font-bold tracking-wider">Transport Identifiers:</span>
                      <div className="bg-[#060606] p-2.5 rounded-lg border border-zinc-900 text-zinc-450 overflow-x-auto text-[10px] whitespace-nowrap">
                        URL: <span className="text-zinc-300">{triggerResult.invokedUrl}</span><br />
                        Bearer Token Header: <span className="text-emerald-500 font-bold">{triggerResult.usedTokenHeader || 'none'}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-zinc-600 uppercase text-[9px] block font-bold tracking-wider">Parsed JSON Response Body:</span>
                      <pre className="bg-[#050505] p-3.5 rounded-xl border border-[#D1FF00]/10 text-emerald-400 text-[10.5px] overflow-x-auto leading-normal whitespace-pre-wrap select-text scrollbar-thin">
                        {JSON.stringify(triggerResult.data || triggerResult, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

