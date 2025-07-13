'use client';
import React, { useState, useEffect} from 'react';

// components
import NoteForm from './components/note-form';
import UserDropdown from './components/user-dropdown';
import NoteCard from './components/note-card';
import RecentNotesDrawer from './components/recent-notes-drawer';
import { Note, FormData } from './types';

import { useAuth } from './hooks/useAuth';
import { useNotes } from './hooks/useNotes';


const ViewNoteModal: React.FC<{
  isOpen: boolean;
  note: Note | null;
  onClose: () => void;
}> = ({ isOpen, note, onClose }) => {
  if (!isOpen || !note) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg relative max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-2xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-2">{note.title}</h2>
        <p className="text-sm text-gray-500 mb-4">By: {note.created_by}</p>
        <p className="whitespace-pre-wrap">{note.body}</p>
      </div>
    </div>
  );
};


const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewNote, setViewNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    body: '',
    id: null,
  });

  const { userEmail, logout } = useAuth();
  const {
    notes,
    recentNotes,
    fetchNotes,
    fetchRecentNotes,
    searchNotes,
    deleteNote,
    saveNote,
    fetchNote,
  } = useNotes();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    if (drawerOpen) {
      fetchRecentNotes();
    }
  }, [drawerOpen, fetchRecentNotes]);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchNotes(searchQuery);
    } else {
      searchNotes.cancel();
      fetchNotes();
    }
  }, [searchQuery, searchNotes, fetchNotes]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAddNote = () => {
    setIsEditMode(false);
    setFormData({ title: '', body: '', id: null });
    setFormOpen(true);
  };

  const handleEditNote = (id: string, title: string, body: string) => {
    setIsEditMode(true);
    setFormData({ title, body, id });
    setFormOpen(true);
  };

  const handleFormSubmit = async () => {
    await saveNote(formData, isEditMode);
    setFormOpen(false);
  };

  const handleViewNote = async (id: string) => {
    const note = await fetchNote(id);
    if (note) {
      setViewNote(note);
      setViewModalOpen(true);
    }
  };

  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Notes App</h1>
        <UserDropdown
          userEmail={userEmail}
          isOpen={dropdownOpen}
          onToggle={() => setDropdownOpen(!dropdownOpen)}
          onLogout={handleLogout}
        />
      </header>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search notes... (Full words only)"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4 flex gap-2">
        <button
          onClick={handleAddNote}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Note
        </button>

        {!drawerOpen && (
          <button
            onClick={() => setDrawerOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Recent Notes - Past 24 hours 🔥
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <NoteCard
            key={note._id}
            note={note}
            onView={handleViewNote}
            onEdit={handleEditNote}
            onDelete={deleteNote}
          />
        ))}
      </div>

      <NoteForm
        isOpen={formOpen}
        isEdit={isEditMode}
        formData={formData}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        onChange={handleFormChange}
      />

      <ViewNoteModal
        isOpen={viewModalOpen}
        note={viewNote}
        onClose={() => setViewModalOpen(false)}
      />

      <RecentNotesDrawer
        isOpen={drawerOpen}
        notes={recentNotes}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};

export default HomePage;