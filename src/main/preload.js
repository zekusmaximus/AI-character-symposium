import React from 'react';

const preload = () => {
  // Expose IPC renderer API to the window object
  window.electron = {
    ipcRenderer: require('electron').ipcRenderer,
    
    // App info
    getAppInfo: () => window.electron.ipcRenderer.invoke('get-app-info'),
    
    // API key management
    setOpenAIKey: (key) => window.electron.ipcRenderer.invoke('set-openai-key', key),
    setAnthropicKey: (key) => window.electron.ipcRenderer.invoke('set-anthropic-key', key),
    
    // Character AI
    generateCharacterResponse: (characterId, prompt, conversationStyle) => 
      window.electron.ipcRenderer.invoke('generate-character-response', { 
        characterId, 
        prompt, 
        conversationStyle 
      })
  };
};

// Execute the preload script
preload();
