import React from 'react';
import { Message } from '../../types/chatbot';
import ChatMessage from '../shared/ChatMessage';

interface ChatWindowProps {
  messages: Message[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  return (
    <div
      style={{
        padding: '2rem 2.5rem',
        borderRadius: '2rem',
        background: 'rgba(255,255,255,0.85)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        marginBottom: 32,
        marginTop: 24,
        minHeight: 320,
        maxHeight: 480,
        overflowY: 'auto',
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      }}
      className="legendary-glass"
      aria-live="polite"
    >
      {messages.map((msg) => (
         <ChatMessage key={msg.id} message={msg} />
      ))}
    </div>
  );
};

export default ChatWindow;
