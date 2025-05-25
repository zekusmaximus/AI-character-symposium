import React, { useState, useEffect } from 'react';

interface Note {
  id: string;
  title: string;
  content: string;
  tags?: string;
  // createdAt: string; 
  // updatedAt: string;
  // projectId: string; 
}

interface NoteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (noteData: { id?: string; title: string; content: string; tags?: string }) => void;
  initialData?: Note | null;
}

const NoteForm: React.FC<NoteFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [formValidationError, setFormValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setContent(initialData.content);
        setTags(initialData.tags || '');
      } else {
        setTitle('');
        setContent('');
        setTags('');
      }
      setFormValidationError(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'title') setTitle(value);
    else if (name === 'content') setContent(value);
    else if (name === 'tags') setTags(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setFormValidationError('Content cannot be empty.');
      return;
    }
    if (!title.trim()) {
      setFormValidationError('Title cannot be empty.');
      return;
    }
    setFormValidationError(null);
    onSubmit({
      id: initialData?.id,
      title,
      content,
      tags,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg transform transition-all">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {initialData ? 'Edit Note' : 'Add New Note'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Content
            </label>
            <textarea
              name="content"
              id="content"
              value={content}
              onChange={handleChange}
              rows={6}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              id="tags"
              value={tags}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., work, personal, important"
            />
          </div>

          {formValidationError && (
            <p className="text-red-500 text-sm mb-4">{formValidationError}</p>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {initialData ? 'Save Changes' : 'Add Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteForm;
