import React, { useState } from 'react';
import { GamePhase, GameStats } from './types';
import { CuttingBoard } from './components/CuttingBoard';
import { Toaster } from './components/Toaster';
import { ButteringStation } from './components/ButteringStation';
import { ResultScreen } from './components/ResultScreen';
import { ChefHat, Play } from 'lucide-react';

export default function App() {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.START);
  const [stats, setStats] = useState<GameStats>({
    sliceQuality: 0,
    toastLevel: 0,
    butterCoverage: 0,
  });

  const handleSliceComplete = (score: number) => {
    setStats(prev => ({ ...prev, sliceQuality: score }));
    setPhase(GamePhase.TOAST);
  };

  const handleToastComplete = (level: number) => {
    setStats(prev => ({ ...prev, toastLevel: level }));
    setPhase(GamePhase.BUTTER);
  };

  const handleButterComplete = (coverage: number) => {
    setStats(prev => ({ ...prev, butterCoverage: coverage }));
    setPhase(GamePhase.RESULT);
  };

  const handleRestart = () => {
    setStats({ sliceQuality: 0, toastLevel: 0, butterCoverage: 0 });
    setPhase(GamePhase.START);
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[600px] flex flex-col relative border-4 border-amber-100">
        
        {/* Header */}
        <div className="bg-amber-500 p-4 flex justify-between items-center text-white shadow-md z-10">
          <div className="flex items-center gap-2">
            <ChefHat size={28} />
            <h1 className="text-xl font-bold tracking-wider">TOAST MASTER</h1>
          </div>
          <div className="text-xs font-mono bg-amber-600 px-2 py-1 rounded">
             PHASE: {phase}
          </div>
        </div>

        {/* Game Content Area */}
        <div className="flex-1 p-6 relative flex flex-col">
          {phase === GamePhase.START && (
            <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in zoom-in duration-500 text-center">
               <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center shadow-inner mb-4">
                  <span className="text-6xl">🍞</span>
               </div>
               <h2 className="text-4xl font-bold text-gray-800">Can you cook?</h2>
               <p className="text-gray-500 max-w-xs">Prove your skills. Cut, Bake, and Butter your way to victory.</p>
               <button 
                onClick={() => setPhase(GamePhase.CUT)}
                className="flex items-center gap-3 px-10 py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-lg rounded-full shadow-xl transition-all hover:scale-105 active:scale-95"
               >
                 <Play size={24} fill="currentColor" /> Play Now
               </button>
            </div>
          )}

          {phase === GamePhase.CUT && (
            <CuttingBoard onComplete={handleSliceComplete} />
          )}

          {phase === GamePhase.TOAST && (
            <Toaster onComplete={handleToastComplete} />
          )}

          {phase === GamePhase.BUTTER && (
            <ButteringStation toastLevel={stats.toastLevel} onComplete={handleButterComplete} />
          )}

          {phase === GamePhase.RESULT && (
            <ResultScreen stats={stats} onRestart={handleRestart} />
          )}
        </div>
        
        {/* Footer decoration */}
        <div className="h-4 bg-amber-200 w-full"></div>
      </div>
    </div>
  );
}