import { useState } from 'react';
import { BallisticsEngine } from '../utils/ballistics';

function QuickLookupView({ setView, userSettings, weather }) {
    const [distance, setDistance] = useState('');
    const [result, setResult] = useState(null);

    const handleCalculate = () => {
        const dist = parseFloat(distance);
        if (isNaN(dist) || dist <= 0) {
            alert('Please enter a valid distance');
            return;
        }

        const currentWeather = weather || { temp: 59, pressure: 29.92, altitude: 0 };
        
        const dope = BallisticsEngine.calculateDope(
            userSettings.velocity,
            userSettings.bc,
            dist,
            userSettings.zeroDistance,
            userSettings.sightHeight,
            currentWeather.temp,
            currentWeather.altitude,
            currentWeather.pressure
        );

        setResult(dope);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleCalculate();
        }
    };

    return (
        <div>
            <button onClick={() => setView('home')} className="text-blue-600 mb-4">← Back</button>
            
            <div className="card">
                <h2 className="text-xl font-bold mb-4">Quick Distance Lookup</h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Distance (yards)</label>
                        <input
                            type="number"
                            value={distance}
                            onChange={(e) => setDistance(e.target.value)}
                            placeholder="Enter target distance"
                            className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            onKeyPress={handleKeyPress}
                        />
                    </div>

                    <button
                        onClick={handleCalculate}
                        className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 transition"
                    >
                        Calculate
                    </button>
                </div>

                {result && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg">
                        <h3 className="font-bold text-lg mb-3">Dope for {result.distance} yards:</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-lg">
                                <span className="font-medium">Elevation:</span>
                                <span className="font-bold text-green-700">{result.milAdjustment} mils</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>0.1 mil clicks:</span>
                                <span>{result.clicksTenth} clicks</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>0.25 mil clicks:</span>
                                <span>{result.clicksQuarter} clicks</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Bullet drop:</span>
                                <span>{result.drop} inches</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {weather && (
                <div className="card">
                    <h3 className="font-bold mb-2">Current Conditions</h3>
                    <div className="text-sm space-y-1">
                        <div>Temperature: {weather.temp}°F</div>
                        <div>Pressure: {weather.pressure}" Hg</div>
                        <div>Altitude: {weather.altitude}'</div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuickLookupView;