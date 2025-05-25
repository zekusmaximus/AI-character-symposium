console.log('Electron main process started');
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';
import { setupAIHandlers } from './services/AIService';
import * as keytar from 'keytar';

const prisma = new PrismaClient();

// Add global error handlers at the top
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // Disable Node.js integration in the renderer process for security
      nodeIntegration: false,
      // Enable Context Isolation for security
      contextIsolation: true,
      // Preload script to expose IPC APIs securely
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    // In development, load from webpack dev server
    mainWindow.loadURL('http://localhost:3000');
    // Open DevTools
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from built files
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Initialize app
app.whenReady().then(() => {
  // Check if keytar is available
  try {
    // Test keytar functionality
    keytar.setPassword('test-service', 'test-account', 'test-password').then(() => {
      keytar.deletePassword('test-service', 'test-account').then(() => {
        console.log('Secure credential storage is working properly');
      });
    });
  } catch (error) {
    console.error('Error initializing secure credential storage:', error);
  }

  // Register API handlers first
  setupAIHandlers();
  
  // Create the main window
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Set up IPC handlers for renderer process communication
// Remove duplicate handlers for set-api-key and get-api-key
// ipcMain.handle('set-api-key', async (event, { service, key }) => {
//   await keytar.setPassword('ai-character-council', service, key);
//   return { success: true };
// });
//
// ipcMain.handle('get-api-key', async (event, { service }) => {
//   const key = await keytar.getPassword('ai-character-council', service);
//   return { success: true, key };
// });

// Add missing handlers for OpenAI and Anthropic keys
ipcMain.handle('set-openai-key', async (event, key) => {
  await keytar.setPassword('ai-character-council', 'openai', key);
  return { success: true };
});
ipcMain.handle('set-anthropic-key', async (event, key) => {
  await keytar.setPassword('ai-character-council', 'anthropic', key);
  return { success: true };
});

ipcMain.handle('get-app-info', () => {
  return {
    version: app.getVersion(),
    name: app.getName(),
    platform: process.platform
  };
});

// TimelineEvent IPC Handlers

ipcMain.handle('get-timeline-events', async () => {
  try {
    const events = await prisma.timelineEvent.findMany({
      orderBy: { date: 'asc' }
    });
    return { success: true, data: events };
  } catch (error: any) {
    console.error('Error fetching timeline events:', error);
    return { success: false, error: error.message };
  }
});

// Note IPC Handlers

ipcMain.handle('get-notes', async () => {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: notes };
  } catch (error: any) {
    console.error('Error fetching notes:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('create-note', async (event, data: { title: string, content: string, tags?: string, projectId: string }) => {
  try {
    const newNote = await prisma.note.create({
      data
    });
    return { success: true, data: newNote };
  } catch (error: any) {
    console.error('Error creating note:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-note', async (event, { id, data }: { id: string, data: { title?: string, content?: string, tags?: string }}) => {
  try {
    const updatedNote = await prisma.note.update({
      where: { id },
      data
    });
    return { success: true, data: updatedNote };
  } catch (error: any) {
    console.error('Error updating note:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-note', async (event, id: string) => {
  try {
    await prisma.note.delete({
      where: { id }
    });
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting note:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('create-timeline-event', async (event, data: { date: string, description: string, charactersInvolved: string }) => {
  try {
    const newEvent = await prisma.timelineEvent.create({
      data: {
        ...data,
        date: new Date(data.date)
      }
    });
    return { success: true, data: newEvent };
  } catch (error: any) {
    console.error('Error creating timeline event:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-timeline-event', async (event, { id, data }: { id: number, data: { date?: string, description?: string, charactersInvolved?: string }}) => {
  try {
    const updatedEvent = await prisma.timelineEvent.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined
      }
    });
    return { success: true, data: updatedEvent };
  } catch (error: any) {
    console.error('Error updating timeline event:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-timeline-event', async (event, id: number) => {
  try {
    await prisma.timelineEvent.delete({
      where: { id }
    });
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting timeline event:', error);
    return { success: false, error: error.message };
  }
});