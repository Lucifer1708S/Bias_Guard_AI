import { useState, useMemo } from 'react';
import { BrainCircuit, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReasoningAccordionProps {
  reasoning: string;
}

export default function ReasoningAccordion({ reasoning }: ReasoningAccordionProps) {
  const [isOpen, setIsOpen] = useState(false); // Collapsed by default
  const [isExpanded, setIsExpanded] = useState(false); // For "Read more" within the card
  
  // Extract key points (sentences starting with certain patterns or just splitting by period)
  const keyPoints = useMemo(() => {
    return reasoning
      .split('. ')
      .map(s => s.trim())
      .filter(s => s.length > 20)
      .slice(0, 3); // Take top 3 sentences as key points
  }, [reasoning]);

  return (
    <div className="glass-card overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 bg-slate-900/40 hover:bg-slate-800/60 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 p-2 rounded-lg">
            <BrainCircuit className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="font-semibold text-slate-200">System Reasoning</h3>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-slate-800"
          >
            <div className="p-6">
              <div className="mb-6 space-y-3">
                {keyPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <ArrowRight className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                    <p>{point}{point.endsWith('.') ? '' : '.'}</p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800">
                <p className={`text-sm text-slate-400 leading-relaxed font-mono ${!isExpanded ? 'line-clamp-2' : ''}`}>
                  {reasoning}
                </p>
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  {isExpanded ? 'Show less' : 'Read full reasoning'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
