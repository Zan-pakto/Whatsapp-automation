import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';

let socket: Socket;

export const useSocket = () => {
  const { user } = useAuthStore();
  const { addMessage, updateMessageStatus, activeContact } = useChatStore();

  useEffect(() => {
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000');
    }

    if (user?.businessId?._id) {
      socket.emit('join', user.businessId._id);

      socket.on('new_message', (data) => {
        if (activeContact?._id === data.contact._id) {
          addMessage(data.message);
        }
      });

      socket.on('message_status_update', (data) => {
        updateMessageStatus(data.whatsappMessageId, data.status);
      });
    }

    return () => {
      socket.off('new_message');
      socket.off('message_status_update');
    };
  }, [user, activeContact, addMessage, updateMessageStatus]);

  return socket;
};
