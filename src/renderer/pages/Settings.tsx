import React, { useState } from 'react';
import { useApiKeys } from '../contexts/ApiKeyContext';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { apiKeys, setApiKey, clearApiKey, isConfigured } = useApiKeys();
  const [showApiKey, setShowApiKey] = useState({
    openai: false,
    anthropic: false
  });
  const [tempApiKeys, setTempApiKeys] = useState({
    openai: '',
    anthropic: ''
  });
  const [theme, setTheme] = useState('system');
  const [embeddingModel, setEmbeddingModel] = useState('local-small');
  const [offlineMode, setOfflineMode] = useState(false);
  
  // Load the keys from context when the component mounts or when the tab changes to API
  React.useEffect(() => {
    if (activeTab === 'api') {
      setTempApiKeys({
        openai: apiKeys.openai || '',
        anthropic: apiKeys.anthropic || ''
      });
    }
  }, [activeTab, apiKeys]);

  const handleSaveApiKey = (service: 'openai' | 'anthropic') => {
    if (tempApiKeys[service]) {
      setApiKey(service, tempApiKeys[service]);
      alert(`${service.charAt(0).toUpperCase() + service.slice(1)} API key saved successfully!`);
    } else {
      clearApiKey(service);
      alert(`${service.charAt(0).toUpperCase() + service.slice(1)} API key removed!`);
    }
  };
  
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'general'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'api'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              API Keys
            </button>
            <button
              onClick={() => setActiveTab('models')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'models'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              AI Models
            </button>
            <button
              onClick={() => setActiveTab('backup')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'backup'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Backup & Restore
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Appearance</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer ${
                      theme === 'light' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700'
                    }`}
                    onClick={() => setTheme('light')}
                  >
                    <div className="h-24 bg-white border border-gray-200 rounded mb-2 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-500"></div>
                    </div>
                    <div className="text-center">Light</div>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer ${
                      theme === 'dark' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700'
                    }`}
                    onClick={() => setTheme('dark')}
                  >
                    <div className="h-24 bg-gray-900 border border-gray-700 rounded mb-2 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-400"></div>
                    </div>
                    <div className="text-center">Dark</div>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer ${
                      theme === 'system' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700'
                    }`}
                    onClick={() => setTheme('system')}
                  >
                    <div className="h-24 bg-gradient-to-r from-white to-gray-900 border border-gray-200 rounded mb-2 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-500"></div>
                    </div>
                    <div className="text-center">System</div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Application Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Offline Mode</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Use only local models when enabled</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={offlineMode}
                        onChange={() => setOfflineMode(!offlineMode)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Auto-save</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Automatically save changes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">API Key Security</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  API keys are stored locally and encrypted. They are never sent to our servers. 
                  These keys are used to access AI services for character conversations.
                </p>
              </div>
              
              <div className="space-y-4">
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
          )}
          
          {activeTab === 'models' && (
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
          )}
          
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">Data Security</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  All your character data is stored locally on your device. Regular backups are recommended to prevent data loss.
                </p>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Backup Data</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Create a backup of all your projects, characters, and settings.
                </p>
                
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">
                  Create Backup
                </button>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Restore Data</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Restore your data from a previous backup.
                </p>
                
                <div className="flex items-center">
                  <input
                    type="file"
                    className="block w-full text-sm text-gray-500 dark:text-gray-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-gray-100 file:text-gray-700
                      dark:file:bg-gray-700 dark:file:text-gray-300
                      hover:file:bg-gray-200 dark:hover:file:bg-gray-600"
                  />
                  <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md ml-2">
                    Restore
                  </button>
                </div>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Auto-Backup Settings</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Configure automatic backup settings.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="auto-backup"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="auto-backup" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Enable automatic backups
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <label htmlFor="backup-frequency" className="block text-sm text-gray-700 dark:text-gray-300 mr-2">
                      Backup frequency:
                    </label>
                    <select
                      id="backup-frequency"
                      className="border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 dark:bg-gray-700 dark:text-white"
                      defaultValue="weekly"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <label htmlFor="backup-location" className="block text-sm text-gray-700 dark:text-gray-300 mr-2">
                      Backup location:
                    </label>
                    <input
                      type="text"
                      id="backup-location"
                      className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 dark:bg-gray-700 dark:text-white"
                      defaultValue="C:\Users\Username\Documents\AI Character Council\Backups"
                      readOnly
                    />
                    <button className="px-2 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md ml-2">
                      Browse
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;