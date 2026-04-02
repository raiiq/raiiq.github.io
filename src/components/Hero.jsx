import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import ShowreelModal from './ShowreelModal';
import { useData } from '../context/DataContext';

const Hero = () => {
    const { settings } = useData();
    const [showreelOpen, setShowreelOpen] = useState(false);

    const scrollToWork = () => {
        const element = document.getElementById('work');
        if (element) {
            const offset = 80;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div id="hero" className="relative min-h-screen w-full overflow-hidden flex items-center justify-center pt-16 sm:pt-20 pb-8 sm:pb-0">
            {/* Background Atmosphere - Gallery Style Bloom Flare */}
            <div className="absolute inset-0 z-0">
                {/* Intense Red Bloom Flare */}
                <div className="absolute -bottom-[10%] -left-[10%] w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(255,59,48,0.08)_0%,transparent_70%)] blur-[30px] sm:blur-[120px]" />

                {/* Secondary White Ambient Bloom */}
                <div className="absolute -top-[10%] -right-[10%] w-[80%] h-[80%] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.01)_0%,transparent_60%)] blur-[30px] sm:blur-[100px]" />

                {/* Fixed Radial Center Atmosphere */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,59,48,0.01)_0%,transparent_70%)] opacity-30 sm:opacity-50" />
            </div>

            {/* Centered Content Slab */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2 }}
                style={{ willChange: 'opacity, transform' }}
                className="relative z-20 flex flex-col items-center text-center px-4 sm:px-6 max-w-6xl"
            >
                {/* Accent line - hidden on very small screens */}
                <div className="hidden sm:flex items-center gap-4 mb-6 sm:mb-8">
                    <div className="h-[2px] w-8 sm:w-12 bg-primary shadow-[0_0_15px_rgba(255,59,48,0.6)]" />
                    <span className="text-primary text-[9px] sm:text-xs font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] text-glow-red halation">
                        Cinematic Intelligence Analyst
                    </span>
                    <div className="h-[2px] w-8 sm:w-12 bg-primary shadow-[0_0_15px_rgba(255,59,48,0.6)]" />
                </div>

                {/* Mobile-only label */}
                <div className="flex sm:hidden items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                    <span className="text-primary text-[9px] font-black uppercase tracking-[0.3em] text-glow-red halation">
                        Cinematic Intelligence
                    </span>
                </div>

                <h1 className="text-[clamp(1.8rem,10vw,10rem)] sm:text-[clamp(2.5rem,12vw,10rem)] font-black text-white leading-[0.85] tracking-tighter uppercase text-glow-strong halation mb-6 sm:mb-10">
                    BARAA <br />
                    <span className="text-white/10 hover:text-white transition-colors duration-1000">BASIM.</span>
                </h1>

                <p className="text-[9px] sm:text-xs md:text-sm text-gray-400 mb-8 sm:mb-10 md:mb-14 max-w-2xl font-medium leading-relaxed uppercase tracking-[0.15em] sm:tracking-[0.3em] md:tracking-[0.4em] opacity-60 px-2 sm:px-4">
                    {settings?.professional_title || "18-Year-Old Filmmaker / AI Prompt Engineer / Creative Director"} <br />
                    {settings?.hero_bio || "Iraq-Based Visionary crafting cutting-edge cinematic sequences."}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 w-full sm:w-auto px-2 sm:px-0 mt-4 sm:mt-0">
                    <motion.button
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowreelOpen(true)}
                        className="w-full sm:w-auto px-6 sm:px-12 py-4 sm:py-6 bg-white text-black font-black rounded-xl sm:rounded-2xl transition-all shadow-2xl hover:shadow-primary/40 uppercase tracking-widest text-[9px] sm:text-xs flex items-center justify-center gap-3 border border-white touch-target"
                    >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Initialize showreel</span>
                    </motion.button>

                    <button
                        onClick={() => {
                            const el = document.getElementById('resume');
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className="w-full sm:w-auto px-6 sm:px-12 py-4 sm:py-6 bg-white/[0.05] border border-white/10 hover:border-white/20 text-white font-black rounded-xl sm:rounded-2xl transition-all backdrop-blur-md uppercase tracking-widest text-[9px] sm:text-xs flex items-center justify-center touch-target"
                    >
                        Access Dossier
                    </button>

                    <button
                        onClick={scrollToWork}
                        className="w-full sm:w-auto px-6 sm:px-12 py-4 sm:py-6 bg-black border border-white/5 hover:border-white/10 text-gray-500 font-black rounded-xl sm:rounded-2xl transition-all uppercase tracking-widest text-[9px] sm:text-xs flex items-center justify-center touch-target"
                    >
                        Operational Archive
                    </button>
                </div>
            </motion.div>



            {/* Showreel Modal */}
            <ShowreelModal
                isOpen={showreelOpen}
                onClose={() => setShowreelOpen(false)}
                videoUrl={settings.hero_video}
            />
        </div>
    );
};

export default Hero;
