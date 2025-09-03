import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
// You'll need to download a suitable Lottie animation file
// and place it in your assets folder
import personAnimation from "../assets/login.json";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setOk(null); setLoading(true);
    try {
      await register(email, password, fullName);
      setOk("Registered! If email confirmation is required, check your inbox. You can sign in now.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (e: any) {
      setErr(e?.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if ((step === 1 && fullName) || (step === 2 && email)) {
      setStep(step + 1);
    }
  };

  const previousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Left column - Animation */}
        <div className="hidden w-1/2 bg-blue-500 p-8 lg:block">
          <div className="flex h-full flex-col items-center justify-center text-center">
            <h2 className="mb-6 text-3xl font-bold text-white">Register now</h2>
            <p className="mb-8 text-lg text-white/80">Set up your free account to explore our services</p>
            
            <div className="h-64 w-64">
              <Lottie 
                animationData={personAnimation} 
                loop={true} 
                className="h-full w-full"
              />
            </div>
            
            <div className="mt-8 flex w-full justify-between">
              <div 
                className={`h-2 w-1/3 rounded-full ${step === 1 ? 'bg-white' : 'bg-white/40'}`}
              />
              <div 
                className={`h-2 w-1/3 rounded-full ${step === 2 ? 'bg-white' : 'bg-white/40'}`}
              />
              <div 
                className={`h-2 w-1/3 rounded-full ${step === 3 ? 'bg-white' : 'bg-white/40'}`}
              />
            </div>
          </div>
        </div>
        
        {/* Right column - Form */}
        <div className="w-full p-8 lg:w-1/2">
          <div className="flex h-full flex-col justify-between">
            <div>
              {step === 1 && (
                <motion.div 
                  key="step1"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-gray-800">What's your name?</h2>
                  <p className="text-gray-600">Let's start with your name so we can personalize your experience</p>
                  
                  <Input 
                    label="Full name" 
                    value={fullName} 
                    onChange={e=>setFullName(e.target.value)}
                    autoFocus 
                    placeholder="John Doe"
                  />
                  
                  <Button 
                    onClick={nextStep} 
                    disabled={!fullName}
                    className="w-full"
                  >
                    Continue
                  </Button>
                </motion.div>
              )}
              
              {step === 2 && (
                <motion.div 
                  key="step2"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-gray-800">What's your email?</h2>
                  <p className="text-gray-600">We'll use this for login and important notifications</p>
                  
                  <Input 
                    label="Email" 
                    type="email" 
                    value={email} 
                    onChange={e=>setEmail(e.target.value)} 
                    required
                    autoFocus
                    placeholder="your@email.com"
                  />
                  
                  <div className="flex space-x-3">
                    <Button 
                      onClick={previousStep}
                      variant="outline" 
                      className="w-1/3"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={nextStep} 
                      disabled={!email}
                      className="w-2/3"
                    >
                      Continue
                    </Button>
                  </div>
                </motion.div>
              )}
              
              {step === 3 && (
                <motion.div 
                  key="step3"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-gray-800">Create a password</h2>
                  <p className="text-gray-600">Almost there! Set a secure password to protect your account</p>
                  
                  <form onSubmit={submit} className="space-y-6">
                    <Input 
                      label="Password" 
                      type="password" 
                      value={password} 
                      onChange={e=>setPassword(e.target.value)} 
                      required
                      autoFocus
                      placeholder="••••••••••••"
                    />
                    
                    {err && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{err}</div>}
                    {ok && <div className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{ok}</div>}
                    
                    <div className="flex space-x-3">
                      <Button 
                        type="button"
                        onClick={previousStep}
                        variant="outline" 
                        className="w-1/3"
                      >
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={loading || !password}
                        className="w-2/3"
                      >
                        {loading ? "Creating..." : "Complete Registration"}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
            </div>
            
            <p className="mt-8 text-center text-sm text-gray-600">
              Already have an account? <Link to="/login" className="font-medium text-blue-600 hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}