"use client"
import { useUserContext } from '@/app/context/Userinfo';
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast"
import { useEffect } from 'react';

import { IconBrandGithub, IconBrandGoogle, IconBrandOnlyfans } from "@tabler/icons-react";
import Link from "next/link";

import { use, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


import { useRouter } from "next/navigation"
import { useSession, signIn } from 'next-auth/react';

function Login() {
  const { data: session } = useSession()

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const { contextsetIsLoggedIn, contextsetEmail, contextsetName, contextemail, contextname, } = useUserContext(); // Updated hook
  const [loggedin, setLoggedin] = useState()
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Update email context if it's empty


  const Getuserinfo = async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      toast({
        title: "No authentication token found",
      });
      // console.log("no token")
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
      // console.log(token)
      // Log the response status and status text
      // console.log('Response Status:', response.status, response.statusText);

      // Check if the response is not OK (status code 200-299)
      if (!response.ok) {
        // Log more detailed error information
        const errorText = await response.text();
        // console.error('Error Response:', errorText);

        // Handle specific HTTP error codes
        if (response.status === 401) {
          // console.error('Unauthorized: Check your token and permissions.');
        } else if (response.status === 404) {
          // console.error('Not Found: The requested resource does not exist.');
        } else {
          // console.error(`HTTP Error: ${response.statusText}`);
        }

        // Optionally, throw an error to be caught by the catch block
        throw new Error(`HTTP Error: ${response.statusText}`);
      }

      // Parse the JSON response if the request was successful
      // const result = await response.json();
      
      // console.log('User Info:', result);

      // Proceed with handling the successful response
      // ...






      // Update context with user information
      contextsetIsLoggedIn(true);
      contextsetEmail(result.email);
      contextsetName(result.name);
      // console.log("hello",result)
      toast({
        title: "You are Successfully Logged In",
      });

      // Redirect to the home page
      router.push("/");

    } catch (error) {
      toast({
        title: "There was an error",
        description: error.message,
      });
      // console.error("Error fetching user info:", error);
    }
  };




  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      // Log the response status and status text
      // console.log('Response Status:', response.status, response.statusText);

      if (!response.ok) {
        // Check for specific status codes and handle them accordingly
        if (response.status === 401) {
          toast({
            title: "Wrong Password",
          });
        } else {
          toast({
            title: "Failed to login",
            description: `Error ${response.status}: ${response.statusText}`,
          });
        }
        return;
      }

      const result = await response.json();
      // console.log('Login Successful:', result);

      // Store the JWT token in local storage
      localStorage.setItem('authToken', result.jwt);

      // Fetch user information
      await Getuserinfo();

    } catch (error) {
      toast({
        title: "An error occurred",
        description: error.message,
      });
      // console.error("Error submitting form:", error);
    }
  };

  async function loginWithGoogle() {
    setLoading(true);
    // console.log("hello")
    try {
      await signIn('google')
    } catch (error) {
      // display error message to user
      toast.error('Something went wrong with your login.')
    } finally {
      setLoading(false)
      OAuth();
    }

  }
  async function loginWithGithub() {
    setLoading(true);



    try {


      await signIn('github')
    } catch (error) {
      // display error message to user
      toast.error('Something went wrong with your login.')
    } finally {
      setLoading(false)
    }

  }
  useEffect(() => {
    // console.log("session", session)
    if (session) {
      contextsetIsLoggedIn(true)
      contextsetEmail(session.user.email);
      contextsetName(session.user.name);
      setName(session.user.name)
      setEmail(session.user.email)
    }
  }, [session]);
  // useEffect(() => {
  //   if(name !==""){
  //     OAuth();
  //   }
  // },[name,email])

  const OAuth = async () => {

    try {
      const response = await fetch('http://localhost:8000/api/oauth2/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, email }),
      });

      // Log the response status and status text
      // console.log('Response Status:', response, response.statusText);

      if (!response.ok) {
        // Check for specific status codes and handle them accordingly

        throw new Error('Failed to login');
      }

      const result = await response.json();
      // console.log('Login Successful:', result);

      // Store the JWT token in local storage
      localStorage.setItem('authToken', result.jwt);

      // Redirect to the home page and show a success message
      router.push('/');
      toast({
        title: "You are Successfully Logged In",
      });

      // Fetch user information
      await Getuserinfo();


    } catch (error) {
      toast({
        title: "There was an error",
        description: error.message,
      });
      // console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    // console.log("name", name)
    // console.log("email", email)
    if (session && name && email) {
      OAuth();

      // console.log("name", name)
    }
  }, [name, email, session])
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-900 to-black p-3 md:p-6">
      <div className="w-full max-w-md relative">
        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white/5 backdrop-blur-2xl" />
        <div className="absolute -z-10 h-full w-full bg-gradient-to-b from-purple-500/20 via-transparent to-blue-500/20 blur-3xl" />
        
        <div className="bg-neutral-900/90 backdrop-blur-xl rounded-2xl border border-neutral-800/50 shadow-2xl p-5 md:p-6">
          {/* Header - More compact */}
          <div className="text-center mb-4">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              Sign in to continue your learning journey
            </p>
          </div>

          {/* Organization Button - More compact */}
          <Link href="/OrganizationLogin">
            <button className="w-full py-2.5 px-4 mb-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/25">
              Continue as Organisation
            </button>
          </Link>

          {/* Login Form - Reduced spacing */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <LabelInputContainer className="space-y-1.5">
              <Label htmlFor="email" className="text-neutral-300 text-sm">Email Address</Label>
              <div className="relative">
                <Input 
                  id="email" 
                  placeholder="you@example.com" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-800/50 border border-neutral-700/50 focus:border-purple-500/50 rounded-lg text-neutral-200 placeholder-neutral-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-sm"
                />
              </div>
            </LabelInputContainer>

            <LabelInputContainer className="space-y-1.5">
              <Label htmlFor="password" className="text-neutral-300 text-sm">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  placeholder="••••••••" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-800/50 border border-neutral-700/50 focus:border-purple-500/50 rounded-lg text-neutral-200 placeholder-neutral-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-sm"
                />
              </div>
            </LabelInputContainer>

            {/* Action Buttons - More compact */}
            <div className="space-y-3">
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-600/25"
              >
                Sign In
                <BottomGradient />
              </button>

              <div className="flex justify-end">
                <Link href="/ForgotPassword">
                  <span className="text-xs text-neutral-400 hover:text-neutral-300 transition-colors">
                    Forgot Password?
                  </span>
                </Link>
              </div>
            </div>

            {/* Signup Link - More compact */}
            <div className="text-center text-sm">
              <p className="text-neutral-500">Don't have an account?{' '}
                <Link href='/Signup'>
                  <span className="text-purple-400 hover:text-purple-300 transition-colors">
                    Create Account
                  </span>
                </Link>
              </p>
            </div>

            {/* Divider - More compact */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-800"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-neutral-900 text-neutral-500">Or continue with</span>
              </div>
            </div>

            {/* Social Logins - More compact */}
            <div className="grid grid-cols-2 gap-3">
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

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
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
export default Login;