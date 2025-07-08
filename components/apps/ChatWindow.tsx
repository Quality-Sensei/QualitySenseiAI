import React from 'react';
import { Message } from '../../types-chatbot';
import ChatMessage from '../../testpro-ai---software-testing-chatbot/components/ChatMessage';

interface ChatWindowProps {
  messages: Message[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  return (
    <div className="p-4 md:p-6 space-y-6" aria-live="polite">
      {messages.map((msg) => (
         <ChatMessage key={msg.id} message={msg} />
      ))}
    </div>
  );
};

export default ChatWindow;
