import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// This should ideally be the same as defined in the main process
const DEFAULT_PROJECT_ID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'; // Valid UUID v4

interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string; 
  updatedAt: string; 
}

interface ProjectContextType {
  projects: Project[];
  activeProjectId: string | null;
  activeProject: Project | null; 
  isLoadingProjects: boolean;
  projectError: string | null;
  setActiveProjectId: (projectId: string | null) => void;
  refreshProjects: () => Promise<void>;
  createProject: (name: string, description?: string) => Promise<Project | null>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectIdState] = useState<string | null>(() => {
    return localStorage.getItem('activeProjectId');
  });
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(true);
  const [projectError, setProjectError] = useState<string | null>(null);

  const refreshProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    setProjectError(null);
    try {
      if (!window.electron?.ipcRenderer) {
        throw new Error('IPC renderer not available. Cannot fetch projects.');
      }
      const result = await window.electron.ipcRenderer.invoke('get-projects');
      if (result.success) {
        setProjects(result.data || []);
      } else {
        throw new Error(result.error || 'Failed to fetch projects.');
      }
    } catch (err: any) {
      console.error('Error refreshing projects:', err);
      setProjectError(err.message);
      setProjects([]); // Clear projects on error
    } finally {
      setIsLoadingProjects(false);
    }
  }, []);

  const createProject = async (name: string, description?: string): Promise<Project | null> => {
    setProjectError(null);
    try {
      if (!window.electron?.ipcRenderer) {
        throw new Error('IPC renderer not available. Cannot create project.');
      }
      const result = await window.electron.ipcRenderer.invoke('create-project', { name, description });
      if (result.success && result.data) {
        await refreshProjects(); // Refresh the list to include the new project
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to create project.');
      }
    } catch (err: any) {
      console.error('Error creating project:', err);
      setProjectError(err.message);
      return null;
    }
  };
  
  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  // Effect to derive activeProject
  useEffect(() => {
    if (activeProjectId && projects.length > 0) {
      const foundProject = projects.find(p => p.id === activeProjectId) || null;
      setActiveProject(foundProject);
    } else {
      setActiveProject(null);
    }
  }, [activeProjectId, projects]);

  // Effect for initializing and persisting activeProjectId
  useEffect(() => {
    const storedProjectId = localStorage.getItem('activeProjectId');
    
    if (!isLoadingProjects && projects.length > 0) {
        let newActiveId: string | null = null;

        if (storedProjectId) {
            // Check if stored ID is valid
            if (projects.some(p => p.id === storedProjectId)) {
                newActiveId = storedProjectId;
            }
        }
        
        if (!newActiveId) { // If stored ID is invalid or not present
            // Try to set to default project if it exists
            const defaultProjectExists = projects.some(p => p.id === DEFAULT_PROJECT_ID);
            if (defaultProjectExists) {
                newActiveId = DEFAULT_PROJECT_ID;
            } else if (projects.length > 0) { // Fallback to the first project
                newActiveId = projects[0].id;
            }
        }
        
        setActiveProjectIdState(newActiveId);
        if (newActiveId) {
            localStorage.setItem('activeProjectId', newActiveId);
        } else {
            localStorage.removeItem('activeProjectId');
        }

    } else if (!isLoadingProjects && projects.length === 0) {
        // No projects, ensure activeProjectId is null and remove from storage
        setActiveProjectIdState(null);
        localStorage.removeItem('activeProjectId');
    }
    // Only run when projects load or isLoadingProjects changes from true to false
  }, [projects, isLoadingProjects, refreshProjects]);


  const setActiveProjectId = (projectId: string | null) => {
    setActiveProjectIdState(projectId);
    if (projectId) {
      localStorage.setItem('activeProjectId', projectId);
    } else {
      localStorage.removeItem('activeProjectId');
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProjectId,
        activeProject,
        isLoadingProjects,
        projectError,
        setActiveProjectId,
        refreshProjects,
        createProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
