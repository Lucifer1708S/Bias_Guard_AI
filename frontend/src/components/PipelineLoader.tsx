import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';

const STEPS = [
  "Refining Prompt",
  "Generating Response",
  "Evaluating Bias",
  "Analyzing Reasoning",
  "Finalizing"
];

export default function PipelineLoader() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // Simulate progression through steps for visual feedback
    // In a real WebSocket setup this would be driven by backend events
    const interval = setInterval(() => {
      setActiveStep(prev => {
        if (prev < STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 2500); // Progress roughly every 2.5s
    
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-4xl mx-auto px-4"
    >
      <div className="glass-card p-8 text-center mb-8">
        <h3 className="text-xl font-semibold mb-6 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-teal-400" />
          Analyzing your prompt
        </h3>
        
        {/* Progress Tracker */}
        <div className="relative max-w-2xl mx-auto mb-10">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0"></div>
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 -translate-y-1/2 z-0 transition-all duration-500 ease-out"
            style={{ width: `${(activeStep / (STEPS.length - 1)) * 100}%` }}
          ></div>
          
          <div className="relative z-10 flex justify-between">
            {STEPS.map((step, index) => {
              const isCompleted = index < activeStep;
              const isActive = index === activeStep;
              
              return (
                <div key={index} className="flex flex-col items-center group">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-900 border-2 transition-colors duration-300 ${
                    isCompleted ? 'border-teal-500 text-teal-500' : 
                    isActive ? 'border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 
                    'border-slate-700 text-slate-600'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : 
                     isActive ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                     <span className="text-xs">{index + 1}</span>}
                  </div>
                  
                  <span className={`absolute mt-10 text-xs font-medium w-24 text-center -ml-8 transition-colors duration-300 ${
                    isActive ? 'text-slate-200' : 'text-slate-500'
                  }`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
        <p className="text-sm text-slate-400 mt-12">
          This usually takes 10-15 seconds. Our pipeline is querying the LLM and evaluating the response...
        </p>
      </div>

      {/* Shimmering Skeletons */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="glass-card p-6 flex-1 h-40 animate-pulse bg-slate-900/80"></div>
          <div className="glass-card p-6 flex-1 h-40 animate-pulse bg-slate-900/80"></div>
        </div>
        <div className="glass-card p-6 h-64 animate-pulse bg-slate-900/80"></div>
      </div>
    </motion.div>
  );
}
