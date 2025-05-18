// Types for character data models
export interface Character {
  id: string;
  name: string;
  description: string;
  traits: string;
  values: string;
  voicePatterns: string;
  project: string;
  created: string;
  memories: CharacterMemory[];
  relationships: CharacterRelationship[];
}

export interface CharacterMemory {
  id: string;
  content: string;
  type: 'episodic' | 'semantic' | 'emotional';
  importance: number;
  created: string;
}

export interface CharacterRelationship {
  id: string;
  name: string;
  type: string;
  description: string;
}

export interface CharacterFormState {
  name: string;
  description: string;
  traits: string;
  values: string;
  voicePatterns: string;
}