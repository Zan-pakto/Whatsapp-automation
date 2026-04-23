import { create } from 'zustand';

interface Message {
  _id: string;
  content: string;
  direction: 'incoming' | 'outgoing';
  status: string;
  createdAt: string;
  whatsappMessageId?: string;
}

interface ChatState {
  conversations: any[];
  activeContact: any | null;
  messages: Message[];
  setConversations: (conversations: any[]) => void;
  setActiveContact: (contact: any) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessageStatus: (msgId: string, status: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeContact: null,
  messages: [],
  setConversations: (conversations) => set({ conversations }),
  setActiveContact: (contact) => set({ activeContact: contact, messages: [] }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateMessageStatus: (msgId, status) => set((state) => ({
    messages: state.messages.map(m => m.whatsappMessageId === msgId ? { ...m, status } : m)
  })),
}));
