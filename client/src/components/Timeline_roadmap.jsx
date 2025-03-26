"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRoadmap } from '@/app/context/RoadmapContext';
import { motion, useScroll, useInView } from "framer-motion";
import { Star } from 'lucide-react';

const RoadmapNode = ({ title, content, index, isActive, progress, isLocked }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="relative"
    >
      {/* Progress Line */}
      <div className="absolute left-[12px] md:left-[20px] top-0 w-[2px] md:w-[3px] h-full">
        <div className="w-full h-full bg-neutral-800/50" />
        <motion.div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-purple-500 to-blue-500"
          style={{ height: `${progress}%` }}
        />
      </div>

      {/* Node Content */}
      <div className={`relative ml-[40px] md:ml-[60px] pb-10 md:pb-16 ${isActive ? 'opacity-100' : 'opacity-75'}`}>
      
        {/* Content Card */}
        <motion.div
          className={`relative p-4 md:p-6 rounded-lg md:rounded-xl border ${
            isLocked 
              ? 'border-neutral-800/50 bg-neutral-900/50' 
              : isActive 
                ? 'border-purple-500/30 bg-neutral-800/50' 
                : 'border-neutral-800/50 bg-neutral-800/20'
          }`}
        >

          <div className="space-y-2 md:space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs md:text-sm text-neutral-500 mb-1">Step {index + 1}</span>
                <h3 className="text-lg md:text-xl font-bold text-neutral-200">
                  {title}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm md:text-base text-neutral-400 leading-relaxed">
              {content.content}
            </p>

            {/* Skills */}
            {content.skills && (
              <div className="flex flex-wrap gap-1 md:gap-2">
                {content.skills.map((skill, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="px-2 py-0.5 md:px-3 md:py-1 text-xs md:text-sm bg-neutral-800/50 rounded-full text-neutral-300 flex items-center gap-1 border border-neutral-700/50"
                  >
                    <Star className="w-3 h-3 md:w-4 md:h-4" />
                    {skill}
                  </motion.span>
                ))}
              </div>
            )}           
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

function Timeline_roadmap_function({ roadmapData }) {
  const router = useRouter();
  const { setRoadmap } = useRoadmap();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ 
    target: containerRef,
    offset: ["start center", "end center"]
  });
  const [activeNodeIndex, setActiveNodeIndex] = useState(0);

  // Update active node based on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(v => {
      const index = Math.floor(v * roadmapData.roadmap.length);
      setActiveNodeIndex(index);
    });
    return () => unsubscribe();
  }, [scrollYProgress, roadmapData.roadmap.length]);

  if (!roadmapData) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="border border-neutral-800 p-8 rounded-xl">
          <p className="text-neutral-400 text-lg">
            No roadmap data available. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const handleButtonClick = () => {
    setRoadmap({
      roadmap_id: roadmapData.roadmap_id,
      total_components: roadmapData.total_components,
      first_component: roadmapData.first_component
    });
    router.push('/Learning');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative pt-24 md:pt-32 px-4"
      >
        <div className="max-w-4xl mx-auto text-center space-y-4 md:space-y-6 bg-transparent">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Your Learning Journey
          </h1>
          <p className="text-base md:text-xl text-neutral-400">
            Track your progress through {roadmapData.total_components} milestones
          </p>
        </div>
      </motion.div>

      {/* Roadmap Section */}
      <div 
        ref={containerRef}
        className="relative max-w-4xl mx-auto px-4 py-12 md:py-16 rounded-xl"
      >
        {roadmapData.roadmap.map((component, index) => (
          <RoadmapNode
            key={index}
            title={component.name}
            content={{
              content: component.description,
              skills: component.skills
            }}
            index={index}
            isActive={index === activeNodeIndex}
            progress={index < activeNodeIndex ? 100 : index === activeNodeIndex ? 50 : 0}
            isLocked={index > activeNodeIndex + 1}
          />
        ))}
      </div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky bottom-4 md:bottom-8 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleButtonClick}
            className="w-full text-sm md:text-base bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg md:rounded-xl py-3 md:py-4 font-medium transition-all duration-300 transform active:scale-[0.98]"
          >
            Start Your Journey
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Timeline_roadmap_function;