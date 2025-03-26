"use client";

import { motion } from 'framer-motion';
import MainInput from '@/components/MainInput';
import PrevCources from '@/components/PrevCources';
import { useEffect, useState } from 'react';
import ChatBot from '@/components/SearchAssistant';
import TrueFocus from '@/components/TrueFocus';
// import Leaderboard from '@/components/Leaderboard';
// import SplashCursor from '@/components/SplashCursor';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const HeroBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    {/* Gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-black-950 via-white-900 to-neutral-950" />
    
    {/* Colorful orbs */}
    <div className="absolute top-10 left-20 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />
    <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl" />
    <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-pink-500/20 blur-3xl" />
    
    {/* Subtle grid */}
    {/* <div className="absolute inset-0 bg-grid-small-white/[0.05] -z-10" /> */}
    
    {/* Subtle dots */}
    {/* <div className="absolute inset-0 bg-dot-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" /> */}
    
    {/* Gentle radial gradient */}
    {/* <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent" /> */}
  
   {/* Colorful orbs */}
   <div className="absolute top-60 right-20 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl" />
    <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl" />
    <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-pink-500/20 blur-3xl" />
    
  </div>
);

// Add type definition for messages
type Message = {
  type: 'user' | 'ai' | 'error';
  content: string;
};

// Test component data for debugging
const testComponentData = {
  name: "Introduction to React",
  description: "Learn the basics of React",
  topics: ["JSX", "Components", "Props", "State"],
  difficulty: "Beginner"
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [response, setResponse] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [componentData, setComponentData] = useState(testComponentData);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle user input
  const handleUserInput = async (text: string) => {
    if (!text.trim()) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { type: 'user', content: text }]);

    try {
      // Store the stringified component data
      const json_string = JSON.stringify(componentData);
      console.log('Sending request with:', {
        json_string,
        question: text,
        component_name: componentData.name
      });

      // Make API request to the bot endpoint
      const aiResponse = await fetch('http://localhost:8000/api/bot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          json_string: json_string,
          question: text,
          component_name: componentData.name
        }),
      });

      if (!aiResponse.ok) {
        throw new Error(`API responded with status: ${aiResponse.status}`);
      }

      const data = await aiResponse.json();
      console.log('API Response:', data);

      // Handle the response
      const responseText = data.message || data.response || 'No response from AI';
      setResponse(responseText);
      setMessages(prev => [...prev, { type: 'ai', content: responseText }]);

    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, {
        type: 'error',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Test function to simulate different component data
  const testWithDifferentComponent = () => {
    const newTestData = {
      name: "Advanced JavaScript",
      description: "Deep dive into JavaScript concepts",
      topics: ["Closures", "Promises", "Async/Await"],
      difficulty: "Advanced"
    };
    setComponentData(newTestData);
    console.log('Switched to new component:', newTestData);
  };

  useEffect(() => {
    // Log current component data whenever it changes
    console.log('Current component data:', componentData);
  }, [componentData]);

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen">
      <HeroBackground />
      {/* <SplashCursor /> */}

      <div className="flex flex-col">
        <motion.section
          className="mt-32 relative"
          initial="initial"
          animate="animate"
          variants={fadeIn}
        >
          {/* Hero Section */}
          <div className="text-center mb-12 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <TrueFocus
                sentence="Learn Grow Excel"
                manualMode={false}
                blurAmount={3}
                borderColor="#ffffff"
                glowColor="rgba(255, 255, 255, 0.7)"
                animationDuration={0.2}
                pauseBetweenAnimations={2}
              />
            </motion.div>
            <motion.p 
              className="text-lg md:text-xl text-white max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Discover personalized learning paths and connect with expert mentors to achieve your goals.
            </motion.p>
          </div>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <ChatBot/>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-6">
              Why Choose Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
              {[
                {
                  icon: "🎯",
                  title: "Personalized Learning",
                  description: "Tailored paths that adapt to your goals and pace"
                },
                {
                  icon: "👥",
                  title: "Expert Mentors",
                  description: "Learn from industry professionals who've been there"
                },
                {
                  icon: "📈",
                  title: "Track Progress",
                  description: "Monitor your growth with detailed analytics"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className={`p-6 rounded-xl text-center bg-gradient-to-br ${
                    index === 0 
                      ? 'from-purple-600/10 to-blue-600/10 border-purple-500/20' 
                      : index === 1 
                        ? 'from-blue-600/10 to-indigo-600/10 border-blue-500/20' 
                        : 'from-indigo-600/10 to-violet-600/10 border-indigo-500/20'
                  } shadow-lg border border-white/10`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                >
                  <span className="text-4xl mb-4 block">{feature.icon}</span>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-200">
                    {feature.description}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-purple-600/25 border border-purple-500/20 text-sm"
                  >
                    Learn More
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* prev courses */}
        <motion.section 
          className="mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          {/* <PrevCources /> */}
        </motion.section>

      </div>


    </main>
  );
}