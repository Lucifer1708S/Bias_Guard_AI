import { motion } from 'framer-motion';
import { Clock, Trash2, FileText, ChevronRight } from 'lucide-react';
import type { AnalysisResponse } from '../types';

export interface LogEntry {
  id: string;
  timestamp: number;
  data: AnalysisResponse;
}

interface LogsViewProps {
  logs: LogEntry[];
  onClear: () => void;
  onViewLog: (log: LogEntry) => void;
}

export default function LogsView({ logs, onClear, onViewLog }: LogsViewProps) {
  if (logs.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-slate-900/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-slate-500" />
        </div>
        <h2 className="text-xl font-semibold text-slate-200 mb-2">No analysis logs yet</h2>
        <p className="text-slate-400">
          Your analyzed prompts will appear here for future reference.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Analysis History</h2>
          <p className="text-sm text-slate-400 mt-1">Review your previously analyzed prompts and their bias scores.</p>
        </div>
        <button 
          onClick={onClear}
          className="btn-secondary px-4 py-2 flex items-center gap-2 text-rose-400 hover:text-rose-300 hover:border-rose-900/50"
        >
          <Trash2 className="w-4 h-4" />
          Clear History
        </button>
      </div>

      <div className="space-y-4">
        {logs.map((log) => {
          const score = log.data.bias.bias_score;
          let scoreColor = "text-emerald-400";
          let scoreBg = "bg-emerald-500/10 border-emerald-500/20";
          if (score > 3 && score <= 6) {
            scoreColor = "text-amber-400";
            scoreBg = "bg-amber-500/10 border-amber-500/20";
          } else if (score > 6) {
            scoreColor = "text-rose-400";
            scoreBg = "bg-rose-500/10 border-rose-500/20";
          }

          return (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-5 hover:bg-slate-800/40 transition-colors cursor-pointer group"
              onClick={() => onViewLog(log)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-medium text-slate-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-200 font-mono text-sm truncate">
                    {log.data.originalPrompt}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className={`px-3 py-1 rounded border flex flex-col items-center justify-center ${scoreBg}`}>
                    <span className={`text-xs font-semibold ${scoreColor}`}>Score</span>
                    <span className={`text-lg font-bold ${scoreColor}`}>{score}/10</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-teal-400 transition-colors" />
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
