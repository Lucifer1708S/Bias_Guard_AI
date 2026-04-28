import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

interface ResponseTabsProps {
  originalResponse: string;
  finalResponse: string;
  biasScore: number;
}

// Custom components for React Markdown to match Tailwind styling
const MarkdownComponents = {
  h1: ({node, ...props}: any) => <h1 className="text-xl font-bold mt-6 mb-3 text-slate-100" {...props} />,
  h2: ({node, ...props}: any) => <h2 className="text-lg font-semibold mt-5 mb-2 text-slate-200" {...props} />,
  h3: ({node, ...props}: any) => <h3 className="text-md font-semibold mt-4 mb-2 text-slate-200" {...props} />,
  p: ({node, ...props}: any) => <p className="mb-4 leading-relaxed text-slate-300" {...props} />,
  ul: ({node, ...props}: any) => <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300" {...props} />,
  ol: ({node, ...props}: any) => <ol className="list-decimal pl-6 mb-4 space-y-1 text-slate-300" {...props} />,
  li: ({node, ...props}: any) => <li className="pl-1" {...props} />,
  strong: ({node, ...props}: any) => <strong className="font-bold text-slate-200" {...props} />,
  blockquote: ({node, ...props}: any) => (
    <blockquote className="border-l-4 border-teal-500 pl-4 py-1 my-4 italic bg-slate-900/50 rounded-r text-slate-400" {...props} />
  ),
  code: ({node, inline, ...props}: any) => 
    inline 
      ? <code className="bg-slate-800 text-teal-300 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
      : <code className="block bg-slate-950 p-4 rounded-lg overflow-x-auto text-sm font-mono mb-4 text-slate-300 border border-slate-800" {...props} />,
};

export default function ResponseTabs({ originalResponse, finalResponse, biasScore }: ResponseTabsProps) {
  const [activeTab, setActiveTab] = useState<'original' | 'final'>('final');
  
  const isCorrected = biasScore > 5;
  const currentContent = activeTab === 'original' ? originalResponse : finalResponse;
  
  const wordCount = currentContent.trim().split(/\s+/).length;

  return (
    <div className="glass-card overflow-hidden flex flex-col">
      {/* Banner if corrected */}
      {isCorrected && (
        <div className="bg-gradient-to-r from-amber-500/20 to-rose-500/20 border-b border-amber-500/30 px-6 py-2 flex items-center justify-center gap-2">
          <span className="text-amber-400 text-sm font-medium">⚠️ Response was corrected for bias</span>
        </div>
      )}
      
      {/* Tabs */}
      <div className="flex border-b border-slate-800 px-2 bg-slate-950/50">
        <button
          onClick={() => setActiveTab('original')}
          className={`px-6 py-4 text-sm font-medium transition-colors relative ${
            activeTab === 'original' ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Original Response
          {activeTab === 'original' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('final')}
          className={`px-6 py-4 text-sm font-medium transition-colors relative flex items-center gap-2 ${
            activeTab === 'final' ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Final Response
          {isCorrected && <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full border border-emerald-500/30">✨ Corrected</span>}
          {activeTab === 'final' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400" />
          )}
        </button>
      </div>
      
      {/* Content area */}
      <div className="p-6 relative min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="prose prose-invert max-w-none"
          >
            <ReactMarkdown components={MarkdownComponents}>
              {currentContent}
            </ReactMarkdown>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Footer */}
      <div className="bg-slate-900/50 border-t border-slate-800 px-6 py-3 flex justify-end">
        <span className="text-xs text-slate-500">{wordCount} words</span>
      </div>
    </div>
  );
}
