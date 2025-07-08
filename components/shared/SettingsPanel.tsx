import React from 'react';
import { GenerationConfig } from '../../types/chatbot';
import { useApiKeyContext } from '../../contexts/ApiKeyContext';
import XIcon from './icons/XIcon';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  config: GenerationConfig;
  setConfig: (config: GenerationConfig) => void;
}

const ToggleSwitch: React.FC<{
    label: string;
    enabled: boolean;
    onChange: (enabled: boolean) => void;
}> = ({ label, enabled, onChange }) => (
    <div className="flex items-center justify-between">
        <span className="text-gray-700">{label}</span>
        <button
            onClick={() => onChange(!enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                enabled ? 'bg-brand-primary' : 'bg-gray-300'
            }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    </div>
);

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, config, setConfig }) => {
  const { apiKey, setApiKey } = useApiKeyContext();
  
  const handleConfigChange = (key: keyof GenerationConfig, value: any) => {
    setConfig({ ...config, [key]: value });
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>

      {/* Panel */}
      <div 
        className={`fixed top-0 left-0 h-full bg-background-light w-80 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
            <header className="p-4 border-b border-border-color flex items-center justify-between flex-shrink-0">
                <h2 className="text-lg font-bold">Model Settings</h2>
                <button 
                    onClick={onClose} 
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Close settings"
                >
                    <XIcon className="w-5 h-5 text-gray-600" />
                </button>
            </header>

            <div className="p-6 space-y-8 flex-1 overflow-y-auto">
                {/* API Key */}
                <div>
                    <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                        Gemini API Key
                    </label>
                    <p className="text-xs text-gray-500 mb-2">Enter your Google AI Studio API key to use the application.</p>
                    <input
                        id="apiKey"
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your Gemini API key..."
                        className="w-full p-2 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                    {!apiKey && (
                        <p className="text-xs text-red-500 mt-1">API key is required to use AI features</p>
                    )}
                </div>

                {/* Temperature */}
                <div>
                    <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
                        Temperature
                        <span className="text-xs text-gray-500 ml-2">{config.temperature.toFixed(2)}</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-2">Controls randomness. Lower is more predictable.</p>
                    <input
                        id="temperature"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={config.temperature}
                        onChange={(e) => handleConfigChange('temperature', parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                    />
                </div>

                {/* Max Output Tokens */}
                <div>
                    <label htmlFor="maxOutputTokens" className="block text-sm font-medium text-gray-700">
                        Max Output Tokens
                    </label>
                    <p className="text-xs text-gray-500 mb-2">Maximum length of the AI's response.</p>
                    <input
                        id="maxOutputTokens"
                        type="number"
                        min="1"
                        max="8192"
                        step="1"
                        value={config.maxOutputTokens}
                        onChange={(e) => handleConfigChange('maxOutputTokens', parseInt(e.target.value, 10))}
                        className="w-full p-2 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                </div>

                {/* Thinking Toggle */}
                <div>
                     <label className="block text-sm font-medium text-gray-700">
                        Thinking Feature
                    </label>
                     <p className="text-xs text-gray-500 mb-2">Enable for higher quality, disable for lower latency.</p>
                    <ToggleSwitch 
                        label="Enable Thinking"
                        enabled={config.isThinkingEnabled}
                        onChange={(value) => handleConfigChange('isThinkingEnabled', value)}
                    />
                </div>
            </div>

            <footer className="p-4 text-center text-xs text-gray-400 border-t border-border-color">
                <p>Settings are applied to the next message.</p>
            </footer>
        </div>
      </div>
    </>
  );
};

export default SettingsPanel;