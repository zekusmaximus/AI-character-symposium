import React, { useState, useEffect, createContext, useContext } from 'react';

// Define the types for our context
interface ApiKeyContextType {
  apiKeys: {
    openai: string;
    anthropic: string;
  };
  setApiKey: (service: 'openai' | 'anthropic', key: string) => void;
  isConfigured: (service: 'openai' | 'anthropic') => boolean;
  clearApiKey: (service: 'openai' | 'anthropic') => void;
}

// Create the context with default values
const ApiKeyContext = createContext<ApiKeyContextType>({
  apiKeys: {
    openai: '',
    anthropic: '',
  },
  setApiKey: () => {},
  isConfigured: () => false,
  clearApiKey: () => {},
});

// Custom hook to use the API key context
export const useApiKeys = () => useContext(ApiKeyContext);

// Secure storage utility (simplified for prototype)
// In a production app, this would use more secure methods like keytar or electron-store with encryption
const SecureStorage = {
  // Encrypt data before storing
  encrypt: (data: string): string => {
    // This is a placeholder for actual encryption
    // In a real app, use a proper encryption library
    return btoa(`encrypted:${data}`);
  },

  // Decrypt data after retrieving
  decrypt: (encryptedData: string): string => {
    // This is a placeholder for actual decryption
    // In a real app, use a proper decryption method
    if (!encryptedData) return '';
    try {
      const decoded = atob(encryptedData);
      return decoded.startsWith('encrypted:') ? decoded.substring(10) : '';
    } catch (e) {
      console.error('Error decrypting data', e);
      return '';
    }
  },

  // Store data securely
  setItem: (key: string, value: string): void => {
    if (!value) {
      localStorage.removeItem(key);
      return;
    }
    const encrypted = SecureStorage.encrypt(value);
    localStorage.setItem(key, encrypted);
  },

  // Retrieve data securely
  getItem: (key: string): string => {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return '';
    return SecureStorage.decrypt(encrypted);
  },

  // Remove data
  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  }
};

// Provider component for API keys
export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    anthropic: '',
  });

  // Load API keys from secure storage on component mount
  useEffect(() => {
    const loadedOpenAI = SecureStorage.getItem('api_key_openai');
    const loadedAnthropic = SecureStorage.getItem('api_key_anthropic');
    
    setApiKeys({
      openai: loadedOpenAI || '',
      anthropic: loadedAnthropic || '',
    });
  }, []);

  // Set an API key and store it securely
  const setApiKey = (service: 'openai' | 'anthropic', key: string) => {
    SecureStorage.setItem(`api_key_${service}`, key);
    setApiKeys(prev => ({
      ...prev,
      [service]: key
    }));
  };

  // Check if an API key is configured
  const isConfigured = (service: 'openai' | 'anthropic'): boolean => {
    return !!apiKeys[service];
  };

  // Clear an API key
  const clearApiKey = (service: 'openai' | 'anthropic') => {
    SecureStorage.removeItem(`api_key_${service}`);
    setApiKeys(prev => ({
      ...prev,
      [service]: ''
    }));
  };

  return (
    <ApiKeyContext.Provider value={{ apiKeys, setApiKey, isConfigured, clearApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export default ApiKeyProvider;
