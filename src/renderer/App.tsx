import React, { useState } from 'react';
import { 
  createBrowserRouter, 
  RouterProvider, 
  Route, 
  createRoutesFromElements,
  Outlet
} from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CharacterManager from './pages/CharacterManager';
import CharacterDetail from './pages/CharacterDetail';
import Conversation from './pages/Conversation';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

/**
 * Layout component that provides the application's common UI structure
 */
const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

/**
 * Router configuration using React Router v7 API
 */
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/characters" element={<CharacterManager />} />
      <Route path="/characters/:id" element={<CharacterDetail />} />
      <Route path="/conversations/:id" element={<Conversation />} />
      <Route path="/settings" element={<Settings />} />
      {/* Add 404 route */}
      <Route path="*" element={<div>Page not found</div>} />
    </Route>
  ),
  {
    // For Electron apps, we typically use hash routing
    // but should create a custom history for electron
    basename: '/'
  }
);

/**
 * Main App component that provides the router
 */
const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;