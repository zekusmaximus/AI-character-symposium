// src/renderer/types/electron.d.ts

/**
 * Type definitions for Electron IPC APIs exposed via preload.js
 */
declare global {
  interface Window {
    electron: {
      // App info methods
      getAppInfo: () => Promise<{
        version: string;
        name: string;
        platform: string;
      }>;
      
      // API key management
      apiKeys: {
        set: (service: string, key: string) => Promise<{ 
          success: boolean;
          error?: string;
        }>;
        get: (service: string) => Promise<{
          success: boolean;
          key?: string;
          error?: string;
        }>;
        has: (service: string) => Promise<{
          success: boolean;
          hasKey: boolean;
          error?: string;
        }>;
      };
      
      // Character AI functionality
      generateCharacterResponse: (
        characterId: string, 
        prompt: string, 
        conversationStyle: string
      ) => Promise<{
        success: boolean;
        response?: string;
        error?: string;
      }>;
      
      // Character management
      character: {
        get: (characterId: string) => Promise<any>;
        create: (characterData: any) => Promise<any>;
        update: (characterId: string, characterData: any) => Promise<any>;
        delete: (characterId: string) => Promise<{ success: boolean, error?: string }>;
      };
      
      // Memory management
      memory: {
        create: (memory: any) => Promise<any>;
        get: (characterId: string) => Promise<any[]>;
        update: (memoryId: string, memoryData: any) => Promise<any>;
        delete: (memoryId: string) => Promise<{ success: boolean, error?: string }>;
      };
      
      // Conversation history
      conversation: {
        save: (conversation: any) => Promise<any>;
        get: (conversationId: string) => Promise<any>;
        list: (characterId: string) => Promise<any[]>;
      };
      
      // Settings and preferences
      settings: {
        save: (settings: any) => Promise<{ success: boolean, error?: string }>;
        get: () => Promise<any>;
      };

      // Add ipcRenderer property for direct IPC access
      ipcRenderer: {
        invoke: (channel: string, ...args: any[]) => Promise<any>;
        on?: (channel: string, listener: (...args: any[]) => void) => void;
        once?: (channel: string, listener: (...args: any[]) => void) => void;
        removeListener?: (channel: string, listener: (...args: any[]) => void) => void;
      };
    };
  }
  
}

export {};