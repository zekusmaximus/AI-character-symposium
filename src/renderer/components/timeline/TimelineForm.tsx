import React, { useState, useEffect } from 'react';

interface TimelineFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description?: string) => Promise<void>;
  initialData?: { name: string; description?: string };
}

const TimelineForm: React.FC<TimelineFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setDescription(initialData.description || '');
      } else {
        setName('');
        setDescription('');
      }
      setFormError(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name: fieldName, value } = e.target;
    if (fieldName === 'name') setName(value);
    else if (fieldName === 'description') setDescription(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Timeline name cannot be empty.');
      return;
    }
    setFormError(null);
    try {
      await onSubmit(name, description);
      // onClose will typically be called by the parent component after successful submission
      // to allow for data refresh before closing the modal.
    } catch (error: any) {
      console.error("Error submitting timeline form:", error);
      setFormError(error.message || 'An error occurred during submission.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-95 opacity-0 animate-modalFadeInScaleUp">
        <h2 className="text-xl font-semibold mb-5 text-gray-900 dark:text-white">
          {initialData ? 'Edit Timeline' : 'Create New Timeline'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Timeline Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              name="description"
              id="description"
              value={description}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter a brief description for this timeline"
            />
          </div>

          {formError && (
            <p className="text-red-500 dark:text-red-400 text-sm mb-4 bg-red-100 dark:bg-red-900 p-2 rounded-md">{formError}</p>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
              {initialData ? 'Save Changes' : 'Create Timeline'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimelineForm;
