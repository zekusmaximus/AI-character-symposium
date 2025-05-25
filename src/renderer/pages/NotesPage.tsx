import React, { useState, useEffect, useCallback } from 'react';
 feature/notes-page

 feature/notes-page
main
import NoteForm from '../components/notes/NoteForm';
import { useProject } from '../contexts/ProjectContext';
// The DEFAULT_PROJECT_ID from ProjectContext or a shared constants file would be ideal
// For now, if needed for fallback (though we aim to disable actions), ensure it's available.
// import { DEFAULT_PROJECT_ID } from '../contexts/ProjectContext'; // or a shared constants file

feature/notes-page


import NoteForm from '../components/notes/NoteForm'; // Assuming NoteForm is in this path
// If you have a shared types file, import Note from there. Otherwise, define it here.
// import { Note } from '../../types'; 

// Define the Note interface if not imported
 main
 main
interface Note {
  id: string;
  title: string;
  content: string;
  tags?: string;
  createdAt: string; 
  updatedAt: string; 
  projectId: string;
}

const NotesPage: React.FC = () => {
feature/notes-page

 feature/notes-page
main
  const { activeProjectId, isLoadingProjects: isLoadingProjectContext } = useProject();

  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState<boolean>(true); // Renamed from isLoading
  const [pageError, setPageError] = useState<string | null>(null); // Renamed from error
feature/notes-page

  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
 main
 main
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const fetchNotes = useCallback(async () => {
feature/notes-page

feature/notes-page
main
    if (!activeProjectId) {
      setNotes([]);
      setIsLoadingNotes(false);
      setPageError(null); // Clear previous errors if project becomes null
      return;
    }

    setIsLoadingNotes(true);
    setPageError(null);
    setActionError(null); // Clear action errors on new fetch
    try {
      if (window.electron?.ipcRenderer) {
        const result = await window.electron.ipcRenderer.invoke('get-notes', activeProjectId);
        if (result.success) {
          setNotes(result.data || []);
        } else {
          setPageError(result.error || 'Failed to fetch notes.');
          setNotes([]); // Clear notes on error
        }
      } else {
        setPageError('IPC renderer not available. Are you running in Electron?');
        console.error('IPC renderer not available');
        setNotes([]);
      }
    } catch (err: any) {
      console.error('Error fetching notes:', err);
      setPageError(err.message || 'An unexpected error occurred while fetching notes.');
      setNotes([]);
    } finally {
      setIsLoadingNotes(false);
    }
  }, [activeProjectId]);

  useEffect(() => {
    // Only fetch notes if a project is active, or when activeProjectId changes.
    // isLoadingProjectContext check prevents fetching while context is still loading projects.
    if (!isLoadingProjectContext) {
        fetchNotes();
    }
  }, [fetchNotes, activeProjectId, isLoadingProjectContext]);

feature/notes-page

    setIsLoading(true);
    setError(null);
    setActionError(null);
    try {
      // Ensure window.electron.ipcRenderer is available
      if (window.electron?.ipcRenderer) {
        const result = await window.electron.ipcRenderer.invoke('get-notes');
        if (result.success) {
          setNotes(result.data);
        } else {
          setError(result.error || 'Failed to fetch notes.');
        }
      } else {
        setError('IPC renderer not available. Are you running in Electron?');
        console.error('IPC renderer not available');
      }
    } catch (err: any) {
      console.error('Error fetching notes:', err);
      setError(err.message || 'An unexpected error occurred while fetching notes.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);
 main

main
  const handleOpenForm = (note: Note | null = null) => {
    setEditingNote(note);
    setIsFormOpen(true);
    setActionError(null); // Clear previous action errors when opening form
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingNote(null);
  };

  const handleFormSubmit = async (noteData: { id?: string; title: string; content: string; tags?: string }) => {
    setIsSubmitting(true);
    setActionError(null);
feature/notes-page

feature/notes-page
main

    if (!activeProjectId) {
      setActionError("Cannot create note: No active project selected.");
      setIsSubmitting(false);
      return;
    }

 feature/notes-page

 main
 main
    try {
      if (!window.electron?.ipcRenderer) {
        setActionError('IPC renderer not available.');
        setIsSubmitting(false);
        return;
      }

      let result;
feature/notes-page

 feature/notes-page
 main
      if (editingNote && noteData.id) { // Update existing note
        result = await window.electron.ipcRenderer.invoke('update-note', { id: noteData.id, data: noteData });
      } else { // Create new note
        const newNoteData = { ...noteData, projectId: activeProjectId };
feature/notes-page


      if (editingNote && noteData.id) {
        result = await window.electron.ipcRenderer.invoke('update-note', { id: noteData.id, data: noteData });
      } else {
        // For new notes, add projectId. This is a placeholder.
        // In a real app, this would come from user context or selection.
        const newNoteData = { ...noteData, projectId: "PROJECT_ID_PLACEHOLDER" };
main
main
        result = await window.electron.ipcRenderer.invoke('create-note', newNoteData);
      }

      if (result.success) {
        handleCloseForm();
        fetchNotes(); // Refresh the list
      } else {
        setActionError(result.error || `Failed to ${editingNote ? 'update' : 'create'} note.`);
      }
    } catch (err: any) {
      console.error(`Error submitting note:`, err);
      setActionError(err.message || `An unexpected error occurred while ${editingNote ? 'updating' : 'creating'} the note.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    // Basic confirmation, consider a more robust modal for this in a real app
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    setIsSubmitting(true);
    setActionError(null);
    try {
      if (!window.electron?.ipcRenderer) {
        setActionError('IPC renderer not available.');
        setIsSubmitting(false);
        return;
      }
      const result = await window.electron.ipcRenderer.invoke('delete-note', noteId);
      if (result.success) {
        fetchNotes(); // Refresh the list
      } else {
        setActionError(result.error || 'Failed to delete note.');
      }
    } catch (err: any) {
      console.error('Error deleting note:', err);
      setActionError(err.message || 'An unexpected error occurred while deleting the note.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };


  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <header className="mb-6 flex justify-between items-center">
feature/notes-page

        feature/notes-page
 main
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          {activeProjectId ? `Notes` : 'Notes'} 
        </h1>
        <button
          onClick={() => handleOpenForm()}
          disabled={isSubmitting || !activeProjectId || isLoadingProjectContext}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 disabled:opacity-50 disabled:bg-gray-400 dark:disabled:bg-gray-600"
          title={!activeProjectId ? "Please select a project to add a new note." : "Add New Note"}
 feature/notes-page

        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Notes</h1>
        <button
          onClick={() => handleOpenForm()}
          disabled={isSubmitting}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 disabled:opacity-50"
main
        
 main
          Add New Note
        </button>
      </header>

      {actionError && (
 feature/notes-page
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-800 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md">

 feature/notes-page
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-800 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md">

        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md">
 main
 main
          <p>Error: {actionError}</p>
        </div>
      )}

 feature/notes-page

feature/notes-page
 main
      {(isLoadingNotes || isLoadingProjectContext) && (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {isLoadingProjectContext ? 'Loading project...' : 'Loading notes...'}
          </p>
        </div>
      )}

      {!isLoadingNotes && !isLoadingProjectContext && !activeProjectId && (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600 dark:text-gray-400">No Project Selected</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">Please select or create a project from the header to manage notes.</p>
        </div>
      )}
      
      {!isLoadingNotes && !isLoadingProjectContext && activeProjectId && pageError && (
        <div className="text-center py-10 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md">
          <p className="text-lg text-red-600 dark:text-red-300">Error loading notes: {pageError}</p>
          <button
            onClick={fetchNotes}
            disabled={isSubmitting}
            className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 disabled:opacity-50"
 feature/notes-page


      {isLoading && (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600 dark:text-gray-400">Loading notes...</p>
          {/* You could add a spinner here */}
        </div>
      )}

      {!isLoading && error && (
        <div className="text-center py-10 p-4 bg-red-50 dark:bg-red-900_ border border-red-200 dark:border-red-700_ rounded-md">
          <p className="text-lg text-red-600 dark:text-red-300">Error loading notes: {error}</p>
          <button
            onClick={fetchNotes}
            className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
main
main
          
            Try Again
          </button>
        </div>
      )}

 feature/notes-page

feature/notes-page
 main
      {!isLoadingNotes && !isLoadingProjectContext && activeProjectId && !pageError && notes.length === 0 && (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600 dark:text-gray-400">No notes found for this project.</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">Click 'Add New Note' to create one for the current project.</p>
        </div>
      )}

      {!isLoadingNotes && !isLoadingProjectContext && activeProjectId && !pageError && notes.length > 0 && (
 feature/notes-page


      {!isLoading && !error && notes.length === 0 && (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600 dark:text-gray-400">No notes found.</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">Click 'Add New Note' to create one.</p>
        </div>
      )}

      {!isLoading && !error && notes.length > 0 && (
main
 main
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div key={note.id} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{note.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                  {note.content.substring(0, 100)}{note.content.length > 100 ? '...' : ''}
                </p>
                {note.tags && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Tags: <span className="font-medium">{note.tags}</span>
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                  Last updated: {formatDate(note.updatedAt)}
                </p>
                 <p className="text-xs text-gray-400 dark:text-gray-500">
                  Created: {formatDate(note.createdAt)}
                </p>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => handleOpenForm(note)}
                    disabled={isSubmitting}
                    className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    disabled={isSubmitting}
                    className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isFormOpen && (
        <NoteForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          initialData={editingNote}
        />
      )}
    </div>
  );
};

export default NotesPage;
