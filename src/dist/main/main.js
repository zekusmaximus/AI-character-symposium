"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = __importStar(require("path"));
var AIService_1 = require("./services/AIService");
var keytar = __importStar(require("keytar"));
var mainWindow = null;
function createWindow() {
    // Create the browser window
    mainWindow = new electron_1.BrowserWindow({
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
    }
    else {
        // In production, load from built files
        mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    }
    // Handle window close
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}
// Initialize app
electron_1.app.whenReady().then(function () {
    // Check if keytar is available
    try {
        // Test keytar functionality
        keytar.setPassword('test-service', 'test-account', 'test-password').then(function () {
            keytar.deletePassword('test-service', 'test-account').then(function () {
                console.log('Secure credential storage is working properly');
            });
        });
    }
    catch (error) {
        console.error('Error initializing secure credential storage:', error);
    }
    // Register API handlers first
    (0, AIService_1.setupAIHandlers)();
    // Create the main window
    createWindow();
    electron_1.app.on('activate', function () {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
// Quit when all windows are closed, except on macOS
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
// Set up IPC handlers for renderer process communication
electron_1.ipcMain.handle('get-app-info', function () {
    return {
        version: electron_1.app.getVersion(),
        name: electron_1.app.getName(),
        platform: process.platform
    };
});
//# sourceMappingURL=main.js.map