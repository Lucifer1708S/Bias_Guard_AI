import { useRef, useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import InputSection from './components/InputSection';
import PipelineLoader from './components/PipelineLoader';
import ResultsDashboard from './components/ResultsDashboard';
import LogsView from './components/LogsView';
import type { LogEntry } from './components/LogsView';
import { useAnalysis } from './hooks/useAnalysis';
import { AlertCircle, X, MessageSquare, History, ChevronLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const { data, loading, error, analyze, clearData } = useAnalysis();
  const topRef = useRef<HTMLDivElement>(null);
  
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'logs'>('chat');
  
  // History state
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [viewingLog, setViewingLog] = useState<LogEntry | null>(null);

  // Load logs from local storage on mount
  useEffect(() => {
    const savedLogs = localStorage.getItem('bias_analyzer_logs');
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error('Failed to parse logs', e);
      }
    }
  }, []);

  // Save logs to local storage when updated
  useEffect(() => {
    localStorage.setItem('bias_analyzer_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    if (error) {
      setToast({ message: error, type: 'error' });
    }
  }, [error]);

  useEffect(() => {
    if (data && !loading) {
      setToast({ message: 'Analysis complete! ✅', type: 'success' });
      
      // Add to logs if not already viewing a log
      if (!viewingLog) {
        const newLog: LogEntry = {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          data: data,
        };
        setLogs(prev => [newLog, ...prev]);
      }
      
      window.scrollTo({ top: 150, behavior: 'smooth' });
    }
  }, [data, loading]);

  const handleAnalyzeAnother = () => {
    clearData();
    setViewingLog(null);
    setToast(null);
    setActiveTab('chat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearLogs = () => {
    if (confirm('Are you sure you want to clear all analysis history?')) {
      setLogs([]);
    }
  };

  const handleViewLog = (log: LogEntry) => {
    setViewingLog(log);
    // Switch to a view that looks like the dashboard
  };

  const handleAnalyze = (prompt: string) => {
    setViewingLog(null);
    analyze(prompt);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-slate-300 relative">
      <div ref={topRef} className="absolute top-0" />
      <Header />

      <main className="flex-1 w-full relative z-10 flex flex-col items-center py-6">
        
        {/* Tab Navigation */}
        <div className="w-full max-w-5xl mx-auto px-4 mb-8">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-px">
            <button
              onClick={() => { setActiveTab('chat'); setViewingLog(null); }}
              className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors relative ${
                activeTab === 'chat' && !viewingLog ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Chat / Analysis
              {activeTab === 'chat' && !viewingLog && (
                <motion.div layoutId="mainTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors relative ${
                activeTab === 'logs' || viewingLog ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-4 h-4" />
              Logs
              <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-xs ml-1">
                {logs.length}
              </span>
              {(activeTab === 'logs' || viewingLog) && (
                <motion.div layoutId="mainTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400" />
              )}
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl border ${
                  toast.type === 'error' 
                    ? 'bg-rose-950/80 border-rose-500/50 text-rose-200' 
                    : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                }`}
              >
                {toast.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0" />}
                <p className="text-sm font-medium">{toast.message}</p>
                <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Chat Tab */}
        {activeTab === 'chat' && !viewingLog && (
          <div className="w-full">
            {!data && (
              <InputSection 
                onAnalyze={handleAnalyze} 
                isLoading={loading} 
              />
            )}

            {loading && <PipelineLoader />}

            {data && !loading && (
              <ResultsDashboard 
                data={data} 
                onAnalyzeAnother={handleAnalyzeAnother} 
              />
            )}
          </div>
        )}

        {/* Logs Tab - List */}
        {activeTab === 'logs' && !viewingLog && (
          <LogsView 
            logs={logs} 
            onClear={handleClearLogs} 
            onViewLog={handleViewLog} 
          />
        )}

        {/* Viewing a specific log */}
        {viewingLog && (
          <div className="w-full">
            <div className="w-full max-w-5xl mx-auto px-4 mb-4">
              <button 
                onClick={() => setViewingLog(null)}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Logs
              </button>
            </div>
            <ResultsDashboard 
              data={viewingLog.data} 
              onAnalyzeAnother={handleAnalyzeAnother} 
            />
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default App;
