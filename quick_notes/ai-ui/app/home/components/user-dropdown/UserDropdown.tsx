export const UserDropdown: React.FC<{
    userEmail: string;
    isOpen: boolean;
    onToggle: () => void;
    onLogout: () => void;
}> = ({ userEmail, isOpen, onToggle, onLogout }) => (
    <div className="relative">
        <button
            className="text-md bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 flex items-center"
            onClick={onToggle}
        >
            {userEmail || 'User'}
            <span className="ml-2">&#9662;</span>
        </button>
        {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                <button
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                    Logout
                </button>
            </div>
        )}
    </div>
);