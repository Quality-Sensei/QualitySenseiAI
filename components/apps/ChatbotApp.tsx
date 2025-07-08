import React, { useState } from 'react';
import { useChat } from '../../testpro-ai---software-testing-chatbot/hooks/useChat';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import SettingsPanel from './SettingsPanel';
import SettingsIcon from './icons/SettingsIcon';
import BotIcon from './icons/BotIcon';

const ChatbotApp: React.FC = () => {
  const {
    messages,
    isLoading,
    handleSendMessage,
    chatWindowRef,
    config,
    setConfig,
    uploadedImage,
    setUploadedImage
  } = useChat();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-2xl flex flex-col h-[600px] border border-gray-200">
      <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-background-light">
        <span className="font-bold text-lg flex items-center gap-2"><BotIcon className="w-6 h-6" /> TestPro AI</span>
        <button onClick={() => setIsSettingsOpen(true)} aria-label="Settings">
          <SettingsIcon className="w-5 h-5 text-gray-500 hover:text-brand-primary" />
        </button>
      </header>
      <div className="flex-1 overflow-y-auto p-2" ref={chatWindowRef}>
        <ChatWindow messages={messages} />
      </div>
      <div className="p-2 border-t border-gray-200 bg-background-light">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading} 
          uploadedImage={uploadedImage}
          setUploadedImage={setUploadedImage}
        />
      </div>
      <SettingsPanel 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        setConfig={setConfig}
      />
    </div>
  );
};

export default ChatbotApp;
