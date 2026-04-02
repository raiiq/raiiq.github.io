import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Youtube, ExternalLink, Maximize } from 'lucide-react';

const ProjectCard = ({ project, onClick }) => {
    const handleYoutubeClick = (e) => {
        e.stopPropagation();
        const youtubeUrl = project.video?.includes('youtube.com/embed/')
            ? project.video.replace('embed/', 'watch?v=')
            : project.video;
        window.open(youtubeUrl, '_blank');
    };

    const handleFullscreenClick = (e) => {
        e.stopPropagation();
        onClick(project, true);
    };

    return (
        <motion.div
            onClick={() => onClick(project)}
            className="group relative w-full aspect-[4/3] sm:aspect-video overflow-hidden rounded-[1.2rem] sm:rounded-[2rem] md:rounded-[2.5rem] cursor-pointer bg-black/40 border border-white/5 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={window.innerWidth > 640 ? { y: -8, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } : {}}
            whileTap={{ scale: 0.98 }}
            style={{ willChange: 'transform, opacity' }}
        >
            {/* Background Image with sophisticated hover */}
            <div className="absolute inset-0 z-0 w-full h-full">
                <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-all duration-1000 group-hover:scale-[1.03] grayscale-0 sm:grayscale-[0.3] group-hover:grayscale-0 brightness-[0.5] sm:brightness-[0.4] group-hover:brightness-[0.6] ease-out-expo"
                />
            </div>

            {/* Edge-lighting effect on hover - Perfect fit radius */}
            <div className="hidden sm:block absolute inset-0 opacity-0 group-hover:opacity-100 halation-border rounded-[1.5rem] md:rounded-[2.5rem] transition-all duration-700 z-10 pointer-events-none" />

            {/* Quick Actions Menu - Re-balanced for Tablet */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-2 sm:gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-500 transform translate-y-0 sm:translate-y-4 sm:group-hover:translate-y-0">
                <button
                    onClick={handleFullscreenClick}
                    className="flex items-center gap-2 p-3 sm:p-3.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl text-white hover:bg-primary hover:border-primary/50 transition-all duration-300 group/btn pointer-events-auto shadow-2xl touch-target"
                >
                    <Maximize size={16} className="sm:w-5 sm:h-5" />
                    <span className="hidden lg:block max-w-0 overflow-hidden group-hover/btn:max-w-[100px] transition-all duration-500 whitespace-nowrap text-[8px] sm:text-[9px] font-black uppercase tracking-widest">
                        Cinematic
                    </span>
                </button>

                <button
                    onClick={handleYoutubeClick}
                    className="flex items-center gap-2 p-3 sm:p-3.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl text-white hover:bg-[#FF0000] hover:border-[#FF0000]/50 transition-all duration-300 group/btn pointer-events-auto shadow-2xl touch-target"
                >
                    <Youtube size={16} className="sm:w-5 sm:h-5" />
                    <span className="hidden lg:block max-w-0 overflow-hidden group-hover/btn:max-w-[100px] transition-all duration-500 whitespace-nowrap text-[8px] sm:text-[9px] font-black uppercase tracking-widest">
                        YouTube
                    </span>
                </button>
            </div>

            {/* HUD Overlay Slab - Optimized for Zero-Overlap Stability */}
            <div className="absolute inset-0 z-20 p-4 sm:p-6 md:p-8 pointer-events-none overflow-hidden flex flex-col justify-between">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 sm:opacity-40 sm:group-hover:opacity-100 transition-opacity duration-700" />

                {/* Top Row: Mission Header & Category - Subtle down-motion */}
                <div className="relative z-30 flex justify-between items-start opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-500 transform translate-y-0 sm:-translate-y-2 sm:group-hover:translate-y-0">
                    <div className="flex flex-col gap-1 sm:gap-1.5">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(255,59,48,0.8)]" />
                            <span className="text-[7px] sm:text-[9px] font-mono font-black text-primary uppercase tracking-[0.3em] sm:tracking-[0.5em] text-glow-red halation">
                                MISSION // 00{project.id}
                            </span>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 px-2 py-0.5 sm:px-3 sm:py-1 rounded-sm inline-flex items-center gap-2">
                            <span className="text-[7px] font-mono text-white/40 uppercase tracking-[0.2em]">TYPE /</span>
                            <span className="text-[8px] sm:text-[9px] font-black text-white uppercase tracking-[0.2em]">{project.category}</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Title & Metadata Grid - Subtle up-motion */}
                <div className="relative z-30 flex flex-col gap-3 sm:gap-6 translate-y-0 sm:translate-y-3 group-hover:translate-y-0 transition-all duration-700">
                    {/* Title with dedicated breathing room */}
                    <div className="flex flex-col gap-1.5">
                        <h3
                            className="text-base sm:text-2xl md:text-2xl lg:text-3xl font-black text-white leading-[1.1] uppercase tracking-tighter text-glow-strong halation break-words max-w-[95%]"
                            style={{ fontFamily: project.font || 'IBM Plex Sans Arabic' }}
                        >
                            {project.title}
                        </h3>
                        <div className="w-8 h-[1.5px] bg-primary/40 shadow-[0_0_8px_rgba(255,59,48,0.3)]" />
                    </div>

                    {/* Metadata Grid - Fixed col structure for stability */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 pt-3 sm:pt-5 border-t border-white/10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-1000 delay-150">
                        <div className="flex flex-col">
                            <span className="text-[6px] sm:text-[7px] font-mono text-gray-500 uppercase tracking-[0.4em]">Designation.</span>
                            <span className="text-[8px] sm:text-[10px] font-black text-white uppercase tracking-[0.1em] group-hover:text-primary transition-colors truncate">{project.role}</span>
                        </div>
                        <div className="hidden md:flex flex-col border-l border-white/10 pl-4 sm:pl-6">
                            <span className="text-[7px] font-mono text-gray-500 uppercase tracking-[0.4em]">Cinematics.</span>
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.1em] group-hover:text-primary transition-colors">Hi-Fi Optic</span>
                        </div>
                        {project.release_date && (
                            <div className="flex flex-col border-l border-white/10 pl-4 sm:pl-6">
                                <span className="text-[6px] sm:text-[7px] font-mono text-gray-500 uppercase tracking-[0.4em]">Archived.</span>
                                <span className="text-[8px] sm:text-[10px] font-black text-white uppercase tracking-[0.1em] group-hover:text-primary transition-colors">
                                    {new Date(project.release_date).toLocaleDateString('en-US', { year: 'numeric' })}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectCard;
