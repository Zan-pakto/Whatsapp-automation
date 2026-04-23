'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useSocket } from '@/hooks/useSocket';
import ChatSidebar from '@/components/ChatSidebar';
import ChatWindow from '@/components/ChatWindow';
import SettingsView from '@/components/SettingsView';
import OverviewView from '@/components/OverviewView';
import ContactsView from '@/components/ContactsView';
import BroadcastView from '@/components/BroadcastView';
import { LogOut, Settings, Users, MessageSquare, BarChart2, LayoutDashboard, Zap } from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'settings' | 'contacts' | 'broadcast'>('overview');
  const router = useRouter();
  useSocket();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated && typeof window !== 'undefined' && !localStorage.getItem('token')) return null;

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-sans">
      {/* Main Sidebar */}
      <div className="w-64 h-full bg-[#054c44] flex flex-col shrink-0 shadow-2xl z-20">
        {/* Brand Section */}
        <div className="p-8 pb-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="Logo" className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-white font-black text-xl tracking-tight leading-none">W-API</h1>
            <p className="text-emerald-400/60 text-[10px] font-bold uppercase tracking-widest mt-1">Automation Pro</p>
          </div>
        </div>
        
        {/* Navigation Links */}
        <div className="flex-1 px-4 space-y-2">
          {[
            { id: 'overview', icon: <LayoutDashboard size={20} />, label: 'Overview' },
            { id: 'chat', icon: <MessageSquare size={20} />, label: 'Live Chat' },
            { id: 'contacts', icon: <Users size={20} />, label: 'Contacts CRM' },
            { id: 'broadcast', icon: <Zap size={20} />, label: 'Broadcasts' },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 font-bold text-sm ${
                activeTab === item.id 
                ? 'bg-white text-[#054c44] shadow-xl translate-x-2' 
                : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={activeTab === item.id ? 'text-[#054c44]' : 'text-emerald-400'}>
                {item.icon}
              </span>
              {item.label}
              {activeTab === item.id && <div className="ml-auto w-1.5 h-1.5 bg-[#054c44] rounded-full" />}
            </button>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-6 mt-auto border-t border-white/5 space-y-4">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 font-bold text-sm ${
              activeTab === 'settings' 
              ? 'bg-white text-[#054c44] shadow-xl' 
              : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings size={20} className={activeTab === 'settings' ? 'text-[#054c44]' : 'text-emerald-400'} />
            Settings
          </button>

          <div className="flex items-center gap-3 px-4 py-4 bg-white/5 rounded-xl border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
              {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-bold truncate">{user?.name || 'Admin User'}</p>
              <button 
                onClick={() => { logout(); router.push('/login'); }}
                className="text-[10px] text-emerald-400 hover:text-red-400 font-bold uppercase tracking-wider transition-colors"
              >
                Sign Out
              </button>
            </div>
            <LogOut size={16} className="text-emerald-400/50" />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'overview' && <OverviewView />}
        {activeTab === 'chat' && (
          <>
            <ChatSidebar />
            <ChatWindow />
          </>
        )}
        {activeTab === 'settings' && <SettingsView />}
        {activeTab === 'contacts' && <ContactsView />}
        {activeTab === 'broadcast' && <BroadcastView />}
      </div>
    </div>
  );
}
