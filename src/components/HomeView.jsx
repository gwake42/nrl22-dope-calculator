function HomeView({ setView, getLocationAndWeather, weather }) {
    return (
        <div>
            <div className="card">
                <h2 className="text-xl font-bold mb-4">Welcome to NRL22 Dope</h2>
                <p className="text-gray-600 mb-4">
                    Calculate accurate dope charts for your NRL22 stages based on your ammo velocity and current conditions.
                </p>
                
                {!weather && (
                    <button
                        onClick={getLocationAndWeather}
                        className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition mb-3"
                    >
                        📍 Get Current Conditions
                    </button>
                )}
                
                <button
                    onClick={() => setView('newStage')}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition mb-3"
                >
                    + New Stage
                </button>
                
                <button
                    onClick={() => setView('quickLookup')}
                    className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 transition"
                >
                    🎯 Quick Distance Lookup
                </button>
            </div>

            <div className="card">
                <h3 className="font-bold mb-2">Quick Tips</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Create stages for each month's match</li>
                    <li>• Update your ammo velocity in Settings</li>
                    <li>• Use Quick Lookup during matches</li>
                    <li>• Track scores for each stage</li>
                </ul>
            </div>
        </div>
    );
}

export default HomeView;