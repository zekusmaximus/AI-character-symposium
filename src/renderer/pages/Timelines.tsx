import React, { useState, useEffect, useCallback } from 'react';
import { useProject } from '../contexts/ProjectContext';
import TimelineEventForm from '../components/timeline/TimelineEventForm';
import TimelineForm from '../components/timeline/TimelineForm'; // Newly created form for Timelines

// Define the window.electron type - this might be better in a global .d.ts file
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        invoke: (channel: string, ...args: any[]) => Promise<any>;
      };
      // other electron API methods if any
    };
  }
}

interface Timeline {
  id: string;
  name: string;
  description?: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

interface TimelineEvent {
  id: number; // Sticking with number as per original if DB uses auto-increment int
  date: string; // ISO string
  description: string;
  charactersInvolved: string;
  timelineId: string; // Foreign key to Timeline
  createdAt: string;
  updatedAt: string;
}

const TimelinesPage: React.FC = () => {
  const { activeProjectId, activeProject, isLoadingProjects } = useProject();

  // State for Timelines
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [selectedTimeline, setSelectedTimeline] = useState<Timeline | null>(null);
  const [isLoadingTimelines, setIsLoadingTimelines] = useState<boolean>(false);
  const [timelineError, setTimelineError] = useState<string | null>(null); // Errors for fetching/managing timelines
  const [timelineActionError, setTimelineActionError] = useState<string | null>(null); // Specific for create/update/delete actions on timelines
  const [isTimelineFormOpen, setIsTimelineFormOpen] = useState<boolean>(false);
  const [editingTimeline, setEditingTimeline] = useState<Timeline | null>(null); // For editing a timeline

  // State for Timeline Events
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(false);
  const [eventError, setEventError] = useState<string | null>(null); // Errors for fetching events
  const [eventActionError, setEventActionError] = useState<string | null>(null); // Specific for create/update/delete actions on events
  const [isEventFormOpen, setIsEventFormOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Generic submitting state for simplicity, can be split

  // Fetch Timelines for the active project
  const fetchTimelines = useCallback(async (projectId: string) => {
    setIsLoadingTimelines(true);
    setTimelineError(null);
    setTimelineActionError(null);
    try {
      const response = await window.electron.ipcRenderer.invoke('get-timelines', projectId);
      if (response.success) {
        setTimelines(response.data || []);
      } else {
        setTimelineError(response.error || 'Failed to fetch timelines.');
        setTimelines([]);
      }
    } catch (err: any) {
      console.error('Error invoking get-timelines:', err);
      setTimelineError(err.message || 'An unexpected error occurred while fetching timelines.');
      setTimelines([]);
    } finally {
      setIsLoadingTimelines(false);
    }
  }, []);

  useEffect(() => {
    if (activeProjectId) {
      fetchTimelines(activeProjectId);
      setSelectedTimeline(null); // Reset selected timeline when project changes
      setEvents([]); // Clear events when project changes
    } else {
      setTimelines([]);
      setSelectedTimeline(null);
      setEvents([]);
    }
  }, [activeProjectId, fetchTimelines]);

  // Fetch Timeline Events for the selected timeline
  const fetchTimelineEvents = useCallback(async (timelineId: string) => {
    setIsLoadingEvents(true);
    setEventError(null);
    setEventActionError(null);
    try {
      const response = await window.electron.ipcRenderer.invoke('get-timeline-events', timelineId);
      if (response.success) {
        setEvents(response.data || []);
      } else {
        setEventError(response.error || 'Failed to fetch timeline events.');
        setEvents([]);
      }
    } catch (err: any) {
      console.error('Error invoking get-timeline-events for timeline:', err);
      setEventError(err.message || 'An unexpected error occurred while fetching events.');
      setEvents([]);
    } finally {
      setIsLoadingEvents(false);
    }
  }, []);

  useEffect(() => {
    if (selectedTimeline) {
      fetchTimelineEvents(selectedTimeline.id);
    } else {
      setEvents([]); // Clear events if no timeline is selected
    }
  }, [selectedTimeline, fetchTimelineEvents]);

  // Timeline Form Handlers
  const handleOpenTimelineFormForCreate = () => {
    setEditingTimeline(null);
    setTimelineActionError(null);
    setIsTimelineFormOpen(true);
  };

  // const handleOpenTimelineFormForEdit = (timeline: Timeline) => {
  //   setEditingTimeline(timeline);
  //   setTimelineActionError(null);
  //   setIsTimelineFormOpen(true);
  // };

  const handleTimelineFormClose = () => {
    setIsTimelineFormOpen(false);
    setEditingTimeline(null);
  };

  const handleTimelineFormSubmit = async (name: string, description?: string) => {
    if (!activeProjectId) {
      setTimelineActionError("No active project to associate with this timeline.");
      return;
    }
    setIsSubmitting(true);
    setTimelineActionError(null);
    try {
      // TODO: Add update logic if editingTimeline is set
      const response = await window.electron.ipcRenderer.invoke('create-timeline', { name, description, projectId: activeProjectId });
      if (response.success) {
        await fetchTimelines(activeProjectId); // Refresh timelines
        // Optionally, select the newly created timeline
        // setSelectedTimeline(response.data); 
        handleTimelineFormClose();
      } else {
        setTimelineActionError(response.error || 'Failed to save timeline.');
      }
    } catch (err: any) {
      console.error('Error submitting timeline form:', err);
      setTimelineActionError(err.message || 'An unexpected error occurred while saving the timeline.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Timeline Event Form Handlers
  const handleOpenEventFormForCreate = () => {
    setEditingEvent(null);
    setEventActionError(null);
    setIsEventFormOpen(true);
  };

  const handleOpenEventFormForEdit = (event: TimelineEvent) => {
    setEditingEvent(event);
    setEventActionError(null);
    setIsEventFormOpen(true);
  };

  const handleEventFormClose = () => {
    setIsEventFormOpen(false);
    setEditingEvent(null);
  };

  const handleEventFormSubmit = async (eventData: { id?: number; date: string; description: string; charactersInvolved: string }) => {
    if (!selectedTimeline) {
      setEventActionError("No timeline selected to add event to.");
      return;
    }
    setIsSubmitting(true);
    setEventActionError(null);
    try {
      let response;
      if (editingEvent && eventData.id) {
        response = await window.electron.ipcRenderer.invoke('update-timeline-event', { id: eventData.id, data: eventData });
      } else {
        const { id, ...newEventData } = eventData;
        response = await window.electron.ipcRenderer.invoke('create-timeline-event', { ...newEventData, timelineId: selectedTimeline.id });
      }

      if (response.success) {
        await fetchTimelineEvents(selectedTimeline.id);
        handleEventFormClose();
      } else {
        setEventActionError(response.error || 'Failed to save event.');
      }
    } catch (err: any) {
      console.error('Error submitting event form:', err);
      setEventActionError(err.message || 'An unexpected error occurred while saving the event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
     if (!selectedTimeline) return; // Should not happen if delete button is only shown with events
    if (window.confirm('Are you sure you want to delete this event?')) {
      setIsSubmitting(true);
      setEventActionError(null);
      try {
        const response = await window.electron.ipcRenderer.invoke('delete-timeline-event', eventId);
        if (response.success) {
          await fetchTimelineEvents(selectedTimeline.id);
        } else {
          setEventActionError(response.error || 'Failed to delete event.');
        }
      } catch (err: any)
      {
        console.error('Error deleting event:', err);
        setEventActionError(err.message || 'An unexpected error occurred while deleting the event.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  // Render Logic
  if (isLoadingProjects) {
    return <div className="p-6 text-center text-gray-500 dark:text-gray-400">Loading project information...</div>;
  }

  if (!activeProjectId) {
    return <div className="p-6 text-center text-gray-500 dark:text-gray-400">Please select a project from the header to manage timelines.</div>;
  }

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          {activeProject ? `${activeProject.name} / Timelines` : 'Timelines'}
        </h1>
        <button
          onClick={handleOpenTimelineFormForCreate}
          disabled={isSubmitting || isLoadingTimelines}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 disabled:opacity-50"
        >
          Add New Timeline
        </button>
      </header>

      {timelineActionError && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-800 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md">
          <p>Timeline Error: {timelineActionError}</p>
        </div>
      )}
      {eventActionError && (
         <div className="mb-4 p-3 bg-red-100 dark:bg-red-800 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md">
          <p>Event Error: {eventActionError}</p>
        </div>
      )}


      {isLoadingTimelines && <p className="text-gray-500 dark:text-gray-400">Loading timelines...</p>}
      {timelineError && <p className="text-red-500 dark:text-red-400">Error loading timelines: {timelineError}</p>}

      {!isLoadingTimelines && !timelineError && timelines.length === 0 && (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-lg text-gray-600 dark:text-gray-400">No timelines found for this project.</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">Click 'Add New Timeline' to create one.</p>
        </div>
      )}

      {!isLoadingTimelines && !timelineError && timelines.length > 0 && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {timelines.map(timeline => (
            <div 
              key={timeline.id} 
              onClick={() => setSelectedTimeline(timeline)}
              className={`p-4 rounded-lg shadow-md cursor-pointer transition-all duration-200 ease-in-out
                          ${selectedTimeline?.id === timeline.id 
                            ? 'bg-indigo-600 text-white ring-2 ring-indigo-700 dark:ring-indigo-400' 
                            : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              <h2 className={`text-xl font-semibold ${selectedTimeline?.id === timeline.id ? 'text-white' : 'text-gray-800 dark:text-white'}`}>{timeline.name}</h2>
              {timeline.description && <p className={`text-sm mt-1 ${selectedTimeline?.id === timeline.id ? 'text-indigo-100' : 'text-gray-600 dark:text-gray-400'}`}>{timeline.description}</p>}
            </div>
          ))}
        </div>
      )}

      {selectedTimeline && (
        <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-700">
          <header className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Events for: <span className="text-indigo-600 dark:text-indigo-400">{selectedTimeline.name}</span></h2>
            <button
              onClick={handleOpenEventFormForCreate}
              disabled={isSubmitting || isLoadingEvents}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 disabled:opacity-50"
            >
              Add New Event
            </button>
          </header>
          
          {isLoadingEvents && <p className="text-gray-500 dark:text-gray-400">Loading events...</p>}
          {eventError && <p className="text-red-500 dark:text-red-400">Error loading events: {eventError}</p>}
          
          {!isLoadingEvents && !eventError && events.length === 0 && (
            <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
              <p className="text-lg text-gray-600 dark:text-gray-400">No events found for this timeline.</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Click 'Add New Event' to create one.</p>
            </div>
          )}

          {!isLoadingEvents && !eventError && events.length > 0 && (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <ul className="space-y-4">
                {events.map(event => (
                  <li key={event.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      {new Date(event.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span className="font-medium">Characters:</span> {event.charactersInvolved || 'N/A'}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-wrap">{event.description}</p>
                    <div className="mt-3 space-x-2 text-right">
                      <button 
                        onClick={() => handleOpenEventFormForEdit(event)}
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
            </div>
          )}
        </div>
      )}

      {!isLoadingProjects && activeProjectId && !selectedTimeline && !isLoadingTimelines && timelines.length > 0 && (
         <div className="text-center py-10 mt-8">
          <p className="text-lg text-gray-600 dark:text-gray-400">Select a timeline above to view its events, or create a new one.</p>
        </div>
      )}

      {isTimelineFormOpen && (
        <TimelineForm
          isOpen={isTimelineFormOpen}
          onClose={handleTimelineFormClose}
          onSubmit={handleTimelineFormSubmit}
          initialData={editingTimeline || undefined} // Pass undefined if not editing
        />
      )}

      {isEventFormOpen && (
        <TimelineEventForm
          isOpen={isEventFormOpen}
          onClose={handleEventFormClose}
          onSubmit={handleEventFormSubmit}
          initialData={editingEvent}
        />
      )}
    </div>
  );
};

export default TimelinesPage;
