import { useAuth } from '../context/AuthContext';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Instagram, Linkedin, Youtube, Twitter, Send, ShieldCheck, Lock, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
    const { login, user } = useAuth();
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    // Auto-fill form effect
    React.useEffect(() => {
        if (user) {
            setFormState(prev => ({
                ...prev,
                name: user.user_metadata?.full_name || user.user_metadata?.name || '',
                email: user.email || ''
            }));
        } else {
            setFormState({ name: '', email: '', message: '' });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const response = await fetch("https://formsubmit.co/ajax/outofrai@gmail.com", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: user?.user_metadata?.full_name || user?.user_metadata?.name || formState.name,
                    email: user?.email || formState.email,
                    message: formState.message
                })
            });

            if (response.ok) {
                setStatus('success');
                setFormState({ name: '', email: '', message: '' });
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                setStatus('error');
                setTimeout(() => setStatus('idle'), 3000);
            }
        } catch (error) {
            console.error("Form submission error:", error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <footer className="relative pt-16 sm:pt-24 md:pt-32 pb-10 sm:pb-16 px-4 sm:px-6 md:px-12 border-t border-white/5" id="contact">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 md:gap-20">

                {/* Contact Info & Socials */}
                <div className="space-y-8 sm:space-y-12">
                    <div>
                        <div className="flex items-center gap-3 sm:gap-4 mb-2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(255,59,48,0.5)]" />
                            <span className="text-primary text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-glow-red">Establish Connection</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-6 sm:mb-8 text-glow-strong halation px-1 sm:px-0">
                            Let's <br /> <span className="text-white/20">Sync.</span>
                        </h2>
                        <p className="text-gray-400 text-xs sm:text-sm font-medium leading-relaxed max-w-sm uppercase tracking-widest opacity-60">
                            Currently accepting high-end cinematic projects,
                            AI consultation and creative collaborations
                            worldwide from Iraq.
                        </p>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                        <a href="mailto:outofrai@gmail.com" className="group flex items-center gap-3 sm:gap-4 text-lg sm:text-xl md:text-2xl font-black text-white uppercase tracking-tighter hover:text-primary transition-colors">
                            <div className="p-3 sm:p-4 bg-white/[0.03] border border-white/5 rounded-xl sm:rounded-2xl group-hover:bg-primary/20 transition-all touch-target">
                                <Mail size={20} className="text-primary" />
                            </div>
                            <span className="break-all">outofrai@gmail.com</span>
                        </a>
                    </div>

                    <div className="flex gap-3 sm:gap-4">
                        {[
                            { icon: Instagram, href: "https://www.instagram.com/raiiq/" },
                            { icon: Linkedin, href: "https://www.linkedin.com/in/baraa-b-hazim-684268343/#" },
                            { icon: Youtube, href: "https://www.youtube.com/@thisrai" },
                        ].map((social, index) => (
                            <motion.a
                                key={index}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={window.innerWidth > 640 ? { y: -8, backgroundColor: 'rgba(255,255,255,0.08)' } : {}}
                                whileTap={{ scale: 0.95 }}
                                style={{ willChange: 'transform, opacity' }}
                                className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-white/[0.03] border border-white/5 rounded-xl sm:rounded-2xl text-gray-400 transition-all sm:hover:text-white touch-target"
                            >
                                <social.icon size={18} />
                            </motion.a>
                        ))}
                    </div>
                    <div className="pt-10 border-t border-white/5 space-y-4 max-w-[280px]">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            <span className="text-[9px] font-black text-white uppercase tracking-[0.3em] opacity-80">Encrypted Channel</span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase leading-relaxed tracking-widest opacity-40">
                            End-to-end encryption active. Identity verification enforced via Google OAuth to ensure secure peer-to-peer cinematic uplink.
                        </p>
                    </div>
                </div>

                {/* Form Slab */}
                <div className="bg-white/[0.02] sm:backdrop-blur-[50px] border border-white/5 p-6 sm:p-10 md:p-14 rounded-2xl sm:rounded-[2.5rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden group">
                    <div className="hidden sm:block absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />


                    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-8 relative z-10">
                        {user ? (
                            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 sm:p-6 flex items-center gap-4 sm:gap-6 group/identity transition-all hover:border-primary/30">
                                <div className="relative">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 border-primary/20 bg-black/40 flex items-center justify-center">
                                        {user.user_metadata?.avatar_url ? (
                                            <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover opacity-80 group-hover/identity:opacity-100 transition-opacity" />
                                        ) : (
                                            <UserCheck size={24} className="text-primary/40" />
                                        )}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-black flex items-center justify-center shadow-lg">
                                        <ShieldCheck size={10} className="text-white" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[9px] sm:text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Verified Identity</p>
                                    <h3 className="text-white font-black uppercase tracking-tighter truncate text-sm sm:text-lg">
                                        {user.user_metadata?.full_name || user.user_metadata?.name || 'Authorized Client'}
                                    </h3>
                                    <p className="text-gray-500 font-bold text-[10px] sm:text-xs truncate">{user.email}</p>
                                </div>
                                <div className="hidden sm:flex flex-col items-end opacity-20 group-hover/identity:opacity-40 transition-opacity">
                                    <Lock size={20} className="text-white" />
                                    <span className="text-[8px] font-black uppercase mt-1">Encrypted</span>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white/[0.03] border border-dashed border-white/10 rounded-2xl p-8 sm:p-12 text-center space-y-6">
                                <div className="w-16 h-16 bg-white/[0.05] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                                    <Lock size={32} className="text-gray-600" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-white font-black uppercase tracking-wider text-sm sm:text-base italic">Access Restricted</h3>
                                    <p className="text-gray-500 text-[10px] sm:text-xs font-bold leading-relaxed max-w-[200px] mx-auto uppercase">
                                        Please link your Google account to establish a secure transmission link.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={login}
                                    className="inline-flex items-center gap-3 bg-white text-black px-6 sm:px-8 py-3 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl active:scale-95"
                                >
                                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                                    Link Google ID
                                </button>
                            </div>
                        )}

                        <div className={`space-y-2 transition-all duration-500 ${user ? 'opacity-100' : 'opacity-20 pointer-events-none grayscale'}`}>
                            <label className="text-[9px] sm:text-[10px] font-black text-gray-600 uppercase tracking-[0.15em] sm:tracking-[0.2em] pl-1">Transmission Data</label>
                            <textarea
                                rows={4}
                                required
                                disabled={!user}
                                value={formState.message}
                                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                className="w-full bg-white/[0.05] border border-white/5 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-white font-medium focus:outline-none focus:border-primary/50 transition-all resize-none placeholder:text-white/10 text-sm sm:text-base"
                                placeholder={user ? "Describe the mission scope..." : "Identity Link Required"}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'submitting' || !user}
                            className={`w-full font-black py-4 sm:py-5 rounded-xl sm:rounded-2xl transition-all flex items-center justify-center gap-3 sm:gap-4 group disabled:opacity-50 uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[9px] sm:text-[10px] shadow-2xl touch-target ${status === 'error' ? 'bg-red-500 text-white' : 'bg-white text-black hover:bg-primary hover:text-white'
                                } ${!user ? 'hidden' : ''}`}
                        >
                            {status === 'submitting' ? 'Transmitting...' :
                                status === 'success' ? 'Transmission Complete' :
                                    status === 'error' ? 'Link Failure' : (
                                        <>
                                            Execute Uplink <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                        </button>
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-16 sm:mt-24 md:pt-32 pt-8 sm:pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 opacity-30">
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gray-500 text-center md:text-left">
                    &copy; {new Date().getFullYear()} BARAA BASIM / CI-ALPHA OPS.
                </p>
                <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gray-500">
                    <div className="flex items-center gap-2 text-primary/60 border border-primary/20 px-3 py-1.5 rounded-full bg-primary/5">
                        <ShieldCheck size={10} />
                        <span>Guaranteed Encrypted & Secure</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/[0.03] backdrop-blur-[80px] border border-white/10 px-3 py-1.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] opacity-70 hover:opacity-100 hover:bg-white/[0.08] transition-all group">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[#F38020] group-hover:drop-shadow-[0_0_8px_rgba(243,128,32,0.8)] transition-all">
                            <path d="M16.94 9.176c-.443-4.14-3.66-7.14-7.44-7.14-3.13 0-5.83 2.11-6.9 4.96C1.19 7.37.1 8.65.1 10.3c0 2.1 1.7 3.82 3.8 3.82h15.22c2.69 0 4.88-2.19 4.88-4.88 0-2.48-1.85-4.52-4.2-4.84l-.86-.02z"/>
                        </svg>
                        <span className="text-[8px] sm:text-[9px] font-black tracking-[0.1em] sm:tracking-[0.2em] uppercase text-gray-300 transform translate-y-[1px]">Protected by Cloudflare</span>
                    </div>
                    <Link to="/admin" className="hover:text-primary transition-colors flex items-center gap-1">
                        System Console
                    </Link>
                    <span>Precision Interface V.2.0</span>
                    <span>All Rights Encrypted</span>
                </div>
            </div>
        </footer>
    );
};

export default Contact;
