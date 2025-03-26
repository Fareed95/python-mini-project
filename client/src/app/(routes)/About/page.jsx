'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaUsers, FaGraduationCap, FaLightbulb, FaChartLine } from 'react-icons/fa';
import NitinImage from '../../../../public/Nitin.jpg';
import FareedImage from '../../../../public/Fareed.jpg';
import { useRouter } from 'next/navigation';

const HeroBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    {/* Enhanced gradient background */}
    <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-950 to-black" />
    
    {/* Animated grid with parallax effect */}
    <motion.div 
      className="absolute inset-0 bg-grid-small-white/[0.1] -z-10"
      animate={{
        backgroundPosition: ['0px 0px', '100px 100px'],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        repeatType: 'reverse',
      }}
    />
    
    {/* Enhanced gradient dots */}
    <div className="absolute inset-0 bg-dot-white/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
    
    {/* Animated radial gradient */}
    <motion.div 
      className="absolute inset-0 bg-gradient-radial from-neutral-800/30 via-transparent to-transparent"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        repeatType: 'reverse',
      }}
    />
  </div>
);

const features = [
  {
    icon: <FaGraduationCap className="text-4xl text-neutral-300" />,
    title: "Expert Education",
    description: "Learn from industry professionals and experienced educators"
  },
  {
    icon: <FaLightbulb className="text-4xl text-neutral-300" />,
    title: "Innovative Learning",
    description: "Interactive courses designed for maximum engagement"
  },
  {
    icon: <FaChartLine className="text-4xl text-neutral-300" />,
    title: "Track Progress",
    description: "Monitor your growth with detailed analytics and insights"
  },
  {
    icon: <FaUsers className="text-4xl text-neutral-300" />,
    title: "Community",
    description: "Join a vibrant community of learners and mentors"
  },
];

const teamMembers = [
  {
    name: "Nitin Gupta",
    role: "UI/UX Designer & Frontend Developer",
    image: NitinImage,
    priority: true
  },
  {
    name: "Fareed Sayed",
    role: "Backend Developer & Machine Learning Engineer",
    image: FareedImage,
    priority: false
  },
  {
    name: "Rehbar Khan",
    role: "Frontend Developer",
    image: "https://avatars.githubusercontent.com/u/136853370?v=4",
    priority: false   
  } 
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <HeroBackground />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto space-y-6"
        >
          <h1 className="text-5xl md:text-7xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-400">
              About Us
            </span>
          </h1>
          <p className="text-xl text-neutral-400 leading-relaxed">
            We're on a mission to transform education through technology and innovation,
            making quality learning accessible to everyone.
          </p>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800/50 p-6 md:p-8 rounded-2xl hover:bg-neutral-800/50 transition-colors duration-300 group"
            >
              <div className="relative z-10 space-y-4">
                <div className="p-3 bg-neutral-800/50 rounded-xl w-fit group-hover:bg-neutral-700/50 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-neutral-200">
                  {feature.title}
                </h3>
                <p className="text-neutral-400">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-neutral-200 mb-4">
            Meet Our Team
          </h2>
          <p className="text-xl text-neutral-400">
            The passionate individuals behind our success
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800/50 p-8 rounded-2xl hover:bg-neutral-800/50 transition-colors duration-300 group"
            >
              <div className="relative z-10 flex flex-col items-center space-y-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-neutral-800/50 group-hover:ring-neutral-700/50 transition-colors duration-300">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100px, 128px"
                    className="object-cover hover:scale-110 transition-transform duration-300"
                    priority={member.priority}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-neutral-200">
                    {member.name}
                  </h3>
                  <p className="text-neutral-400 mt-2">
                    {member.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Join Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800/50 p-8 md:p-12 rounded-2xl text-center max-w-4xl mx-auto relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-800/20 to-neutral-700/20 transform group-hover:scale-105 transition-transform duration-300" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-200">
              Join Our Journey
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Be part of our mission to revolutionize education and empower learners worldwide.
            </p>
            <motion.button
              onClick={() => router.push('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-purple-600/25 border border-purple-500/20"
            >
              Get Started Today
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
