import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  getAppInfo: (): Promise<any> => ipcRenderer.invoke('get-app-info'),
  setOpenAIKey: (key: string): Promise<void> => ipcRenderer.invoke('set-openai-key', key),
  setAnthropicKey: (key: string): Promise<void> => ipcRenderer.invoke('set-anthropic-key', key),
  generateCharacterResponse: (params: { characterId: string; prompt: string; conversationStyle: string }): Promise<any> => 
    ipcRenderer.invoke('generate-character-response', params)
});
