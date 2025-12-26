
import React, { useState, useEffect } from 'react';

interface ProcessingProps {
  onComplete: () => void;
}

const Processing: React.FC<ProcessingProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + 2;
      });
    }, 60);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-dark p-6">
      <div className="w-full max-w-4xl bg-[#1e1427] rounded-3xl overflow-hidden border border-white/5 shadow-2xl flex flex-col lg:flex-row">
        <div className="lg:w-5/12 aspect-square relative group">
           <img src="https://picsum.photos/800/800?grayscale" alt="Processing" className="w-full h-full object-cover opacity-40" />
           <div className="absolute inset-0 flex items-center justify-center">
             <div className="size-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
           </div>
           <div className="absolute bottom-8 left-8 right-8 text-center bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Applying Model</p>
              <h3 className="font-bold">Anime Style V2</h3>
           </div>
        </div>

        <div className="lg:w-7/12 p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-10">
            <span className="text-primary font-bold text-sm tracking-widest uppercase mb-2 block">Task #9421</span>
            <h2 className="text-3xl font-bold mb-4">Transforming Reality...</h2>
            <p className="text-gray-400">Our neural networks are mapping facial expressions and redrawing every frame with professional style layers.</p>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <span className="text-5xl font-black">{progress}%</span>
              <span className="text-gray-500 font-medium text-sm">~ {Math.ceil((100 - progress) / 10)}s remaining</span>
            </div>
            <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-gradient-to-r from-primary to-purple-400 transition-all duration-300 shadow-[0_0_15px_rgba(140,43,238,0.5)]" style={{width: `${progress}%`}}></div>
            </div>
          </div>

          <div className="mt-12 space-y-4">
             <div className={`flex items-center gap-3 transition-opacity ${progress > 20 ? 'opacity-100' : 'opacity-30'}`}>
               <span className="material-symbols-outlined text-primary">{progress > 30 ? 'check_circle' : 'sync'}</span>
               <span className="text-sm font-medium">Extracting keyframes and poses</span>
             </div>
             <div className={`flex items-center gap-3 transition-opacity ${progress > 50 ? 'opacity-100' : 'opacity-30'}`}>
               <span className="material-symbols-outlined text-primary">{progress > 60 ? 'check_circle' : 'sync'}</span>
               <span className="text-sm font-medium">Applying AI neural style model</span>
             </div>
             <div className={`flex items-center gap-3 transition-opacity ${progress > 80 ? 'opacity-100' : 'opacity-30'}`}>
               <span className="material-symbols-outlined text-primary">{progress > 90 ? 'check_circle' : 'sync'}</span>
               <span className="text-sm font-medium">Finalizing render and color grading</span>
             </div>
          </div>
        </div>
      </div>
      <div className="mt-10 flex items-center gap-3 text-gray-500 text-sm">
         <span className="material-symbols-outlined text-primary">lightbulb</span>
         <p>Pro Tip: High-quality rendering can be up to 5x faster with a <span className="text-primary font-bold">Premium Plan</span>.</p>
      </div>
    </div>
  );
};

export default Processing;
