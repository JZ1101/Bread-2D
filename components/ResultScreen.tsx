import React from 'react';
import { GameStats } from '../types';
import { RefreshCw, Star } from 'lucide-react';

interface ResultScreenProps {
  stats: GameStats;
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ stats, onRestart }) => {
  // --- Deterministic Scoring Logic ---
  
  // 1. Calculate weighted components
  // Slice: 20% | Toast: 50% | Butter: 30%
  const sliceScore = stats.sliceQuality * 0.2;
  
  // Toast scoring: 50 is perfect. Deviate from 50 and score drops.
  // 50 => 100pts
  // 0 or 100 => 0pts
  const toastDist = Math.abs(stats.toastLevel - 50);
  const toastRawScore = Math.max(0, 100 - (toastDist * 2)); 
  const toastWeighted = toastRawScore * 0.5;

  const butterScore = stats.butterCoverage * 0.3;

  const totalRaw = sliceScore + toastWeighted + butterScore;

  // 2. Critical Failures (The "Gordon Ramsay" check)
  // If toast is Raw (<20) or Burnt (>80), score is capped strictly.
  let isCriticalFail = false;
  let statusMessage = "WELL DONE";
  
  if (stats.toastLevel < 20) {
    isCriticalFail = true;
    statusMessage = "IT'S RAW!";
  } else if (stats.toastLevel > 80) {
    isCriticalFail = true;
    statusMessage = "BURNT!";
  }

  // 3. Final Calculation
  // If critical fail, max score is 3/10 regardless of other stats
  const finalPercent = isCriticalFail ? Math.min(totalRaw, 30) : totalRaw;
  const finalScore10 = Math.round(finalPercent / 10);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-md mx-auto p-4 space-y-6 text-center animate-in zoom-in duration-500">
      
      <div className="bg-white p-6 rounded-2xl shadow-2xl border-2 border-amber-100 w-full relative overflow-hidden">
          {/* Decorative background stamp */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-500 rounded-full opacity-10 blur-xl"></div>

          <h2 className="text-3xl font-black text-amber-800 mb-2 tracking-tighter">SCORE</h2>
          
          <div className="flex justify-center items-center gap-1 mb-4">
              {Array.from({ length: 10 }).map((_, i) => (
                  <Star 
                      key={i} 
                      size={20} 
                      className={`${i < finalScore10 ? 'fill-yellow-400 text-yellow-500' : 'text-gray-200'}`} 
                  />
              ))}
          </div>
          
          <p className="text-6xl font-bold text-gray-800 mb-2">{finalScore10}<span className="text-2xl text-gray-400">/10</span></p>
          <p className="text-xl font-bold text-amber-600 uppercase tracking-widest">{statusMessage}</p>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full text-sm">
          <div className="bg-white p-2 rounded shadow-sm border border-gray-100 flex flex-col items-center">
              <span className="text-xs text-gray-400 uppercase tracking-wide">Cutting</span>
              <span className="font-bold text-gray-800">{stats.sliceQuality}%</span>
          </div>
          <div className="bg-white p-2 rounded shadow-sm border border-gray-100 flex flex-col items-center">
              <span className="text-xs text-gray-400 uppercase tracking-wide">Toasting</span>
              <span className="font-bold text-gray-800">{stats.toastLevel}%</span>
          </div>
          <div className="bg-white p-2 rounded shadow-sm border border-gray-100 flex flex-col items-center">
              <span className="text-xs text-gray-400 uppercase tracking-wide">Buttering</span>
              <span className="font-bold text-gray-800">{stats.butterCoverage}%</span>
          </div>
      </div>

      <button
        onClick={onRestart}
        className="flex items-center gap-2 px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <RefreshCw size={20} /> Cook Again
      </button>
    </div>
  );
};