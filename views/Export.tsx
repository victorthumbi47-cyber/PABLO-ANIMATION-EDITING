
import React from 'react';

interface ExportProps {
  onPay: () => void;
  isAdmin?: boolean;
}

const Export: React.FC<ExportProps> = ({ onPay, isAdmin }) => {
  return (
    <div className="flex-1 flex flex-col h-screen">
      <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between bg-[#141118]">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-3xl">animation</span>
          <span className="text-lg font-bold">Animify Studio {isAdmin && <span className="text-amber-500 text-xs ml-2 uppercase tracking-widest font-black">Admin</span>}</span>
        </div>
        {!isAdmin && <button className="px-6 py-2 rounded-lg bg-primary hover:bg-[#7a25d0] text-sm font-bold shadow-lg shadow-primary/20">Upgrade to Pro</button>}
      </header>

      <main className="flex-1 flex items-center justify-center p-8 bg-[#1a1022]">
        <div className="w-full max-w-6xl grid lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h1 className="text-4xl font-black tracking-tight">Ready to Share?</h1>
            <p className="text-gray-400">Your video has been successfully converted to animation.</p>
            
            <div className="aspect-video rounded-3xl bg-black overflow-hidden shadow-2xl border border-white/5 relative group">
              <img src="https://picsum.photos/1200/800?random=42" alt="Final" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                <button className="size-20 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-4xl filled-icon">play_arrow</span>
                </button>
              </div>
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">{isAdmin ? 'ADMIN PREVIEW' : 'PRO PREVIEW'}</span>
                <span className="text-xs text-gray-300">{isAdmin ? 'Watermark will be removed automatically' : 'Watermark will be removed after payment'}</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {['Duration: 00:34', 'Resolution: 1080p', 'FPS: 60', 'Size: 24MB'].map(stat => (
                <div key={stat} className="p-3 bg-white/5 rounded-xl border border-white/5 text-center text-[10px] font-bold text-gray-400">{stat}</div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-[#2a1a33] p-8 rounded-3xl border border-white/5 shadow-xl flex flex-col gap-8">
               <div className="space-y-4">
                 <h3 className="text-lg font-bold">Export Settings</h3>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">File Name</label>
                    <div className="flex bg-black/20 border border-white/10 rounded-xl px-4 py-3 items-center justify-between">
                      <span className="text-sm font-medium">Cyberpunk_Animation_Final_01</span>
                      <span className="material-symbols-outlined text-gray-500 text-sm">edit</span>
                    </div>
                 </div>
               </div>

               <div className="space-y-4">
                 <h4 className="text-xs font-bold text-gray-500 uppercase">Format</h4>
                 <div className="grid grid-cols-3 gap-2">
                   <button className="py-3 rounded-xl bg-primary text-white font-bold text-xs border-2 border-primary">MP4 (HQ)</button>
                   <button className="py-3 rounded-xl bg-black/20 text-gray-400 font-bold text-xs border border-white/10 hover:border-white/20 transition-all">GIF</button>
                   <button className="py-3 rounded-xl bg-black/20 text-gray-400 font-bold text-xs border border-white/10 hover:border-white/20 transition-all">MOV</button>
                 </div>
               </div>

               <div className={`p-5 rounded-2xl border relative overflow-hidden group ${isAdmin ? 'bg-gradient-to-br from-amber-600/20 to-black/20 border-amber-500/30' : 'bg-gradient-to-br from-primary/20 to-[#2a1a33] border-primary/30'}`}>
                  <div className="relative z-10">
                    <h4 className="font-bold flex items-center gap-2 mb-2">
                      <span className={`material-symbols-outlined text-xl ${isAdmin ? 'text-amber-500' : 'text-primary'}`}>{isAdmin ? 'admin_panel_settings' : 'workspace_premium'}</span>
                      {isAdmin ? 'Owner Bypass Active' : 'Remove Watermarks'}
                    </h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed mb-4">
                      {isAdmin 
                        ? 'Admin privileges enabled. You can download this asset without payment.' 
                        : 'Includes high-quality 4K export, zero branding, and commercial usage rights.'}
                    </p>
                    <button onClick={onPay} className={`w-full py-3 rounded-xl font-black text-sm transition-all shadow-lg active:scale-95 ${isAdmin ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-white text-black hover:bg-gray-100'}`}>
                      {isAdmin ? 'Download as Admin' : 'Pay & Download Now'}
                    </button>
                  </div>
               </div>

               <div className="flex items-center gap-3 text-[10px] text-gray-500 justify-center">
                 <span className="material-symbols-outlined text-[14px]">lock</span>
                 {isAdmin ? 'Admin encrypted session' : 'Secure payment powered by M-PESA & Stripe'}
               </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <p className="text-xs text-gray-500 text-center font-bold uppercase tracking-widest">Share Directly</p>
              <div className="grid grid-cols-4 gap-3">
                {['tiktok', 'instagram', 'youtube', 'share'].map(icon => (
                  <button key={icon} className="size-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all">
                     <span className="material-symbols-outlined text-xl">{icon === 'share' ? 'ios_share' : 'smart_display'}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Export;
