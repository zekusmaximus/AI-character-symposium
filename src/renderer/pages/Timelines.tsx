import React, { useState, useEffect, useCallback } from 'react';
import TimelineEventForm from '../components/timeline/TimelineEventForm'; // Adjust path as necessary

// Define the window.electron type
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        invoke: (channel: string, ...args: any[]) => Promise<any>;
      };
      getAppInfo: () => Promise<any>;
      setOpenAIKey: (key: string) => Promise<void>;
      setAnthropicKey: (key: string) => Promise<void>;
      generateCharacterResponse: (params: { characterId: string; prompt: string; conversationStyle: string }) => Promise<any>;
    };
  }
}

interface TimelineEvent {
  id: number;
  date: string; // ISO string from backend
  description: string;
  charactersInvolved: string; // Comma-separated string
  createdAt: string;
  updatedAt: string;
}

const TimelinesPage: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true); // For initial data load
  const [error, setError] = useState<string | null>(null); // For initial data load error
  const [actionError, setActionError] = useState<string | null>(null); // For errors from CRUD actions
  const [isSubmitting, setIsSubmitting] = useState(false); // For disabling buttons during actions

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setActionError(null); // Clear previous action errors on refresh
    try {
      const response = await window.electron.ipcRenderer.invoke('get-timeline-events');
      if (response.success) {
        setEvents(response.data);
        setError(null); // Clear initial load error
      } else {
        setError(response.error || 'Failed to fetch events.');
        setEvents([]); 
      }
    } catch (err: any) {
      console.error('Error invoking get-timeline-events:', err);
      setError(err.message || 'An unexpected error occurred.');
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleOpenFormForCreate = () => {
    setActionError(null); // Clear errors when opening form
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleOpenFormForEdit = (event: TimelineEvent) => {
    setActionError(null); // Clear errors when opening form
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingEvent(null); 
  };

  const handleFormSubmit = async (eventData: { id?: number; date: string; description: string; charactersInvolved: string }) => {
    setIsSubmitting(true);
    setActionError(null);
    try {
      let response;
      if (editingEvent && eventData.id) { 
        response = await window.electron.ipcRenderer.invoke('update-timeline-event', { id: eventData.id, data: eventData });
      } else { 
        const { id, ...newEventData } = eventData; 
        response = await window.electron.ipcRenderer.invoke('create-timeline-event', newEventData);
      }

      if (response.success) {
        await fetchEvents(); 
        handleFormClose();
      } else {
        console.error('Failed to save event:', response.error);
        setActionError(response.error || 'Failed to save event.');
        // Keep form open if error is from backend, so user can see/correct
        // For this, TimelineEventForm might need an error prop.
        // For now, form closes, error displayed on main page.
        handleFormClose(); // Or optionally keep form open by not calling this
      }
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setActionError(err.message || 'An unexpected error occurred while saving the event.');
      handleFormClose(); // Or optionally keep form open
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setIsSubmitting(true);
      setActionError(null);
      try {
        const response = await window.electron.ipcRenderer.invoke('delete-timeline-event', eventId);
        if (response.success) {
          await fetchEvents(); 
        } else {
          console.error('Failed to delete event:', response.error);
          setActionError(response.error || 'Failed to delete event.');
        }
      } catch (err: any) {
        console.error('Error deleting event:', err);
        setActionError(err.message || 'An unexpected error occurred while deleting the event.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };


  if (isLoading && events.length === 0) { 
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Timelines</h1>
        <p className="text-gray-700 dark:text-gray-300">Loading timeline events...</p>
      </div>
    );
  }

  if (error && events.length === 0) { // Show error only if events are not populated (e.g. initial load failed)
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Timelines</h1>
        <p className="text-red-500">Error fetching events: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Timelines</h1>
      
      <div className="mb-6">
        <button 
          onClick={handleOpenFormForCreate}
          disabled={isSubmitting}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50"
        >
          Add New Event
        </button>
      </div>

      {/* Display action error message (from CRUD operations) */}
      {actionError && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md">
          <p>Error: {actionError}</p>
        </div>
      )}
      
      {/* Display initial load error message */}
      {error && events.length === 0 && (
         <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md">
            <p>Error loading events: {error}. Please try refreshing or check the logs.</p>
        </div>
      )}


      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        {events.length === 0 && !isLoading && !error ? ( 
          <p className="text-gray-700 dark:text-gray-300">No timeline events found. Click "Add New Event" to create one.</p>
        ) : (
          <ul className="space-y-4">
            {events.map(event => (
              <li key={event.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span className="font-medium">Characters:</span> {event.charactersInvolved || 'N/A'}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-wrap">{event.description}</p>
                <div className="mt-3 space-x-2 text-right">
                  <button 
                    onClick={() => handleOpenFormForEdit(event)}
                    disabled={isSubmitting}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteEvent(event.id)}
                    disabled={isSubmitting}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {isFormOpen && (
        <TimelineEventForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          initialData={editingEvent}
        />
      )}
    </div>
  );
};

export default TimelinesPage;
