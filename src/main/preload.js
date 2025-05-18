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
  
  // API key management
  setOpenAIKey: (key) => ipcRenderer.invoke('set-openai-key', key),
  setAnthropicKey: (key) => ipcRenderer.invoke('set-anthropic-key', key),
  
  // Character AI functionality
  generateCharacterResponse: (characterId, prompt, conversationStyle) => 
    ipcRenderer.invoke('generate-character-response', { 
      characterId, 
      prompt, 
      conversationStyle 
    }),
    
  // You can add additional functionality here as needed
  // Examples of other methods you might want to expose:
  
  // Character management
  getCharacter: (characterId) => 
    ipcRenderer.invoke('get-character', characterId),
  
  createCharacter: (characterData) => 
    ipcRenderer.invoke('create-character', characterData),
  
  updateCharacter: (characterId, characterData) => 
    ipcRenderer.invoke('update-character', { characterId, characterData }),
  
  deleteCharacter: (characterId) => 
    ipcRenderer.invoke('delete-character', characterId),
  
  // Memory management
  createMemory: (memory) => 
    ipcRenderer.invoke('create-memory', memory),
  
  // Conversation history
  saveConversation: (conversation) => 
    ipcRenderer.invoke('save-conversation', conversation),
  
  // Settings and preferences
  saveSettings: (settings) => 
    ipcRenderer.invoke('save-settings', settings),
  
  getSettings: () => 
    ipcRenderer.invoke('get-settings'),
});

// Note: You should NOT have any other code that modifies the window object
// or tries to access Node.js APIs outside of the contextBridge