import React, { useState, useEffect } from 'react';

interface TimelineEvent {
  id: number;
  date: string;
  description: string;
  charactersInvolved: string;
  createdAt: string;
  updatedAt: string;
}

interface TimelineEventFormData {
  date: string;
  description: string;
  charactersInvolved: string;
}

interface TimelineEventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: { id?: number; date: string; description: string; charactersInvolved: string }) => void;
  initialData?: TimelineEvent | null;
}

const TimelineEventForm: React.FC<TimelineEventFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<TimelineEventFormData>({
    date: '',
    description: '',
    charactersInvolved: '',
  });
  const [formValidationError, setFormValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
        description: initialData.description,
        charactersInvolved: initialData.charactersInvolved,
      });
    } else {
      // Reset form for new event
      setFormData({ date: '', description: '', charactersInvolved: '' });
    }
  }, [initialData, isOpen]); // Depend on isOpen to reset form when re-opened for new

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormValidationError(null); // Clear previous errors

    if (!formData.date.trim()) {
      setFormValidationError('Date is required.');
      return;
    }
    if (!formData.description.trim()) {
      setFormValidationError('Description is required.');
      return;
    }

    onSubmit({
      id: initialData?.id,
      ...formData,
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="relative mx-auto p-8 border w-full max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {initialData ? 'Edit Timeline Event' : 'Add New Timeline Event'}
        </h2>
        {formValidationError && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md">
            <p>{formValidationError}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="charactersInvolved" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Characters Involved
            </label>
            <input
              type="text"
              name="charactersInvolved"
              id="charactersInvolved"
              value={formData.charactersInvolved}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white"
              placeholder="Comma-separated names or IDs"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Tip: Use comma-separated values (e.g., Character A, Character B).
            </p>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
              {initialData ? 'Save Changes' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimelineEventForm;
