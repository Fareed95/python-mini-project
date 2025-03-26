"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useRoadmap } from '@/app/context/RoadmapContext';
import { useUserContext } from '@/app/context/Userinfo';
import { motion } from 'framer-motion';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import Masonry from 'react-masonry-css';

const HeroBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 " />
  </div>
);
const CardWithGradientBorder = ({ children, onClick }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const updateMousePosition = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={updateMousePosition}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-xl cursor-pointer"
      onClick={onClick}
    >
      {/* Outer border container - adjust background */}
      <div
        className="absolute inset-0 rounded-xl transition-opacity duration-300 "
        style={{
          padding: '6px',
          background: 'rgba(255, 255, 255, 0.03)',
          opacity: isHovered ? 1 : 0,
        }}
      >
        <div className="absolute inset-0 rounded-xl " />
      </div>

      {/* Inner gradient border container */}
      <div
        className="absolute inset-[2px] rounded-xl transition-opacity duration-300"
        style={{
          padding: '2px',
          background: isHovered
            ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.15), transparent 40%)`
            : 'transparent',
          opacity: isHovered ? 1 : 0,
        }}
      >
      </div>

      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: isHovered
            ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1), transparent 40%)`
            : 'transparent',
        }}
      />

      {/* Content area adjustments */}
      <div className="relative bg-black hover:/30 p-6 rounded-xl backdrop-blur-sm z-10">
        {children}
      </div>
    </motion.div>
  );
};

function PrevCources() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { setRoadmap } = useRoadmap();
  const { contextemail } = useUserContext();

  const MODEL_API_SERVER = process.env.NEXT_PUBLIC_MODEL_API_SERVER;

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${MODEL_API_SERVER}/user-roadmaps`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: contextemail,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch roadmaps');
        }

        const data = await response.json();
        setRoadmaps(data);

        setError(null);
      } catch (err) {
        console.error('Error fetching roadmaps:', err);
        setError('Failed to load roadmaps');
      } finally {
        setLoading(false);
      }
    };

    if (contextemail) {
      fetchRoadmaps();
    }
  }, [contextemail]);

  const handleCardClick = async(roadmap) => {
    setRoadmap({ roadmap_id: roadmap.id });
    router.push('/LearningPrev');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-400"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-red-500">
      Error: {error}
    </div>
  );

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };


  return (
    <div className="relative min-h-screen py-12 px-4 md:px-8">
      <HeroBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">Your Learning Journey</h2>
          <p className="text-neutral-400 text-lg">Continue where you left off or start something new</p>
        </div>

        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto -ml-8"
          columnClassName="pl-8 bg-clip-padding"
        >
          {roadmaps.map((roadmap) => (
            <div className="mb-8" key={roadmap.id}>
              <CardWithGradientBorder
                onClick={() => handleCardClick(roadmap)}
                key={roadmap.id}
              >
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                />
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white">{roadmap.name}</h3>
                    <div className="h-1 w-24 bg-gradient-to-r from-neutral-400 to-neutral-600 rounded-full" />
                  </div>

                  {roadmap.roadmap_json?.roadmap_components?.length > 0 ? (
                    <div className="space-y-4">
                      {roadmap.roadmap_json.roadmap_components.map((component, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 rounded-xl backdrop-blur-sm border border-neutral-800/50"
                        >
                          <h4 className="text-lg font-semibold text-neutral-200 mb-2">
                            {component.name}
                          </h4>
                          <p className="text-neutral-400 text-sm line-clamp-2">
                            {component.description}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className=" p-4 rounded-xl text-center border border-neutral-800/50">
                      <p className="text-neutral-400">No components available yet</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                      <span className="text-sm text-neutral-300">Progress</span>
                      <div className="h-2 w-full sm:w-24  rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-400 to-pink-600"
                          style={{ width: `${(roadmap.roadmap_json?.roadmap_components?.length || 0) * 20}%` }}
                        />
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 shadow-lg shadow-purple-600/10 mt-2 sm:mt-0"
                    >
                      Continue
                    </motion.button>
                  </div>
                </div>
              </CardWithGradientBorder>
            </div>
          ))}
        </Masonry>

        {roadmaps.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-neutral-950 border border-neutral-800 text-center py-12 rounded-xl"
          >
            <p className="text-neutral-400">No roadmaps available. Start your learning journey today!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300"
              onClick={() => router.push('/')}
            >
              Create New Roadmap
            </motion.button>
          </motion.div>
        )}
      </motion.div>


      {/* <Checking/> */}
    </div>
  );
}

export default PrevCources;