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
exports.setupAIHandlers = void 0;
var electron_1 = require("electron");
var client_1 = require("@prisma/client");
var keytar = __importStar(require("keytar"));
var crypto_1 = require("crypto");
// Initialize Prisma client
var prisma = new client_1.PrismaClient();
// Constants for keytar service
var SERVICE_NAME = 'AI-Character-Council';
var ALGORITHM = 'aes-256-gcm';
var APP_SECRET_KEY = process.env.APP_SECRET || 'default-dev-secret'; // In production, use a secure environment variable
// API service for secure AI model interactions
var AIService = /** @class */ (function () {
    function AIService() {
        // Private constructor for singleton pattern
    }
    AIService.getInstance = function () {
        if (!AIService.instance) {
            AIService.instance = new AIService();
        }
        return AIService.instance;
    };
    // Encrypt data before storing
    AIService.prototype.encrypt = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var key, iv, cipher, encrypted, authTag;
            return __generator(this, function (_a) {
                key = (0, crypto_1.scryptSync)(APP_SECRET_KEY, 'salt', 32);
                iv = (0, crypto_1.randomBytes)(16);
                cipher = (0, crypto_1.createCipheriv)(ALGORITHM, key, iv);
                encrypted = cipher.update(data, 'utf8', 'base64');
                encrypted += cipher.final('base64');
                authTag = cipher.getAuthTag();
                // Store the encrypted data with the IV and auth tag
                return [2 /*return*/, {
                        encryptedData: encrypted + '.' + authTag.toString('base64'),
                        iv: iv.toString('base64')
                    }];
            });
        });
    };
    // Decrypt stored data
    AIService.prototype.decrypt = function (encryptedData, iv) {
        return __awaiter(this, void 0, void 0, function () {
            var key, parts, encrypted, authTag, decipher, decrypted;
            return __generator(this, function (_a) {
                try {
                    key = (0, crypto_1.scryptSync)(APP_SECRET_KEY, 'salt', 32);
                    parts = encryptedData.split('.');
                    if (parts.length !== 2) {
                        throw new Error('Invalid encrypted data format');
                    }
                    encrypted = parts[0];
                    authTag = Buffer.from(parts[1], 'base64');
                    decipher = (0, crypto_1.createDecipheriv)(ALGORITHM, key, Buffer.from(iv, 'base64'));
                    decipher.setAuthTag(authTag);
                    decrypted = decipher.update(encrypted, 'base64', 'utf8');
                    decrypted += decipher.final('utf8');
                    return [2 /*return*/, decrypted];
                }
                catch (error) {
                    console.error('Error decrypting data:', error);
                    throw new Error('Failed to decrypt data');
                }
                return [2 /*return*/];
            });
        });
    };
    // Store API key securely
    AIService.prototype.storeApiKey = function (service, key) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, encryptedData, iv, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.encrypt(key)];
                    case 1:
                        _a = _b.sent(), encryptedData = _a.encryptedData, iv = _a.iv;
                        // Store the encrypted key and IV using keytar
                        return [4 /*yield*/, keytar.setPassword(SERVICE_NAME, service, encryptedData)];
                    case 2:
                        // Store the encrypted key and IV using keytar
                        _b.sent();
                        return [4 /*yield*/, keytar.setPassword("".concat(SERVICE_NAME, "-iv"), service, iv)];
                    case 3:
                        _b.sent();
                        console.log("".concat(service, " API key stored securely"));
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _b.sent();
                        console.error("Error storing ".concat(service, " API key:"), error_1);
                        throw error_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Get API key securely
    AIService.prototype.getApiKey = function (service) {
        return __awaiter(this, void 0, void 0, function () {
            var encryptedData, iv, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, keytar.getPassword(SERVICE_NAME, service)];
                    case 1:
                        encryptedData = _a.sent();
                        if (!encryptedData) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, keytar.getPassword("".concat(SERVICE_NAME, "-iv"), service)];
                    case 2:
                        iv = _a.sent();
                        if (!iv) {
                            throw new Error('Initialization vector not found');
                        }
                        return [4 /*yield*/, this.decrypt(encryptedData, iv)];
                    case 3: 
                    // Decrypt the API key
                    return [2 /*return*/, _a.sent()];
                    case 4:
                        error_2 = _a.sent();
                        console.error("Error retrieving ".concat(service, " API key:"), error_2);
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Delete API key
    AIService.prototype.deleteApiKey = function (service) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, keytar.deletePassword(SERVICE_NAME, service)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, keytar.deletePassword("".concat(SERVICE_NAME, "-iv"), service)];
                    case 2:
                        _a.sent();
                        console.log("".concat(service, " API key removed"));
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        console.error("Error removing ".concat(service, " API key:"), error_3);
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Check if API key exists
    AIService.prototype.hasApiKey = function (service) {
        return __awaiter(this, void 0, void 0, function () {
            var key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getApiKey(service)];
                    case 1:
                        key = _a.sent();
                        return [2 /*return*/, !!key];
                }
            });
        });
    };
    // Generate character response
    AIService.prototype.generateResponse = function (character_1, prompt_1, memories_1) {
        return __awaiter(this, arguments, void 0, function (character, prompt, memories, conversationStyle) {
            var openaiKey, anthropicKey;
            if (conversationStyle === void 0) { conversationStyle = 'accurate'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getApiKey('openai')];
                    case 1:
                        openaiKey = _a.sent();
                        if (openaiKey) {
                            console.log('Using OpenAI for response generation');
                            return [2 /*return*/, this.mockOpenAIResponse(character, prompt, memories, conversationStyle)];
                        }
                        return [4 /*yield*/, this.getApiKey('anthropic')];
                    case 2:
                        anthropicKey = _a.sent();
                        if (anthropicKey) {
                            console.log('Using Anthropic for response generation');
                            return [2 /*return*/, this.mockAnthropicResponse(character, prompt, memories, conversationStyle)];
                        }
                        // Finally use local model if no keys available
                        console.log('Using local model for response generation');
                        return [2 /*return*/, this.mockLocalModelResponse(character, prompt, memories, conversationStyle)];
                }
            });
        });
    };
    // Mock implementations for prototype
    AIService.prototype.mockOpenAIResponse = function (character, prompt, memories, conversationStyle) {
        return __awaiter(this, void 0, void 0, function () {
            var traits, values, response;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: 
                    // Simulate API call delay
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                    case 1:
                        // Simulate API call delay
                        _c.sent();
                        traits = ((_a = character.traits) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
                        values = ((_b = character.values) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || '';
                        response = "As ".concat(character.name, ", I'm considering how to respond...");
                        if (prompt.toLowerCase().includes('mission') || prompt.toLowerCase().includes('goal')) {
                            response = "My current mission is to explore new possibilities and overcome challenges. ".concat(traits.includes('determined') ? 'I never back down from a challenge.' : '');
                        }
                        else if (prompt.toLowerCase().includes('feel') || prompt.toLowerCase().includes('emotion')) {
                            response = "I feel ".concat(traits.includes('conflicted') ? 'conflicted about many things' : traits.includes('loyal') ? 'strongly committed to my allies' : 'cautiously optimistic', ". ").concat(values.includes('honor') ? 'Honor guides my emotions and actions.' : '');
                        }
                        else if (prompt.toLowerCase().includes('think') || prompt.toLowerCase().includes('opinion')) {
                            response = "I think ".concat(traits.includes('strategic') ? 'we should approach this methodically' : traits.includes('wise') ? 'there is more to this than meets the eye' : 'we should consider all angles', ". ").concat(values.includes('truth') ? 'The truth is what matters most.' : '');
                        }
                        else {
                            response = "".concat(traits.includes('mysterious') ? 'There are many layers to this situation.' : traits.includes('intelligent') ? 'I have analyzed this carefully.' : 'I understand your question.', " ").concat(values.includes('knowledge') ? 'Knowledge is the key to understanding.' : values.includes('progress') ? 'Progress requires bold action.' : 'Let me share my perspective.');
                        }
                        // Adjust response based on conversation style
                        if (conversationStyle === 'concise') {
                            response = response.split('.')[0] + '.';
                        }
                        else if (conversationStyle === 'detailed') {
                            response += " ".concat(character.voicePatterns || '', " I've experienced many things that have shaped my perspective on this.");
                        }
                        return [2 /*return*/, response];
                }
            });
        });
    };
    AIService.prototype.mockAnthropicResponse = function (character, prompt, memories, conversationStyle) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Similar to OpenAI mock but with slight variations
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1200); })];
                    case 1:
                        // Similar to OpenAI mock but with slight variations
                        _a.sent();
                        return [2 /*return*/, this.mockOpenAIResponse(character, prompt, memories, conversationStyle)];
                }
            });
        });
    };
    AIService.prototype.mockLocalModelResponse = function (character, prompt, memories, conversationStyle) {
        return __awaiter(this, void 0, void 0, function () {
            var responses;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Simpler responses for local model
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                    case 1:
                        // Simpler responses for local model
                        _a.sent();
                        responses = [
                            "As ".concat(character.name, ", I would say that's an interesting question."),
                            "Given my background, I have some thoughts on this matter.",
                            "I've considered this before, and my perspective is shaped by my experiences.",
                            "That's something I've dealt with in the past."
                        ];
                        return [2 /*return*/, responses[Math.floor(Math.random() * responses.length)]];
                }
            });
        });
    };
    return AIService;
}());
// Set up IPC handlers for main process
var setupAIHandlers = function () {
    var aiService = AIService.getInstance();
    // Handle API key configuration
    electron_1.ipcMain.handle('set-api-key', function (event_1, _a) { return __awaiter(void 0, [event_1, _a], void 0, function (event, _b) {
        var error_4;
        var service = _b.service, key = _b.key;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    if (!!key) return [3 /*break*/, 2];
                    return [4 /*yield*/, aiService.deleteApiKey(service)];
                case 1:
                    _c.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, aiService.storeApiKey(service, key)];
                case 3:
                    _c.sent();
                    _c.label = 4;
                case 4: return [2 /*return*/, { success: true }];
                case 5:
                    error_4 = _c.sent();
                    console.error("Error handling API key for ".concat(service, ":"), error_4);
                    return [2 /*return*/, { success: false, error: error_4 instanceof Error ? error_4.message : 'Unknown error' }];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    // Handle API key retrieval
    electron_1.ipcMain.handle('get-api-key', function (event, service) { return __awaiter(void 0, void 0, void 0, function () {
        var key, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, aiService.getApiKey(service)];
                case 1:
                    key = _a.sent();
                    return [2 /*return*/, { success: true, key: key }];
                case 2:
                    error_5 = _a.sent();
                    console.error("Error retrieving API key for ".concat(service, ":"), error_5);
                    return [2 /*return*/, { success: false, error: error_5 instanceof Error ? error_5.message : 'Unknown error' }];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Handle checking if API key exists
    electron_1.ipcMain.handle('has-api-key', function (event, service) { return __awaiter(void 0, void 0, void 0, function () {
        var hasKey, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, aiService.hasApiKey(service)];
                case 1:
                    hasKey = _a.sent();
                    return [2 /*return*/, { success: true, hasKey: hasKey }];
                case 2:
                    error_6 = _a.sent();
                    console.error("Error checking API key for ".concat(service, ":"), error_6);
                    return [2 /*return*/, { success: false, error: error_6 instanceof Error ? error_6.message : 'Unknown error' }];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Handle character response generation
    electron_1.ipcMain.handle('generate-character-response', function (event_1, _a) { return __awaiter(void 0, [event_1, _a], void 0, function (event, _b) {
        var character, memories, response, error_7;
        var characterId = _b.characterId, prompt = _b.prompt, conversationStyle = _b.conversationStyle;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, prisma.character.findUnique({
                            where: { id: characterId },
                        })];
                case 1:
                    character = _c.sent();
                    if (!character) {
                        throw new Error('Character not found');
                    }
                    return [4 /*yield*/, prisma.characterMemory.findMany({
                            where: { characterId: characterId },
                            orderBy: { importance: 'desc' },
                            take: 10,
                        })];
                case 2:
                    memories = _c.sent();
                    return [4 /*yield*/, aiService.generateResponse(character, prompt, memories, conversationStyle)];
                case 3:
                    response = _c.sent();
                    return [2 /*return*/, { success: true, response: response }];
                case 4:
                    error_7 = _c.sent();
                    console.error('Error generating character response:', error_7);
                    return [2 /*return*/, {
                            success: false,
                            error: error_7 instanceof Error ? error_7.message : 'Unknown error'
                        }];
                case 5: return [2 /*return*/];
            }
        });
    }); });
};
exports.setupAIHandlers = setupAIHandlers;
exports.default = AIService;
//# sourceMappingURL=AIService.js.map