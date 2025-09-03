import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";
import Lottie from "lottie-react";

import loginAnimation from "../assets/login.json";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (e: any) {
      setErr(e?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: { 
        delay: custom * 0.1,
        duration: 0.5
      }
    })
  };

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Left column - Form */}
        <div className="w-full p-8 lg:w-1/2">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={formVariants}
            className="flex h-full flex-col justify-between"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Welcome back</h2>
              <p className="mt-2 text-gray-600">Sign in to access your account</p>
              
              <form onSubmit={submit} className="mt-8 space-y-6">
                <motion.div custom={1} variants={inputVariants}>
                  <Input 
                    label="Email" 
                    type="email" 
                    value={email} 
                    onChange={e=>setEmail(e.target.value)} 
                    required
                    autoFocus
                    placeholder="your@email.com"
                    className="focus:border-blue-500 focus:ring-blue-500"
                  />
                </motion.div>
                
                <motion.div custom={2} variants={inputVariants}>
                  <Input 
                    label="Password" 
                    type="password" 
                    value={password} 
                    onChange={e=>setPassword(e.target.value)} 
                    required
                    placeholder="••••••••••••"
                    className="focus:border-blue-500 focus:ring-blue-500"
                  />
                </motion.div>
                
                <motion.div custom={3} variants={inputVariants}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>
                    
                    <div className="text-sm">
                      <a href="#" className="font-medium text-blue-600 hover:underline">
                        Forgot your password?
                      </a>
                    </div>
                  </div>
                </motion.div>
                
                {err && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
                  >
                    {err}
                  </motion.div>
                )}
                
                <motion.div custom={4} variants={inputVariants}>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="mr-2 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </span>
                    ) : "Sign in"}
                  </Button>
                </motion.div>
              </form>
            </div>
            
            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-blue-600 hover:underline">
                Register
              </Link>
            </p>
          </motion.div>
        </div>
        
        {/* Right column - Animation */}
        <div className="hidden w-1/2 bg-blue-500 lg:block">
          <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <h3 className="mb-2 text-2xl font-bold text-white">Welcome to MiniBlog</h3>
            <p className="mb-8 text-white/80">Share your thoughts with the world</p>
            
            <div className="h-64 w-64">
              <Lottie 
                animationData={loginAnimation} 
                loop={true} 
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}