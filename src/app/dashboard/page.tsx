"use client";
import React, { useEffect, useState } from 'react';
import { MatchingService } from '@/core/matching/MatchingService';
import { CompatibilityForecast } from '@/components/CompatibilityForecast';
import Link from 'next/link';

// Mock Data Type for UI dev before DB is fully seeded
type MatchProfile = {
    user: { username: string };
    skill: string;
    compatibility_score: number;
    distance: number;
    attributes: number[]; // For SVD
};

export default function SyncLinkDashboard() {
    const [matches, setMatches] = useState<MatchProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredUser, setHoveredUser] = useState<string | null>(null);

    // Mock "My" Attributes for the session (normally from DB)
    const myAttributes = [0.8, 0.7, 0.9, 0.2, 0.5];

    useEffect(() => {
        async function fetchMatches() {
            // In a real scenario: const service = new MatchingService();
            // const results = await service.findMatches('current-user-id');

            // MOCK DATA for "First Match" verification
            const mockMatches: MatchProfile[] = [
                {
                    user: { username: 'MelodyMaker' },
                    skill: 'Songwriting',
                    compatibility_score: 0.95,
                    distance: 0.05,
                    attributes: [0.85, 0.6, 0.9, 0.2, 0.4]
                },
                {
                    user: { username: 'BeatMaster' },
                    skill: 'Production',
                    compatibility_score: 0.72,
                    distance: 0.38,
                    attributes: [0.2, 0.9, 0.5, 0.8, 0.1]
                },
                {
                    user: { username: 'LyricistPro' },
                    skill: 'Lyrics',
                    compatibility_score: 0.45,
                    distance: 1.2,
                    attributes: [0.9, 0.1, 0.1, 0.1, 0.9]
                },
            ];

            // Simulate network delay
            setTimeout(() => {
                setMatches(mockMatches);
                setLoading(false);
            }, 800);
        }
        fetchMatches();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30">
            <nav className="border-b border-zinc-800 p-4 sticky top-0 bg-black/80 backdrop-blur-xl z-50">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold tracking-tighter bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
                        SyncLink
                    </h1>
                    <div className="flex gap-4 text-sm font-mono text-zinc-400">
                        <Link href="/dashboard" className="text-white">Feed</Link>
                        <Link href="/twins" className="hover:text-white transition">My Twin</Link>
                        <Link href="/lab" className="hover:text-white transition">The Lab</Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto p-6 mt-10">
                <h2 className="text-3xl font-light mb-8">
                    <span className="font-bold">Neural Feed</span> / Recommended Connections
                </h2>

                {loading ? (
                    <div className="text-zinc-500 animate-pulse font-mono">Scanning neural pathways...</div>
                ) : (
                    <div className="space-y-6">
                        {matches.map((match, idx) => (
                            <div
                                key={idx}
                                className="group relative p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-emerald-500/50 hover:bg-zinc-900 transition-all duration-300 cursor-pointer"
                                onMouseEnter={() => setHoveredUser(match.user.username)}
                                onMouseLeave={() => setHoveredUser(null)}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition">
                                            {match.user.username}
                                        </h3>
                                        <p className="text-zinc-400 text-sm mt-1">{match.skill}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-mono font-bold text-white">
                                            {Math.round(match.compatibility_score * 100)}
                                            <span className="text-xs text-zinc-500 ml-1">%</span>
                                        </div>
                                        <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Mahalanobis Rank</div>
                                    </div>
                                </div>

                                {/* Hover Overlay: SVD Forecast */}
                                {hoveredUser === match.user.username && (
                                    <div className="absolute top-full left-0 z-10 pt-2 w-full">
                                        <CompatibilityForecast
                                            username={match.user.username}
                                            myAttributes={myAttributes}
                                            targetAttributes={match.attributes}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
