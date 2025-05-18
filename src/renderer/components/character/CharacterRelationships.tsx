import React from 'react';
import { Character } from '../../types/character';

interface CharacterRelationshipsProps {
  character: Character;
}

const CharacterRelationships: React.FC<CharacterRelationshipsProps> = ({ character }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Character Relationships</h2>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm">
          Add Relationship
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {character.relationships.map((relationship) => (
          <div key={relationship.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{relationship.name}</h3>
                <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200">
                  {relationship.type}
                </span>
              </div>
              <div className="flex space-x-2">
                <button className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{relationship.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterRelationships;