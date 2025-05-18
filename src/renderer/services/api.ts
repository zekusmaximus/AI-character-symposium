// src/renderer/services/api.ts
import type { Character } from '../types/character'; // Adjust the path as needed

// Remove redeclaration of global Window interface to avoid type conflicts.
// The electron type should be defined in src/renderer/types/electron.d.ts.

export const characterService = {
  getCharacter: (id: string) => window.electron.ipcRenderer.invoke('get-character', id),
  createCharacter: (character: Character) => window.electron.ipcRenderer.invoke('create-character', character),
  // ...
};