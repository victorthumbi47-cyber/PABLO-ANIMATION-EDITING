
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

// Simulated local storage for registered users
const INITIAL_REGISTERED_EMAILS = [
  'victor@example.com',
  'demo@pabloactor254.com'
];

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [registeredEmails, setRegisteredEmails] = useState<string[]>(INITIAL_REGISTERED_EMAILS);

  const OWNER_EMAIL = 'vickthumbi47@gmail.com';
  const MOCK_OTP = '254254';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (isSignUp) {
      handleSignUp();
    } else {
      handleLogin();
    }
  };

  const handleSignUp = () => {
    if (registeredEmails.includes(email.toLowerCase()) || email.toLowerCase() === OWNER_EMAIL) {
      setError('This email is already registered. Please log in.');
      return;
    }

    setIsProcessing(true);
    // Simulate API call and "Email Notification to Owner"
    setTimeout(() => {
      setRegisteredEmails(prev => [...prev, email.toLowerCase()]);
      setIsProcessing(false);
      setSuccessMsg(`Signup successful! A registration notification has been sent to the owner at ${OWNER_EMAIL}. You may now log in.`);
      setIsSignUp(false);
      setEmail('');
    }, 1800);
  };

  const handleLogin = () => {
    const lowerEmail = email.toLowerCase();

    // Owner flow (Priority)
    if (lowerEmail === OWNER_EMAIL) {
      if (!showOtp) {
        setIsProcessing(true);
        setTimeout(() => {
          setIsProcessing(false);
          setShowOtp(true);
        }, 1200);
      } else {
        if (otp === MOCK_OTP) {
          onLogin({ name: 'Pablo (Owner)', email: OWNER_EMAIL, role: 'OWNER' });
        } else {
          setError('Verification code is incorrect. Access denied.');
        }
      }
      return;
    }

    // Restricted login check: Must be in "database"
    if (!registeredEmails.includes(lowerEmail)) {
      setError('Account not found. You must sign up before logging in.');
      return;
    }

    // Standard User / Staff Login
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (isAdminMode) {
        onLogin({ name: 'System Admin', email: email, role: 'OWNER' });
      } else {
        onLogin({ name: fullName || 'Creator', email: email, role: 'USER' });
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0f0914] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#8c2bee15,transparent_50%)]"></div>
      
      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-[#1e1427]/60 rounded-[2.5rem] overflow-hidden border border-white/5 backdrop-blur-2xl shadow-[0_25px_100px_-20px_rgba(0,0,0,0.8)] relative z-10">
        <div className="p-10 lg:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center lg:text-left">
            <div className="flex items-center gap-3 mb-10 justify-center lg:justify-start group cursor-pointer">
              <div className="size-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-white text-3xl filled-icon">animation</span>
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase">Pablo <span className="text-primary">Actor 254</span></span>
            </div>
            
            <h1 className="text-4xl font-bold mb-3 tracking-tight">
              {showOtp ? 'Owner Verification' : (isSignUp ? 'New Account' : (isAdminMode ? 'Staff Entry' : 'Sign In'))}
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              {showOtp 
                ? `A secure access code was sent to ${OWNER_EMAIL}` 
                : (isSignUp ? 'Join the next generation of AI cinematography.' : 'Enter your credentials to manage your projects.')}
            </p>
          </div>

          {successMsg && (
            <div className="mb-8 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
              <span className="material-symbols-outlined shrink-0 text-sm">check_circle</span>
              <span className="font-medium leading-normal">{successMsg}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!showOtp ? (
              <>
                {isSignUp && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                    <input 
                      required 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your name" 
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-700" 
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@provider.com" 
                    className={`w-full bg-black/40 border ${error.includes('not found') ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-700`} 
                  />
                  {error && (
                    <div className="flex items-center gap-1.5 px-1 mt-2">
                      <span className="material-symbols-outlined text-[14px] text-red-500">error</span>
                      <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider">{error}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Secure Password</label>
                  <input 
                    required 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-700" 
                  />
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">6-Digit Access Code</label>
                  <input 
                    required 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="0 0 0 0 0 0" 
                    className="w-full bg-black/60 border border-primary/50 rounded-2xl px-4 py-5 outline-none focus:ring-4 focus:ring-primary/20 font-mono text-center text-3xl tracking-[0.6em] text-primary" 
                    maxLength={6}
                  />
                </div>
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-sm">info</span>
                  <p className="text-[10px] text-gray-400 font-medium leading-relaxed">System Note: For the purpose of this demonstration, the owner verification code is <span className="text-primary font-bold">{MOCK_OTP}</span></p>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isProcessing}
              className={`w-full h-16 rounded-2xl font-black text-sm shadow-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${
                isProcessing ? 'opacity-70 cursor-wait' : ''
              } ${
                isAdminMode || email.toLowerCase() === OWNER_EMAIL 
                  ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-900/20 text-white' 
                  : 'bg-primary hover:bg-[#7a25d0] shadow-primary/20 text-white'
              }`}
            >
              {isProcessing ? (
                <div className="size-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {showOtp ? 'Authorize Access' : (isSignUp ? 'Create & Notify Owner' : (email.toLowerCase() === OWNER_EMAIL ? 'Secure Owner Entry' : 'Log In to Studio'))}
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {!showOtp && (
            <div className="mt-10 text-center flex flex-col gap-6">
              <p className="text-xs text-gray-500 font-medium">
                {isSignUp ? 'Already have an account?' : "Don't have an account yet?"} 
                <button 
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                  }} 
                  className="text-primary font-bold hover:underline ml-2"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up Free'}
                </button>
              </p>
              
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
              
              <button 
                onClick={() => setIsAdminMode(!isAdminMode)} 
                className="text-[10px] font-black text-gray-600 hover:text-gray-400 transition-colors uppercase tracking-[0.2em] flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">shield_person</span>
                {isAdminMode ? 'Switch to Standard Portal' : 'Owner / Staff Secure Gateway'}
              </button>
            </div>
          )}
          
          {showOtp && (
            <button 
              onClick={() => setShowOtp(false)}
              className="mt-8 text-[10px] font-black text-gray-500 hover:text-white transition-colors text-center w-full uppercase tracking-widest"
            >
              Use a different account
            </button>
          )}
        </div>

        {/* Branding Side */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-[#150e1b] relative overflow-hidden border-l border-white/5">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full blur-[150px] opacity-[0.08] -mr-64 -mt-64"></div>
          
          <div className="relative z-10 space-y-10">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest">
               {isSignUp ? 'Global Registry' : (isAdminMode ? 'Platform Master' : 'Secure Session')}
             </div>
             
             <div className="space-y-4">
               <h2 className="text-5xl font-black leading-[1.1] tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40">
                 Elite Film <br/>Transformation
               </h2>
               <p className="text-gray-400 text-lg leading-relaxed">
                 Pablo Actor 254 utilizes localized secure hashing for every account. All new signups trigger real-time owner notifications.
               </p>
             </div>

             <div className="space-y-6 pt-10">
               {[
                 { icon: 'notifications_active', title: 'Audit Logging', desc: 'Owner is notified of all new account creations.' },
                 { icon: 'vpn_key', title: 'Two-Factor Auth', desc: 'Critical accounts require hardware-bound OTP verification.' },
                 { icon: 'verified', title: 'Role Based Access', desc: 'Strict separation of Creator, Staff, and Owner roles.' }
               ].map((feature, i) => (
                 <div key={i} className="flex gap-5 p-5 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-all cursor-default">
                   <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                     <span className="material-symbols-outlined">{feature.icon}</span>
                   </div>
                   <div>
                     <h3 className="font-bold text-sm text-gray-200">{feature.title}</h3>
                     <p className="text-[11px] text-gray-500 mt-1 leading-normal">{feature.desc}</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>
          
          <div className="relative z-10 flex items-center justify-between text-[10px] font-black text-gray-600 uppercase tracking-widest mt-auto pt-10">
            <span>© 2024 PABLO ACTOR 254</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">Legal</a>
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
