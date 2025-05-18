import React from 'react';

const ModelsSettings: React.FC<{
  embeddingModel: string;
  setEmbeddingModel: (model: string) => void;
}> = ({ embeddingModel, setEmbeddingModel }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">AI Model Settings</h2>
      <div className="space-y-4">
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Character Conversation Model</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Select which AI model to use for character conversations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* GPT-4 */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-center">
                <input 
                  type="radio" 
                  name="conversation-model" 
                  id="gpt4" 
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  defaultChecked
                />
                <label htmlFor="gpt4" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  OpenAI GPT-4
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 ml-6">
                Best quality, requires API key, higher cost
              </p>
            </div>
            {/* Claude */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-center">
                <input 
                  type="radio" 
                  name="conversation-model" 
                  id="claude" 
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="claude" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Anthropic Claude
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 ml-6">
                High quality, requires API key, medium cost
              </p>
            </div>
            {/* GPT-3.5 */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-center">
                <input 
                  type="radio" 
                  name="conversation-model" 
                  id="gpt35" 
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="gpt35" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  OpenAI GPT-3.5
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 ml-6">
                Good quality, requires API key, lower cost
              </p>
            </div>
            {/* Local Model */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-center">
                <input 
                  type="radio" 
                  name="conversation-model" 
                  id="local" 
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="local" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Local Model
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 ml-6">
                Works offline, no API key needed, free
              </p>
            </div>
          </div>
        </div>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Embedding Model</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Select which model to use for memory embeddings and semantic search.
          </p>
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            value={embeddingModel}
            onChange={(e) => setEmbeddingModel(e.target.value)}
          >
            <option value="openai">OpenAI Embeddings (requires API key)</option>
            <option value="local-small">Local Small (faster, less accurate)</option>
            <option value="local-large">Local Large (slower, more accurate)</option>
          </select>
        </div>
      </div>
    </div>
  </div>
);

export default ModelsSettings;
