'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Layout, 
  Plus, 
  Search, 
  Settings, 
  Image as ImageIcon, 
  Type, 
  Palette, 
  Share2, 
  MoreVertical,
  ChevronRight,
  Clock
} from 'lucide-react';
import MoodboardCanvas from '@/components/canvas/MoodboardCanvas';
import { BoardItem } from '@/lib/supabase';

export default function App() {
  const [activeTab, setActiveTab] = useState<'moodboard' | 'lookboard' | 'shotlist'>('moodboard');
  const [items, setItems] = useState<BoardItem[]>([
    {
      id: '1',
      board_id: 'test',
      type: 'image',
      x: 100,
      y: 100,
      width: 300,
      height: 400,
      rotation: 0,
      z_index: 1,
      content: { url: 'https://picsum.photos/seed/photography1/600/800' }
    },
    {
      id: '2',
      board_id: 'test',
      type: 'image',
      x: 450,
      y: 150,
      width: 250,
      height: 250,
      rotation: 5,
      z_index: 2,
      content: { url: 'https://picsum.photos/seed/photography2/500/500' }
    }
  ]);

  const handleUpdateItem = (id: string, updates: Partial<BoardItem>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30">
      {/* Sidebar */}
      <aside className="w-64 border-right border-white/5 flex flex-col bg-[#0d0d0d] hidden lg:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Camera size={18} className="text-black" />
          </div>
          <h1 className="font-bold tracking-tight text-lg">ZAP <span className="text-emerald-500">Look</span></h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-semibold mb-4 px-2">Workspace</div>
          <NavItem active={activeTab === 'moodboard'} onClick={() => setActiveTab('moodboard')} icon={<Layout size={18} />} label="Moodboard" />
          <NavItem active={activeTab === 'lookboard'} onClick={() => setActiveTab('lookboard')} icon={<Palette size={18} />} label="Lookboard" />
          <NavItem active={activeTab === 'shotlist'} onClick={() => setActiveTab('shotlist')} icon={<Camera size={18} />} label="Shot List" />
          
          <div className="pt-8 text-[10px] uppercase tracking-[0.2em] text-white/30 font-semibold mb-4 px-2">Recent Projects</div>
          <ProjectItem label="Vogue Editorial" date="2h ago" />
          <ProjectItem label="Streetwear Drop" date="Yesterday" />
          <ProjectItem label="Portrait Series" date="3 days ago" />
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">Amir Ali</div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider">Pro Plan</div>
            </div>
            <Settings size={16} className="text-white/20" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="h-16 border-bottom border-white/5 flex items-center justify-between px-6 bg-[#0a0a0a]/50 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4">
            <div className="lg:hidden w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-2">
              <Camera size={18} className="text-black" />
            </div>
            <div className="flex items-center gap-2 text-sm text-white/40">
              <span>Projects</span>
              <ChevronRight size={14} />
              <span className="text-white font-medium">Vogue Editorial</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-2 mr-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0a0a0a] bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-[#0a0a0a] bg-emerald-500 flex items-center justify-center text-black">
                <Plus size={14} />
              </div>
            </div>
            <button className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-zinc-200 transition-colors">
              <Share2 size={14} />
              Share
            </button>
          </div>
        </header>

        {/* Canvas Area */}
        <div className="flex-1 relative">
          <MoodboardCanvas items={items} onUpdateItem={handleUpdateItem} />
          
          {/* Side Panel (Inspector) */}
          <AnimatePresence>
            <motion.aside 
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              className="absolute top-0 right-0 bottom-0 w-80 bg-[#0d0d0d] border-l border-white/5 z-30 hidden xl:flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="font-semibold text-sm uppercase tracking-widest text-white/60">Inspector</h2>
                <MoreVertical size={16} className="text-white/20" />
              </div>
              <div className="p-6 space-y-8">
                <section>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold block mb-4">Properties</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-[10px] text-white/40 uppercase">Width</div>
                      <div className="bg-white/5 rounded-lg px-3 py-2 text-sm font-mono">300px</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] text-white/40 uppercase">Height</div>
                      <div className="bg-white/5 rounded-lg px-3 py-2 text-sm font-mono">400px</div>
                    </div>
                  </div>
                </section>

                <section>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold block mb-4">Color Palette</label>
                  <div className="flex gap-2">
                    {['#1a1a1a', '#e5e5e5', '#emerald-500', '#f59e0b'].map(c => (
                      <div key={c} className="w-10 h-10 rounded-lg border border-white/10" style={{ backgroundColor: c.startsWith('#') ? c : undefined }} />
                    ))}
                  </div>
                </section>

                <section>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold block mb-4">Notes</label>
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/80 focus:outline-none focus:border-emerald-500/50 h-32 resize-none"
                    placeholder="Add styling notes..."
                  />
                </section>
              </div>
            </motion.aside>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function NavItem({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
        active 
          ? 'bg-emerald-500/10 text-emerald-500 font-medium' 
          : 'text-white/40 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
      {active && <motion.div layoutId="nav-active" className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />}
    </button>
  );
}

function ProjectItem({ label, date }: { label: string, date: string }) {
  return (
    <div className="group flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
      <div className="w-2 h-2 rounded-full bg-white/10 group-hover:bg-emerald-500 transition-colors" />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-white/60 group-hover:text-white truncate">{label}</div>
      </div>
      <div className="text-[10px] text-white/20 flex items-center gap-1">
        <Clock size={10} />
        {date}
      </div>
    </div>
  );
}
