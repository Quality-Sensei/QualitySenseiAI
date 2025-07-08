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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: 'var(--text-main)' }}>{label}</span>
        <button
            onClick={() => onChange(!enabled)}
            style={{
                position: 'relative',
                height: 24,
                width: 44,
                borderRadius: 9999,
                background: enabled ? 'var(--accent-teal)' : 'var(--secondary-blue)',
                transition: 'background 0.2s',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
            }}
        >
            <span
                style={{
                    display: 'inline-block',
                    height: 16,
                    width: 16,
                    borderRadius: '50%',
                    background: 'var(--primary-base)',
                    transform: enabled ? 'translateX(20px)' : 'translateX(4px)',
                    transition: 'transform 0.2s',
                }}
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
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.3)',
          zIndex: 40,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s',
        }}
        onClick={onClose}
      ></div>

      {/* Panel */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          width: 340,
          background: 'rgba(255,255,255,0.92)',
          boxShadow: '0 8px 32px 0 var(--accent-teal)',
          borderRight: '2px solid var(--accent-teal)',
          borderTopRightRadius: '2rem',
          borderBottomRightRadius: '2rem',
          zIndex: 50,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s',
          display: 'flex',
          flexDirection: 'column',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        }}
        className="legendary-glass"
      >
        <header style={{ padding: 24, borderBottom: '1.5px solid var(--secondary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--accent-teal)', letterSpacing: '-0.02em', textShadow: '0 0 8px var(--accent-teal)' }}>Model Settings</h2>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 24, cursor: 'pointer' }}
            aria-label="Close settings"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </header>
        <div style={{ padding: 24, flex: 1, overflowY: 'auto' }}>
          <div style={{ marginBottom: 32 }}>
            <label htmlFor="api-key" style={{ color: 'var(--accent-teal)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 8, display: 'block' }}>Gemini API Key</label>
            <input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.7)',
                border: '1.5px solid var(--secondary-blue)',
                borderRadius: '1rem',
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
                padding: '1rem 1.25rem',
                color: 'var(--text-main)',
                fontSize: '1.1rem',
                outline: 'none',
                marginTop: 4,
                marginBottom: 8,
              }}
              className="focus-ring"
            />
          </div>

          {/* Temperature */}
          <div style={{ marginBottom: 32 }}>
            <label htmlFor="temperature" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>
              Temperature
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: 8 }}>{config.temperature.toFixed(2)}</span>
            </label>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 8 }}>Controls randomness. Lower is more predictable.</p>
            <input
              id="temperature"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={config.temperature}
              onChange={(e) => handleConfigChange('temperature', parseFloat(e.target.value))}
              style={{
                width: '100%',
                height: 8,
                borderRadius: 4,
                background: 'var(--bg-secondary)',
                cursor: 'pointer',
                appearance: 'none',
              }}
            />
          </div>

          {/* Max Output Tokens */}
          <div style={{ marginBottom: 32 }}>
            <label htmlFor="maxOutputTokens" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>
              Max Output Tokens
            </label>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 8 }}>Maximum length of the AI's response.</p>
            <input
              id="maxOutputTokens"
              type="number"
              min="1"
              max="8192"
              step="1"
              value={config.maxOutputTokens}
              onChange={(e) => handleConfigChange('maxOutputTokens', parseInt(e.target.value, 10))}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--border-color)',
                outline: 'none',
                transition: 'box-shadow 0.2s',
                boxShadow: apiKey ? '0 0 0 2px var(--accent-teal)' : 'none',
              }}
            />
          </div>

          {/* Thinking Toggle */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>
              Thinking Feature
            </label>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 8 }}>Enable for higher quality, disable for lower latency.</p>
            <ToggleSwitch 
              label="Enable Thinking"
              enabled={config.isThinkingEnabled}
              onChange={(value) => handleConfigChange('isThinkingEnabled', value)}
            />
          </div>
        </div>

        <footer style={{ padding: 16, textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--secondary-blue)' }}>
          <p>Settings are applied to the next message.</p>
        </footer>
      </div>
    </>
  );
};

export default SettingsPanel;