import React from 'react';
import { Character } from '../../types/character';
import { useApiKeys } from '../../contexts/ApiKeyContext';
import { Link } from 'react-router-dom';

interface CharacterConversationProps {
  character: Character;
}

const CharacterConversation: React.FC<CharacterConversationProps> = ({ character }) => {
  const { isConfigured } = useApiKeys();
  
  return (
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
                {character.id === '1' 
                  ? "I've spent most of my life among the stars. Grew up on Proxima Colony, joined the Fleet at 18. Lost my first command during the Battle of Proxima... not a day goes by I don't think about the crew we lost. Now I captain the Stellar Horizon, trying to make a difference in this vast universe."
                  : character.id === '2'
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
                {character.id === '1' 
                  ? "Failure. Not the kind that gets you demoted, but the kind that costs lives. I've seen what happens when a captain hesitates or makes the wrong call. The weight of command is knowing your decisions determine who lives and who dies. I fear making a mistake I can't live with."
                  : character.id === '2'
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
              <option value="3" defaultValue="3">3 - Important memories only</option>
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">API Configuration Status</label>
          <div className="flex items-center justify-between">
            <div>
              {isConfigured('openai') ? (
                <p className="text-sm text-green-600 dark:text-green-400">
                  ✓ OpenAI API key is configured
                </p>
              ) : isConfigured('anthropic') ? (
                <p className="text-sm text-green-600 dark:text-green-400">
                  ✓ Anthropic API key is configured
                </p>
              ) : (
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  ⚠ No API keys configured. Using local model only.
                </p>
              )}
            </div>
            <Link 
              to="/settings" 
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-md"
            >
              Configure APIs
            </Link>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">API keys are securely stored and used for character conversations</p>
        </div>
      </div>
    </div>
  );
};

export default CharacterConversation;