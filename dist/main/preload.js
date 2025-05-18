"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electron', {
    getAppInfo: function () { return electron_1.ipcRenderer.invoke('get-app-info'); },
    setOpenAIKey: function (key) { return electron_1.ipcRenderer.invoke('set-openai-key', key); },
    setAnthropicKey: function (key) { return electron_1.ipcRenderer.invoke('set-anthropic-key', key); },
    generateCharacterResponse: function (params) {
        return electron_1.ipcRenderer.invoke('generate-character-response', params);
    }
});
//# sourceMappingURL=preload.js.map