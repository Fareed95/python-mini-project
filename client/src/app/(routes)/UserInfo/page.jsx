"use client";
import { useUserContext } from '@/app/context/Userinfo';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import PrevCources from '@/components/PrevCources';
import { Calendar, Users, Clock, Award, Briefcase } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { useRouter } from 'next/navigation';
import { saveAs } from 'file-saver';

const HeroBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-950 to-black" />
    <div className="absolute inset-0 bg-grid-small-white/[0.1] -z-10" />
    <div className="absolute inset-0 bg-dot-white/[0.1] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
    <motion.div 
      className="absolute inset-0 bg-gradient-radial from-neutral-800/20 via-transparent to-transparent"
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.4, 0.3],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        repeatType: 'reverse',
      }}
    />
  </div>
);

const FriendCard = ({ friend }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-xl flex items-center space-x-4 hover:bg-neutral-800/50 transition-all duration-300 backdrop-blur-sm group"
  >
    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-700 flex items-center justify-center text-neutral-200 ring-2 ring-neutral-700/50 group-hover:ring-neutral-600/50 transition-all duration-300">
      {friend.name.charAt(0).toUpperCase()}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-neutral-200 font-medium truncate">{friend.name}</h4>
      <p className="text-sm text-neutral-400 truncate">{friend.status}</p>
    </div>
    <div className={`flex-shrink-0 w-2 h-2 rounded-full ${friend.isOnline ? 'bg-green-500' : 'bg-neutral-600'} ring-2 ${friend.isOnline ? 'ring-green-500/20' : 'ring-neutral-600/20'}`} />
  </motion.div>
);

const InterviewSlotCard = ({ slot, onJoinMeet }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-xl backdrop-blur-sm hover:bg-neutral-800/50 transition-all duration-300 group"
  >
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div className="space-y-1">
        <h4 className="text-neutral-200 font-semibold text-lg">{slot.internship_name}</h4>
        <p className="text-neutral-400 text-sm flex items-center">
          <Briefcase className="w-4 h-4 mr-1 text-neutral-500" />
          {slot.company_name}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <p className="text-neutral-400 text-sm flex items-center">
          <Clock className="w-4 h-4 mr-1 text-neutral-500" />
          {new Date(slot.interviw_time).toLocaleString()}
        </p>
        {slot.is_selected && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onJoinMeet(slot)}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-2 rounded-xl text-white text-sm font-medium hover:from-emerald-500 hover:to-emerald-600 transition-all duration-300 shadow-lg shadow-emerald-900/20"
          >
            Join Meet
          </motion.button>
        )}
      </div>
    </div>
  </motion.div>
);

