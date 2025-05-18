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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log('Electron main process started');
var electron_1 = require("electron");
var path = __importStar(require("path"));
var AIService_1 = require("./services/AIService");
var keytar = __importStar(require("keytar"));
// Add global error handlers at the top
process.on('uncaughtException', function (err) {
    console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', function (reason, promise) {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
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
electron_1.ipcMain.handle('set-openai-key', function (event, key) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, keytar.setPassword('ai-character-council', 'openai', key)];
            case 1:
                _a.sent();
                return [2 /*return*/, { success: true }];
        }
    });
}); });
electron_1.ipcMain.handle('set-anthropic-key', function (event, key) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, keytar.setPassword('ai-character-council', 'anthropic', key)];
            case 1:
                _a.sent();
                return [2 /*return*/, { success: true }];
        }
    });
}); });
electron_1.ipcMain.handle('get-app-info', function () {
    return {
        version: electron_1.app.getVersion(),
        name: electron_1.app.getName(),
        platform: process.platform
    };
});
//# sourceMappingURL=main.js.map