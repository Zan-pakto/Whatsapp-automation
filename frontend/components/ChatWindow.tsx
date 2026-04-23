'use client';

import { useState, useEffect, useRef } from 'react';
import { useChatStore } from '@/store/useChatStore';
import api from '@/lib/api';
import { Send } from 'lucide-react';

export default function ChatWindow() {
  const { activeContact, messages, setMessages, addMessage } = useChatStore();
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeContact) {
      const fetchMessages = async () => {
        try {
          const { data } = await api.get(`/messages?contactId=${activeContact._id}`);
          setMessages(data);
        } catch (error) {
          console.error('Failed to fetch messages');
        }
      };
      fetchMessages();
    }
  }, [activeContact, setMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeContact) return;

    setLoading(true);
    try {
      const { data } = await api.post('/messages', {
        contactId: activeContact._id,
        content: inputText
      });
      addMessage(data);
      setInputText('');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  if (!activeContact) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-gray-50 text-gray-400 font-medium">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col bg-[#f0f2f5] relative">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}
      ></div>

      {/* Header */}
      <div className="p-4 border-b bg-white flex items-center justify-between shadow-sm z-10 relative">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold mr-4 shadow-sm text-lg">
            {(activeContact.name || activeContact.waId).charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-gray-900">{activeContact.name || activeContact.waId}</div>
            <div className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Online • WhatsApp
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10 scroll-smooth">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${msg.direction === 'outgoing' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3.5 rounded-2xl shadow-sm relative animate-in slide-in-from-bottom-2 duration-300 ${
                msg.direction === 'outgoing'
                  ? 'bg-[#dcf8c6] text-gray-800 rounded-tr-none'
                  : 'bg-white text-gray-800 rounded-tl-none'
              }`}
            >
              <div className="text-[14px] leading-relaxed font-medium">{msg.content}</div>
              <div className={`text-[9px] mt-1 flex justify-end items-center font-bold uppercase tracking-tighter ${
                msg.direction === 'outgoing' ? 'text-emerald-700' : 'text-gray-400'
              }`}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {msg.direction === 'outgoing' && (
                  <span className={`ml-1 text-[14px] leading-none ${msg.status === 'read' ? 'text-blue-500' : ''}`}>
                    {msg.status === 'read' ? '✓✓' : msg.status === 'delivered' ? '✓✓' : '✓'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-white/80 backdrop-blur-md border-t relative z-10">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="flex-1 bg-gray-100 rounded-[1.5rem] px-5 py-3 shadow-inner border border-gray-200">
            <input
              type="text"
              placeholder="Type a response..."
              className="w-full bg-transparent border-none focus:outline-none text-gray-900 text-sm placeholder-gray-400 font-medium"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="w-12 h-12 bg-[#075E54] text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-100 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