const UserInfoPage = () => {
  const { email, name, isLoggedIn } = useAuth();
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    role: '',
    joinDate: '',
    lastActive: '',
    preferences: {
      theme: 'dark',
      notifications: true,
      language: 'en',
    }
  });
  const [interviewSlots, setInterviewSlots] = useState([]);
  const [interviewreview, setInterviewreview] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = useRef(null);
  const { data: session } = useSession();
  const { contextsetIsLoggedIn, contextsetEmail, contextsetName, contextisLoggedIn, setcontextInterviewdeets, contextInterviewdeets } = useUserContext();

  const Getuserinfo = async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.log("no token")
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/user', {
        method: 'GET',
        headers: {
          "Authorization": token,
          'Content-Type': "application/json",
        },
        credentials: 'include',
      });

      // Log the response status and status text
      console.log('Response Status:', response.status, response.statusText);

      // Check if the response is not OK (status code 200-299)
      if (!response.ok) {
        // Log more detailed error information
        const errorText = await response.text();
        console.error('Error Response:', errorText);

        // Handle specific HTTP error codes
        if (response.status === 401) {
          console.error('Unauthorized: Check your token and permissions.');
        } else if (response.status === 404) {
          console.error('Not Found: The requested resource does not exist.');
        } else {
          console.error(`HTTP Error: ${response.statusText}`);
        }

        // Optionally, throw an error to be caught by the catch block
        throw new Error(`HTTP Error: ${response.statusText}`);
      }

      // Parse the JSON response if the request was successful
      const result = await response.json();

      setInterviewSlots(result.interview_selected);
      setInterviewreview(result.internship_under_review);

      // Proceed with handling the successful response
      // ...
      // Update context with user information
      contextsetIsLoggedIn(true);
      contextsetEmail(result.email);
      contextsetName(result.name);

    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    Getuserinfo();
  }, [contextisLoggedIn]);

  const router = useRouter();

  // const handleUpdatePreferences = async (key, value) => {
  //   setUserDetails(prev => ({
  //     ...prev,
  //     preferences: {
  //       ...prev.preferences,
  //       [key]: value
  //     }
  //   }));
  //   // Add API call to update preferences here
  // };

  // const formatDate = (dateString) => {
  //   return new Date(dateString).toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric'
  //   });
  // };

  const friends = [
    { id: 1, name: 'Sarah Chen', status: 'Working on Web Development', isOnline: true },
    { id: 2, name: 'Mike Johnson', status: 'Learning React', isOnline: false },
    { id: 3, name: 'Emily Davis', status: 'Studying Data Structures', isOnline: true },
    { id: 4, name: 'Alex Thompson', status: 'Practicing Algorithms', isOnline: true },
    { id: 5, name: 'Jessica Lee', status: 'Taking a break', isOnline: false },
  ];

  const handleJoinMeet = (slot) => {
    // Set the context with the interview details
    setcontextInterviewdeets(slot);
    router.push('/AiInterview');
    console.log(contextInterviewdeets);
    // Optionally, you can navigate to another page or perform additional actions here
  };

  // const capture = () => {
  //   const imageSrc = webcamRef.current.getScreenshot();
  //   console.log(imageSrc); // Log the captured image to the console
  //   setCapturedImage(imageSrc);
  //   setIsCameraOpen(false); // Close the camera preview after taking the picture

  //   // Convert Base64 to Blob
  //   const byteString = atob(imageSrc.split(',')[1]);
  //   const ab = new ArrayBuffer(byteString.length);
  //   const ia = new Uint8Array(ab);
  //   for (let i = 0; i < byteString.length; i++) {
  //     ia[i] = byteString.charCodeAt(i);
  //   }
  //   const blob = new Blob([ab], { type: 'image/jpeg' });

  //   // Create a downloadable link
  //   saveAs(blob, 'captured_image.jpg');
  // };

  const handleDownloadResume = async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`http://localhost:8000/api/resume/${session?.user?.email}`, {
      method: 'GET',
      headers: {
        "Authorization": token,
        'Content-Type': "application/json",
      },
      credentials: 'include',
    });
    const data = await response.blob();
    saveAs(data, `${session?.user?.name}.pdf`);
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-28 pb-12 px-4 bg-black">
      <HeroBackground />

      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-400">
            User Profile
          </h1>
          <p className="text-neutral-400 mt-2">Manage your account settings and preferences</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl backdrop-blur-sm"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="m-2">
                <AnimatedTooltip
                  items={[{
                    id: 1,
                    name: session?.user?.name || "User",
                    designation: "Member",
                    image: session?.user?.image || "/default-avatar.png",
                  }]}
                />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-200">{session?.user?.name}</h2>
                <p className="text-sm text-neutral-400">{session?.user?.email}</p>
              </div>
            </div>

            <motion.div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg shadow-purple-600/25 border border-purple-500/20"
                onClick={handleDownloadResume}
              >
                Download Resume
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(`/portfolio/${session?.user?.email}`)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg shadow-purple-600/25 border border-purple-500/20"
              >
                See and Edit Portfolio
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-neutral-300" />
                <h3 className="text-lg font-semibold text-neutral-200">Friends</h3>
              </div>
              <span className="text-sm text-neutral-400">{friends.length} friends</span>
            </div>
            <div className="space-y-4">
              {friends.map((friend) => (
                <FriendCard key={friend.id} friend={friend} />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-neutral-300" />
                <h3 className="text-lg font-semibold text-neutral-200">Interview Slots</h3>
              </div>
              <span className="text-sm text-neutral-400">{interviewSlots.length} interviews</span>
            </div>
            <div className="space-y-4">
              {interviewSlots.length > 0 ? (
                interviewSlots.map((slot) => (
                  <InterviewSlotCard
                    key={slot.id}
                    slot={slot}
                    onJoinMeet={handleJoinMeet}
                  />
                ))
              ) : (
                <p className="text-neutral-400 text-center py-4">No interview slots scheduled</p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-neutral-300" />
                <h3 className="text-lg font-semibold text-neutral-200">Under Review</h3>
              </div>
              <span className="text-sm text-neutral-400">{interviewreview.length} interviews</span>
            </div>
            <div className="space-y-4">
              {interviewreview.length > 0 ? (
                interviewreview.map((slot) => (
                  <InterviewSlotCard
                    key={slot.id}
                    slot={slot}
                    onJoinMeet={handleJoinMeet}
                  />
                ))
              ) : (
                <p className="text-neutral-400 text-center py-4">No interviews under review</p>
              )}
            </div>
          </motion.div>
        </div>

        <PrevCources />
      </div>
    </div>
  );
};

export default UserInfoPage;
