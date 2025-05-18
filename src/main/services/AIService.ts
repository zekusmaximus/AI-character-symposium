import { ipcMain } from 'electron';
import { PrismaClient } from '@prisma/client';
import * as keytar from 'keytar';
import { randomBytes, createCipheriv, createDecipheriv, scryptSync } from 'crypto';

// Initialize Prisma client
const prisma = new PrismaClient();

// Constants for keytar service
const SERVICE_NAME = 'AI-Character-Council';
const ALGORITHM = 'aes-256-gcm';
const APP_SECRET_KEY = process.env.APP_SECRET || 'default-dev-secret'; // In production, use a secure environment variable

// API service for secure AI model interactions
class AIService {
  private static instance: AIService;
  
  private constructor() {
    // Private constructor for singleton pattern
  }
  
  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }
  
  // Encrypt data before storing
  private async encrypt(data: string): Promise<{ encryptedData: string, iv: string }> {
    // Create a secure key from the app secret
    const key = scryptSync(APP_SECRET_KEY, 'salt', 32);
    
    // Create a random initialization vector
    const iv = randomBytes(16);
    
    // Create cipher and encrypt the data
    const cipher = createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    // Get the authentication tag
    const authTag = cipher.getAuthTag();
    
    // Store the encrypted data with the IV and auth tag
    return {
      encryptedData: encrypted + '.' + authTag.toString('base64'),
      iv: iv.toString('base64')
    };
  }
  
  // Decrypt stored data
  private async decrypt(encryptedData: string, iv: string): Promise<string> {
    try {
      // Create a secure key from the app secret
      const key = scryptSync(APP_SECRET_KEY, 'salt', 32);
      
      // Split encrypted data and auth tag
      const parts = encryptedData.split('.');
      if (parts.length !== 2) {
        throw new Error('Invalid encrypted data format');
      }
      
      const encrypted = parts[0];
      const authTag = Buffer.from(parts[1], 'base64');
      
      // Create decipher
      const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(iv, 'base64'));
      decipher.setAuthTag(authTag);
      
      // Decrypt the data
      let decrypted = decipher.update(encrypted, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Error decrypting data:', error);
      throw new Error('Failed to decrypt data');
    }
  }
  
  // Store API key securely
  public async storeApiKey(service: string, key: string): Promise<void> {
    try {
      // Encrypt the API key
      const { encryptedData, iv } = await this.encrypt(key);
      
      // Store the encrypted key and IV using keytar
      await keytar.setPassword(SERVICE_NAME, service, encryptedData);
      await keytar.setPassword(`${SERVICE_NAME}-iv`, service, iv);
      
      console.log(`${service} API key stored securely`);
    } catch (error) {
      console.error(`Error storing ${service} API key:`, error);
      throw error;
    }
  }
  
  // Get API key securely
  public async getApiKey(service: string): Promise<string | null> {
    try {
      // Get the encrypted key and IV
      const encryptedData = await keytar.getPassword(SERVICE_NAME, service);
      if (!encryptedData) {
        return null;
      }
      
      const iv = await keytar.getPassword(`${SERVICE_NAME}-iv`, service);
      if (!iv) {
        throw new Error('Initialization vector not found');
      }
      
      // Decrypt the API key
      return await this.decrypt(encryptedData, iv);
    } catch (error) {
      console.error(`Error retrieving ${service} API key:`, error);
      return null;
    }
  }
  
  // Delete API key
  public async deleteApiKey(service: string): Promise<void> {
    try {
      await keytar.deletePassword(SERVICE_NAME, service);
      await keytar.deletePassword(`${SERVICE_NAME}-iv`, service);
      console.log(`${service} API key removed`);
    } catch (error) {
      console.error(`Error removing ${service} API key:`, error);
      throw error;
    }
  }
  
  // Check if API key exists
  public async hasApiKey(service: string): Promise<boolean> {
    const key = await this.getApiKey(service);
    return !!key;
  }
  
  // Generate character response
  public async generateResponse(
    character: any, 
    prompt: string, 
    memories: any[],
    conversationStyle: string = 'accurate'
  ): Promise<string> {
    // First check OpenAI
    const openaiKey = await this.getApiKey('openai');
    if (openaiKey) {
      console.log('Using OpenAI for response generation');
      return this.mockOpenAIResponse(character, prompt, memories, conversationStyle);
    } 
    
    // Then check Anthropic
    const anthropicKey = await this.getApiKey('anthropic');
    if (anthropicKey) {
      console.log('Using Anthropic for response generation');
      return this.mockAnthropicResponse(character, prompt, memories, conversationStyle);
    }
    
    // Finally use local model if no keys available
    console.log('Using local model for response generation');
    return this.mockLocalModelResponse(character, prompt, memories, conversationStyle);
  }
  
  // Mock implementations for prototype
  private async mockOpenAIResponse(
    character: any, 
    prompt: string, 
    memories: any[],
    conversationStyle: string
  ): Promise<string> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple response generation based on character traits and prompt keywords
    const traits = character.traits?.toLowerCase() || '';
    const values = character.values?.toLowerCase() || '';
    
    let response = `As ${character.name}, I'm considering how to respond...`;
    
    if (prompt.toLowerCase().includes('mission') || prompt.toLowerCase().includes('goal')) {
      response = `My current mission is to explore new possibilities and overcome challenges. ${traits.includes('determined') ? 'I never back down from a challenge.' : ''}`;
    } else if (prompt.toLowerCase().includes('feel') || prompt.toLowerCase().includes('emotion')) {
      response = `I feel ${traits.includes('conflicted') ? 'conflicted about many things' : traits.includes('loyal') ? 'strongly committed to my allies' : 'cautiously optimistic'}. ${values.includes('honor') ? 'Honor guides my emotions and actions.' : ''}`;
    } else if (prompt.toLowerCase().includes('think') || prompt.toLowerCase().includes('opinion')) {
      response = `I think ${traits.includes('strategic') ? 'we should approach this methodically' : traits.includes('wise') ? 'there is more to this than meets the eye' : 'we should consider all angles'}. ${values.includes('truth') ? 'The truth is what matters most.' : ''}`;
    } else {
      response = `${traits.includes('mysterious') ? 'There are many layers to this situation.' : traits.includes('intelligent') ? 'I have analyzed this carefully.' : 'I understand your question.'} ${values.includes('knowledge') ? 'Knowledge is the key to understanding.' : values.includes('progress') ? 'Progress requires bold action.' : 'Let me share my perspective.'}`;
    }
    
    // Adjust response based on conversation style
    if (conversationStyle === 'concise') {
      response = response.split('.')[0] + '.';
    } else if (conversationStyle === 'detailed') {
      response += ` ${character.voicePatterns || ''} I've experienced many things that have shaped my perspective on this.`;
    }
    
    return response;
  }
  
  private async mockAnthropicResponse(
    character: any, 
    prompt: string, 
    memories: any[],
    conversationStyle: string
  ): Promise<string> {
    // Similar to OpenAI mock but with slight variations
    await new Promise(resolve => setTimeout(resolve, 1200));
    return this.mockOpenAIResponse(character, prompt, memories, conversationStyle);
  }
  
  private async mockLocalModelResponse(
    character: any, 
    prompt: string, 
    memories: any[],
    conversationStyle: string
  ): Promise<string> {
    // Simpler responses for local model
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const responses = [
      `As ${character.name}, I would say that's an interesting question.`,
      `Given my background, I have some thoughts on this matter.`,
      `I've considered this before, and my perspective is shaped by my experiences.`,
      `That's something I've dealt with in the past.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// Set up IPC handlers for main process
export const setupAIHandlers = () => {
  const aiService = AIService.getInstance();
  
  // Handle API key configuration
  ipcMain.handle('set-api-key', async (event, { service, key }) => {
    try {
      if (!key) {
        await aiService.deleteApiKey(service);
      } else {
        await aiService.storeApiKey(service, key);
      }
      return { success: true };
    } catch (error) {
      console.error(`Error handling API key for ${service}:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });
  
  // Handle API key retrieval
  ipcMain.handle('get-api-key', async (event, service) => {
    try {
      const key = await aiService.getApiKey(service);
      return { success: true, key };
    } catch (error) {
      console.error(`Error retrieving API key for ${service}:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });
  
  // Handle checking if API key exists
  ipcMain.handle('has-api-key', async (event, service) => {
    try {
      const hasKey = await aiService.hasApiKey(service);
      return { success: true, hasKey };
    } catch (error) {
      console.error(`Error checking API key for ${service}:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });
  
  // Handle character response generation
  ipcMain.handle('generate-character-response', async (event, { characterId, prompt, conversationStyle }) => {
    try {
      // In a real app, we would fetch the character and memories from the database
      const character = await prisma.character.findUnique({
        where: { id: characterId },
      });
      
      if (!character) {
        throw new Error('Character not found');
      }
      
      const memories = await prisma.characterMemory.findMany({
        where: { characterId },
        orderBy: { importance: 'desc' },
        take: 10,
      });
      
      const response = await aiService.generateResponse(
        character,
        prompt,
        memories,
        conversationStyle
      );
      
      return { success: true, response };
    } catch (error) {
      console.error('Error generating character response:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  });
};

export default AIService;