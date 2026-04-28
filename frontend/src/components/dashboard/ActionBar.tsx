import { RefreshCw, Copy, Download } from 'lucide-react';
import type { AnalysisResponse } from '../../types';

interface ActionBarProps {
  onAnalyzeAnother: () => void;
  data: AnalysisResponse;
}

export default function ActionBar({ onAnalyzeAnother, data }: ActionBarProps) {
  
  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    // Could add toast here
  };

  const handleDownloadReport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bias-report-${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pb-12">
      <button 
        onClick={onAnalyzeAnother}
        className="w-full sm:w-auto btn-primary px-8 py-3 flex items-center justify-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Analyze Another Prompt
      </button>

      <div className="flex w-full sm:w-auto items-center gap-3">
        <button 
          onClick={handleCopyJSON}
          className="flex-1 sm:flex-none btn-secondary px-6 py-3 flex items-center justify-center gap-2 text-sm"
        >
          <Copy className="w-4 h-4" />
          Copy JSON
        </button>
        <button 
          onClick={handleDownloadReport}
          className="flex-1 sm:flex-none btn-secondary px-6 py-3 flex items-center justify-center gap-2 text-sm"
        >
          <Download className="w-4 h-4" />
          Download Report
        </button>
      </div>
    </div>
  );
}
