import { useState, useEffect } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnalysisAccordionProps {
  explanation: string;
}

export default function AnalysisAccordion({ explanation }: AnalysisAccordionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [tags, setTags] = useState<{label: string, type: 'success' | 'warning' | 'danger' | 'info'}[]>([]);

  useEffect(() => {
    // Generate tags based on explanation content (simulated keyword extraction)
    const lowerExp = explanation.toLowerCase();
    const newTags: {label: string, type: 'success' | 'warning' | 'danger' | 'info'}[] = [];
    
    if (lowerExp.includes('research') || lowerExp.includes('cite') || lowerExp.includes('evidence')) {
      newTags.push({ label: '✅ Evidence-Based', type: 'success' });
    }
    if (lowerExp.includes('context') || lowerExp.includes('condition') || lowerExp.includes('moderator')) {
      newTags.push({ label: '⚠️ Context-Dependent', type: 'warning' });
    }
    if (lowerExp.includes('systemic') || lowerExp.includes('structure') || lowerExp.includes('society')) {
      newTags.push({ label: '🔍 Structural Factors', type: 'info' });
    }
    if (lowerExp.includes('stereotype') || lowerExp.includes('generalization') || lowerExp.includes('bias')) {
      newTags.push({ label: '❌ Potential Bias Detected', type: 'danger' });
    } else if (lowerExp.includes('no bias') || lowerExp.includes('neutral') || lowerExp.includes('fair')) {
      newTags.push({ label: '🚫 No Stereotypes', type: 'success' });
    }

    // Default tag if none matched
    if (newTags.length === 0) {
      newTags.push({ label: 'ℹ️ Automated Analysis', type: 'info' });
    }
    
    setTags(newTags);
  }, [explanation]);

  return (
    <div className="glass-card overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 bg-slate-900/40 hover:bg-slate-800/60 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 p-2 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
          </div>
          <h3 className="font-semibold text-slate-200">Bias Analysis</h3>
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
              <div className="flex flex-wrap gap-2 mb-5">
                {tags.map((tag, i) => (
                  <span 
                    key={i} 
                    className={`text-xs px-3 py-1 rounded-full border bg-opacity-20 hover:scale-105 transition-transform cursor-default ${
                      tag.type === 'success' ? 'bg-emerald-500 text-emerald-300 border-emerald-500/30' :
                      tag.type === 'warning' ? 'bg-amber-500 text-amber-300 border-amber-500/30' :
                      tag.type === 'danger' ? 'bg-rose-500 text-rose-300 border-rose-500/30' :
                      'bg-cyan-500 text-cyan-300 border-cyan-500/30'
                    }`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
              
              <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                {explanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
