
import React from 'react';

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="relative flex flex-col">
      <header className="fixed top-0 w-full z-50 bg-background-dark/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">animation</span>
            <span className="text-xl font-bold tracking-tight">PABLO <span className="text-primary">ACTOR 254</span></span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onStart} className="text-sm font-medium text-gray-400 hover:text-white transition-colors hidden sm:block">Log In</button>
            <button onClick={onStart} className="bg-primary hover:bg-[#7a25d0] px-6 py-2 rounded-lg font-bold text-sm transition-all shadow-lg shadow-primary/20">
              Launch App
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center lg:text-left flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
            v2.0 AI Video Transformation
          </div>
          <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight">
            Turn Reality into <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Animation.</span>
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
            The ultimate tool for 4K video-to-cartoon conversion. No watermarks, high-speed rendering, and professional styles.
          </p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <button onClick={onStart} className="h-14 px-8 rounded-2xl bg-primary hover:bg-[#7a25d0] font-bold shadow-lg shadow-primary/30 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined">rocket_launch</span>
              Try for Free
            </button>
            <button onClick={onStart} className="h-14 px-8 rounded-2xl bg-white/5 border border-yellow-500/30 hover:bg-yellow-500/10 font-bold transition-all flex items-center gap-2 group">
              <span className="material-symbols-outlined text-yellow-500 filled-icon group-hover:animate-pulse">diamond</span>
              Go Premium
            </button>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-500 justify-center lg:justify-start">
             <div className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">verified</span> Verified Quality</div>
             <div className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">bolt</span> Ultra Fast Render</div>
             <div className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">block</span> No Watermarks</div>
          </div>
        </div>

        <div className="flex-1 w-full max-w-[600px] relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-[#211c27] shadow-2xl">
            <img src="https://picsum.photos/1200/800?blur=2" alt="Preview" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <span className="material-symbols-outlined text-white text-5xl ml-1 filled-icon">play_arrow</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step by Step Guide */}
      <section className="py-24 px-6 bg-black/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-4">How it Works</h2>
            <p className="text-gray-400">Transform your videos in 4 simple steps.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Sign Up', desc: 'Create your account and owner will be notified instantly.', icon: 'person_add', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400&h=300' },
              { step: '02', title: 'Upload & Edit', desc: 'Drag your 4K footage and choose from 20+ art styles.', icon: 'upload_file', img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400&h=300' },
              { step: '03', title: 'AI Rendering', desc: 'Our neural engines process your video at lightning speed.', icon: 'memory', img: 'https://images.unsplash.com/photo-1633412802994-5c058f151b66?auto=format&fit=crop&q=80&w=400&h=300' },
              { step: '04', title: 'Pay & Export', desc: 'Secure payment via M-PESA to remove watermarks.', icon: 'payments', img: 'https://images.unsplash.com/photo-1556742049-02e53695219e?auto=format&fit=crop&q=80&w=400&h=300' }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col gap-6 group">
                <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 relative">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                  <div className="absolute top-4 left-4 size-10 rounded-full bg-primary/20 backdrop-blur-md border border-primary/50 flex items-center justify-center font-black text-primary">
                    {item.step}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-primary">{item.icon}</span>
                    <h3 className="text-lg font-bold">{item.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 bg-[#1a1423]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-black">Choose Your Plan</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Flexible options for creators of all levels. Unlock the full power of AI animation.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Daily */}
            <div className="p-8 rounded-3xl bg-background-dark border border-white/5 flex flex-col hover:border-white/20 transition-all">
              <h3 className="text-xl font-bold mb-2">Daily Pass</h3>
              <p className="text-gray-500 text-sm mb-6">Perfect for single projects</p>
              <div className="mb-8">
                <span className="text-4xl font-black">KES 499</span>
                <span className="text-gray-500 text-sm"> / day</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-gray-300"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Unlimited 4K Exports</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> 24h Premium Access</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> All Pro Styles</li>
              </ul>
              <button onClick={onStart} className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold transition-all">Select Daily</button>
            </div>

            {/* Weekly - Popular */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#2a1a3a] to-background-dark border-2 border-primary flex flex-col relative shadow-2xl shadow-primary/10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-[10px] font-black uppercase tracking-widest">Most Popular</div>
              <h3 className="text-xl font-bold mb-2">Weekly Pro</h3>
              <p className="text-gray-400 text-sm mb-6">Best for active creators</p>
              <div className="mb-8">
                <span className="text-4xl font-black">KES 2,999</span>
                <span className="text-gray-500 text-sm"> / week</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-gray-200 font-medium"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Everything in Daily</li>
                <li className="flex items-center gap-3 text-sm text-gray-200 font-medium"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> 7 Days Access</li>
                <li className="flex items-center gap-3 text-sm text-gray-200 font-medium"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Priority Cloud Render</li>
                <li className="flex items-center gap-3 text-sm text-gray-200 font-medium"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Commercial Rights</li>
              </ul>
              <button onClick={onStart} className="w-full py-3 rounded-xl bg-primary hover:bg-[#7a25d0] font-bold shadow-lg shadow-primary/30 transition-all">Get Weekly Access</button>
            </div>

            {/* Monthly */}
            <div className="p-8 rounded-3xl bg-background-dark border border-white/5 flex flex-col hover:border-white/20 transition-all">
              <h3 className="text-xl font-bold mb-2">Monthly Studio</h3>
              <p className="text-gray-500 text-sm mb-6">For professional studios</p>
              <div className="mb-8">
                <span className="text-4xl font-black">KES 10,199</span>
                <span className="text-gray-500 text-sm"> / mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-gray-300"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Everything in Weekly</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> 30 Days Full Access</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> 24/7 VIP Support</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Team Collaboration</li>
              </ul>
              <button onClick={onStart} className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold transition-all">Select Monthly</button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-background-dark border border-white/5 hover:border-primary/50 transition-all">
            <span className="material-symbols-outlined text-primary text-4xl mb-4">4k</span>
            <h3 className="text-xl font-bold mb-2">4K Ultra HD</h3>
            <p className="text-gray-400 text-sm">Crystal clear high-definition output ready for the big screen.</p>
          </div>
          <div className="p-8 rounded-2xl bg-background-dark border border-white/5 hover:border-primary/50 transition-all">
            <span className="material-symbols-outlined text-primary text-4xl mb-4">palette</span>
            <h3 className="text-xl font-bold mb-2">AI Styles</h3>
            <p className="text-gray-400 text-sm">Choose from 20+ unique art styles from Anime to Sketch.</p>
          </div>
          <div className="p-8 rounded-2xl bg-background-dark border border-white/5 hover:border-primary/50 transition-all">
            <span className="material-symbols-outlined text-primary text-4xl mb-4">branding_watermark</span>
            <h3 className="text-xl font-bold mb-2">Zero Watermarks</h3>
            <p className="text-gray-400 text-sm">Your content is yours. Pure exports with no branding.</p>
          </div>
        </div>
      </section>

      <footer className="p-12 text-center text-xs text-gray-600 bg-black/20">
        <p className="mb-4 font-bold text-gray-400">PABLO ACTOR 254 FILM APPS</p>
        <div className="flex justify-center gap-4 mb-4">
          <button onClick={onStart} className="text-gray-500 hover:text-white transition-colors">Staff Portal</button>
          <span className="text-gray-800">|</span>
          <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
        </div>
        <p>© 2024 All rights reserved. Secure payments by M-PESA.</p>
      </footer>
    </div>
  );
};

export default Landing;
