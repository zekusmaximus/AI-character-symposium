import React from 'react';
import { Character, CharacterFormState } from '../../types/character';

interface CharacterProfileProps {
  character: Character;
  editing: boolean;
  editForm: CharacterFormState;
  onFormChange: (field: keyof CharacterFormState, value: string) => void;
}

const CharacterProfile: React.FC<CharacterProfileProps> = ({ 
  character, 
  editing, 
  editForm, 
  onFormChange 
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Description</h2>
        {editing ? (
          <textarea
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            rows={3}
            value={editForm.description}
            onChange={(e) => onFormChange('description', e.target.value)}
          ></textarea>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">{character.description}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Traits</h2>
          {editing ? (
            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              rows={3}
              value={editForm.traits}
              onChange={(e) => onFormChange('traits', e.target.value)}
            ></textarea>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">{character.traits}</p>
          )}
        </div>
        
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Values</h2>
          {editing ? (
            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              rows={3}
              value={editForm.values}
              onChange={(e) => onFormChange('values', e.target.value)}
            ></textarea>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">{character.values}</p>
          )}
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Voice Patterns</h2>
        {editing ? (
          <textarea
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            rows={3}
            value={editForm.voicePatterns}
            onChange={(e) => onFormChange('voicePatterns', e.target.value)}
          ></textarea>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">{character.voicePatterns}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Project</h2>
          <p className="text-gray-600 dark:text-gray-300">{character.project}</p>
        </div>
        
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Created</h2>
          <p className="text-gray-600 dark:text-gray-300">{character.created}</p>
        </div>
      </div>
    </div>
  );
};

export default CharacterProfile;