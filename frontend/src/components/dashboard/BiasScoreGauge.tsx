import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface BiasScoreGaugeProps {
  score: number;
  explanation: string;
}

export default function BiasScoreGauge({ score, explanation }: BiasScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Simple counter animation
    const duration = 1000;
    const steps = 60;
    const stepTime = duration / steps;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Color logic
  let colorClass = "text-emerald-500";
  let bgClass = "bg-emerald-500/10";
  let strokeClass = "stroke-emerald-500";
  let label = "Low Risk";

  if (score > 3 && score <= 6) {
    colorClass = "text-amber-500";
    bgClass = "bg-amber-500/10";
    strokeClass = "stroke-amber-500";
    label = "Moderate Risk";
  } else if (score > 6) {
    colorClass = "text-rose-500";
    bgClass = "bg-rose-500/10";
    strokeClass = "stroke-rose-500";
    label = "High Risk";
  }

  // SVG Math
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  // It's a gauge from 0 to 10. Represented as a circle fill
  const dashoffset = circumference - (score / 10) * circumference;

  return (
    <div className="glass-card p-6 flex flex-col items-center justify-center group relative">
      <h3 className="text-lg font-semibold text-slate-200 mb-6">Bias Score</h3>
      
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Background track */}
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="12"
            className="text-slate-800"
          />
          {/* Animated fill */}
          <motion.circle
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="round"
            className={strokeClass}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${colorClass}`}>{animatedScore}</span>
          <span className="text-sm text-slate-500 mt-1">/ 10</span>
        </div>
      </div>

      <div className={`mt-6 px-4 py-1.5 rounded-full text-sm font-medium border ${colorClass} ${bgClass} border-current/20`}>
        {label}
      </div>

      {/* Hover Tooltip */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full w-64 p-3 bg-slate-800 text-xs text-slate-200 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-slate-700">
        {explanation}
        {/* Caret */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
      </div>
    </div>
  );
}
