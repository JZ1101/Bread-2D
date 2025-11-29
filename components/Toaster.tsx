import React, { useState, useEffect, useRef } from 'react';
import { Flame, Pause } from 'lucide-react';

interface ToasterProps {
  onComplete: (score: number) => void;
}

export const Toaster: React.FC<ToasterProps> = ({ onComplete }) => {
  const [toastLevel, setToastLevel] = useState(0);
  const [isToasting, setIsToasting] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const startToasting = () => {
    setIsToasting(true);
    intervalRef.current = window.setInterval(() => {
      setToastLevel(prev => {
        if (prev >= 100) {
          stopToasting();
          return 100;
        }
        return prev + 1; // Speed of toasting
      });
    }, 100);
  };

  const stopToasting = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsToasting(false);
    onComplete(toastLevel);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Calculate toast color based on level
  // 0 = #fef3c7 (amber-100)
  // 50 = #d97706 (amber-600) - Perfect
  // 100 = #451a03 (amber-950) - Burnt
  const getToastColor = (level: number) => {
    if (level < 50) {
        // Interpolate light to golden
        const p = level / 50;
        return `rgba(${254 - (254-217)*p}, ${243 - (243-119)*p}, ${199 - (199-6)*p}, 1)`;
    } else {
        // Interpolate golden to burnt
        const p = (level - 50) / 50;
        return `rgba(${217 - (217-69)*p}, ${119 - (119-26)*p}, ${6 - (6-3)*p}, 1)`;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in zoom-in duration-500">
      <h2 className="text-3xl font-bold text-amber-800">Toast It!</h2>
      <p className="text-amber-600">Stop when it's golden brown!</p>

      <div className="relative w-64 h-64 bg-gray-200 rounded-xl border-4 border-gray-400 flex items-center justify-center shadow-inner">
        {/* Toaster Slot */}
        <div className="w-48 h-4 bg-gray-800 rounded-full absolute top-12 opacity-20"></div>
        
        {/* Bread popping up/down */}
        <div 
            className={`w-40 h-40 rounded-lg border-2 border-amber-900/20 shadow-md transition-all duration-500 ease-in-out ${isToasting ? 'translate-y-8' : '-translate-y-4'}`}
            style={{ backgroundColor: getToastColor(toastLevel) }}
        >
            <div className="w-full h-full opacity-10 bg-[radial-gradient(circle,transparent_20%,#00000010_20%,#00000010_25%,transparent_25%)] bg-[length:10px_10px]"></div>
        </div>

        {/* Toaster Front Overlay */}
        <div className="absolute bottom-0 w-full h-32 bg-gray-300 rounded-b-lg border-t-4 border-gray-400 z-10 flex items-center justify-center shadow-lg">
             <div className="text-gray-500 font-bold text-xl tracking-widest">TOAST-MASTER 3000</div>
        </div>
      </div>

      <div className="flex space-x-4">
        {!isToasting && toastLevel === 0 && (
          <button 
            onClick={startToasting}
            className="flex items-center gap-2 px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <Flame size={24} /> Start
          </button>
        )}
        
        {isToasting && (
          <button 
            onClick={stopToasting}
            className="flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 animate-pulse"
          >
            <Pause size={24} /> STOP!
          </button>
        )}
      </div>

      <div className="text-xl font-mono font-bold text-gray-700">
        Temp: {toastLevel}°C
      </div>
    </div>
  );
};