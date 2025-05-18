import React from 'react';

const GeneralSettings: React.FC<{
  theme: string;
  setTheme: (theme: string) => void;
  offlineMode: boolean;
  setOfflineMode: (offline: boolean) => void;
}> = ({ theme, setTheme, offlineMode, setOfflineMode }) => (
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
);

export default GeneralSettings;
