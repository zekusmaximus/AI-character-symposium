console.log('Electron main process started');
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';
import { setupAIHandlers } from './services/AIService';
import * as keytar from 'keytar';

const prisma = new PrismaClient();

const DEFAULT_PROJECT_ID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'; // Valid UUID v4
const DEFAULT_PROJECT_NAME = 'Default Project';

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
app.whenReady().then(async () => { // Made async
  // Ensure default project exists
  try {
    await prisma.project.upsert({
      where: { id: DEFAULT_PROJECT_ID },
      update: {},
      create: {
        id: DEFAULT_PROJECT_ID,
        name: DEFAULT_PROJECT_NAME,
      },
    });
    console.log(`Ensured default project "${DEFAULT_PROJECT_NAME}" (ID: ${DEFAULT_PROJECT_ID}) exists.`);
  } catch (error) {
    console.error('Error ensuring default project:', error);
    // Depending on the application's needs, you might want to handle this more gracefully,
    // e.g., by preventing the app from starting or alerting the user.
  }

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

// Timeline IPC Handlers
ipcMain.handle('get-timelines', async (event, projectId: string) => {
  if (!projectId) {
    console.error('Error fetching timelines: projectId is required.');
    return { success: false, error: 'projectId is required to fetch timelines.' };
  }
  try {
    const timelines = await prisma.timeline.findMany({
      where: { projectId },
      orderBy: { name: 'asc' }
    });
    return { success: true, data: timelines };
  } catch (error: any) {
    console.error('Error fetching timelines:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('create-timeline', async (event, data: { name: string; description?: string; projectId: string }) => {
  const { name, description, projectId } = data;
  if (!name || !projectId) {
    console.error('Error creating timeline: name and projectId are required.');
    return { success: false, error: 'Name and projectId are required to create a timeline.' };
  }
  try {
    const newTimeline = await prisma.timeline.create({
      data: {
        name,
        description,
        projectId
      }
    });
    return { success: true, data: newTimeline };
  } catch (error: any) {
    console.error('Error creating timeline:', error);
    return { success: false, error: error.message };
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

// Project IPC Handlers
ipcMain.handle('get-projects', async () => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'asc' }
    });
    return { success: true, data: projects };
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('create-project', async (event, data: { name: string; description?: string }) => {
  try {
    const newProject = await prisma.project.create({
      data
    });
    return { success: true, data: newProject };
  } catch (error: any) {
    console.error('Error creating project:', error);
    return { success: false, error: error.message };
  }
});


// TimelineEvent IPC Handlers

ipcMain.handle('get-timeline-events', async (event, timelineId: string) => {
  if (!timelineId) {
    return { success: false, error: 'timelineId is required to fetch timeline events.' };
  }
  try {
    const events = await prisma.timelineEvent.findMany({
      where: { timelineId },
      orderBy: { date: 'asc' }
    });
    return { success: true, data: events };
  } catch (error: any) {
    console.error('Error fetching timeline events:', error);
    return { success: false, error: error.message };
  }
});

// Note IPC Handlers

ipcMain.handle('get-notes', async (event, projectId?: string | null) => {
  try {
    let targetProjectId = DEFAULT_PROJECT_ID; // Default to DEFAULT_PROJECT_ID
    if (projectId && projectId.trim() !== '') {
      targetProjectId = projectId;
    }

    const notes = await prisma.note.findMany({
      where: { projectId: targetProjectId },
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

ipcMain.handle('create-timeline-event', async (event, data: { date: string, description: string, charactersInvolved: string, timelineId: string }) => {
  try {
    const newEvent = await prisma.timelineEvent.create({
      data: {
        ...data,
        date: new Date(data.date),
        // timelineId is already part of data due to updated signature
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