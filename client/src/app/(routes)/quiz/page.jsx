'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Loader2, Clock, Eye, Lock } from 'lucide-react';
import { useUserContext } from '@/app/context/Userinfo';

const HeroBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-neutral-950" />
    <div className="absolute inset-0 bg-grid-small-white/[0.03] -z-10" />
    <div className="absolute inset-0 bg-dot-white/[0.03] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
    <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent" />
  </div>
);

function QuizPage() {
  const { contextinput } = useUserContext();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const [tabWarnings, setTabWarnings] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds timer
  const timerRef = useRef(null);

  // Timer effect
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          router.push('/');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [router]);

  // Format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Tab visibility detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabWarnings(prev => {
          const newWarnings = prev + 1;
          setShowWarning(true);
          
          if (newWarnings >= 3) {
            clearInterval(timerRef.current);
            router.push('/');
          }
          
          setTimeout(() => {
            setShowWarning(false);
          }, 3000);
          
          return newWarnings;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [router]);

  // Prevent copy paste
  useEffect(() => {
    const handleCopyPaste = (e) => {
      e.preventDefault();
      setShowWarning(true);
      setTabWarnings(prev => {
        const newWarnings = prev + 1;
        if (newWarnings >= 3) {
          router.push('/');
        }
        return newWarnings;
      });
      
      setTimeout(() => {
        setShowWarning(false);
      }, 3000);
    };

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'c')) {
        handleCopyPaste(e);
      }
    };

    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('paste', handleCopyPaste);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [router]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8001/testseries`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input_value: `${contextinput}`
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }

        const data = await response.json();
        if (!data.questions || data.questions.length === 0) {
          throw new Error('No questions available');
        }
        setQuestions(data.questions);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = (answer) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    if (answer === questions[currentQuestionIndex].answer) {
      setScore(score + 1);
    }

    // Wait for 1.5 seconds before moving to the next question
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        // Quiz completed, navigate to results page
        router.push(`/quiz/congratulations?score=${score + (answer === questions[currentQuestionIndex].answer ? 1 : 0)}&total=${questions.length}&topic=Java`);
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <HeroBackground />
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400 mx-auto mb-4" />
          <p className="text-neutral-400">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <HeroBackground />
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-neutral-800 text-neutral-200 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-neutral-950 relative">
      <HeroBackground />

      {/* Timer bar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-neutral-900/80 backdrop-blur-sm px-4 py-3 border-b border-neutral-800 shadow-xl rounded-xl mt-8 p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className={`text-lg font-medium ${timeLeft < 10 ? 'text-red-400' : 'text-blue-400'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-neutral-800/50 px-3 py-1 rounded-lg">
              <Lock className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-neutral-300">Proctored</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-neutral-400" />
              <span className="text-sm text-neutral-400">
                Warnings: <span className="font-medium">{tabWarnings}</span>/3
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced progress bar */}
        <div className="w-full h-2 bg-neutral-800 mt-3 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: `${(timeLeft / 60) * 100}%` }}
            className={`h-full transition-colors duration-300 ${
              timeLeft > 30 ? 'bg-green-400' :
              timeLeft > 10 ? 'bg-yellow-400' :
              'bg-red-400'
            } rounded-full`}
          />
        </div>
      </div>

      {/* Warning popup */}
      {showWarning && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-32 left-0 right-0 z-50 mx-auto max-w-md bg-red-900/90 text-white p-4 rounded-xl border border-red-400/50 backdrop-blur-sm shadow-xl"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-red-400/20 p-2 rounded-lg">
              <Lock className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="font-semibold text-red-200">Security Alert!</p>
              <p className="text-sm mt-1 text-red-300">Restricted action detected ({tabWarnings}/3 warnings)</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Time up popup */}
      {timeLeft === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center max-w-md mx-4">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Time's Up!</h2>
            <p className="text-neutral-300 mb-6">Your quiz session has ended.</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-neutral-800 text-neutral-200 rounded-lg hover:bg-neutral-700 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </motion.div>
      )}

      {/* Main content */}
      <div className="pt-36 pb-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-neutral-400 mb-3">
              <span className="text-lg font-medium text-neutral-200">
                Question {currentQuestionIndex + 1}
                <span className="text-neutral-400 ml-2">/ {questions.length}</span>
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-neutral-400">Score:</span>
                <span className="text-lg font-medium text-neutral-200">{score}</span>
              </div>
            </div>
            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                className="h-full bg-neutral-600 rounded-full"
              />
            </div>
          </div>

          {/* Question */}
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-900/80 border border-neutral-800 p-8 rounded-2xl backdrop-blur-sm mb-6 shadow-xl"
          >
            <h2 className="text-2xl font-medium text-neutral-100 mb-6 leading-relaxed">
              {currentQuestion.question}
            </h2>
            
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                    isAnswered
                      ? option === currentQuestion.answer
                        ? 'bg-green-500/20 text-green-300 border-2 border-green-500/50'
                        : option === selectedAnswer
                        ? 'bg-red-500/20 text-red-300 border-2 border-red-500/50'
                        : 'bg-neutral-800/30 text-neutral-400 border border-neutral-700'
                      : 'bg-neutral-800/30 text-neutral-100 hover:bg-neutral-700/40 border border-neutral-700'
                  }`}
                  whileHover={!isAnswered ? { scale: 1.02 } : {}}
                  whileTap={!isAnswered ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-center">
                    <span className="w-7 h-7 rounded-lg bg-neutral-700/50 border border-neutral-600 flex items-center justify-center mr-4 text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-lg">{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default QuizPage; 