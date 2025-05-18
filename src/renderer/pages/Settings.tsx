import React, { useState } from 'react';
import { useApiKeys } from '../contexts/ApiKeyContext';
import GeneralSettings from './GeneralSettings';
import ApiKeysSettings from './ApiKeysSettings';
import ModelsSettings from './ModelsSettings';
import BackupSettings from './BackupSettings';

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
            <GeneralSettings theme={theme} setTheme={setTheme} offlineMode={offlineMode} setOfflineMode={setOfflineMode} />
          )}
          {activeTab === 'api' && (
            <ApiKeysSettings
              apiKeys={apiKeys}
              setApiKey={setApiKey}
              clearApiKey={clearApiKey}
              isConfigured={isConfigured}
              showApiKey={showApiKey}
              setShowApiKey={setShowApiKey}
              tempApiKeys={tempApiKeys}
              setTempApiKeys={setTempApiKeys}
              handleSaveApiKey={handleSaveApiKey}
            />
          )}
          {activeTab === 'models' && (
            <ModelsSettings embeddingModel={embeddingModel} setEmbeddingModel={setEmbeddingModel} />
          )}
          {activeTab === 'backup' && (
            <BackupSettings />
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;