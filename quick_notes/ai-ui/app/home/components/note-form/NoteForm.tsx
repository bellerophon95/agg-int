import React from 'react';

type FormData = {
  title: string;
  body: string;
};

interface NoteFormProps {
  isOpen: boolean;
  isEdit: boolean;
  formData: FormData;
  onClose: () => void;
  onSubmit: () => void;
  onChange: (field: keyof FormData, value: string) => void;
}

export const NoteForm: React.FC<NoteFormProps> = ({ isOpen, isEdit, formData, onClose, onSubmit, onChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{isEdit ? 'Edit Note' : 'Add Note'}</h2>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => onChange('title', e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <textarea
          placeholder="Body"
          value={formData.body}
          onChange={(e) => onChange('body', e.target.value)}
          className="w-full p-2 border rounded mb-4"
          rows={4}
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};