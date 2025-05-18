import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CharacterManager: React.FC = () => {
  const [characters, setCharacters] = useState([
    { 
      id: '1', 
      name: 'Captain Elara', 
      description: 'Veteran starship captain with a troubled past',
      project: 'Space Opera Series',
      traits: 'Determined, Loyal, Strategic',
      created: '2025-04-15'
    },
    { 
      id: '2', 
      name: 'Wizard Thorne', 
      description: 'Reclusive mage with ancient knowledge',
      project: 'Fantasy Trilogy',
      traits: 'Wise, Mysterious, Powerful',
      created: '2025-04-20'
    },
    { 
      id: '3', 
      name: 'Dr. Nova', 
      description: 'Brilliant scientist pushing ethical boundaries',
      project: 'Space Opera Series',
      traits: 'Intelligent, Ambitious, Conflicted',
      created: '2025-05-01'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    description: '',
    project: 'Space Opera Series',
    traits: ''
  });

  const filteredCharacters = characters.filter(character => 
    character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    character.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    character.traits.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCharacter = () => {
    const character = {
      id: Date.now().toString(),
      name: newCharacter.name,
      description: newCharacter.description,
      project: newCharacter.project,
      traits: newCharacter.traits,
      created: new Date().toISOString().split('T')[0]
    };
    
    setCharacters([...characters, character]);
    setNewCharacter({ name: '', description: '', project: 'Space Opera Series', traits: '' });
    setShowCreateModal(false);
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Characters</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
        >
          Create Character
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search characters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCharacters.map(character => (
          <Link 
            to={`/characters/${character.id}`} 
            key={character.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{character.name}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{character.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span>{character.project}</span>
                <span>Created: {character.created}</span>
              </div>
              <div className="mt-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Traits:</span>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{character.traits}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Create Character Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Create New Character</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    value={newCharacter.name}
                    onChange={(e) => setNewCharacter({...newCharacter, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    rows={3}
                    value={newCharacter.description}
                    onChange={(e) => setNewCharacter({...newCharacter, description: e.target.value})}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    value={newCharacter.project}
                    onChange={(e) => setNewCharacter({...newCharacter, project: e.target.value})}
                  >
                    <option value="Space Opera Series">Space Opera Series</option>
                    <option value="Fantasy Trilogy">Fantasy Trilogy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Traits</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    placeholder="Comma-separated traits"
                    value={newCharacter.traits}
                    onChange={(e) => setNewCharacter({...newCharacter, traits: e.target.value})}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCharacter}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                  disabled={!newCharacter.name}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterManager;
