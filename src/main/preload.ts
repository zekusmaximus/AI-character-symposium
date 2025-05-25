import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
    // Potentially add other methods like 'on', 'send' if needed later
  },
  // Keep existing specific handlers for now, or refactor them later to use the generic invoke
  getAppInfo: (): Promise<any> => ipcRenderer.invoke('get-app-info'),
  setOpenAIKey: (key: string): Promise<void> => ipcRenderer.invoke('set-openai-key', key),
  setAnthropicKey: (key: string): Promise<void> => ipcRenderer.invoke('set-anthropic-key', key),
  generateCharacterResponse: (params: { characterId: string; prompt: string; conversationStyle: string }): Promise<any> => 
    ipcRenderer.invoke('generate-character-response', params)
});
