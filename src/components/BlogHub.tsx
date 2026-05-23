import React, { useState, useEffect } from 'react';
import { BookOpen, User, Calendar, Clock, ArrowLeft, Share2, Sparkles, Filter, Bookmark, Play, Globe, Wifi, RefreshCw } from 'lucide-react';
import { BLOG_ARTICLES } from '../data/blogArticles';
import { BlogArticle } from '../types';

export default function BlogHub() {
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [shareCopied, setShareCopied] = useState(false);

  // WordPress live posts state sync
  const [articles, setArticles] = useState<BlogArticle[]>(BLOG_ARTICLES);
  const [isSynced, setIsSynced] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isLoadingWP, setIsLoadingWP] = useState<boolean>(false);
  const [wpEndpoint, setWpEndpoint] = useState<string>('https://www.flipnprofit.com/wp-json/wp/v2/posts?_embed');

  useEffect(() => {
    // Attempt automatic sync with their site
    fetchWordPressPosts(wpEndpoint);
  }, []);

  const fetchWordPressPosts = async (urlToFetch: string) => {
    setIsLoadingWP(true);
    setSyncError(null);
    try {
      const response = await fetch(urlToFetch);
      if (!response.ok) {
        throw new Error(`WordPress responded with: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        if (data.length === 0) {
          throw new Error('Endpoint returned 0 posts. Write posts in your WP Dashboard first.');
        }
        
        const mapped: BlogArticle[] = data.map((post: any) => {
          // Decode HTML titles
          const title = post.title?.rendered 
            ? post.title.rendered
                .replace(/&#8217;/g, "'")
                .replace(/&#8220;/g, '"')
                .replace(/&#8221;/g, '"')
                .replace(/&amp;/g, '&')
                .replace(/&#8211;/g, '–')
            : 'Untitled Post';

          // Identify Category
          let category = 'WordPress Guide';
          try {
            if (post._embedded && post._embedded['wp:term'] && post._embedded['wp:term'][0]) {
              const terms = post._embedded['wp:term'][0];
              const matched = terms.find((t: any) => t.taxonomy === 'category' && t.name !== 'Uncategorized');
              if (matched) {
                category = matched.name;
              }
            }
          } catch (e) {}

          // Featured Image
          let imageUrl = 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80';
          try {
            if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
              imageUrl = post._embedded['wp:featuredmedia'][0].source_url || imageUrl;
            }
          } catch (e) {}

          // Text Excerpt for Summary preview
          let summary = 'Open to read this full strategy guide...';
          try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(post.excerpt?.rendered || '', 'text/html');
            summary = doc.body.textContent || doc.body.innerText || summary;
            if (summary.length > 150) {
              summary = summary.substring(0, 147) + '...';
            }
          } catch (e) {}

          // Smart Read Time calculation based on 220 WPM
          let readTime = '5 min read';
          try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(post.content?.rendered || '', 'text/html');
            const words = (doc.body.textContent || doc.body.innerText || '').split(/\s+/).filter(Boolean).length;
            if (words > 0) {
              readTime = `${Math.max(1, Math.round(words / 220))} min read`;
            }
          } catch (e) {}

          // Format ISO date
          let formattedDate = 'Just Now';
          try {
            formattedDate = new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
                });
          } catch (e) {}

          return {
            id: `wp-${post.id}`,
            title,
            category,
            readTime,
            date: formattedDate,
            summary,
            imageUrl,
            content: post.content?.rendered || post.excerpt?.rendered || ''
          };
        });

        setArticles(mapped);
        setIsSynced(true);
      } else {
        throw new Error('WP API didn\'t return a valid list array');
      }
    } catch (e: any) {
      setSyncError(e?.message || 'CORS Restrict / Unmapped Domain');
      setIsSynced(false);
      // Seamlessly keep fallback to preloaded expert articles
      setArticles(BLOG_ARTICLES);
    } finally {
      setIsLoadingWP(false);
    }
  };

  // Play a gentle page flip sound when selecting an article
  const playPageSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  };

  const handleArticleClick = (article: BlogArticle) => {
    setSelectedArticle(article);
    setReadingProgress(0);
    playPageSound();
    
    // Auto scroll modal to top
    setTimeout(() => {
      const el = document.getElementById('article-modal-content');
      if (el) el.scrollTop = 0;
    }, 50);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
    playPageSound();
  };

  // Extract unique categories for filtration
  const categories = ['All', ...new Set(articles.map(a => a.category))];

  const filteredArticles = selectedCategory === 'All'
    ? articles
    : articles.filter(a => a.category === selectedCategory);

  // Custom parser to translate markdown-like text to gorgeous React components
  const renderReadableContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={i} className="h-4" />;

      // Main Headers
      if (trimmed.startsWith('# ')) {
        return (
          <h2 key={i} className="text-xl md:text-3xl font-bold tracking-tight text-white mt-8 mb-4 border-b border-slate-900 pb-2">
            {trimmed.slice(2)}
          </h2>
        );
      }

      // Subheaders
      if (trimmed.startsWith('## ')) {
        return (
          <h3 key={i} className="text-lg md:text-xl font-black text-[#D1FF00] uppercase tracking-wider mt-6 mb-3">
            {trimmed.slice(3)}
          </h3>
        );
      }

      // Bullet points
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        return (
          <li key={i} className="text-zinc-350 text-sm md:text-base leading-relaxed pl-4 list-none relative mb-2">
            <span className="absolute left-0 text-[#D1FF00] font-bold">•</span>
            {trimmed.startsWith('* ') ? trimmed.slice(2) : trimmed.slice(2)}
          </li>
        );
      }

      // Blockquotes
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={i} className="border-l-4 border-[#D1FF00] bg-zinc-900/60 p-4 rounded-r-2xl text-xs md:text-sm text-zinc-205 mt-4 mb-4 italic leading-relaxed text-left">
            {trimmed.slice(2)}
          </blockquote>
        );
      }

      // Math/Key elements formatted cleanly
      if (trimmed.startsWith('$$')) {
        return (
          <div key={i} className="bg-black border border-zinc-850 p-4 rounded-xl font-mono text-center text-[#D1FF00] text-xs md:text-sm my-4 overflow-x-auto shadow-inner">
            {trimmed.replace(/\$\$/g, '')}
          </div>
        );
      }

      // Plain paragraphs
      return (
        <p key={i} className="text-slate-300 text-sm md:text-base leading-relaxed mb-4 text-left">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div id="blog-hub" className="space-y-8 select-none">
      
      {/* Blog Section title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-zinc-900">
        <div className="text-left">
          <span className="text-[#D1FF00] text-xs font-black uppercase tracking-widest block mb-1">Thrift University</span>
          <h2 className="text-white text-xl md:text-2xl font-black uppercase tracking-tight">Sourced Treasures & Strategy Blog</h2>
          <p className="text-zinc-400 text-xs mt-1">
            Proven hacks, pricing strategies, and estate sales secrets to transform thrift store plastics into pocket capital.
          </p>
        </div>
        
        {/* Category Filtration bar */}
        <div className="flex flex-wrap gap-2 shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                playPageSound();
              }}
              className={`py-1.5 px-3.5 rounded-lg text-xs font-bold tracking-wider border transition-all pointer-events-auto cursor-pointer ${
                selectedCategory === cat
                ? 'bg-[#D1FF00] border-[#D1FF00] text-black font-black'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* WordPress Sync Status indicator Panel */}
      <div className="bg-[#0E0E0E] border border-zinc-900 rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 scale-95 sm:scale-100 text-left">
        <div className="flex items-center space-x-3.5">
          <div className="h-10 w-10 bg-[#D1FF00]/10 border border-[#D1FF00]/20 rounded-xl flex items-center justify-center text-[#D1FF00] shrink-0">
            <Globe className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-white text-xs font-black uppercase tracking-wider">WordPress Sync Workspace</span>
              {isLoadingWP ? (
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              ) : isSynced ? (
                <span className="h-1.5 w-1.5 rounded-full bg-[#D1FF00] animate-ping"></span>
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-600"></span>
              )}
            </div>
            <p className="text-[11px] text-zinc-550 font-mono mt-0.5 leading-tight">
              {isLoadingWP ? 'Querying Live REST Engine...' : isSynced ? `Connected Live & Syncing posts from: www.flipnprofit.com` : `Offline fallback mode triggered (${syncError || 'Local Strategy Guides loaded'})`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <input 
            type="text"
            value={wpEndpoint}
            onChange={(e) => setWpEndpoint(e.target.value)}
            placeholder="WordPress API Endpoint URL"
            className="bg-black border border-zinc-850 px-3.5 py-1.5 rounded-xl text-[10px] font-mono text-zinc-300 focus:text-white focus:border-[#D1FF00] focus:outline-none flex-1 md:w-64"
          />
          <button 
            onClick={() => fetchWordPressPosts(wpEndpoint)}
            disabled={isLoadingWP}
            className={`p-2.5 rounded-xl bg-zinc-900 border border-zinc-805 text-zinc-400 hover:text-white transition-all cursor-pointer ${isLoadingWP ? 'animate-spin' : ''}`}
            title="Refresh WordPress Sync"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid List of articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((article) => (
          <div 
            key={article.id}
            onClick={() => handleArticleClick(article)}
            className="group bg-[#0E0E0E] border border-zinc-900 rounded-3xl overflow-hidden shadow-lg hover:border-zinc-800 transition-all cursor-pointer flex flex-col justify-between animate-fade-in"
          >
            <div>
              <div className="h-44 overflow-hidden relative">
                <img 
                  src={article.imageUrl} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Category Pill tag */}
                <span className="absolute top-3 left-3 bg-black/95 border border-zinc-850 text-[#D1FF00] font-black px-2.5 py-1 rounded-none text-[9px] uppercase tracking-widest">
                  {article.category}
                </span>
                
                <span className="absolute bottom-3 right-3 bg-black/80 text-zinc-300 font-mono text-[9px] px-2.5 py-1 rounded-md">
                  {article.readTime}
                </span>
              </div>

              <div className="p-5 space-y-2.5 text-left">
                <span className="text-zinc-500 text-[10px] font-mono">{article.date}</span>
                <h3 className="text-white font-black uppercase text-base group-hover:text-[#D1FF00] transition-colors leading-snug line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2">
                  {article.summary}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 flex justify-between items-center text-[10px] text-zinc-500 font-mono tracking-wider border-t border-zinc-900/40 mt-2">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-zinc-650" />
                <span>By Flip n Profit Team</span>
              </span>
              <span className="text-[#D1FF00] group-hover:translate-x-1 transition-transform flex items-center gap-1 font-bold uppercase tracking-wider font-extrabold text-[9px]">
                <span>Read Article</span>
                <span>→</span>
              </span>
            </div>

          </div>
        ))}
      </div>

      {/* Full-Screen overlays for Reader Panel UI */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div 
            id="article-modal"
            className="w-full max-w-3xl h-[85vh] bg-black border border-zinc-850 rounded-3xl overflow-hidden flex flex-col relative animate-scale-up"
          >
            {/* Header / Cover controls */}
            <div className="relative h-48 md:h-64 shrink-0">
              <img 
                src={selectedArticle.imageUrl} 
                alt={selectedArticle.title} 
                className="w-full h-full object-cover brightness-[0.65]"
                referrerPolicy="no-referrer"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
              
              {/* Controls */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                <button 
                  onClick={handleCloseModal}
                  className="p-2.5 bg-black/80 hover:bg-zinc-900 text-white rounded-xl border border-zinc-800 transition-all flex items-center space-x-2 text-xs font-bold uppercase tracking-wider select-none pointer-events-auto cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-[#D1FF00]" />
                  <span>Close Reader</span>
                </button>
                <div className="flex gap-2">
                  <span className="bg-[#D1FF00] text-black font-mono font-black text-[9px] px-3 py-1 border border-zinc-800 rounded-none tracking-widest uppercase">
                    {selectedArticle.category}
                  </span>
                </div>
              </div>

              {/* Cover item info */}
              <div className="absolute bottom-4 left-6 right-6 text-left">
                <div className="flex items-center gap-4 text-xs text-zinc-300 font-mono mb-1.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#D1FF00]" />
                    <span>{selectedArticle.date}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#D1FF00]" />
                    <span>{selectedArticle.readTime}</span>
                  </span>
                </div>
                <h1 className="text-white font-black uppercase text-lg md:text-2xl leading-tight">
                  {selectedArticle.title}
                </h1>
              </div>
            </div>

            {/* Scrollable Core Reader contents */}
            <div 
              id="article-modal-content"
              onScroll={(e) => {
                const target = e.currentTarget;
                const progress = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100;
                setReadingProgress(progress);
              }}
              className="flex-1 overflow-y-auto px-6 md:px-10 py-8 relative space-y-5"
            >
              
              {/* Dynamic scroll progress strip */}
              <div className="fixed top-0 left-0 w-full h-[3px] bg-zinc-900">
                <div className="bg-[#D1FF00] h-full" style={{ width: `${readingProgress}%` }}></div>
              </div>

              <div className="prose prose-invert max-w-none text-left">
                {selectedArticle.id.startsWith('wp-') ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: selectedArticle.content }} 
                    className="space-y-4 text-zinc-350 text-sm md:text-base leading-relaxed wp-content-rendered-body"
                  />
                ) : (
                  renderReadableContent(selectedArticle.content)
                )}
              </div>
              
              <div className="pt-6 border-t border-zinc-900 flex justify-between items-center text-zinc-500 font-mono text-[10px]">
                <span>Flip n Profit reseller guide series</span>
                <span>© 2026 Flip n Profit</span>
              </div>
            </div>

            {/* Bottom Actions footer bar */}
            <div className="p-4 bg-zinc-900/60 border-t border-zinc-850 flex items-center justify-between">
              <span className="text-zinc-450 text-xs flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-[#D1FF00]" />
                <span className="font-medium text-zinc-400">Curated reseller academy handbook guides.</span>
              </span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/blog#${selectedArticle.id}`);
                  playPageSound();
                  setShareCopied(true);
                  setTimeout(() => setShareCopied(false), 2000);
                }}
                className="py-2.5 px-4 bg-[#D1FF00] text-black font-black hover:bg-[#c2ed00] rounded-none text-xs transition-all flex items-center space-x-1.5 cursor-pointer uppercase tracking-wider"
              >
                <Share2 className="w-3.5 h-3.5 text-black stroke-[3]" />
                <span>{shareCopied ? 'Link Copied' : 'Share Guide'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
