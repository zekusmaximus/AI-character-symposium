// src/main/preload.js
const { contextBridge, ipcRenderer } = require('electron');

/**
 * Secure preload script that exposes a limited set of Electron
 * functionality to the renderer process via contextBridge.
 * 
 * This prevents direct access to Node.js and Electron APIs
 * from the renderer process, improving security.
 */
contextBridge.exposeInMainWorld('electron', {
  // App info methods
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),
  
  // API key management - Unified API with proper method naming
  apiKeys: {
    set: (service, key) => ipcRenderer.invoke('set-api-key', { service, key }),
    get: (service) => ipcRenderer.invoke('get-api-key', service),
    has: (service) => ipcRenderer.invoke('has-api-key', service),
  },
  
  // Character AI functionality
  generateCharacterResponse: (characterId, prompt, conversationStyle) => 
    ipcRenderer.invoke('generate-character-response', { 
      characterId, 
      prompt, 
      conversationStyle 
    }),
    
  // Character management
  character: {
    get: (characterId) => ipcRenderer.invoke('get-character', characterId),
    create: (characterData) => ipcRenderer.invoke('create-character', characterData),
    update: (characterId, characterData) => ipcRenderer.invoke('update-character', { characterId, characterData }),
    delete: (characterId) => ipcRenderer.invoke('delete-character', characterId),
  },
  
  // Memory management
  memory: {
    create: (memory) => ipcRenderer.invoke('create-memory', memory),
    get: (characterId) => ipcRenderer.invoke('get-memories', characterId),
    update: (memoryId, memoryData) => ipcRenderer.invoke('update-memory', { memoryId, memoryData }),
    delete: (memoryId) => ipcRenderer.invoke('delete-memory', memoryId),
  },
  
  // Conversation history
  conversation: {
    save: (conversation) => ipcRenderer.invoke('save-conversation', conversation),
    get: (conversationId) => ipcRenderer.invoke('get-conversation', conversationId),
    list: (characterId) => ipcRenderer.invoke('list-conversations', characterId),
  },
  
  // Settings and preferences
  settings: {
    save: (settings) => ipcRenderer.invoke('save-settings', settings),
    get: () => ipcRenderer.invoke('get-settings'),
  },
});

// Note: You should NOT have any other code that modifies the window object
// or tries to access Node.js APIs outside of the contextBridge