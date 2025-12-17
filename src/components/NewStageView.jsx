import { useState } from 'react';
import { BallisticsEngine } from '../utils/ballistics';

function NewStageView({ setView, stages, setStages, userSettings, weather }) {
    const [stageName, setStageName] = useState('');
    const [distances, setDistances] = useState('');
    const [includeWind, setIncludeWind] = useState(false);
    const [windSpeed, setWindSpeed] = useState(0);
    const [windDirection, setWindDirection] = useState(90); // 90 = full value
    const [notes, setNotes] = useState('');
    const [shotSequence, setShotSequence] = useState([]);
    const [showShotBuilder, setShowShotBuilder] = useState(false);

    const handleSave = () => {
        if (!stageName || !distances) {
            alert('Please enter stage name and distances');
            return;
        }

        const distanceArray = distances.split(',').map(d => parseInt(d.trim())).filter(d => !isNaN(d));
        
        if (distanceArray.length === 0) {
            alert('Please enter valid distances (e.g., 25, 50, 75, 100)');
            return;
        }

        const currentWeather = weather || { temp: 59, pressure: 29.92, altitude: 0 };

        // Calculate dope for each distance
        const dopeData = distanceArray.map(distance => 
            BallisticsEngine.calculateDope(
                userSettings.velocity,
                userSettings.bc,
                distance,
                userSettings.zeroDistance,
                userSettings.sightHeight,
                currentWeather.temp,
                currentWeather.altitude,
                currentWeather.pressure
            )
        );

        // Calculate relative dope (from minimum distance)
        const dopeDataWithRelative = BallisticsEngine.calculateRelativeDope(dopeData);

        const newStage = {
            id: Date.now(),
            name: stageName,
            date: new Date().toISOString(),
            distances: distanceArray,
            dopeData: dopeDataWithRelative,
            shotSequence: shotSequence,
            weather: currentWeather,
            ammo: {
                velocity: userSettings.velocity,
                bc: userSettings.bc,
                name: userSettings.ammo.name
            },
            wind: includeWind ? { speed: windSpeed, direction: windDirection } : null,
            notes,
            score: null
        };

        setStages([newStage, ...stages]);
        setView('stages');
    };

    const addShot = () => {
        setShotSequence([...shotSequence, { targetName: '', distance: '' }]);
    };

    const updateShot = (index, field, value) => {
        const updated = [...shotSequence];
        updated[index][field] = value;
        setShotSequence(updated);
    };

    const removeShot = (index) => {
        setShotSequence(shotSequence.filter((_, i) => i !== index));
    };

    const distanceArray = distances.split(',').map(d => parseInt(d.trim())).filter(d => !isNaN(d));

    return (
        <div>
            <button onClick={() => setView('home')} className="text-blue-600 mb-4">← Back</button>
            
            <div className="card">
                <h2 className="text-xl font-bold mb-4">New Stage</h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Stage Name</label>
                        <input
                            type="text"
                            value={stageName}
                            onChange={(e) => setStageName(e.target.value)}
                            placeholder="e.g., December 2024 - Stage 1"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Distances (yards, comma separated)</label>
                        <input
                            type="text"
                            value={distances}
                            onChange={(e) => setDistances(e.target.value)}
                            placeholder="e.g., 25, 50, 75, 100"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Stage description, positions, etc."
                            className="w-full p-2 border border-gray-300 rounded-lg h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Shot Sequence Builder */}
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium">Shot Sequence (Optional)</label>
                            <button
                                type="button"
                                onClick={() => setShowShotBuilder(!showShotBuilder)}
                                className="text-blue-600 text-sm hover:text-blue-800"
                            >
                                {showShotBuilder ? 'Hide' : 'Build Sequence'}
                            </button>
                        </div>

                        {showShotBuilder && (
                            <div className="space-y-2">
                                {shotSequence.map((shot, idx) => (
                                    <div key={idx} className="flex gap-2 items-center">
                                        <span className="text-xs text-gray-500 w-6">{idx + 1}.</span>
                                        <input
                                            type="text"
                                            value={shot.targetName}
                                            onChange={(e) => updateShot(idx, 'targetName', e.target.value)}
                                            placeholder="Target name"
                                            className="flex-1 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <select
                                            value={shot.distance}
                                            onChange={(e) => updateShot(idx, 'distance', parseInt(e.target.value))}
                                            className="w-24 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Dist</option>
                                            {distanceArray.map(d => (
                                                <option key={d} value={d}>{d}y</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => removeShot(idx)}
                                            className="text-red-500 text-sm px-2 hover:text-red-700"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addShot}
                                    className="w-full bg-gray-100 text-gray-700 py-2 rounded text-sm hover:bg-gray-200 transition"
                                >
                                    + Add Shot
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={includeWind}
                            onChange={(e) => setIncludeWind(e.target.checked)}
                            className="mr-2"
                        />
                        <label className="text-sm font-medium">Include Wind (Future Feature)</label>
                    </div>

                    {includeWind && (
                        <div className="pl-6 space-y-2 opacity-50">
                            <div>
                                <label className="block text-sm">Wind Speed (mph)</label>
                                <input
                                    type="number"
                                    value={windSpeed}
                                    onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    disabled
                                />
                            </div>
                        </div>
                    )}

                    {weather && (
                        <div className="bg-blue-50 p-3 rounded-lg text-sm">
                            <div className="font-medium mb-1">Current Conditions:</div>
                            <div>Temp: {weather.temp}°F</div>
                            <div>Pressure: {weather.pressure}" Hg</div>
                            <div>Altitude: {weather.altitude}' </div>
                        </div>
                    )}

                    <button
                        onClick={handleSave}
                        className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
                    >
                        Calculate & Save Stage
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NewStageView;