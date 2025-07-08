import React, { createContext, useContext, ReactNode } from 'react';
import { useApiKey } from '../hooks/useApiKey';

interface ApiKeyContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  hasApiKey: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const useApiKeyContext = () => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKeyContext must be used within an ApiKeyProvider');
  }
  return context;
};

interface ApiKeyProviderProps {
  children: ReactNode;
}

export const ApiKeyProvider: React.FC<ApiKeyProviderProps> = ({ children }) => {
  const { apiKey, setApiKey, hasApiKey } = useApiKey();

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, hasApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
};