"use client";
import React, { useEffect, useState, useRef } from 'react';

export default function ErrorPage() {
  const [glitchActive, setGlitchActive] = useState(false);
  const [particles, setParticles] = useState([]);
  const containerRef = useRef(null);

  // Generate random particles with more aesthetic properties
  useEffect(() => {
    const generateParticles = () => {
      const particleCount = 80;
      return Array.from({ length: particleCount }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5, // Smaller, more subtle particles
        velocity: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.4 + 0.1, // More transparent
        hue: Math.floor(Math.random() * 40) + 200, // Blues to purples
      }));
    };

    setParticles(generateParticles());

    // More subtle, random glitch effect
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) { // Only glitch sometimes
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 150 + Math.random() * 100);
      }
    }, 2000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div ref={containerRef} className="relative flex flex-col items-center justify-center w-full h-screen bg-gray-950 overflow-hidden">
      {/* Improved gradient background with subtle animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black opacity-80 animate-pulse" 
           style={{ animationDuration: '8s' }} />
      
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMzc0RCIgb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQiPSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-20" />

      {/* Enhanced particles */}
      {particles.map((particle, index) => (
        <div
          key={index}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: `hsl(${particle.hue}, 80%, 60%)`,
            boxShadow: `0 0 ${particle.size * 2}px hsl(${particle.hue}, 80%, 60%)`,
            opacity: particle.opacity,
            transform: 'translateZ(0)',
            animation: `float ${5 + particle.velocity * 8}s infinite ease-in-out`,
          }}
        />
      ))}

      {/* Main content container */}
      <div className="relative z-10 text-center px-6 w-full max-w-lg">
        <h1 
          className={`text-8xl md:text-9xl font-bold mb-6 ${
            glitchActive ? 'opacity-90' : 'opacity-100'
          }`}
        >
          <span className="relative inline-block tracking-tighter">
            {/* Enhanced glitch effect */}
            <span className={`absolute inset-0 ${glitchActive ? 'text-cyan-400 -translate-x-1.5 translate-y-0.5 blur-sm' : 'text-transparent'}`}>
              404
            </span>
            <span className={`absolute inset-0 ${glitchActive ? 'text-fuchsia-400 translate-x-1.5 -translate-y-0.5 blur-sm' : 'text-transparent'}`}>
              404
            </span>
            <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-500">404</span>
          </span>
        </h1>

        <p className="text-2xl text-cyan-200 font-light mb-10 tracking-wide">
          <span className="opacity-80">Page not found</span>
        </p>

        {/* Improved spinner/loader with subtle animation */}
        <div className="w-16 h-16 relative mx-auto mb-12">
          <div className="absolute inset-0 border-2 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-0 border-2 border-t-transparent border-r-cyan-500 border-b-transparent border-l-transparent rounded-full animate-spin" style={{ animationDuration: '2.5s', animationDirection: 'reverse' }} />
          <div className="absolute inset-2 border-2 border-t-transparent border-r-transparent border-b-blue-400 border-l-transparent rounded-full animate-spin" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-4 rounded-full bg-indigo-900 bg-opacity-20 animate-pulse" />
        </div>

        <div className="mb-8">
          <p className="text-gray-400 max-w-lg mx-auto text-sm leading-relaxed font-light">
            The page you're looking for has drifted beyond our digital reach.
            <br />Perhaps it was never meant to exist in this dimension.
          </p>
        </div>
        
        {/* Better positioned, more aesthetic button */}
        <div className="relative mt-6 flex justify-center">
          <button 
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg 
                    shadow-lg shadow-indigo-800/30 hover:shadow-indigo-700/50
                    transition-all duration-300 transform hover:translate-y-[-2px] 
                    backdrop-blur-sm text-sm uppercase tracking-wider font-medium"
            onClick={() => window.location.href = '/'}
          >
            Return to Reality
          </button>
        </div>
      </div>

      {/* Bottom light bar with subtle animation */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-800 to-transparent opacity-60" />
      
      {/* Animated corner accent */}
      <div className="absolute top-8 right-8 w-24 h-24">
        <div className="absolute top-0 right-0 w-12 h-px bg-cyan-500 opacity-60 animate-pulse" />
        <div className="absolute top-0 right-0 h-12 w-px bg-cyan-500 opacity-60 animate-pulse" />
      </div>
      <div className="absolute bottom-8 left-8 w-24 h-24">
        <div className="absolute bottom-0 left-0 w-12 h-px bg-indigo-500 opacity-60 animate-pulse" />
        <div className="absolute bottom-0 left-0 h-12 w-px bg-indigo-500 opacity-60 animate-pulse" />
      </div>
      
      {/* More refined animated lines */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" 
            style={{ 
              left: '0',
              width: '100%',
              top: `${10 + (i * 4)}px`,
              opacity: 0.1 + (i * 0.01),
              transform: `translateY(${Math.sin(i) * 5}px)`,
              animation: `pulse ${4 + i * 0.5}s infinite ease-in-out`
            }}
          />
        ))}
      </div>
    </div>
  );
}