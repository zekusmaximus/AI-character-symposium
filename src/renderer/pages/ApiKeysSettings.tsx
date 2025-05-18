import React from 'react';

const ApiKeysSettings: React.FC<{
  apiKeys: any;
  setApiKey: (service: 'openai' | 'anthropic', key: string) => void;
  clearApiKey: (service: 'openai' | 'anthropic') => void;
  isConfigured: (service: 'openai' | 'anthropic') => boolean;
  showApiKey: { openai: boolean; anthropic: boolean };
  setShowApiKey: (show: { openai: boolean; anthropic: boolean }) => void;
  tempApiKeys: { openai: string; anthropic: string };
  setTempApiKeys: (keys: { openai: string; anthropic: string }) => void;
  handleSaveApiKey: (service: 'openai' | 'anthropic') => void;
}> = ({ apiKeys, setApiKey, clearApiKey, isConfigured, showApiKey, setShowApiKey, tempApiKeys, setTempApiKeys, handleSaveApiKey }) => (
  <div className="space-y-6">
    <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6">
      <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">API Key Security</h3>
      <p className="text-sm text-yellow-700 dark:text-yellow-300">
        API keys are stored locally and encrypted. They are never sent to our servers. 
        These keys are used to access AI services for character conversations.
      </p>
    </div>
    <div className="space-y-4">
      {/* OpenAI API Key */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">OpenAI API Key</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Used for GPT-4 and other OpenAI models. <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">Get an API key</a>
        </p>
        <div className="flex items-center">
          <input
            type={showApiKey.openai ? "text" : "password"}
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            placeholder="sk-..."
            value={tempApiKeys.openai}
            onChange={(e) => setTempApiKeys({...tempApiKeys, openai: e.target.value})}
          />
          <button 
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border-y border-r border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 py-2 px-4"
            onClick={() => setShowApiKey({...showApiKey, openai: !showApiKey.openai})}
          >
            {showApiKey.openai ? "Hide" : "Show"}
          </button>
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-r-md"
            onClick={() => handleSaveApiKey('openai')}
          >
            Save
          </button>
        </div>
        {isConfigured('openai') && (
          <p className="mt-2 text-sm text-green-600 dark:text-green-400">
            ✓ OpenAI API key is configured
          </p>
        )}
      </div>
      {/* Anthropic API Key */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Anthropic API Key</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Used for Claude and other Anthropic models. <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">Get an API key</a>
        </p>
        <div className="flex items-center">
          <input
            type={showApiKey.anthropic ? "text" : "password"}
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            placeholder="sk_ant-..."
            value={tempApiKeys.anthropic}
            onChange={(e) => setTempApiKeys({...tempApiKeys, anthropic: e.target.value})}
          />
          <button 
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border-y border-r border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 py-2 px-4"
            onClick={() => setShowApiKey({...showApiKey, anthropic: !showApiKey.anthropic})}
          >
            {showApiKey.anthropic ? "Hide" : "Show"}
          </button>
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-r-md"
            onClick={() => handleSaveApiKey('anthropic')}
          >
            Save
          </button>
        </div>
        {isConfigured('anthropic') && (
          <p className="mt-2 text-sm text-green-600 dark:text-green-400">
            ✓ Anthropic API key is configured
          </p>
        )}
      </div>
      {/* Local Models */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Local Models</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Use locally installed models for offline functionality.
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status: </span>
            <span className="text-sm text-green-600 dark:text-green-400">Enabled</span>
          </div>
          <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md">
            Configure
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ApiKeysSettings;
