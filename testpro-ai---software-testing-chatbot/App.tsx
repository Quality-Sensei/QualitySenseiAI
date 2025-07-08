import React, { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import BotIcon from './components/icons/BotIcon';
import { useChat } from './hooks/useChat';
import SettingsPanel from './components/SettingsPanel';
import SettingsIcon from './components/icons/SettingsIcon';

const App: React.FC = () => {
  const { 
    messages, 
    isLoading, 
    error, 
    handleSendMessage, 
    chatWindowRef,
    config,
    setConfig,
    uploadedImage,
    setUploadedImage
  } = useChat();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="font-sans w-screen h-screen flex bg-background-light text-text-primary">
      <SettingsPanel 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        setConfig={setConfig}
      />

      <div className="flex-1 flex flex-col transition-all duration-300">
        <header className="bg-background-light border-b border-border-color p-4 shadow-sm flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="bg-brand-primary p-2 rounded-full">
                <BotIcon className="w-6 h-6 text-white" />
            </div>
            <div>
                <h1 className="text-xl font-bold text-text-primary">TestPro AI</h1>
                <p className="text-sm text-text-secondary">Your AI Software Testing Partner</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)} 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Toggle settings"
          >
            <SettingsIcon className="w-6 h-6 text-gray-600" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto bg-brand-secondary" ref={chatWindowRef}>
          <ChatWindow messages={messages} />
        </main>

        <footer className="bg-background-light p-4 border-t border-border-color flex-shrink-0">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading}
            uploadedImage={uploadedImage}
            setUploadedImage={setUploadedImage}
          />
          {error && <p className="text-red-500 text-center text-sm mt-2">{error}</p>}
        </footer>
      </div>
    </div>
  );
};

export default App;