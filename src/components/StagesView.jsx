import { useState } from 'react';
import { BallisticsEngine } from '../utils/ballistics';
import { generateAndPrintDopeCard, generateAndPrintMultipleCards } from './DopeCardPrint';

function StagesView({ setView, stages, setStages, userSettings, weather }) {
    const [selectedStage, setSelectedStage] = useState(null);
    const [editingScore, setEditingScore] = useState(null);
    const [scoreValue, setScoreValue] = useState('');

    const handleDeleteStage = (id) => {
        if (confirm('Delete this stage?')) {
            setStages(stages.filter(s => s.id !== id));
            setSelectedStage(null);
        }
    };

    const handleRecalculateStage = (stageId) => {
        const stage = stages.find(s => s.id === stageId);
        if (!stage) return;

        const currentWeather = weather || { temp: 59, pressure: 29.92, altitude: 0 };

        // Recalculate dope with current settings
        const dopeData = stage.distances.map(distance => 
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

        // Calculate relative dope
        const dopeDataWithRelative = BallisticsEngine.calculateRelativeDope(dopeData);

        // Update the stage
        setStages(stages.map(s => 
            s.id === stageId ? {
                ...s,
                dopeData: dopeDataWithRelative,
                weather: currentWeather,
                ammo: {
                    velocity: userSettings.velocity,
                    bc: userSettings.bc,
                    name: userSettings.ammo.name
                }
            } : s
        ));
    };

    const handleSaveScore = (stageId) => {
        const score = parseInt(scoreValue);
        if (isNaN(score)) {
            alert('Please enter a valid score');
            return;
        }

        setStages(stages.map(s => 
            s.id === stageId ? { ...s, score } : s
        ));
        setEditingScore(null);
        setScoreValue('');
    };

    if (selectedStage) {
        const stage = stages.find(s => s.id === selectedStage);
        return (
            <div>
                <button onClick={() => setSelectedStage(null)} className="text-blue-600 mb-4">← Back to Stages</button>
                
                <div className="card">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-xl font-bold">{stage.name}</h2>
                            <div className="text-sm text-gray-500">{new Date(stage.date).toLocaleDateString()}</div>
                        </div>
                        <div className="flex gap-2">
                            {stage.shotSequence && stage.shotSequence.length > 0 && (
                                <button
                                    onClick={() => generateAndPrintDopeCard(stage, userSettings)}
                                    className="text-green-600 text-sm px-3 py-1 border border-green-600 rounded hover:bg-green-50 transition"
                                >
                                    Print Card
                                </button>
                            )}
                            <button
                                onClick={() => handleRecalculateStage(stage.id)}
                                className="text-blue-500 text-sm px-3 py-1 border border-blue-500 rounded hover:bg-blue-50 transition"
                            >
                                Recalc
                            </button>
                            <button
                                onClick={() => handleDeleteStage(stage.id)}
                                className="text-red-500 text-sm hover:text-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                    {stage.notes && (
                        <div className="mb-4 p-3 bg-gray-50 rounded text-sm">
                            {stage.notes}
                        </div>
                    )}

                    <div className="mb-4 p-3 bg-blue-50 rounded text-sm">
                        <div className="font-medium mb-1">Ammo & Conditions:</div>
                        <div>{stage.ammo.name} @ {stage.ammo.velocity} fps</div>
                        <div>{stage.weather.temp}°F • {stage.weather.pressure}" Hg • {stage.weather.altitude}' alt</div>
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold">Score:</h3>
                            {editingScore === stage.id ? (
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={scoreValue}
                                        onChange={(e) => setScoreValue(e.target.value)}
                                        placeholder="Score"
                                        className="w-20 p-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <button
                                        onClick={() => handleSaveScore(stage.id)}
                                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingScore(null);
                                            setScoreValue('');
                                        }}
                                        className="bg-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-400 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        setEditingScore(stage.id);
                                        setScoreValue(stage.score || '');
                                    }}
                                    className="text-blue-600 text-sm hover:text-blue-800 transition"
                                >
                                    {stage.score ? `${stage.score} points (edit)` : '+ Add Score'}
                                </button>
                            )}
                        </div>
                    </div>

                    {stage.shotSequence && stage.shotSequence.length > 0 && (
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold">Shot Sequence:</h3>
                                <button
                                    onClick={() => generateAndPrintDopeCard(stage, userSettings)}
                                    className="text-green-600 text-sm px-3 py-1 border border-green-600 rounded hover:bg-green-50 transition"
                                >
                                    🖨️ Print Dope Card
                                </button>
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    {stage.shotSequence.map((shot, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <span className="font-bold text-gray-500">{idx + 1}.</span>
                                            <span>{shot.targetName || 'Target'}</span>
                                            <span className="text-gray-400">•</span>
                                            <span className="font-medium">{shot.distance}y</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <h3 className="font-bold mb-3">Dope Chart:</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2 text-left" rowSpan="2">Dist</th>
                                    <th className="p-2 text-center border-r border-gray-300" colSpan="2">
                                        From {userSettings.zeroDistance}y Zero
                                    </th>
                                    <th className="p-2 text-center" colSpan="2">
                                        From Min Dist
                                    </th>
                                </tr>
                                <tr>
                                    <th className="p-2 text-right text-gray-600 font-normal">Dial (clicks)</th>
                                    <th className="p-2 text-right text-gray-600 font-normal border-r border-gray-300">Hold (mils)</th>
                                    <th className="p-2 text-right text-gray-600 font-normal">Dial (clicks)</th>
                                    <th className="p-2 text-right text-gray-600 font-normal">Hold (mils)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stage.dopeData.map((dope, idx) => {
                                    const isUnderZero = dope.distance < userSettings.zeroDistance;
                                    const milValue = parseFloat(dope.milAdjustment);
                                    const relativeMilValue = parseFloat(dope.relativeMils);
                                    const isRelativeUnderZero = relativeMilValue < 0;
                                    
                                    return (
                                        <tr key={idx} className="border-b">
                                            <td className="p-2 font-medium">{dope.distance}y</td>
                                            <td className="p-2 text-right">
                                                {isUnderZero ? (
                                                    <div className="text-gray-400 italic text-xs">zero stop</div>
                                                ) : (
                                                    <div className="font-bold text-green-700">{dope.clicksTenth} ↑</div>
                                                )}
                                            </td>
                                            <td className="p-2 text-right border-r border-gray-300">
                                                {isUnderZero ? (
                                                    <div className="font-bold text-orange-600">{Math.abs(milValue).toFixed(2)} ↓</div>
                                                ) : (
                                                    <div className="font-bold text-green-700">{dope.milAdjustment} ↑</div>
                                                )}
                                            </td>
                                            <td className="p-2 text-right">
                                                {isRelativeUnderZero ? (
                                                    <div className="text-gray-400 italic text-xs">zero stop</div>
                                                ) : (
                                                    <div className="font-bold text-blue-700">{dope.relativeClicksTenth} ↑</div>
                                                )}
                                            </td>
                                            <td className="p-2 text-right">
                                                {isRelativeUnderZero ? (
                                                    <div className="font-bold text-orange-600">{Math.abs(relativeMilValue).toFixed(2)} ↓</div>
                                                ) : (
                                                    <div className="font-bold text-blue-700">{dope.relativeMils} ↑</div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div className="mt-2 text-xs text-gray-500 space-y-1">
                            <div><strong>From {userSettings.zeroDistance}y Zero:</strong> Adjustments from your {userSettings.zeroDistance}-yard zero</div>
                            <div><strong>From Min Dist:</strong> Adjustments if you zero at the closest target</div>
                            <div className="italic">↑ Dial UP / Hold HIGH • ↓ Hold LOW (under) • "zero stop" = can't dial down</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">My Stages</h2>
                <div className="flex gap-2">
                    {stages.some(stage => stage.shotSequence && stage.shotSequence.length > 0) && (
                        <button
                            onClick={() => generateAndPrintMultipleCards(stages, userSettings)}
                            className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                        >
                            🖨️ Print All
                        </button>
                    )}
                    <button
                        onClick={() => setView('newStage')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition"
                    >
                        + New
                    </button>
                </div>
            </div>

            {stages.length === 0 ? (
                <div className="card text-center text-gray-500">
                    <p className="mb-4">No stages yet</p>
                    <button
                        onClick={() => setView('newStage')}
                        className="text-blue-600 font-medium hover:text-blue-800 transition"
                    >
                        Create your first stage
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {stages.map(stage => (
                        <div
                            key={stage.id}
                            onClick={() => setSelectedStage(stage.id)}
                            className="card cursor-pointer hover:shadow-lg transition"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold">{stage.name}</h3>
                                    <div className="text-sm text-gray-500 mt-1">
                                        {new Date(stage.date).toLocaleDateString()}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        {stage.distances.length} distances • {stage.ammo.name}
                                    </div>
                                    {stage.score && (
                                        <div className="text-sm text-green-600 font-medium mt-1">
                                            Score: {stage.score}
                                        </div>
                                    )}
                                </div>
                                <div className="text-gray-400">›</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default StagesView;