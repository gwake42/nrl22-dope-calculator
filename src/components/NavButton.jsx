function NavButton({ icon, label, onClick, active }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center px-4 py-2 rounded-lg transition ${
                active ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
            }`}
        >
            <span className="text-2xl">{icon}</span>
            <span className="text-xs mt-1">{label}</span>
        </button>
    );
}

export default NavButton;