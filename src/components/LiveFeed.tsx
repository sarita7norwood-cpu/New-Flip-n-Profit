import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Compass, ShoppingBag, Radio } from 'lucide-react';

interface FeedItem {
  id: string;
  user: string;
  item: string;
  cost: number;
  sold: number;
  platform: string;
  region: string;
}

const TEMPLATE_FEED: FeedItem[] = [
  { id: '1', user: '@thrift_grails', item: '1992 Nirvana In Utero Tee', cost: 3.50, sold: 280, platform: 'eBay', region: 'Portland, OR' },
  { id: '2', user: '@denimpicker', item: 'Vintage Levis 501 Selvedge Denim', cost: 12, sold: 135, platform: 'Poshmark', region: 'Austin, TX' },
  { id: '3', user: '@retro_kid', item: 'Original GameBoy Color Berry', cost: 15, sold: 90, platform: 'Mercari', region: 'Chicago, IL' },
  { id: '4', user: '@mcm_estate', item: 'Mid-Century Teak Ice Bucket', cost: 8, sold: 120, platform: 'FB Marketplace', region: 'Orlando, FL' },
  { id: '5', user: '@jewelry_queen', item: 'Signed Trifari Crown Brooch', cost: 2, sold: 85, platform: 'Ebay', region: 'Phoenix, AZ' },
  { id: '6', user: '@shoe_dog', item: '2015 Adidas Yeezy Boost 350', cost: 45, sold: 210, platform: 'Mercari', region: 'Las Vegas, NV' },
  { id: '7', user: '@boardgame_guy', item: '1981 Dark Tower Board Game (Incomplete)', cost: 10, sold: 160, platform: 'eBay', region: 'Boston, MA' }
];

export default function LiveFeed() {
  const [feed, setFeed] = useState<FeedItem[]>(TEMPLATE_FEED.slice(0, 4));

  useEffect(() => {
    const interval = setInterval(() => {
      // Pick a random template feed element to inject
      const itemToInsert = TEMPLATE_FEED[Math.floor(Math.random() * TEMPLATE_FEED.length)];
      const uniqueIdItem = {
        ...itemToInsert,
        id: Math.random().toString(),
        cost: Math.max(1, Math.round(itemToInsert.cost + (Math.random() * 4 - 2))),
        sold: Math.max(30, Math.round(itemToInsert.sold + (Math.random() * 20 - 10)))
      };

      setFeed(prev => {
        const next = [uniqueIdItem, ...prev];
        if (next.length > 4) next.pop(); // keep only 4
        return next;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="live-sourcing-feed" className="bg-[#0E0E0E] border border-zinc-800/80 rounded-3xl p-6 shadow-xl select-none text-left">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-90 w-full mb-5">
        <div className="flex items-center space-x-2.5">
          <div className="relative">
            <Radio className="w-5 h-5 text-[#D1FF00]" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#D1FF00] animate-ping"></span>
          </div>
          <div>
            <h3 className="text-white text-sm font-black tracking-widest uppercase">Live Global Thrifts feed</h3>
            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Simulated Flipper Network</p>
          </div>
        </div>
        <div className="text-xs font-mono text-[#D1FF00] bg-[#D1FF00]/10 border border-[#D1FF00]/30 px-3 py-1 rounded-full flex items-center space-x-1 font-bold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Active Scans Today</span>
        </div>
      </div>

      <div className="space-y-3">
        {feed.map((f) => {
          const profit = f.sold - f.cost;
          const roi = f.sold / f.cost;

          return (
            <div 
              key={f.id}
              className="bg-black p-4 rounded-xl border border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all animate-fade-in hover:border-zinc-850"
            >
              <div className="flex items-center space-x-3.5">
                <div className="h-10 w-10 bg-zinc-900 border border-zinc-800 rounded-none flex items-center justify-center text-[#D1FF00] font-mono font-black text-xs shrink-0 shadow-inner">
                  {f.user.slice(1, 3).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-extrabold text-xs">{f.user}</span>
                    <span className="text-zinc-500 text-[10px] font-medium">• {f.region}</span>
                  </div>
                  <span className="text-zinc-300 text-xs font-mono tracking-tight font-medium mt-0.5 block">{f.item}</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-900">
                <div className="flex items-center space-x-3 sm:space-x-0">
                  <span className="text-zinc-500 text-[10px] font-mono">Sourced ${f.cost.toFixed(2)}</span>
                  <span className="text-zinc-400 font-bold text-xs sm:hidden">→</span>
                  <span className="text-white font-extrabold text-xs sm:hidden">Sold ${f.sold} ({f.platform})</span>
                </div>
                <div className="text-right flex items-center sm:block space-x-2 sm:space-x-0 mt-0.5">
                  <span className="text-[#D1FF00] text-xs font-black block">
                    +${profit.toFixed(0)} Net Profit
                  </span>
                  <span className="text-[9.5px] font-mono font-black text-zinc-500 uppercase tracking-wider block bg-zinc-900 px-1.5 py-0.5 rounded sm:bg-transparent sm:p-0">
                    {roi.toFixed(1)}x ROI Ratio
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
