import moment from "moment";
import { Note } from "../../types/Note";

const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

export const RecentNotesDrawer: React.FC<{
    isOpen: boolean;
    notes: Note[];
    onClose: () => void;
}> = ({ isOpen, notes, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 h-full w-80 bg-white shadow-lg p-4 overflow-y-auto z-40">
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none"
                aria-label="Close recent notes drawer"
            >
                &times;
            </button>
            <h3 className="text-lg font-bold mb-4">Recent Notes - Past 24 hours</h3>
            <div>
                {notes.length === 0 ? (
                    <p>No recent notes available.</p>
                ) : (
                    notes.map((note) => (
                        <div key={note._id} className="p-2 border-b">
                            <h4 className="font-bold">{note.title}</h4>
                            <p className="text-sm">{truncateText(note.body, 80)}</p>
                            <p className="text-xs text-gray-400">
                                Updated: {moment(note.updated_time).utc().format('YYYY-MM-DD HH:mm:ss')}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};