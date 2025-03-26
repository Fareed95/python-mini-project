"use client"
import { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { Code, Play, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { CODE_SNIPPETS } from "@/constants/constants";
import LanguageSelector from "./LanguageSelector";
import Output from "./Output";

const LearningCodeEditor = ({ isOpen, onClose, editorRef }) => {
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [showOutput, setShowOutput] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const onMount = (editor) => {
    if (editorRef) {
      editorRef.current = editor;
    }
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  // Initialize with default code
  useEffect(() => {
    setValue(CODE_SNIPPETS[language]);
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Header with tabs - More compact and properly positioned */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-1.5 sm:p-2 border-b border-neutral-800 gap-1.5 sm:gap-0 mt-16 z-99">
        <div className="flex items-center space-x-1.5 sm:space-x-2 w-full sm:w-auto">
          <button
            onClick={() => setShowOutput(false)}
            className={`flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-2.5 py-0.5 rounded-lg transition-colors text-xs sm:text-sm ${
              !showOutput 
                ? 'bg-neutral-700/50 text-neutral-200' 
                : 'text-neutral-400 hover:bg-neutral-800'
            }`}
          >
            <Code className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Editor</span>
          </button>
          <button
            onClick={() => setShowOutput(true)}
            className={`flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-2.5 py-0.5 rounded-lg transition-colors text-xs sm:text-sm ${
              showOutput 
                ? 'bg-neutral-700/50 text-neutral-200' 
                : 'text-neutral-400 hover:bg-neutral-800'
            }`}
          >
            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Output</span>
          </button>
        </div>
        <div className="flex items-center space-x-1.5 sm:space-x-2 w-full sm:w-auto justify-between sm:justify-end">
          <LanguageSelector language={language} onSelect={onSelect} />
          <button
            onClick={onClose}
            className="p-1 sm:p-1.5 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Content area - Improved responsiveness */}
      <div className="flex-1 overflow-hidden">
        <motion.div
          initial={false}
          animate={{ 
            x: showOutput ? (isMobile ? '0%' : '-50%') : '0%',
            y: showOutput ? (isMobile ? '-50%' : '0%') : '0%'
          }}
          transition={{ type: "tween", duration: 0.3 }}
          className="relative w-full sm:w-[200%] h-full flex flex-col sm:flex-row"
        >
          {/* Editor Panel */}
          <div className="w-full sm:w-1/2 h-1/2 sm:h-full p-2 sm:p-4">
            <div className="h-full border border-neutral-700 rounded-lg overflow-hidden">
              <Editor
                height="100%"
                theme="vs-dark"
                language={language}
                value={value}
                onChange={(value) => setValue(value)}
                onMount={onMount}
                options={{
                  fontSize: isMobile ? 12 : 14,
                  minimap: { enabled: true, side: 'right', showSlider: 'always' },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  lineNumbers: "on",
                  roundedSelection: false,
                  padding: { top: 12, bottom: 12 },
                  cursorStyle: "line",
                  tabSize: 2,
                  wordWrap: "on",
                  formatOnPaste: true,
                  formatOnType: true,
                }}
              />
            </div>
          </div>

          {/* Output Panel */}
          <div className="w-full sm:w-1/2 h-1/2 sm:h-full p-2 sm:p-4">
            <Output 
              editorRef={editorRef}
              language={language}
              value={value}
              hideSubmit={true}
              onRun={() => setShowOutput(true)}
              className="h-full"
            />
          </div>
        </motion.div>
      </div>

      {/* Run button - More compact */}
      <div className="p-2 sm:p-3 border-t border-neutral-800">
        <button
          onClick={() => {
            const outputComponent = document.querySelector('[data-run-button]');
            if (outputComponent) {
              outputComponent.click();
            }
            setShowOutput(true);
          }}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 sm:py-2 bg-neutral-700/50 hover:bg-neutral-600/50 text-neutral-200 rounded-lg transition-colors text-sm"
        >
          <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Run Code</span>
          <span className="hidden sm:inline text-xs opacity-60 ml-2">⌘R</span>
        </button>
      </div>
    </div>
  );
};

export default LearningCodeEditor; 