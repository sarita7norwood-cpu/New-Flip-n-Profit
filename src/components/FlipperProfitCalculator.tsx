import React, { useState, useEffect } from 'react';
import { DollarSign, ShieldAlert, BadgePercent, ArrowUpRight, Scale, ChevronDown, Award } from 'lucide-react';
import { PlatformFeeResult } from '../types';

export default function FlipperProfitCalculator() {
  const [sourceCost, setSourceCost] = useState<number>(15);
  const [sellPrice, setSellPrice] = useState<number>(85);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [shippingPaidBy, setShippingPaidBy] = useState<'buyer' | 'seller'>('buyer');
  const [results, setResults] = useState<PlatformFeeResult[]>([]);

  // Sound generator
  const playCaclulationChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {}
  };

  useEffect(() => {
    // Math logic based on current standard marketplace seller schedules
    const calculatedShipping = shippingPaidBy === 'seller' ? shippingCost : 0;

    // 1. eBay
    // General category: 13.25% standard commission + $0.30 fixed listing/transaction fee
    const ebayFee = (sellPrice * 0.1325) + 0.30;
    const ebayProfit = sellPrice - sourceCost - ebayFee - calculatedShipping;
    const ebayMargin = (ebayProfit / sellPrice) * 100;

    // 2. Poshmark
    // Flat $2.95 for items under $15, else 20% flat commission rate
    const poshmarkFee = sellPrice < 15 ? 2.95 : sellPrice * 0.20;
    const poshmarkProfit = sellPrice - sourceCost - poshmarkFee - calculatedShipping;
    const poshmarkMargin = (poshmarkProfit / sellPrice) * 100;

    // 3. Mercari (New zero-selling fee model)
    // 0% selling fee, but 2.9% + $0.50 processing/payout fee charged on seller transfer
    const mercariFee = (sellPrice * 0.029) + 0.50;
    const mercariProfit = sellPrice - sourceCost - mercariFee - calculatedShipping;
    const mercariMargin = (mercariProfit / sellPrice) * 100;

    // 4. FB Marketplace (Shipping vs local)
    // Local pickup is 0%; shipping checkout is 5% processing fee (minimum $0.40)
    const fbFee = shippingCost > 0 || shippingPaidBy === 'seller' ? Math.max(0.40, sellPrice * 0.05) : 0;
    const fbProfit = sellPrice - sourceCost - fbFee - calculatedShipping;
    const fbMargin = (fbProfit / sellPrice) * 100;

    const data: PlatformFeeResult[] = [
      {
        platformName: 'Facebook Marketplace',
        fee: fbFee,
        shippingCharge: calculatedShipping,
        netProfit: Math.max(0, fbProfit),
        margin: Math.max(0, fbMargin),
        color: 'emerald'
      },
      {
        platformName: 'Mercari',
        fee: mercariFee,
        shippingCharge: calculatedShipping,
        netProfit: Math.max(0, mercariProfit),
        margin: Math.max(0, mercariMargin),
        color: 'indigo'
      },
      {
        platformName: 'eBay US Store',
        fee: ebayFee,
        shippingCharge: calculatedShipping,
        netProfit: Math.max(0, ebayProfit),
        margin: Math.max(0, ebayMargin),
        color: 'amber'
      },
      {
        platformName: 'Poshmark Closet',
        fee: poshmarkFee,
        shippingCharge: calculatedShipping,
        netProfit: Math.max(0, poshmarkProfit),
        margin: Math.max(0, poshmarkMargin),
        color: 'pink'
      }
    ];

    // Sort descending by highest profitability
    data.sort((a, b) => b.netProfit - a.netProfit);
    setResults(data);
  }, [sourceCost, sellPrice, shippingCost, shippingPaidBy]);

  return (
    <div id="calculator-section" className="bg-[#0E0E0E] border border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-2xl space-y-8 select-none">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-zinc-900">
        <div className="text-left">
          <span className="text-[#D1FF00] text-xs font-black uppercase tracking-widest block mb-1">Interactive Sourcing Math</span>
          <h2 className="text-white text-xl md:text-2xl font-black uppercase tracking-tight">Flipper Profit Multi-Calculator</h2>
          <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
            Instantly compare net earnings and broker commission cuts across 4 giant marketplaces simultaneously.
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0 bg-[#050505] px-3.5 py-2.5 rounded-xl border border-zinc-850">
          <Scale className="w-4 h-4 text-[#D1FF00]" />
          <span className="text-white text-xs font-mono font-bold uppercase">Dynamic Ratio Model</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Input Parameters (5 Cols) */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-5">
          
          {/* Sourcing Cost input row */}
          <div className="space-y-2 text-left">
            <label className="text-white text-xs font-bold uppercase tracking-wider block">Sourcing Cost (What you buy it for)</label>
            <div className="relative rounded-2xl bg-black border border-zinc-800 group hover:border-[#D1FF00]/40 transition-colors">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">$</span>
              <input 
                type="number" 
                value={sourceCost === 0 ? '' : sourceCost} 
                onChange={(e) => {
                  setSourceCost(Math.max(0, parseFloat(e.target.value) || 0));
                  playCaclulationChime();
                }}
                className="w-full bg-transparent border-0 ring-0 focus:ring-0 text-white font-mono py-4 pl-8 pr-4 text-sm font-semibold rounded-2xl outline-none"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Sell Price input row */}
          <div className="space-y-2 text-left">
            <label className="text-white text-xs font-bold uppercase tracking-wider block">Est. Market Selling Price</label>
            <div className="relative rounded-2xl bg-black border border-zinc-800 group hover:border-[#D1FF00]/45 transition-colors">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D1FF00] font-bold">$</span>
              <input 
                type="number" 
                value={sellPrice === 0 ? '' : sellPrice} 
                onChange={(e) => {
                  setSellPrice(Math.max(0, parseFloat(e.target.value) || 0));
                  playCaclulationChime();
                }}
                className="w-full bg-transparent border-0 ring-0 focus:ring-0 text-white font-mono py-4 pl-8 pr-4 text-sm font-black rounded-2xl outline-none"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Shipping fees config */}
          <div className="space-y-4 pt-3 border-t border-zinc-900">
            <div className="flex justify-between items-center">
              <label className="text-white text-xs font-bold uppercase tracking-wider">Estimated Outbound Shipping</label>
              <div className="flex bg-[#050505] border border-zinc-850 rounded-lg overflow-hidden p-0.5 select-none shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setShippingPaidBy('buyer');
                    playCaclulationChime();
                  }}
                  className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all select-none cursor-pointer ${
                    shippingPaidBy === 'buyer' 
                    ? 'bg-[#D1FF00] text-black font-black' 
                    : 'text-zinc-500 hover:text-zinc-400'
                  }`}
                >
                  Paid by Buyer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShippingPaidBy('seller');
                    playCaclulationChime();
                  }}
                  className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all select-none cursor-pointer ${
                    shippingPaidBy === 'seller' 
                    ? 'bg-[#D1FF00] text-black font-black' 
                    : 'text-zinc-500 hover:text-zinc-400'
                  }`}
                >
                  Free Shipping
                </button>
              </div>
            </div>

            {shippingPaidBy === 'seller' && (
              <div className="relative rounded-2xl bg-black border border-zinc-800 group hover:border-[#D1FF00]/40 transition-colors animate-fade-in text-left">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">$</span>
                <input 
                  type="number" 
                  value={shippingCost === 0 ? '' : shippingCost} 
                  onChange={(e) => {
                    setShippingCost(Math.max(0, parseFloat(e.target.value) || 0));
                    playCaclulationChime();
                  }}
                  className="w-full bg-transparent border-0 ring-0 text-white font-mono py-3.5 pl-8 pr-4 text-sm rounded-2xl outline-none leading-none"
                  placeholder="0.00"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 font-mono">Deducted from profits</span>
              </div>
            )}
          </div>

          <div className="bg-[#050505] border border-zinc-850 p-4 rounded-2xl text-[11px] leading-relaxed text-zinc-400 text-left flex items-start space-x-2.5">
            <ShieldAlert className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
            <div>
              Commission rates listed do not reflect localized sales taxes or monthly subscription fees/promoted listings cuts. Margins are estimates subject to changes in state rules.
            </div>
          </div>

        </div>

        {/* Dynamic Profit outputs (7 Cols) */}
        <div className="lg:col-span-12 xl:col-span-7 bg-[#050505] border border-zinc-800/80 rounded-2xl p-4 md:p-6 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-90 w-full">
            <span className="text-white text-xs font-bold uppercase tracking-wider">Market Competitiveness Rankings</span>
            <span className="text-[#D1FF00] text-xs font-mono font-bold">1st Place Highlighted</span>
          </div>

          <div className="space-y-3.5">
            {results.map((res, index) => {
              const profitPercentage = sellPrice > 0 ? (res.netProfit / sellPrice) * 100 : 0;
              
              const platformColors: Record<string, string> = {
                emerald: 'from-[#D1FF00] to-[#c2ed00]',
                indigo: 'from-zinc-500 to-zinc-400',
                amber: 'from-amber-500 to-amber-450',
                pink: 'from-rose-500 to-rose-400'
              };

              return (
                <div 
                  key={res.platformName}
                  className={`p-4 border rounded-2xl transition-all flex flex-col justify-between relative text-left ${
                    index === 0 
                    ? 'border-[#D1FF00]/40 bg-zinc-900 shadow-md ring-1 ring-[#D1FF00]/10' 
                    : 'border-zinc-900 bg-[#0A0A0A]'
                  }`}
                >
                  {/* Winner crown tag */}
                  {index === 0 && (
                    <div className="absolute -top-2.5 -right-2 bg-[#D1FF00] text-black font-black px-2.5 py-0.5 rounded-none text-[8.5px] uppercase tracking-widest flex items-center space-x-1 shadow-lg shadow-[#D1FF00]/15 select-none">
                      <Award className="w-3 h-3 text-black fill-current" />
                      <span>Best Profit Margin</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center mb-2.5">
                    <div>
                      <span className="text-white font-extrabold text-sm tracking-tight uppercase font-sans">{res.platformName}</span>
                      <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        Commission Deducted: <span className="font-mono">${res.fee.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-base font-black tracking-tight block ${index === 0 ? 'text-[#D1FF00]' : 'text-white'}`}>
                        ${res.netProfit.toFixed(2)}
                      </span>
                      <span className="text-[9.5px] font-mono text-zinc-500 font-bold block leading-none">
                        Margin: {res.margin.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Profit bar visualizer overlay */}
                  <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden mb-1">
                    <div 
                      className={`h-full bg-gradient-to-r rounded-full transition-all duration-500 ${platformColors[res.color] || platformColors.emerald}`} 
                      style={{ width: `${Math.min(100, profitPercentage)}%` }}
                    ></div>
                  </div>

                  {/* Extra little marketplace highlights for extreme details */}
                  <div className="flex justify-between items-center text-[9px] text-zinc-500 font-mono italic mt-1.5 pt-1 border-t border-zinc-900/40">
                    <span>
                      {res.platformName === 'Facebook Marketplace' && '* Assumes cash pickup. Shipped/checkout commission is 5%.'}
                      {res.platformName === 'Mercari' && '* Zero seller standard listing fee model enabled.'}
                      {res.platformName === 'eBay US Store' && '* General category 13.25% bracket calculation.'}
                      {res.platformName === 'Poshmark Closet' && '* Flat $2.95 under $15, else flat 20% standard cut.'}
                    </span>
                    <span className="font-bold flex items-center shrink-0">
                      ROI: {res.netProfit > 0 ? `${(res.netProfit / sourceCost).toFixed(1)}x` : '0x'}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
}
