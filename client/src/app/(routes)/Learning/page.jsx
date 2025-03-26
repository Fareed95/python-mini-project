"use client";
import { useUserContext } from '@/app/context/Userinfo';
import { useState, useEffect, useRef } from 'react';
import { Clock, FileText, ArrowRight, BookOpen, Award, BarChart, Code, Play } from 'lucide-react';
import { useRoadmap } from '@/app/context/RoadmapContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import LearningCodeEditor from '@/components/editor/LearningCodeEditor';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Home() {
  const { contextsetinput, contextsetRoadmap,contextRoadmap,contextFirstRoadmap} = useUserContext();
  const { roadmap } = useRoadmap();
  const [PDF, setPDF] = useState([]);
  const [pdfErrors, setPdfErrors] = useState({});

  const [componentData, setComponentData] = useState(null);
  const [total, setTotal] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentComponentIndex, setCurrentComponentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roadmapId, setRoadmapId] = useState(null);
  const [isCompleted, setIsCompleted] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const editorRef = useRef(null);
  const router = useRouter();
  const MODEL_API_SERVER = process.env.NEXT_PUBLIC_MODEL_API_SERVER;
  const DJANGO_API_SERVER = process.env.NEXT_PUBLIC_DJANGO_API_SERVER;
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    if (roadmap?.roadmap_id) {
      setRoadmapId(roadmap.roadmap_id);
      fetchRoadmapData(roadmap.roadmap_id);
    } else {
      router.push('/');
    }
  }, [roadmap]);

  useEffect(() => {
    if (contextRoadmap != '') {
      alert("Your roadmap is generated Now");
      setTotal(contextRoadmap.total_components);
      setRoadmapId(contextRoadmap.roadmap_id);
      fetchRoadmapData(contextRoadmap.roadmap_id);
    }
  }, [contextRoadmap]);
  useEffect(() => {
    setTotal(contextFirstRoadmap.total_components);
  }, [contextFirstRoadmap]);
