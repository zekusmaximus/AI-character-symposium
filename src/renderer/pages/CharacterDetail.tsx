import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const CharacterDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('profile');
  const [character, setCharacter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    traits: '',
    values: '',
    voicePatterns: ''
  });

  // Mock data fetch - would be replaced with actual database query
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockCharacter = {
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
      
      setCharacter(mockCharacter);
      setEditForm({
        name: mockCharacter.name,
        description: mockCharacter.description,
        traits: mockCharacter.traits,
        values: mockCharacter.values,
        voicePatterns: mockCharacter.voicePatterns
      });
      setLoading(false);
    }, 500);
  }, [id]);

  const handleSaveEdit = () => {
    setCharacter({
      ...character,
      name: editForm.name,
      description: editForm.description,
      traits: editForm.traits,
      values: editForm.values,
      voicePatterns: editForm.voicePatterns
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
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
              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
            />
          ) : (
            <h1 className="text-2xl font-bold dark:text-white">{character.name}</h1>
          )}
          <div>
            {editing ? (
              <div className="space-x-2">
                <button 
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                >
                  Save
                </button>
                <button 
                  onClick={() => setEditing(false)}
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
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Description</h2>
                {editing ? (
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
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
                      onChange={(e) => setEditForm({...editForm, traits: e.target.value})}
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
                      onChange={(e) => setEditForm({...editForm, values: e.target.value})}
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
                    onChange={(e) => setEditForm({...editForm, voicePatterns: e.target.value})}
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
          )}
          
          {activeTab === 'memories' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Character Memories</h2>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm">
                  Add Memory
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Memory
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Importance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {character.memories.map((memory: any) => (
                      <tr key={memory.id}>
                        <td className="px-6 py-4 whitespace-normal">
                          <div className="text-sm text-gray-900 dark:text-white">{memory.content}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            memory.type === 'episodic' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                              : memory.type === 'semantic'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
                          }`}>
                            {memory.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{memory.importance}/5</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{memory.created}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'relationships' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Character Relationships</h2>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm">
                  Add Relationship
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {character.relationships.map((relationship: any) => (
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
          )}
          
          {activeTab === 'conversation' && (
            <div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Conversation with {character.name}</h2>
                
                <div className="space-y-4 mb-4 max-h-96 overflow-y-auto p-2">
                  <div className="flex justify-end">
                    <div className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-100 p-3 rounded-lg max-w-md">
                      <p className="text-sm">Hello {character.name}, can you tell me about your background?</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg max-w-md">
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        {id === '1' 
                          ? "I've spent most of my life among the stars. Grew up on Proxima Colony, joined the Fleet at 18. Lost my first command during the Battle of Proxima... not a day goes by I don't think about the crew we lost. Now I captain the Stellar Horizon, trying to make a difference in this vast universe."
                          : id === '2'
                          ? "I was apprenticed to the Archmage for two decades, learning the ancient arts in the Crystalline Tower. During the Mage Wars, I retreated to the Forgotten Forest, where I discovered texts of power long thought lost. I've spent my life seeking knowledge others fear to uncover."
                          : "My research into quantum biology has always pushed boundaries. The establishment called my methods unorthodox, even dangerous. But innovation requires risk. I've dedicated my life to advancing human potential, even when ethics committees tried to hold me back. Some call my work controversial, I call it necessary."}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-100 p-3 rounded-lg max-w-md">
                      <p className="text-sm">What's your greatest fear?</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg max-w-md">
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        {id === '1' 
                          ? "Failure. Not the kind that gets you demoted, but the kind that costs lives. I've seen what happens when a captain hesitates or makes the wrong call. The weight of command is knowing your decisions determine who lives and who dies. I fear making a mistake I can't live with."
                          : id === '2'
                          ? "That knowledge will be lost. Not just my own, but the ancient wisdom I've spent decades collecting. Magic is fading from this world, and few appreciate the old ways. I fear dying before finding a worthy apprentice to carry on my work."
                          : "Mediocrity. Being forgotten. I've always known my research could change humanity forever. The thought that I might die with my greatest discoveries unmade, that my potential might go unfulfilled... that terrifies me more than any ethical controversy."}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-r-md">
                    Send
                  </button>
                </div>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">AI Character Engine Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Memory Importance Threshold</label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                      <option value="1">1 - Include all memories</option>
                      <option value="2">2 - Most memories</option>
                      <option value="3" selected>3 - Important memories only</option>
                      <option value="4">4 - Very important memories only</option>
                      <option value="5">5 - Critical memories only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Conversation Style</label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                      <option value="accurate">Accurate to character</option>
                      <option value="concise">Concise responses</option>
                      <option value="detailed">Detailed and elaborate</option>
                      <option value="creative">Creative and unexpected</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">API Key</label>
                  <div className="flex">
                    <input
                      type="password"
                      value="••••••••••••••••••••••••••••••"
                      className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-md py-2 px-4 bg-gray-50 dark:bg-gray-700 dark:text-white"
                      disabled
                    />
                    <button className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-r-md">
                      Configure
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">API key is securely stored and used for character conversations</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterDetail;
