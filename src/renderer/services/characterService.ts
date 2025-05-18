import { Character, CharacterFormState } from '../types/character';

// This would normally interact with IPC to the main process
export const characterService = {
  getCharacter: async (id: string): Promise<Character> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockCharacter: Character = {
          id: id,
          name: id === '1' ? 'Captain Elara' : id === '2' ? 'Wizard Thorne' : 'Dr. Nova',
          description: id === '1' 
            ? 'Veteran starship captain with a troubled past' 
            : id === '2' 
            ? 'Reclusive mage with ancient knowledge' 
            : 'Brilliant scientist pushing ethical boundaries',
          traits: id === '1' 
            ? 'Determined, Loyal, Strategic' 
            : id === '2' 
            ? 'Wise, Mysterious, Powerful' 
            : 'Intelligent, Ambitious, Conflicted',
          values: id === '1' 
            ? 'Honor, Duty, Redemption' 
            : id === '2' 
            ? 'Knowledge, Balance, Tradition' 
            : 'Progress, Truth, Innovation',
          voicePatterns: id === '1' 
            ? 'Direct, authoritative, occasionally uses naval terminology' 
            : id === '2' 
            ? 'Speaks in riddles, formal, uses archaic terms' 
            : 'Precise, technical, uses scientific jargon',
          project: id === '1' || id === '3' ? 'Space Opera Series' : 'Fantasy Trilogy',
          created: id === '1' ? '2025-04-15' : id === '2' ? '2025-04-20' : '2025-05-01',
          memories: [
            { 
              id: '1', 
              content: id === '1' 
                ? 'Lost my first ship in the Battle of Proxima' 
                : id === '2' 
                ? 'Apprenticed under the Archmage for 20 years' 
                : 'Published groundbreaking research on quantum biology',
              type: 'episodic',
              importance: 5,
              created: '2025-05-01'
            },
            { 
              id: '2', 
              content: id === '1' 
                ? 'Grew up on a colony world with limited resources' 
                : id === '2' 
                ? 'Survived the Mage Wars by hiding in the Forgotten Forest' 
                : 'Ethical committee rejected my proposal for human enhancement',
              type: 'episodic',
              importance: 4,
              created: '2025-05-02'
            },
            { 
              id: '3', 
              content: id === '1' 
                ? 'Believes in leading from the front' 
                : id === '2' 
                ? 'Distrusts political authority' 
                : 'Values scientific progress above conventional ethics',
              type: 'semantic',
              importance: 3,
              created: '2025-05-03'
            }
          ],
          relationships: [
            {
              id: '1',
              name: id === '1' ? 'Dr. Nova' : id === '2' ? 'Ranger Ash' : 'Captain Elara',
              type: id === '1' ? 'Colleague' : id === '2' ? 'Former Student' : 'Colleague',
              description: id === '1' 
                ? 'Uneasy alliance with the ship\'s scientist' 
                : id === '2' 
                ? 'Taught survival magic to the ranger' 
                : 'Respects the captain\'s leadership but questions her caution'
            },
            {
              id: '2',
              name: id === '1' ? 'Admiral Chen' : id === '2' ? 'Dark Sorcerer Vex' : 'Corporate Director Zane',
              type: id === '1' ? 'Superior' : id === '2' ? 'Enemy' : 'Antagonist',
              description: id === '1' 
                ? 'Former mentor turned political adversary' 
                : id === '2' 
                ? 'Ancient rival seeking forbidden knowledge' 
                : 'Funds research but has hidden agenda'
            }
          ]
        };
        
        resolve(mockCharacter);
      }, 500);
    });
  },

  updateCharacter: async (id: string, data: Partial<Character>): Promise<Character> => {
    // In a real app, this would call the main process via IPC
    console.log('Updating character', id, data);
    return Promise.resolve({
      ...data,
      id
    } as Character);
  }
};