"use client";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useUserContext } from '@/app/context/Userinfo';
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { motion } from "framer-motion";
import { Mail, Lock, KeyRound, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";

const loadingStates = [
  { text: "Retrieving Account Details" },
  { text: "Verifying Your Identity" },
  { text: "Generating Secure Password Link" },
  { text: "Preparing Your New Credentials" },
  { text: "Logging You In Securely" },
];

function ForgotPassword() {
  const { contextsetIsLoggedIn, contextsetEmail, contextsetName } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [new_password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const [confirm_password, setconfirm_password] = useState("");
  const [otp, setotp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new_password !== confirm_password) {
      toast({
        title: "Passwords don't match",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `http://0.0.0.0:8000/api/password-reset/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            new_password,
            confirm_password
          }),
        }
      );
     
      if (!response.ok) {
        throw new Error("Password reset failed");
      }

      setPass(new_password);
      await Autologin();
    } catch (error) {
      toast({
        title: "Password reset failed",
        description: error.message,
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const sendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Please enter your email",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(
        `http://0.0.0.0:8000/api/password-reset-request/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error("No such email exists");
      }

      setIsOtpSent(true);
      toast({
        title: "OTP sent successfully",
        description: "Please check your email"
      });
    } catch (error) {
      toast({
        title: "Failed to send OTP",
        description: error.message,
        variant: "destructive"
      });
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
          password: pass,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const result = await response.json();
      localStorage.setItem('authToken', result.jwt);
      await getUserInfo();
      setPass('');
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const getUserInfo = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch(`http://0.0.0.0:8000/api/user`, {
        method: 'GET',
        headers: {
          "Authorization": token,
          'Content-Type': "application/json",
        },
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        contextsetIsLoggedIn(true);
        contextsetEmail(result.email);
        contextsetName(result.name);
        toast({
          title: "Password reset successful",
          description: `Welcome back, ${result.name}!`,
        });
        setLoading(false);
        router.push('/');
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-900 to-black p-4">
      {loading ? (
        <div className="w-full h-[60vh] flex items-center justify-center">
          <Loader loadingStates={loadingStates} loading={loading} duration={1000} />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative"
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 -z-10 h-full w-full bg-white/5 backdrop-blur-2xl" />
          <div className="absolute -z-10 h-full w-full bg-gradient-to-b from-purple-500/20 via-transparent to-blue-500/20 blur-3xl" />

          <div className="bg-neutral-900/90 backdrop-blur-xl rounded-2xl border border-neutral-800/50 shadow-2xl p-6 md:p-8">
            <div className="text-center space-y-2 mb-6">
              <KeyRound className="w-12 h-12 mx-auto text-purple-400 mb-4" />
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                Reset Password
              </h1>
              <p className="text-neutral-400 text-sm">
                Enter your email to receive a verification code
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <LabelInputContainer>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                  <Input
                    id="email"
                    placeholder="you@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-neutral-800/50 border-neutral-700/50 text-neutral-200 placeholder-neutral-500"
                    disabled={isOtpSent}
                  />
                </div>
              </LabelInputContainer>

              {!isOtpSent ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={sendOTP}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl text-sm font-medium transition-all duration-300 group"
                >
                  <div className="flex items-center justify-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Send OTP
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <BottomGradient />
                </motion.button>
              ) : (
                <>
                  <LabelInputContainer>
                    <Label htmlFor="otp">Verification Code</Label>
                    <div className="bg-neutral-800/50 p-4 rounded-xl backdrop-blur-sm">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => setotp(value)}
                        className="gap-2"
                      >
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={0}
                            className="bg-neutral-700/50 border-neutral-600 text-neutral-200"
                          />
                          <InputOTPSlot
                            index={1}
                            className="bg-neutral-700/50 border-neutral-600 text-neutral-200"
                          />
                          <InputOTPSlot
                            index={2}
                            className="bg-neutral-700/50 border-neutral-600 text-neutral-200"
                          />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={3}
                            className="bg-neutral-700/50 border-neutral-600 text-neutral-200"
                          />
                          <InputOTPSlot
                            index={4}
                            className="bg-neutral-700/50 border-neutral-600 text-neutral-200"
                          />
                          <InputOTPSlot
                            index={5}
                            className="bg-neutral-700/50 border-neutral-600 text-neutral-200"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </LabelInputContainer>

                  <LabelInputContainer>
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                      <Input
                        id="password"
                        placeholder="••••••••"
                        type="password"
                        value={new_password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-neutral-800/50 border-neutral-700/50 text-neutral-200 placeholder-neutral-500"
                      />
                    </div>
                  </LabelInputContainer>

                  <LabelInputContainer>
                    <Label htmlFor="confirm_password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                      <Input
                        id="confirm_password"
                        placeholder="••••••••"
                        type="password"
                        value={confirm_password}
                        onChange={(e) => setconfirm_password(e.target.value)}
                        className="pl-10 bg-neutral-800/50 border-neutral-700/50 text-neutral-200 placeholder-neutral-500"
                      />
                    </div>
                  </LabelInputContainer>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl text-sm font-medium transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-center">
                      <KeyRound className="w-4 h-4 mr-2" />
                      Reset Password
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <BottomGradient />
                  </motion.button>
                </>
              )}
            </form>
          </div>
        </motion.div>
      )}
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

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default ForgotPassword;
