import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { useApiKeyContext } from '../../contexts/ApiKeyContext';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import SettingsPanel from '../shared/SettingsPanel';
import SettingsIcon from '../shared/icons/SettingsIcon';
import BotIcon from '../shared/icons/BotIcon';

const ChatbotApp: React.FC = () => {
  const { apiKey, hasApiKey } = useApiKeyContext();
  const {
    messages,
    isLoading,
    handleSendMessage,
    chatWindowRef,
    config,
    setConfig,
    uploadedImage,
    setUploadedImage
  } = useChat(apiKey);
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
        {hasApiKey ? (
          <ChatWindow messages={messages} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">API Key Required</h3>
              <p className="text-gray-500 mb-4">Please add your Gemini API key in settings to start chatting.</p>
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90"
              >
                Open Settings
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="p-2 border-t border-gray-200 bg-background-light">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading}
          disabled={!hasApiKey}
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
