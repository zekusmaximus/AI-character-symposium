import React from 'react';
import { useParams } from 'react-router-dom';
import { useCharacter } from '../hooks/useCharacter';
import CharacterProfile from '../components/character/CharacterProfile';
import CharacterMemories from '../components/character/CharacterMemories';
import CharacterRelationships from '../components/character/CharacterRelationships';
import CharacterConversation from '../components/character/CharacterConversation';

const CharacterDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = React.useState('profile');
  
  const {
    character,
    loading,
    error,
    editForm,
    editing,
    setEditing,
    updateFormField,
    saveCharacter,
    resetForm
  } = useCharacter(id);

  if (loading && !character) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Error Loading Character</h3>
          <p className="text-red-700 dark:text-red-300 mt-2">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Character Not Found</h3>
          <p className="text-red-700 dark:text-red-300 mt-2">
            The character you're looking for doesn't exist or couldn't be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          {editing ? (
            <input
              type="text"
              className="text-2xl font-bold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-indigo-500 dark:text-white"
              value={editForm.name}
              onChange={(e) => updateFormField('name', e.target.value)}
            />
          ) : (
            <h1 className="text-2xl font-bold dark:text-white">{character.name}</h1>
          )}
          <div>
            {editing ? (
              <div className="space-x-2">
                <button 
                  onClick={saveCharacter}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                >
                  Save
                </button>
                <button 
                  onClick={() => {
                    resetForm();
                    setEditing(false);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
              >
                Edit Character
              </button>
            )}
          </div>
        </div>
        
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'profile'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('memories')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'memories'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Memories
            </button>
            <button
              onClick={() => setActiveTab('relationships')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'relationships'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Relationships
            </button>
            <button
              onClick={() => setActiveTab('conversation')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'conversation'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Conversation
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'profile' && (
            <CharacterProfile 
              character={character} 
              editing={editing} 
              editForm={editForm} 
              onFormChange={updateFormField} 
            />
          )}
          
          {activeTab === 'memories' && (
            <CharacterMemories character={character} />
          )}
          
          {activeTab === 'relationships' && (
            <CharacterRelationships character={character} />
          )}
          
          {activeTab === 'conversation' && (
            <CharacterConversation character={character} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterDetail;