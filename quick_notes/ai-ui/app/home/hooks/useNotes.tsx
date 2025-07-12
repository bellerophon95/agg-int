import { useState, useCallback } from 'react';
import _debounce from 'lodash/debounce';
import { apiClient}  from '../client/apiClient'; 
import { Note, FormData } from '../types'; 

const SEARCH_DEBOUNCE_MS = 300;

export const useNotes = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [recentNotes, setRecentNotes] = useState<Note[]>([]);

    const fetchNotes = useCallback(async () => {
        try {
            const response = await apiClient.get('/notes');
            setNotes(response.data);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    }, []);

    const fetchRecentNotes = useCallback(async () => {
        try {
            const response = await apiClient.get('/notes/recent');
            setRecentNotes(response.data);
        } catch (error) {
            console.error('Error fetching recent notes:', error);
        }
    }, []);

    const searchNotes = useCallback(
        _debounce(async (query: string) => {
            try {
                const response = await apiClient.get(`/notes/search?q=${query}`);
                setNotes(response.data);
            } catch (error) {
                console.error('Error searching notes:', error);
            }
        }, SEARCH_DEBOUNCE_MS),
        []
    );

    const deleteNote = async (id: string) => {
        try {
            await apiClient.delete(`/note/${id}`);
            fetchNotes();
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const saveNote = async (formData: FormData, isEdit: boolean) => {
        try {
            if (isEdit && formData.id) {
                await apiClient.put(`/note/${formData.id}`, {
                    title: formData.title,
                    body: formData.body,
                });
            } else {
                await apiClient.post('/note', {
                    title: formData.title,
                    body: formData.body,
                });
            }
            fetchNotes();
        } catch (error) {
            console.error('Error saving note:', error);
        }
    };

    const fetchNote = async (id: string): Promise<Note | null> => {
        try {
            const response = await apiClient.get(`/note/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching note:', error);
            return null;
        }
    };

    return {
        notes,
        recentNotes,
        fetchNotes,
        fetchRecentNotes,
        searchNotes,
        deleteNote,
        saveNote,
        fetchNote,
    };
};

