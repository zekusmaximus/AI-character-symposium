import React, { useState, Fragment } from 'react';
import { useProject } from '../../contexts/ProjectContext';
import ProjectForm from './project/ProjectForm'; // Ensure this path is correct
import { Menu, Transition } from '@headlessui/react'; // Using Headless UI for dropdown
import { ChevronDownIcon, FolderPlusIcon, FolderIcon } from '@heroicons/react/20/solid'; // Example icons

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const {
    projects,
    activeProject,
    activeProjectId,
    setActiveProjectId,
    createProject,
    isLoadingProjects,
    projectError,
  } = useProject();
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [formSubmissionError, setFormSubmissionError] = useState<string | null>(null);

  const handleCreateProjectSubmit = async (name: string, description?: string) => {
    setFormSubmissionError(null);
    try {
      const newProject = await createProject(name, description);
      if (newProject) {
        setIsProjectFormOpen(false);
        // Optionally, set the new project as active, though context might handle this
        // setActiveProjectId(newProject.id); 
      } else {
        // Error message might be set in context, or handle specific form error
        setFormSubmissionError("Failed to create project. Check console for details or context error state.");
      }
    } catch (error: any) {
      console.error('Project creation failed in header:', error);
      setFormSubmissionError(error.message || 'An unexpected error occurred.');
    }
  };

  const getProjectDisplayName = () => {
    if (isLoadingProjects) return "Loading Projects...";
    if (projectError) return "Error Loading Projects";
    if (!activeProject && projects.length > 0) return "Select a Project";
    if (!activeProject && projects.length === 0) return "No Projects";
    return activeProject?.name || "No Project Selected";
  };


  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-md py-3 px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none mr-3"
            aria-label="Toggle sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>

          {/* Project Selector Dropdown */}
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-3 py-2 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-700 focus:ring-indigo-500">
                <FolderIcon className="mr-2 h-5 w-5 text-indigo-500 dark:text-indigo-400" aria-hidden="true" />
                {getProjectDisplayName()}
                <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-1">
                  {isLoadingProjects ? (
                    <Menu.Item>
                      {({ active }) => (
                        <span className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100 dark:bg-gray-600' : ''} text-gray-700 dark:text-gray-300`}>
                          Loading...
                        </span>
                      )}
                    </Menu.Item>
                  ) : projectError ? (
                     <Menu.Item>
                      {({ active }) => (
                        <span className={`block px-4 py-2 text-sm ${active ? 'bg-red-100 dark:bg-red-500' : ''} text-red-700 dark:text-red-200`}>
                          Error: {projectError.substring(0,30)}...
                        </span>
                      )}
                    </Menu.Item>
                  ) : projects.length === 0 ? (
                    <Menu.Item>
                      {({ active }) => (
                        <span className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100 dark:bg-gray-600' : ''} text-gray-700 dark:text-gray-300`}>
                          No projects yet.
                        </span>
                      )}
                    </Menu.Item>
                  ) : (
                    projects.map((project) => (
                      <Menu.Item key={project.id}>
                        {({ active }) => (
                          <button
                            onClick={() => setActiveProjectId(project.id)}
                            className={`${
                              active ? 'bg-indigo-500 text-white dark:bg-indigo-600' : 'text-gray-900 dark:text-gray-200'
                            } group flex w-full items-center rounded-md px-4 py-2 text-sm ${
                              project.id === activeProjectId ? 'font-semibold bg-indigo-100 dark:bg-indigo-800' : ''
                            }`}
                          >
                            {project.name}
                          </button>
                        )}
                      </Menu.Item>
                    ))
                  )}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsProjectFormOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
            aria-label="Create new project"
          >
            <FolderPlusIcon className="h-5 w-5 mr-1.5" aria-hidden="true" />
            New Project
          </button>
          {/* Theme toggle can go here if needed */}
        </div>
      </header>

      <ProjectForm
        isOpen={isProjectFormOpen}
        onClose={() => {
          setIsProjectFormOpen(false);
          setFormSubmissionError(null); // Clear error when closing form
        }}
        onSubmit={handleCreateProjectSubmit}
      />
      {/* Display form submission error from ProjectForm if needed, or rely on context errors */}
      {formSubmissionError && (
         <div className="fixed bottom-4 right-4 bg-red-500 text-white p-3 rounded-md shadow-lg z-50">
           <p>Error: {formSubmissionError}</p>
           <button onClick={() => setFormSubmissionError(null)} className="ml-2 text-sm underline">Dismiss</button>
         </div>
      )}
    </>
  );
};

export default Header;
