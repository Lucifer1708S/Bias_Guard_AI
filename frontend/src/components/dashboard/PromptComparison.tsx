import { useState } from 'react';
import { FileText, Sparkles, Copy, ChevronDown, ChevronUp, Check } from 'lucide-react';


interface PromptCardProps {
  title: string;
  icon: React.ReactNode;
  content: string;
  isImproved?: boolean;
}

function PromptCard({ title, icon, content, isImproved }: PromptCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLong = content.length > 150;

  return (
    <div className={`glass-card p-5 flex-1 relative ${isImproved ? 'border-teal-500/30 bg-teal-950/10' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-semibold text-slate-200">{title}</h3>
        </div>
        <button 
          onClick={handleCopy}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
          title="Copy prompt"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      
      <div className="bg-slate-950/80 rounded-lg border border-slate-800 p-4">
        <div className={`font-mono text-sm text-slate-300 whitespace-pre-wrap transition-all duration-300 ${!expanded && isLong ? 'line-clamp-4' : ''}`}>
          {content}
        </div>
      </div>
      
      {isLong && (
        <button 
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-medium"
        >
          {expanded ? <><ChevronUp className="w-3 h-3"/> Show less</> : <><ChevronDown className="w-3 h-3"/> Expand</>}
        </button>
      )}
    </div>
  );
}

interface PromptComparisonProps {
  original: string;
  improved: string;
}

export default function PromptComparison({ original, improved }: PromptComparisonProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 w-full">
      <PromptCard 
        title="Your Original Prompt" 
        icon={<FileText className="w-5 h-5 text-slate-400" />} 
        content={original} 
      />
      <PromptCard 
        title="AI-Optimized Prompt" 
        icon={<Sparkles className="w-5 h-5 text-teal-400" />} 
        content={improved}
        isImproved
      />
    </div>
  );
}
