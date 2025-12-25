"use client";
import React, { useState, useRef } from 'react';
// import { motion } from 'framer-motion'; // Mocking since we can't install yet
import Link from 'next/link';

export default function CreativeLab() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [artGenerated, setArtGenerated] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleUpload = () => {
        setIsProcessing(true);
        // Simulate "Non-Gradient GNN" processing ($W = Pi^+ Y$)
        // Pseudoinverse calculation simulation time
        setTimeout(() => {
            setIsProcessing(false);
            setArtGenerated(true);
            drawGenerativeArt();
        }, 2000);
    };

    const drawGenerativeArt = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Spectral Attention Visualization
        // Drawing random spectral waves
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const width = canvas.width;
        const height = canvas.height;

        for (let i = 0; i < 50; i++) {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${Math.random() * 360}, 70%, 50%, 0.5)`;
            ctx.lineWidth = Math.random() * 2;
            ctx.moveTo(Math.random() * width, Math.random() * height);
            ctx.bezierCurveTo(
                Math.random() * width, Math.random() * height,
                Math.random() * width, Math.random() * height,
                Math.random() * width, Math.random() * height
            );
            ctx.stroke();
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <nav className="border-b border-zinc-800 p-4 sticky top-0 bg-black/80 backdrop-blur-xl z-50">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                        The Lab
                    </h1>
                    <div className="flex gap-4 text-sm font-mono text-zinc-400">
                        <Link href="/dashboard" className="hover:text-white transition">Feed</Link>
                        <Link href="/twins" className="hover:text-white transition">My Twin</Link>
                        <Link href="/lab" className="text-white">The Lab</Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto p-6 mt-10 text-center">
                <h2 className="text-4xl font-light mb-2">Music-to-Art GNN</h2>
                <p className="text-zinc-500 mb-12">Closed-form Pseudoinverse Transformation ($W = \Pi^{\dagger}Y$)</p>

                <div className="relative group w-full h-64 border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center hover:border-orange-500/50 hover:bg-zinc-900/30 transition-all cursor-pointer"
                    onClick={handleUpload}
                >
                    {isProcessing ? (
                        <div className="text-orange-400 animate-pulse font-mono">
                            CALCULATING PSEUDOINVERSE...
                        </div>
                    ) : artGenerated ? (
                        <div className="text-zinc-400">
                            <span className="text-orange-400">Transformation Complete.</span><br />
                            Click to Regenerate.
                        </div>
                    ) : (
                        <div className="text-zinc-500 group-hover:text-zinc-300">
                            <p className="mb-2 text-2xl">+</p>
                            <p>Upload Audio File</p>
                        </div>
                    )}
                </div>

                <div className="mt-12 bg-zinc-900 rounded-3xl p-4 shadow-2xl shadow-orange-900/10">
                    <canvas
                        ref={canvasRef}
                        width={700}
                        height={500}
                        className="w-full h-auto bg-black rounded-2xl border border-zinc-800"
                    />
                    {artGenerated && (
                        <div className="mt-4 flex justify-between items-center px-2">
                            <div className="text-left">
                                <p className="text-xs font-mono text-zinc-500">SPECTRAL ATTENTION FILTER</p>
                                <p className="text-sm font-bold text-white">Applied 4.2M parameters</p>
                            </div>
                            <button className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-zinc-200 transition">
                                Mint to Chain
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
