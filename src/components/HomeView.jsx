function HomeView({ setView, getLocationAndWeather, weather, manualWeather, setManualWeather, useManualWeather, setUseManualWeather, getCurrentWeather }) {
    return (
        <div>
            <div className="card">
                <h2 className="text-xl font-bold mb-4">Welcome to NRL22 Dope</h2>
                <p className="text-gray-600 mb-4">
                    Calculate accurate dope charts for your NRL22 stages based on your ammo velocity and current conditions.
                </p>
                
                <div className="mb-4">
                    {!weather && !useManualWeather && (
                        <button
                            onClick={getLocationAndWeather}
                            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition mb-3"
                        >
                            📍 Get GPS Conditions
                        </button>
                    )}
                    
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Weather Source:</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setUseManualWeather(false)}
                                className={`px-3 py-1 rounded text-sm transition ${
                                    !useManualWeather 
                                        ? 'bg-green-500 text-white' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                GPS
                            </button>
                            <button
                                onClick={() => setUseManualWeather(true)}
                                className={`px-3 py-1 rounded text-sm transition ${
                                    useManualWeather 
                                        ? 'bg-blue-500 text-white' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Manual
                            </button>
                        </div>
                    </div>

                    {useManualWeather && (
                        <div className="bg-blue-50 p-3 rounded-lg mb-3">
                            <h3 className="font-medium mb-2 text-sm">Manual Conditions:</h3>
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="block text-xs font-medium mb-1">Temp (°F)</label>
                                    <input
                                        type="number"
                                        value={manualWeather.temp}
                                        onChange={(e) => setManualWeather({
                                            ...manualWeather,
                                            temp: parseInt(e.target.value) || 59
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1">Pressure</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={manualWeather.pressure}
                                        onChange={(e) => setManualWeather({
                                            ...manualWeather,
                                            pressure: parseFloat(e.target.value) || 29.92
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1">Elevation (ft)</label>
                                    <input
                                        type="number"
                                        value={manualWeather.altitude}
                                        onChange={(e) => setManualWeather({
                                            ...manualWeather,
                                            altitude: parseInt(e.target.value) || 0
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
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