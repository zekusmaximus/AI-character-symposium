import React, { useState, useEffect, createContext, useContext } from 'react';

// Define the types for our context
interface ApiKeyContextType {
  apiKeys: {
    openai: string;
    anthropic: string;
  };
  setApiKey: (service: 'openai' | 'anthropic', key: string) => Promise<void>;
  isConfigured: (service: 'openai' | 'anthropic') => boolean;
  clearApiKey: (service: 'openai' | 'anthropic') => Promise<void>;
}

// Create the context with default values
const ApiKeyContext = createContext<ApiKeyContextType>({
  apiKeys: {
    openai: '',
    anthropic: '',
  },
  setApiKey: async () => {},
  isConfigured: () => false,
  clearApiKey: async () => {},
});

// Custom hook to use the API key context
export const useApiKeys = () => useContext(ApiKeyContext);

// Provider component for API keys
export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    anthropic: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load API keys from secure storage on component mount
  useEffect(() => {
    const loadApiKeys = async () => {
      try {
        setIsLoading(true);
        
        // Check if API keys are configured
        const openaiResult = await window.electron.apiKeys.has('openai');
        const anthropicResult = await window.electron.apiKeys.has('anthropic');
        
        setApiKeys({
          openai: openaiResult.hasKey ? '••••••••••••••••' : '',
          anthropic: anthropicResult.hasKey ? '••••••••••••••••' : '',
        });
      } catch (error) {
        console.error('Error loading API keys:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadApiKeys();
  }, []);

  // Set an API key and store it securely
  const setApiKey = async (service: 'openai' | 'anthropic', key: string) => {
    try {
      await window.electron.apiKeys.set(service, key);
      
      setApiKeys(prev => ({
        ...prev,
        [service]: key ? '••••••••••••••••' : ''
      }));
    } catch (error) {
      console.error(`Error setting ${service} API key:`, error);
      throw error;
    }
  };

  // Check if an API key is configured
  const isConfigured = (service: 'openai' | 'anthropic'): boolean => {
    return !!apiKeys[service];
  };

  // Clear an API key
  const clearApiKey = async (service: 'openai' | 'anthropic') => {
    try {
      await window.electron.apiKeys.set(service, '');
      
      setApiKeys(prev => ({
        ...prev,
        [service]: ''
      }));
    } catch (error) {
      console.error(`Error clearing ${service} API key:`, error);
      throw error;
    }
  };

  // Don't render children until keys are loaded
  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <ApiKeyContext.Provider value={{ apiKeys, setApiKey, isConfigured, clearApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export default ApiKeyProvider;