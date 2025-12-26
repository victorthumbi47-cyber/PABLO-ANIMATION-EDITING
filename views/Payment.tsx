
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface PaymentProps {
  onComplete: () => void;
}

const Payment: React.FC<PaymentProps> = ({ onComplete }) => {
  const [selectedPlan, setSelectedPlan] = useState('daily');
  const [transactionCode, setTransactionCode] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
        setVerificationError(null);
        setVerificationSuccess(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const verifyWithAI = async () => {
    if (!screenshot || !transactionCode) return;

    setIsVerifying(true);
    setVerificationError(null);
    setVerificationSuccess(false);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Extract base64 data (remove prefix)
      const base64Data = screenshot.split(',')[1];

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Data,
              },
            },
            {
              text: `You are a professional payment auditor. Look at this M-PESA confirmation message or screenshot. 
              1. Extract the unique 10-character transaction code (e.g., QKH1234567).
              2. Verify if it matches the code provided by the user: "${transactionCode}".
              3. Check if the amount matches the selected plan: "${selectedPlan}".
              
              Respond strictly in JSON format.`,
            },
          ],
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              match: { type: Type.BOOLEAN, description: "True if the code in image matches the provided code" },
              extractedCode: { type: Type.STRING, description: "The code found in the image" },
              reason: { type: Type.STRING, description: "Explanation if there is a mismatch" },
              verifiedAmount: { type: Type.STRING, description: "The amount found in the image" }
            },
            required: ["match", "extractedCode"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');

      if (result.match) {
        setVerificationSuccess(true);
        setTimeout(() => {
          onComplete();
        }, 1500);
      } else {
        setVerificationError(result.reason || `The code in the image (${result.extractedCode}) does not match what you entered.`);
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setVerificationError("Verification system unavailable. Please ensure your internet is stable and the image is clear.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-dark overflow-x-hidden">
      <header className="h-16 border-b border-white/5 px-10 flex items-center justify-between bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-primary text-3xl">animation</span>
          <span className="text-lg font-bold">Animify Studio</span>
        </div>
        <button className="h-9 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-bold transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">help</span>
          Support
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 bg-[#251b30] border border-white/5 rounded-3xl shadow-2xl overflow-hidden">
          {/* Instructions Column */}
          <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col gap-10 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <span className="material-symbols-outlined text-[300px] leading-none">payments</span>
            </div>
            
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                Instant Verification
              </div>
              <h1 className="text-4xl font-black leading-tight mb-4">Finalize Your Payment</h1>
              <p className="text-gray-400 text-lg leading-relaxed">Pay via M-PESA and upload your confirmation for instant AI-powered account activation.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 mt-4">
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-3">
                  1. Payment Details
                  <span className="h-px flex-1 bg-white/10"></span>
                </h3>
                <div className="bg-black/20 p-6 rounded-2xl border border-white/5 space-y-4">
                   <div className="flex justify-between items-center">
                     <span className="text-xs text-gray-500 font-bold uppercase">Paybill</span>
                     <span className="text-primary font-mono font-black text-lg">714777</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-xs text-gray-500 font-bold uppercase">Account</span>
                     <span className="text-white font-mono font-bold">0117652390</span>
                   </div>
                   <div className="pt-2 border-t border-white/5">
                      <p className="text-[10px] text-gray-500 leading-tight">Pay the exact amount for your chosen plan to ensure fast verification.</p>
                   </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-3">
                  2. AI Confirmation
                  <span className="h-px flex-1 bg-white/10"></span>
                </h3>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all overflow-hidden relative group ${screenshot ? 'border-primary' : 'border-white/10 hover:border-primary/50 hover:bg-white/5'}`}
                >
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                   {screenshot ? (
                     <>
                        <img src={screenshot} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" />
                        <div className="relative z-10 flex flex-col items-center gap-2">
                           <span className="material-symbols-outlined text-primary text-3xl filled-icon">check_circle</span>
                           <span className="text-[10px] font-black uppercase text-white tracking-widest bg-black/60 px-2 py-1 rounded">Change Screenshot</span>
                        </div>
                     </>
                   ) : (
                     <>
                        <div className="size-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-primary transition-colors">
                          <span className="material-symbols-outlined">add_a_photo</span>
                        </div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-center px-4">Upload M-PESA Screenshot</span>
                     </>
                   )}
                </div>
              </div>
            </div>
            
            <div className="bg-primary/5 border border-primary/20 p-6 rounded-3xl flex items-start gap-4">
               <span className="material-symbols-outlined text-primary">psychology</span>
               <div className="space-y-1">
                 <h4 className="text-xs font-bold text-primary uppercase tracking-widest">Smart Audit Active</h4>
                 <p className="text-[10px] text-gray-400 leading-relaxed font-medium">Gemini 3 Flash will analyze your screenshot in real-time to confirm the transaction. This process is secure and encrypted.</p>
               </div>
            </div>
          </div>

          {/* Verification Column */}
          <div className="lg:col-span-5 bg-black/20 p-8 lg:p-10 flex flex-col justify-center gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary filled-icon">diamond</span>
                <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Selected Plan</span>
              </div>
              
              <div className="space-y-3">
                {[
                  { id: 'daily', name: 'Daily Access', price: 'KES 499' },
                  { id: 'weekly', name: 'Weekly Access', price: 'KES 2,999', tag: 'SAVE 14%' },
                  { id: 'monthly', name: 'Monthly Access', price: 'KES 10,199', tag: 'BEST VALUE' }
                ].map(plan => (
                  <label key={plan.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group ${selectedPlan === plan.id ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' : 'border-white/5 bg-black/20 hover:border-white/20'}`}>
                    <input type="radio" name="plan" className="sr-only" checked={selectedPlan === plan.id} onChange={() => setSelectedPlan(plan.id)} />
                    <div className="flex items-center gap-4">
                      <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedPlan === plan.id ? 'border-primary' : 'border-gray-600'}`}>
                        {selectedPlan === plan.id && <div className="size-2.5 rounded-full bg-primary animate-scale-in"></div>}
                      </div>
                      <span className={`font-bold transition-colors ${selectedPlan === plan.id ? 'text-primary' : 'text-gray-400'}`}>{plan.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-sm">{plan.price}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Transaction Code</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">receipt_long</span>
                    <input 
                      type="text" 
                      value={transactionCode}
                      onChange={(e) => setTransactionCode(e.target.value.toUpperCase())}
                      placeholder="e.g. QKH1234567" 
                      className="w-full bg-black/40 border border-white/10 rounded-2xl h-14 pl-12 pr-4 text-white font-mono text-lg uppercase focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-gray-700" 
                    />
                  </div>
               </div>

               {verificationError && (
                 <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest flex items-start gap-3 animate-in shake duration-300">
                    <span className="material-symbols-outlined text-sm">error</span>
                    <p className="flex-1">{verificationError}</p>
                 </div>
               )}

               {verificationSuccess && (
                 <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-widest flex items-start gap-3 animate-in fade-in duration-300">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    <p className="flex-1">Verification Successful! Activating Premium...</p>
                 </div>
               )}

               <button 
                  onClick={verifyWithAI} 
                  disabled={transactionCode.length < 5 || !screenshot || isVerifying || verificationSuccess} 
                  className="w-full h-14 rounded-2xl bg-primary hover:bg-[#7a25d0] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 relative overflow-hidden"
               >
                 {isVerifying ? (
                   <>
                      <div className="size-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      AI Analyzing Screenshot...
                   </>
                 ) : (
                   <>
                      {verificationSuccess ? 'Authorized' : 'Verify & Activate'}
                      <span className="material-symbols-outlined">verified</span>
                   </>
                 )}
               </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 font-medium">
              <span className="material-symbols-outlined text-green-500 text-sm">lock</span>
              Secure 256-bit Encrypted Verification
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-center text-sm text-gray-500">Problems with verification? <a href="#" className="text-primary hover:underline">Chat with Support</a></p>
      </main>

      <footer className="p-10 border-t border-white/5 text-center text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] bg-black/20">
        Pablo Actor 254 Secure Payment Gateway
      </footer>
    </div>
  );
};

export default Payment;