useEffect(() => {
  console.log(currentComponentIndex)
  console.log(total)
}, [currentComponentIndex,total]);
  const fetchComponentData = async (roadmapId, componentNumber) => {
    try {
      if (componentNumber == 0) {
        console.log("Setting first component data:", roadmap.first_component);
        setComponentData(roadmap.first_component);
      } else {
        const response = await fetch(`${MODEL_API_SERVER}/roadmaps/${roadmapId}/component`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ component_number: componentNumber }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        contextsetinput(data.name);

        console.log("Component data:", data);
        setComponentData(data);
      }
      setError(null);
    } catch (error) {
      console.error("Error fetching component data:", error);
      setError("Failed to fetch component data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoadmapData = async (roadmapId) => {
    try {
      const response = await fetch(`${MODEL_API_SERVER}/roadmaps/${roadmapId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setIsCompleted(data.is_completed);
      setPDF(data.roadmap_json.pdf_links);
      console.log("Total components:", data.roadmap_json.total_components);
      fetchComponentData(roadmapId, data.is_completed);
      console.log(data.is_completed, roadmapId);
      console.log("Fetched roadmap data:", data);
    } catch (error) {
      console.error("Error fetching roadmap data:", error);
      setError("Failed to fetch roadmap data. Please try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Updated isCompleted:", isCompleted);
  }, [isCompleted]);

  const handleNextComponent = async () => {
    console.log("Totals", total);
    
   if (currentComponentIndex + 1 < total && contextRoadmap!= '') {
      console.log("Current Component Index", currentComponentIndex);
      console.log("roadmapId", roadmapId);
      try {
        const newCompletedIndex = currentComponentIndex + 1;
        const response = await fetch(`${MODEL_API_SERVER}/roadmaps/${roadmapId}/complete`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ is_completed: newCompletedIndex }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        setIsCompleted(newCompletedIndex);
        setCurrentComponentIndex(newCompletedIndex);
        fetchComponentData(roadmapId, newCompletedIndex);
        setQuizAnswers({});
        console.log("Updated completion status:", data);
        console.log("is_completed: newCompletedIndex", newCompletedIndex);
        setQuizCompleted(false);
      } catch (error) {
        console.error("Error updating completion status:", error);
        setError("Failed to update completion status. Please try again.");
      }
    } else if (total === currentComponentIndex + 1) {
      router.push('/quiz');
      contextsetRoadmap('');
    } 
    else if (contextRoadmap === '') {
      toast({
        variant: "destructive",
        title: "Your Full roadmap is not Generated Yet",
      });

      
    }
    else{
      toast({
        variant: "destructive",
        title: "Thers an eror",
      });
    }
  };
  

  const handleQuizAnswer = (questionIndex, selectedAnswer) => {
    setQuizAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: selectedAnswer,
    }));
  };

  const checkQuizCompletion = () => {
    if (!componentData || !componentData.component || !componentData.component.test_series) {
      setQuizCompleted(false);
      return;
    }

    const allQuestionsAnswered = componentData.component.test_series.every(
      (_, index) => quizAnswers[index] !== undefined
    );
    setQuizCompleted(allQuestionsAnswered);
  };

  useEffect(() => {
    checkQuizCompletion();
  }, [quizAnswers]);

useEffect(() => {
  console.log("Component Data name", componentData?.component);
  console.log("Component Data ", componentData);

}, [componentData]);

  const getLayoutClasses = () => {
    if (isEditorOpen) {
      return {
        container: "w-1/2 transition-all duration-300 ease-in-out overflow-y-auto h-[calc(100vh-2rem)] mt-20",
        content: "space-y-4 pr-4"
      };
    }
    return {
      container: "w-full transition-all duration-300 ease-in-out overflow-y-auto h-[calc(100vh-2rem)] mt-20",
      content: "space-y-6"
    };
  };

  const VideoGrid = ({ videos, componentName }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`grid ${isEditorOpen ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-6`}
    >
      {videos.map((video, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="aspect-video bg-neutral-800/30 rounded-xl overflow-hidden border border-neutral-700/50 hover:border-neutral-600/50 transition-all"
        >
          <iframe
            src={video}
            title={`${componentName} Video ${index + 1}`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </motion.div>
      ))}
    </motion.div>
  );

  if (isLoading) return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-electric-blue border-t-transparent rounded-full"
      />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <motion.div
        {...fadeIn}
        className="glass p-8 rounded-2xl text-center max-w-md mx-4"
      >
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-electric-blue mb-4">Error</h2>
        <p className="text-neon-cyan mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="neon-btn"
        >
          Try Again
        </button>
      </motion.div>
    </div>
  );

  if (!componentData) return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <motion.div
        {...fadeIn}
        className="glass p-8 rounded-2xl text-center max-w-md mx-4"
      >
        <BookOpen className="w-16 h-16 text-neutral-200 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-neutral-200 mb-4">No Content Available</h2>
        <p className="text-neon-cyan mb-6">Please select a learning path to begin.</p>
        <button
          onClick={() => router.push('/')}
          className="glass p-3 rounded-2xl text-center max-w-md mx-4"
        >
          Go to Dashboard
        </button>
      </motion.div>
    </div>
  );
  const PDFGrid = ({ pdfs }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {pdfs.map((pdf, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-neutral-800/30 p-6 rounded-xl border border-neutral-700/50 hover:border-neutral-600/50 transition-all flex flex-col items-center justify-center text-center"
        >
          {pdfErrors[pdf] ? (
            <div className="text-red-500">Failed to load PDF</div>
          ) : (
            <>
              <FileText size={48} className="text-neutral-400 mb-4" />
              <p className="text-neutral-300 mb-4">PDF Document {index + 1}</p>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={pdf}
                download
                className="inline-flex items-center space-x-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-200 rounded-lg transition-colors"
              >
                <FileText size={20} />
                <span>Download PDF</span>
              </motion.a>
            </>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
  
  return (
    <>
      {isCompleted === 0 && componentData.name && (
        <div className="bg-neutral-950 text-white min-h-screen flex flex-row items-start p-4 overflow-hidden">
          {/* Left Panel */}
          <div className={getLayoutClasses().container}>
            <motion.div {...fadeIn} className={`bg-neutral-900/30 border border-neutral-800/50 rounded-2xl shadow-2xl p-6 ${getLayoutClasses().content}`}>
              {/* Progress Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-neutral-200">{componentData.name}</h1>
                  <div className="flex items-center space-x-2 mt-2">
                    <BarChart className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-400">
                      Progress: {Math.round((currentComponentIndex + 1) / total * 100)}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-neutral-400">Component</p>
                    <p className="text-lg font-bold text-neutral-200">
                      {currentComponentIndex + 1} / {total}
                    </p>
                  </div>
                  <Award className="w-8 h-8 text-neutral-400" />
                </div>
              </div>

              {/* Video Section */}
              <VideoGrid
                videos={componentData.videos}
                componentName={componentData.name}
              />

              {/* Description Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-neutral-800/30 p-6 rounded-xl border border-neutral-700/50"
              >
                <h2 className="text-xl font-bold text-neutral-200 mb-4">Overview</h2>
                <p className="text-neutral-300">{componentData.description}</p>
              </motion.div>

              {/* Learning Materials Section */}
              


{/* Quiz Section */}
<motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4 bg-neutral-800/30 p-6 rounded-xl border border-neutral-700/50"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="text-neutral-400" />
                  <h2 className="text-xl font-semibold text-neutral-400">Knowledge Check</h2>
                </div>
                <div className="bg-neutral-800/30 p-6 rounded-xl border border-neutral-700/50">
                  {componentData.test_series.map((question, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="mb-6"
                    >
                      <h3 className="text-lg font-semibold mb-4 text-neutral-200">{question.question}</h3>
                      <div className="space-y-3">
                        {question.options.map((option, optionIndex) => (
                          <label
                            key={optionIndex}
                            className="flex items-center space-x-3 p-3 bg-neutral-800/30 rounded-lg cursor-pointer transition-all hover:bg-neutral-700/30"
                          >
                            <input
                              type="radio"
                              name={`question-${index}`}
                              value={option}
                              onChange={() => handleQuizAnswer(index, option)}
                              className="form-radio tex-neutral-200"
                            />
                            <span className="text-neon-cyan">{option}</span>
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  ))}

                  {quizCompleted && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 bg-neutral-800/30 p-6 rounded-xl border border-neutral-700/50"
                    >
                      <h3 className="text-xl font-bold text-neutral-200 mb-4">Quiz Results</h3>
                      {componentData.test_series.map((question, index) => (
                        <div key={index} className="mb-4">
                          <p className="font-semibold text-neutral-200">{question.question}</p>
                          <p className={`mt-2 ${quizAnswers[index] === question.answer ? 'text-green-500' : 'text-red-500'}`}>
                            Your answer: {quizAnswers[index]}
                            {quizAnswers[index] === question.answer ? " ✅" : " ❌"}
                          </p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Next Component Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextComponent}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors"
              >
                <span>Next Component</span>
                <ArrowRight />
              </motion.button>
            </motion.div>
          </div>

          {/* Right Panel - Code Editor */}
          {isEditorOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-1/2 h-[calc(100vh-2rem)] pl-4"
            >
              <div className="bg-neutral-900/30 border border-neutral-800/50 rounded-2xl shadow-2xl h-full overflow-hidden">
                <LearningCodeEditor
                  isOpen={true}
                  onClose={() => setIsEditorOpen(false)}
                  editorRef={editorRef}
                />
              </div>
            </motion.div>
          )}

          {/* Code Editor Toggle Button - Only show when editor is closed */}
          {!isEditorOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditorOpen(true)}
              className="fixed bottom-24 right-4 z-50 p-3 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-200 hover:bg-neutral-700 transition-all duration-200 backdrop-blur-sm shadow-lg hidden md:block"
            >
              <Code className="w-6 h-6" />
            </motion.button>
          )}
        </div>
      )}

      { componentData.component && (
        <div className="bg-neutral-950 text-white min-h-screen flex flex-row items-start p-4 overflow-hidden mt-4">
          {/* Left Panel */}
          <div className={getLayoutClasses().container}>
            <motion.div {...fadeIn} className={`bg-neutral-900/30 border border-neutral-800/50 rounded-2xl shadow-2xl p-6 ${getLayoutClasses().content}`}>
              {/* Progress Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-neutral-200">{componentData.component?.name}</h1>
                  <div className="flex items-center space-x-2 mt-2">
                    <BarChart className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-400">
                      Progress: {Math.round((currentComponentIndex + 1) / total * 100)}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-neutral-400">Component</p>
                    <p className="text-lg font-bold text-neutral-200">
                      {currentComponentIndex + 1} / {total}
                    </p>
                  </div>
                  <Award className="w-8 h-8 text-neutral-400" />
                </div>
              </div>

              {/* Video Section */}
              <VideoGrid
                videos={componentData.component.videos}
                componentName={componentData.component.name}
              />

              {/* Description Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-neutral-800/30 p-6 rounded-xl border border-neutral-700/50"
              >
                <h2 className="text-xl font-bold text-neutral-200 mb-4">Overview</h2>
                <p className="text-neutral-300">{componentData.component.description}</p>
              </motion.div>

              {/* Learning Materials Section */}
              <PDFGrid pdfs={PDF} />

              {/* Quiz Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4 bg-neutral-800/30 p-6 rounded-xl border border-neutral-700/50"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="text-neutral-400" />
                  <h2 className="text-xl font-semibold text-neutral-400">Knowledge Check</h2>
                </div>
                <div className="bg-neutral-800/30 p-6 rounded-xl border border-neutral-700/50">
                  {componentData.component.test_series.map((question, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="mb-6"
                    >
                      <h3 className="text-lg font-semibold mb-4 text-neutral-200">{question.question}</h3>
                      <div className="space-y-3">
                        {question.options.map((option, optionIndex) => (
                          <label
                            key={optionIndex}
                            className="flex items-center space-x-3 p-3 bg-neutral-800/30 rounded-lg cursor-pointer transition-all hover:bg-neutral-700/30"
                          >
                            <input
                              type="radio"
                              name={`question-${index}`}
                              value={option}
                              onChange={() => handleQuizAnswer(index, option)}
                              className="form-radio tex-neutral-200"
                            />
                            <span className="text-neon-cyan">{option}</span>
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  ))}

                  {quizCompleted && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 bg-neutral-800/30 p-6 rounded-xl border border-neutral-700/50"
                    >
                      <h3 className="text-xl font-bold text-neutral-200 mb-4">Quiz Results</h3>
                      {componentData.component.test_series.map((question, index) => (
                        <div key={index} className="mb-4">
                          <p className="font-semibold text-neutral-200">{question.question}</p>
                          <p className={`mt-2 ${quizAnswers[index] === question.answer ? 'text-green-500' : 'text-red-500'}`}>
                            Your answer: {quizAnswers[index]}
                            {quizAnswers[index] === question.answer ? " ✅" : " ❌"}
                          </p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Next Component Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextComponent}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors"
              >
                <span>Next Component</span>
                <ArrowRight />
              </motion.button>
            </motion.div>
          </div>

          {/* Right Panel - Code Editor */}
          {isEditorOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-1/2 h-[calc(100vh-2rem)] pl-4"
            >
              <div className="bg-neutral-900/30 border border-neutral-800/50 rounded-2xl shadow-2xl h-full overflow-hidden">
                <LearningCodeEditor
                  isOpen={true}
                  onClose={() => setIsEditorOpen(false)}
                  editorRef={editorRef}
                />
              </div>
            </motion.div>
          )}

          {/* Code Editor Toggle Button - Only show when editor is closed */}
          {!isEditorOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditorOpen(true)}
              className="fixed bottom-24 right-4 z-50 p-3 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-200 hover:bg-neutral-700 transition-all duration-200 backdrop-blur-sm shadow-lg hidden md:block"
            >
              <Code className="w-6 h-6" />
            </motion.button>
          )}
        </div>
      )}
    </>
  );
}