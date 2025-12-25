"use client";
import React, { useState } from 'react';
import { NeuralCell } from '@/core/digital-twin/NeuralCell';
import Link from 'next/link';

export default function TwinHub() {
    const [twin] = useState(() => new NeuralCell({
        traits: { openness: 0.8, curiosity: 0.9, stability: 0.7 },
        history: ['Joined Platform', 'Matched with BeatMaster'],
        signature: 'USER_AO1'
    }));

    const [messages, setMessages] = useState<{ role: 'user' | 'twin', content: string }[]>([
        { role: 'twin', content: 'Neural Link established. I am monitoring your interactions.' }
    ]);
    const [input, setInput] = useState('');

    const sendMessage = () => {
        if (!input) return;

        // User message
        const newMessages = [...messages, { role: 'user' as const, content: input }];
        setMessages(newMessages);

        // Markovian Decision
        // We mock "message importance" as random for now, or based on keyword length
        const importance = Math.min(input.length / 20, 1.0);
        const shouldProcess = twin.shouldProcessMessage(importance);

        setTimeout(() => {
            let response = "";
            if (shouldProcess) {
                response = `I have processed "${input}". My local DNA has been updated.`;
            } else {
                response = `[AUTO-FILTERED] Signal too weak. Ignoring to preserve cognitive load.`;
            }
            setMessages([...newMessages, { role: 'twin', content: response }]);
        }, 600);

        setInput('');
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <nav className="border-b border-zinc-800 p-4 sticky top-0 bg-black/80 backdrop-blur-xl z-50">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                        Neural Twin Hub
                    </h1>
                    <div className="flex gap-4 text-sm font-mono text-zinc-400">
                        <Link href="/dashboard" className="hover:text-white transition">Feed</Link>
                        <Link href="/twins" className="text-white">My Twin</Link>
                        <Link href="/lab" className="hover:text-white transition">The Lab</Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">

                {/* DNA VISUALIZATION */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-light">Biological Parameters</h2>

                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                        <h3 className="text-sm font-mono text-zinc-500 uppercase mb-4">Local DNA</h3>
                        <div className="space-y-4">
                            {Object.entries(twin.localDNA.traits).map(([trait, value]) => (
                                <div key={trait}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="capitalize">{trait}</span>
                                        <span className="font-mono">{value}</span>
                                    </div>
                                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500" style={{ width: `${value * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                        <h3 className="text-sm font-mono text-zinc-500 uppercase mb-4">Global DNA (System Ethics)</h3>
                        <div className="p-3 bg-zinc-950 rounded text-xs text-zinc-400 font-mono">
                            <p>SIGNATURE: {twin.globalDNA.signature}</p>
                            <p>STATUS: COMPLIANT</p>
                        </div>
                    </div>
                </div>

                {/* CHAT INTERFACE */}
                <div className="h-[600px] flex flex-col bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-zinc-800 bg-zinc-900">
                        <h3 className="text-sm font-bold">Neural Link Interface</h3>
                        <p className="text-xs text-zinc-500">Testing Markovian Routing Logic</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.role === 'user'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-zinc-800 text-zinc-200 font-mono text-xs'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-zinc-800 bg-zinc-900">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Transmit data to twin..."
                                className="flex-1 bg-black border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500"
                            />
                            <button
                                onClick={sendMessage}
                                className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition"
                            >
                                SEND
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
