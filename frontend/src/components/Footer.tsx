export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-slate-500 text-sm">
          &copy; 2026 AI Bias Monitoring System.
        </p>
        <div className="flex items-center gap-6 text-sm text-slate-400">
          <a href="#" className="hover:text-slate-200 transition-colors">Documentation</a>
          <a href="#" className="hover:text-slate-200 transition-colors">API</a>
          <a href="#" className="hover:text-slate-200 transition-colors">Privacy</a>
        </div>
        <div className="text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-slate-400 font-mono">
          Powered by FastAPI & Qwen AI
        </div>
      </div>
    </footer>
  );
}
