"use client"
import { useUserContext } from '@/app/context/Userinfo';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Lock } from "lucide-react";
import { useRouter } from 'next/navigation';
import React, { useState, FormEvent } from 'react';

function OTP() {
  const router = useRouter();
  const { 
    contextpassword, 
    contextsetPassword, 
    contextsetIsLoggedIn, 
    contextsetEmail, 
    contextsetName 
  } = useUserContext();
  const password = contextpassword;
  const { toast } = useToast();
  const { contextemail } = useUserContext();
  const email = contextemail;
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`http://0.0.0.0:8000/api/register`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      if (!response.ok) {
        throw new Error("OTP verification failed");
      }

      await Autologin();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to verify OTP',
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  const Getuserinfo = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch('http://0.0.0.0:8000/api/user', {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        contextsetIsLoggedIn(true);
        contextsetEmail(result.email);
        contextsetName(result.name);
        toast({
          title: "Successfully registered",
        });
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const Autologin = async () => {
    try {
      const response = await fetch(`http://0.0.0.0:8000/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const result = await response.json();
      localStorage.setItem('authToken', result.jwt);
      await Getuserinfo();
      contextsetPassword("");
      router.push("/");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-900 to-black p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <div className="absolute inset-0 -z-10 h-full w-full bg-white/5 backdrop-blur-2xl" />
        <div className="absolute -z-10 h-full w-full bg-gradient-to-b from-purple-500/20 via-transparent to-blue-500/20 blur-3xl" />

        <div className="bg-neutral-900/90 backdrop-blur-xl rounded-2xl border border-neutral-800/50 shadow-2xl p-6 md:p-8">
          <div className="text-center space-y-2 mb-6">
            <Mail className="w-12 h-12 mx-auto text-purple-400 mb-4" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              Verify Your Email
            </h1>
            <p className="text-neutral-400 text-sm">
              We've sent a verification code to {contextemail}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-neutral-800/50 p-4 rounded-xl backdrop-blur-sm">
              <InputOTP
                maxLength={4}
                value={otp}
                onChange={handleOtpChange}
                className="gap-2"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="bg-neutral-700/50 border-neutral-600 text-neutral-200" />
                  <InputOTPSlot index={1} className="bg-neutral-700/50 border-neutral-600 text-neutral-200" />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={2} className="bg-neutral-700/50 border-neutral-600 text-neutral-200" />
                  <InputOTPSlot index={3} className="bg-neutral-700/50 border-neutral-600 text-neutral-200" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative group"
              type="submit"
            >
              <div className="flex items-center justify-center">
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <Lock className="w-4 h-4 mr-2" />
                )}
                {isSubmitting ? "Verifying..." : "Verify Email"}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
              <BottomGradient />
            </motion.button>

            <p className="text-center text-sm text-neutral-500">
              Didn't receive the code?{" "}
              <button
                type="button"
                className="text-purple-400 hover:text-purple-300 transition-colors"
                onClick={() => {
                  toast({
                    title: "New code sent",
                    description: "Please check your email"
                  });
                }}
              >
                Resend
              </button>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

export default OTP;