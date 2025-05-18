import React from 'react';

const BackupSettings: React.FC = () => (
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
);

export default BackupSettings;
