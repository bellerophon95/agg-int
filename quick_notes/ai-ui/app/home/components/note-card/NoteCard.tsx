interface Note {
  _id: string;
  title: string;
  body: string;
  created_by: string;
  updated_time: string;
}

const TRUNCATE_LENGTH = 100;

const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};


export const NoteCard: React.FC<{
    note: Note;
    onView: (id: string) => void;
    onEdit: (id: string, title: string, body: string) => void;
    onDelete: (id: string) => void;
}> = ({ note, onView, onEdit, onDelete }) => (
    <div className="p-4 bg-white shadow rounded">
        <h2 className="text-lg font-bold">{note.title}</h2>
        <h2 className="text-sm text-gray-500">Author: {note.created_by}</h2>
        <p className="text-sm text-gray-700">{truncateText(note.body, TRUNCATE_LENGTH)}</p>
        <div className="mt-2 flex flex-wrap gap-2">
            <button
                onClick={() => onView(note._id)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
                View
            </button>
            <button
                onClick={() => onEdit(note._id, note.title, note.body)}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
                Edit
            </button>
            <button
                onClick={() => onDelete(note._id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
                Delete
            </button>
        </div>
    </div>
);
