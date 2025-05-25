import React, { useState, lazy, Suspense } from 'react';
import { 
  createBrowserRouter, 
  RouterProvider, 
  Route, 
  createRoutesFromElements,
  Outlet
} from 'react-router-dom';
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CharacterManager = lazy(() => import('./pages/CharacterManager'));
const CharacterDetail = lazy(() => import('./pages/CharacterDetail'));
const Settings = lazy(() => import('./pages/Settings'));
import Conversation from './pages/Conversation';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { ApiKeyProvider } from './contexts/ApiKeyContext';

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
        <main className="flex-1 overflow-y-auto p-6">
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
      <Route 
        path="/" 
        element={
          <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <Dashboard />
          </Suspense>
        } 
      />
      <Route 
        path="/characters" 
        element={
          <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <CharacterManager />
          </Suspense>
        } 
      />
      <Route 
        path="/characters/:id" 
        element={
          <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <CharacterDetail />
          </Suspense>
        } 
      />
      <Route path="/conversations/:id" element={<Conversation />} />
      <Route 
        path="/settings" 
        element={
          <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <Settings />
          </Suspense>
        } 
      />
      <Route path="*" element={<div>Page not found</div>} />
    </Route>
  ),
  {
    basename: '/'
  }
);

/**
 * Main App component that provides the router and context providers
 */
const App: React.FC = () => {
  return (
    <ApiKeyProvider>
      <RouterProvider router={router} />
    </ApiKeyProvider>
  );
};

export default App;