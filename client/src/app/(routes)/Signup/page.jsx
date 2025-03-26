"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserContext } from '@/app/context/Userinfo';
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
function SignUp() {
  const { contextsetEmail, contextsetPassword, contextsetName } = useUserContext();
  const { data: session } = useSession();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();
  const [loadings, setLoading] = useState(false);

  useEffect(() => {
    setName(`${firstname} ${lastname}`);
  }, [firstname, lastname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirm_password) {
      console.error("Password Doesn't Match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          confirm_password,
          is_company:true 
        }),
      });

      // Log the response status and status text
      console.log('Response Status:', response.status, response.statusText);

      if (!response.ok) {
        console.error("Error submitting form:", response);
        setLoading(false);
        return;
      }

      const result = await response.json();
      console.log(result?.message);

      contextsetEmail(email);
      contextsetPassword(password);
      changetoOTP();

    } catch (error) {
      console.error("Error submitting form:", error);
      setLoading(false);
    }
  };

  const changetoOTP = () => {
    setTimeout(() => {
      setLoading(false);
      router.push('/OTP');
    }, 1000);
  };

  async function loginWithGoogle() {
    setLoading(true);
    try {
      await signIn('google');
    } catch (error) {
      console.error("Error logging in with Google:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loginWithGithub() {
    setLoading(true);
    try {
      await signIn('github');
    } catch (error) {
      console.error("Error logging in with GitHub:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (session) {
      contextsetEmail(session.user.email);
      contextsetName(session.user.name);
      router.push('/');
    }
  }, [session]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-900 to-black p-4 md:p-8">
      {/* {loadings && (
        // <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        //   <motion.div
        //     animate={{ rotate: 360 }}
        //     transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        //     className="w-16 h-16 border-4 border-electric-blue border-t-transparent rounded-full"
        //   />
        // </div>
      )} */}

      <div className="w-full max-w-md relative">
        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white/5 backdrop-blur-2xl" />
        <div className="absolute -z-10 h-full w-full bg-gradient-to-b from-purple-500/20 via-transparent to-blue-500/20 blur-3xl" />

        <div className="bg-neutral-900/90 backdrop-blur-xl rounded-2xl border border-neutral-800/50 shadow-2xl p-5 md:p-6">
          {/* Header - More compact */}
          <div className="text-center mb-4">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              Join us on your learning journey
            </p>
          </div>

          <Link href="/OrganizationSignup">
            <button className="w-full py-2.5 px-4 mb-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/25">
              Continue as Organization
            </button>
          </Link>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name Fields - More compact */}
            <div className="grid grid-cols-2 gap-3">
              <LabelInputContainer className="space-y-1.5">
                <Label htmlFor="firstname" className="text-neutral-300 text-sm">First Name</Label>
                <Input
                  id="firstname"
                  placeholder="John"
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-800/50 border border-neutral-700/50 focus:border-purple-500/50 rounded-lg text-neutral-200 placeholder-neutral-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-sm"
                />
              </LabelInputContainer>

              <LabelInputContainer className="space-y-1.5">
                <Label htmlFor="lastname" className="text-neutral-300 text-sm">Last Name</Label>
                <Input
                  id="lastname"
                  placeholder="Doe"
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-800/50 border border-neutral-700/50 focus:border-purple-500/50 rounded-lg text-neutral-200 placeholder-neutral-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-sm"
                />
              </LabelInputContainer>
            </div>

            {/* Email and Password Fields - More compact */}
            <LabelInputContainer className="space-y-1.5">
              <Label htmlFor="email" className="text-neutral-300 text-sm">Email Address</Label>
              <Input
                id="email"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800/50 border border-neutral-700/50 focus:border-purple-500/50 rounded-lg text-neutral-200 placeholder-neutral-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-sm"
              />
            </LabelInputContainer>

            <div className="grid grid-cols-2 gap-3">
              <LabelInputContainer className="space-y-1.5">
                <Label htmlFor="password" className="text-neutral-300 text-sm">Password</Label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-800/50 border border-neutral-700/50 focus:border-purple-500/50 rounded-lg text-neutral-200 placeholder-neutral-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-sm"
                />
              </LabelInputContainer>

              <LabelInputContainer className="space-y-1.5">
                <Label htmlFor="confirm_password" className="text-neutral-300 text-sm">Confirm</Label>
                <Input
                  id="confirm_password"
                  placeholder="••••••••"
                  type="password"
                  value={confirm_password}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-800/50 border border-neutral-700/50 focus:border-purple-500/50 rounded-lg text-neutral-200 placeholder-neutral-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-sm"
                />
              </LabelInputContainer>
            </div>

            {/* Submit Button and Login Link - More compact */}
            <div className="space-y-3">
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-600/25"
              >
                Create Account
                <BottomGradient />
              </button>

              <div className="text-center text-sm">
                <p className="text-neutral-500">Already have an account?{' '}
                  <Link href="/Login">
                    <span className="text-purple-400 hover:text-purple-300 transition-colors">
                      Sign In
                    </span>
                  </Link>
                </p>
              </div>
            </div>

            {/* Social Buttons - More compact */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={loginWithGoogle}
                type="button"
                className="px-3 py-2 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg transition-all duration-200 group"
              >
                <div className="flex items-center justify-center space-x-2">
                  <IconBrandGoogle className="w-4 h-4 text-neutral-300 group-hover:text-white transition-colors" />
                  <span className="text-neutral-300 group-hover:text-white transition-colors text-sm">Google</span>
                </div>
                <BottomGradient />
              </button>

              <button
                onClick={loginWithGithub}
                type="button"
                className="px-3 py-2 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg transition-all duration-200 group"
              >
                <div className="flex items-center justify-center space-x-2">
                  <IconBrandGithub className="w-4 h-4 text-neutral-300 group-hover:text-white transition-colors" />
                  <span className="text-neutral-300 group-hover:text-white transition-colors text-sm">GitHub</span>
                </div>
                <BottomGradient />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const BottomGradient = () => (
  <>
    <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
  </>
);

const LabelInputContainer = ({ children, className }) => (
  <div className={`flex flex-col space-y-2 w-full ${className}`}>
    {children}
  </div>
);

export default SignUp;
