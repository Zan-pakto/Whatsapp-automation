'use client';

import { useEffect } from 'react';
import { useChatStore } from '@/store/useChatStore';
import api from '@/lib/api';

export default function ChatSidebar() {
  const { conversations, setConversations, setActiveContact, activeContact } = useChatStore();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await api.get('/messages/conversations');
        setConversations(data);
      } catch (error) {
        console.error('Failed to fetch conversations');
      }
    };
    fetchConversations();
    
    // Refresh every 30 seconds as fallback for socket
    const interval = setInterval(fetchConversations, 30000);
    return () => clearInterval(interval);
  }, [setConversations]);

  return (
    <div className="w-80 h-full border-r bg-white flex flex-col shrink-0">
      <div className="p-4 border-b bg-white font-bold text-xl text-gray-800">Chats</div>
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">No conversations yet</div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.contact._id}
              onClick={() => setActiveContact(conv.contact)}
              className={`p-4 mx-2 my-1 rounded-2xl cursor-pointer transition-all duration-200 ${
                activeContact?._id === conv.contact._id 
                  ? 'bg-emerald-50 text-emerald-900 shadow-sm border border-emerald-100' 
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-semibold text-gray-800 truncate">
                  {conv.contact.name || conv.contact.waId}
                </span>
                <span className="text-[10px] text-gray-500 shrink-0 ml-2">
                  {conv.lastMessage ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
              <div className="text-sm text-gray-500 truncate mt-1">
                {conv.lastMessage?.content || 'No messages yet'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
