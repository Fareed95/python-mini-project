"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from 'next-auth/react';
import { useUserContext } from '@/app/context/Userinfo';
import UserIcon from '@/components/UserIcon';
import { motion } from "framer-motion";
import img from '../../public/logo.png';
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { useRouter } from "next/navigation";
import GetUserInfo from "./GetUserInfo";

function Navbar() {
  const { data: session } = useSession();
  const { contextisLoggedIn, contextsetIsLoggedIn, contextsetName, contextsetEmail,contextorganisation,contextsetorganisation } = useUserContext();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [isHomePage, setIsHomePage] = useState(false);

  useEffect(() => {
    if (session) {
      contextsetIsLoggedIn(true);
      contextsetEmail(session.user.email);
      contextsetName(session.user.name);
    }
  }, [session]);
  const menuItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/About" },
    { label: "Community", href: "/ChatRoom/django" },
  ];
    
  const Logout = () => {
    

    localStorage.setItem('authToken', "-");
    contextsetIsLoggedIn(false);
    contextsetEmail('');
    contextsetName('');
    contextsetorganisation([]);
    // if (localStorage.getItem('authToken') == "-") {
    //   window.location.reload();
    // }
  };
 
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <GetUserInfo />
      <div className="mx-4 mt-4">
        <div className="relative bg-neutral-900/50 backdrop-blur-xl border border-neutral-800/50 rounded-2xl shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="h-10 w-10 overflow-hidden"
                >
                  <img src={img.src} alt="Logo" className="h-full w-full object-cover" />
                </motion.div>
              </Link>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-8">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                  >
                    <motion.span
                      whileHover={{ y: -2 }}
                      className="relative text-sm text-neutral-300 hover:text-white transition-colors group"
                    >
                      {item.label}
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
                    </motion.span>
                  </Link>
                ))}
              </div>

              {/* Auth Buttons */}
              <div className="flex items-center space-x-4">
                {contextisLoggedIn ? (
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => signOut() && Logout()}
                      className="px-4 py-2 bg-neutral-800/50 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-xl text-sm transition-all duration-200 border border-neutral-700/50"
                    >
                      Logout
                    </motion.button>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="cursor-pointer"
                    >
                      <div onClick={() =>
                        contextorganisation.length!=0?router.push("/organization/dashboard") :router.push("/UserInfo")}>
                        <AnimatedTooltip
                          items={[{
                            id: 1,
                            name: session?.user?.name || "User",
                            designation: contextorganisation.length!=0 ? "Organization" : "Member",
                            image: session?.user?.image || "/default-avatar.png",
                          }]}
                        />
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  <Link href="/Login">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg shadow-purple-600/25"
                    >
                      Login
                    </motion.button>
                  </Link>
                )}

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg text-neutral-300 hover:text-white transition-colors"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {isOpen ? (
                        <path d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path d="M4 6h16M4 12h16M4 18h16" />
                      )}
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="md:hidden py-4 border-t border-neutral-800 mt-2"
              >
                <div className="flex flex-col space-y-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                    >
                      <motion.span
                        whileHover={{ x: 4 }}
                        className="block px-4 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-all duration-200"
                      >
                        {item.label}
                      </motion.span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
     
    </nav>
  );
}

export default Navbar;