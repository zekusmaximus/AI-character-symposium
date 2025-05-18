import React, { useState } from 'react';

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState([
    { id: '1', name: 'Space Opera Series', characters: 12, timelines: 3, notes: 24 },
    { id: '2', name: 'Fantasy Trilogy', characters: 8, timelines: 2, notes: 15 },
  ]);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Characters</h2>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {projects.reduce((acc, project) => acc + project.characters, 0)}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Total characters across all projects</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Timelines</h2>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {projects.reduce((acc, project) => acc + project.timelines, 0)}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Active timelines</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Notes</h2>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {projects.reduce((acc, project) => acc + project.notes, 0)}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Total notes and references</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Your Projects</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Characters
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Timelines
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{project.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{project.characters}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{project.timelines}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{project.notes}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3">
                        Open
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
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
        </div>
        <div className="p-6">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            <li className="py-4">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Character "Captain Elara" updated
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    2 hours ago in Space Opera Series
                  </p>
                </div>
              </div>
            </li>
            <li className="py-4">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    New conversation with "Wizard Thorne"
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Yesterday in Fantasy Trilogy
                  </p>
                </div>
              </div>
            </li>
            <li className="py-4">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Timeline "The Great War" created
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    3 days ago in Fantasy Trilogy
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
