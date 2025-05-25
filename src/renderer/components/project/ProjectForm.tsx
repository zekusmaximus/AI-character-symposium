import React, { useState, useEffect } from 'react';

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description?: string) => Promise<void>;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset form when opening
      setName('');
      setDescription('');
      setFormError(null);
    }
  }, [isOpen]);

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
      setFormError('Project name cannot be empty.');
      return;
    }
    setFormError(null);
    try {
      await onSubmit(name, description);
      // onClose will be called by the parent component after successful submission
    } catch (error: any) {
      console.error("Error submitting project form:", error);
      setFormError(error.message || 'An error occurred during submission.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-95 opacity-0 animate-modalFadeInScaleUp">
        <h2 className="text-xl font-semibold mb-5 text-gray-900 dark:text-white">
          Create New Project
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Name
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
              placeholder="Enter a brief description of your project"
            />
          </div>

          {formError && (
            <p className="text-red-500 dark:text-red-400 text-sm mb-4 bg-red-100 dark:bg-red-900_ p-2 rounded-md">{formError}</p>
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
              Create Project
            </button>
          </div>
        </form>
      </div>
      {/* Basic CSS for modal animation - can be moved to a global CSS file */}
      <style jsx global>{`
        @keyframes modalFadeInScaleUp {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-modalFadeInScaleUp {
          animation: modalFadeInScaleUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ProjectForm;
