"use client"
import { useState } from "react";
import { executeCode } from "@/app/api/editor/api";
import { useRouter, usePathname } from "next/navigation";
import { Play, Send, Loader2 } from 'lucide-react';

const Output = ({ editorRef, language, hideSubmit = false, onRun, className = '' }) => {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isVideoCallPage = pathname.startsWith('/VideoCall/');

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    
    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      console.error(error);
      setIsError(true);
      setOutput([error.message || "Unable to run code"]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const sourceCode = editorRef.current.getValue();
      if (!sourceCode) return;

      await runCode();

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `${language}_${timestamp}.txt`;
      const blob = new Blob([sourceCode], { type: 'text/plain' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      const formData = new FormData();
      formData.append('file', blob, fileName);
      
      const response = await fetch('/api/savelog', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to save log file');
      }

      router.push(`/coding/results?status=completed`);
    } catch (error) {
      console.error('Error saving code:', error);
      setIsError(true);
      setOutput(['Failed to save code file']);
    }
  };

  return (
    <div className={`${className} flex flex-col`}>
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="text-sm sm:text-base text-neutral-200">Output</div>
        <div className="flex gap-1.5 sm:gap-2">
          <button
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 text-sm
              ${isLoading 
                ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/50' 
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
              }`}
            disabled={isLoading}
            onClick={runCode}
            data-run-button
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Run</span>
                <span className="hidden sm:inline text-xs opacity-60 ml-1">⌘R</span>
              </>
            )}
          </button>
          {!hideSubmit && !isVideoCallPage && (
            <button
              className="px-2.5 sm:px-3 py-1.5 rounded-lg border transition-colors bg-blue-500/20 text-blue-400 border-blue-500/50 hover:bg-blue-500/30 text-sm flex items-center gap-1.5"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit</span>
            </button>
          )}
        </div>
      </div>
      <div
        className={`flex-1 p-3 sm:p-4 font-mono text-xs sm:text-sm rounded-lg border overflow-auto
          ${isError 
            ? 'border-red-500/50 bg-red-500/10 text-red-400' 
            : 'border-neutral-700 bg-neutral-800/50 text-neutral-200'
          }`}
      >
        {output ? (
          output.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap mb-0.5 sm:mb-1">
              {line}
            </div>
          ))
        ) : (
          <div className="text-neutral-400">
            Click "Run" to see the output here
          </div>
        )}
      </div>
    </div>
  );
};

export default Output;
