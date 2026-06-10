import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useSocket = (noteId, handlers = {}) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!noteId) return;

    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.emit('join:note', noteId);

    if (handlers.onNewComment) socket.on('comment:new', handlers.onNewComment);
    if (handlers.onLike) socket.on('comment:like', handlers.onLike);
    if (handlers.onPin) socket.on('comment:pin', handlers.onPin);
    if (handlers.onDelete) socket.on('comment:delete', handlers.onDelete);

    return () => {
      socket.emit('leave:note', noteId);
      socket.disconnect();
    };
  }, [noteId]);

  return socketRef;
};
