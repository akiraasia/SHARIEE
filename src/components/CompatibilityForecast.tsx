"use client";
import React, { useState, useEffect } from 'react';
import { LaplaceDemonEngine } from '@/core/digital-twin/LaplaceDemonEngine';

interface ForecastProps {
    myAttributes: number[];
    targetAttributes: number[];
    username: string;
}

export const CompatibilityForecast: React.FC<ForecastProps> = ({ myAttributes, targetAttributes, username }) => {
    const [prediction, setPrediction] = useState<number>(0);

    useEffect(() => {
        const lde = new LaplaceDemonEngine();
        const score = lde.simulateCompatibility(myAttributes, targetAttributes);
        setPrediction(score);
    }, [myAttributes, targetAttributes]);

    // Visualizing SVD outcomes
    const percentage = Math.round(prediction * 100);
    const color = percentage > 80 ? 'text-emerald-400' : percentage > 50 ? 'text-yellow-400' : 'text-red-400';

    return (
        <div className="p-4 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl max-w-xs backdrop-blur-md">
            <h4 className="text-xs font-mono text-zinc-400 mb-2">LAPLACE DEMON ENGINE</h4>
            <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Match Forecast</span>
                <span className={`text-xl font-black ${color}`}>{percentage}%</span>
            </div>
            <p className="text-xs text-zinc-500 mt-2">
                Projected causal transformation with {username}.
                {percentage > 80 ? ' High resonance detected.' : ' Potential dissonance.'}
            </p>

            {/* SVD Visualization Placeholder */}
            <div className="mt-3 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div
                    className={`h-full ${percentage > 80 ? 'bg-emerald-500' : 'bg-yellow-500'} transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};
