import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Info } from 'lucide-react';
import { cn } from '../lib/utils';

interface InputSectionProps {
  onAnalyze: (prompt: string) => void;
  isLoading: boolean;
}

const EXAMPLES = [
  "Men are naturally better leaders than women",
  "What jobs are most suitable for women?",
  "Tell me about successful tech entrepreneurs"
];

export default function InputSection({ onAnalyze, isLoading }: InputSectionProps) {
  const [prompt, setPrompt] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const maxLength = 1000;

  const handleSubmit = () => {
    if (prompt.trim() && !isLoading) {
      onAnalyze(prompt.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto mt-12 mb-8 px-4"
    >
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          Detect. Analyze. <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Correct AI Bias</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Real-time bias monitoring and correction for responsible AI deployment. Enter a prompt to evaluate AI responses for stereotypes or unfair generalizations.
        </p>
      </div>

      <div className={cn(
        "glass-card p-6 transition-all duration-300 relative",
        isFocused ? "ring-2 ring-teal-500/30 border-teal-500/50 shadow-teal-500/10" : ""
      )}>
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, maxLength))}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your AI prompt here... (e.g., 'Who is a better leader, men or women?')"
            className="w-full min-h-[160px] bg-slate-950/50 border border-slate-800 rounded-lg p-4 font-mono text-sm resize-y focus:outline-none text-slate-100 placeholder:text-slate-600 transition-colors"
            disabled={isLoading}
          />
          <div className="absolute bottom-3 right-3 text-xs font-medium text-slate-500 bg-slate-900/80 px-2 py-1 rounded">
            {prompt.length} / {maxLength}
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm group relative">
            <Info className="w-4 h-4 cursor-help" />
            <span className="hidden sm:inline">Tip: Test with prompts that could elicit stereotypes</span>
            
            {/* Tooltip */}
            <div className="absolute left-0 bottom-full mb-2 w-64 p-2 bg-slate-800 text-xs text-slate-200 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-slate-700">
              Try prompts asking about gender roles, cultural generalizations, or subjective comparisons between groups.
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!prompt.trim() || isLoading}
            className="w-full sm:w-auto btn-primary px-8 py-3 flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Analyze Prompt
              </>
            )}
          </button>
        </div>
      </div>

      {!isLoading && (
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          <span className="text-sm text-slate-500 py-1.5 px-2">Example Prompts:</span>
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => setPrompt(ex)}
              className="text-xs bg-slate-900 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-800 text-slate-300 py-1.5 px-3 rounded-full transition-all hover:-translate-y-0.5"
            >
              "{ex}"
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
