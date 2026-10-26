import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "We couldn't load Gokak properties right now",
  message = "Please check your network connection or try refreshing the view. All real Gokak listings remain safe in our records.",
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div className={`w-full max-w-lg mx-auto my-12 p-8 text-center bg-rose-50/50 rounded-3xl border border-rose-200/80 shadow-xs ${className}`}>
      <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <h3 className="text-xl font-bold font-sans text-rose-950 mb-2">
        {title}
      </h3>

      <p className="text-sm text-rose-800/80 max-w-sm mx-auto mb-6 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-sm transition-all text-sm cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
