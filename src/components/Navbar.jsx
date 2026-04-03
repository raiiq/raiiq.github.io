import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, LayoutDashboard, User, Menu, X, LogIn, Terminal, Activity, ShieldCheck, Share2, QrCode } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';

const Navbar = () => {
    const { user, isAdmin, login, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [avatarError, setAvatarError] = useState(false);
    const [hoveredTab, setHoveredTab] = useState(null);
    const [isQRVisible, setIsQRVisible] = useState(false);
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin');

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
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
            setIsMenuOpen(false);
            setIsMobileMenuOpen(false);
        }
    };

    if (isAdminPage) return null;

    const navItems = [
        { label: 'STATION', id: 'hero' },
        { label: 'ARCHIVE', id: 'work' },
        { label: 'ROADMAP', id: 'resume' },
        { label: 'UPLINK', id: 'contact' }
    ];

    // Liquid Pod Spring Config
    const podSpring = { type: "spring", stiffness: 400, damping: 30 };

    return (
        <nav className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-4 sm:py-8 flex justify-between items-center pointer-events-none main-navbar">
            {/* Logo Pod */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={podSpring}
                className="pointer-events-auto"
            >
                <div className="flex items-center gap-3 pointer-events-auto">
                    <Link
                        to="/"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex items-center gap-2 sm:gap-3 bg-white/[0.03] backdrop-blur-[80px] border border-white/10 px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] group hover:bg-white/[0.05] transition-all duration-500"
                    >
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full group-hover:scale-150 transition-transform shadow-[0_0_15px_rgba(255,59,48,0.8)]" />
                        <span className="text-[10px] sm:text-sm font-black tracking-tighter text-white uppercase whitespace-nowrap">Baraa Basim</span>
                    </Link>

                    {/* QR Broadcast Node */}
                    <div className="relative">
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsQRVisible(!isQRVisible)}
                            className={`p-3 rounded-full border transition-all duration-500 ${isQRVisible ? 'bg-primary border-primary text-white' : 'bg-white/[0.03] border-white/10 text-gray-400 hover:text-white hover:border-white/20'}`}
                        >
                            <QrCode size={16} />
                        </motion.button>

                        <AnimatePresence>
                            {isQRVisible && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, y: 10, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, scale: 0.8, y: 10, filter: 'blur(10px)' }}
                                    className="absolute left-0 top-[calc(100%+16px)] p-6 bg-black/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-50 overflow-hidden"
                                >
                                    <div className="flex flex-col items-center gap-4 min-w-[180px]">
                                        <div className="p-4 bg-white rounded-2xl shadow-inner">
                                            <QRCodeCanvas
                                                value="https://baraabasim.site"
                                                size={140}
                                                level={"H"}
                                                includeMargin={false}
                                                imageSettings={{
                                                    src: "/favicon.ico",
                                                    x: undefined,
                                                    y: undefined,
                                                    height: 24,
                                                    width: 24,
                                                    excavate: true,
                                                }}
                                            />
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] halation">Origin Broadcast</p>
                                            <p className="text-[7px] text-gray-500 font-bold uppercase tracking-widest opacity-60">Scan to access node</p>
                                        </div>
                                        <div className="w-full flex items-center justify-between px-2 pt-2 border-t border-white/5">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                                <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">Broadcasting</span>
                                            </div>
                                            <Share2 size={10} className="text-gray-500" />
                                        </div>
                                    </div>
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>

            {/* Central Navigation Pod */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={podSpring}
                className="hidden lg:flex items-center gap-1 bg-white/[0.03] backdrop-blur-[80px] border border-white/10 px-2 py-2 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] pointer-events-auto relative"
                onMouseLeave={() => setHoveredTab(null)}
            >
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onMouseEnter={() => setHoveredTab(item.id)}
                        onClick={() => scrollToSection(item.id)}
                        className={`text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2 transition-all relative z-10 ${hoveredTab === item.id || location.hash === `#${item.id}` ? 'text-white' : 'text-gray-500'
                            }`}
                    >
                        <span className={hoveredTab === item.id ? 'halation text-glow-red text-primary' : ''}>
                            {item.label}
                        </span>

                        {hoveredTab === item.id && (
                            <motion.div
                                layoutId="nav-pill"
                                className="absolute inset-0 bg-white/[0.1] rounded-full -z-10"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                    </button>
                ))}
            </motion.div>

            {/* Auth/Action Pod & Mobile Toggle */}
            <div className="flex items-center gap-3">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={podSpring}
                    className="pointer-events-auto relative"
                >
                    {!user ? (
                        <div className="flex items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={login}
                                className="hidden sm:flex items-center gap-4 bg-white/[0.03] backdrop-blur-[80px] border border-white/10 px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] text-white shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:bg-white/[0.08] hover:border-white/20 transition-all group overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                                <div className="relative flex items-center gap-3">
                                    <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-primary">
                                            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                                        </svg>
                                     </div>
                                    <span className="halation">Log In With Google</span>
                                </div>

                                <div className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </div>
                            </motion.button>

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-4 bg-white/[0.03] backdrop-blur-[80px] border border-white/10 rounded-full text-white pointer-events-auto touch-manipulation active:scale-90 transition-transform"
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
                            </button>
                        </div>
                    ) : (
                        <div className="relative flex items-center gap-3">
                            {/* Admin-only Console Button */}
                            {isAdmin && (
                                <Link
                                    to="/admin"
                                    className="hidden md:flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl group hover:bg-primary hover:border-primary transition-all duration-300"
                                >
                                    <LayoutDashboard size={14} className="text-primary group-hover:text-white transition-colors" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary group-hover:text-white transition-colors">Console</span>
                                </Link>
                            )}

                            {/* Detailed Account Pod */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-3 bg-white/[0.03] backdrop-blur-[80px] border border-white/10 p-1.5 pr-4 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/[0.08] transition-all group"
                            >
                                <div className="relative">
                                    {user.user_metadata?.avatar_url && !avatarError ? (
                                        <img
                                            src={user.user_metadata.avatar_url}
                                            alt=""
                                            className="w-8 h-8 rounded-xl border border-white/10 object-cover"
                                            onError={() => setAvatarError(true)}
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
                                            <User size={16} className="text-gray-400" />
                                        </div>
                                    )}
                                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-black/50 rounded-full" />
                                </div>
                                <div className="flex flex-col items-start -space-y-1">
                                    <span className="text-[10px] font-black text-white uppercase tracking-tighter">
                                        {user.user_metadata?.full_name?.split(' ')[0] || 'ADMIN'}
                                    </span>
                                    <span className="text-[7px] font-bold text-primary/80 uppercase tracking-widest halation">
                                        {isAdmin ? 'Root Access' : 'Authorized'}
                                    </span>
                                </div>
                            </motion.button>

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-4 bg-white/[0.03] backdrop-blur-[80px] border border-white/10 rounded-full text-white pointer-events-auto touch-manipulation active:scale-90 transition-transform"
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
                            </button>

                            {/* Enhanced Dropdown */}
                            <AnimatePresence>
                                {isMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(10px)' }}
                                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                                        exit={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(10px)' }}
                                        className="absolute right-0 top-[calc(100%+16px)] w-64 bg-black/90 backdrop-blur-[100px] border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden p-2 hidden lg:block"
                                    >
                                        <div className="px-6 py-5 border-b border-white/5 mb-2 bg-white/[0.02]">
                                            <div className="flex items-center gap-2 mb-2">
                                                <ShieldCheck size={12} className="text-primary" />
                                                <p className="text-[8px] text-primary font-black uppercase tracking-[0.3em]">Identity Verified</p>
                                            </div>
                                            <p className="text-xs font-black text-white truncate max-w-full mb-1">{user.user_metadata?.full_name || 'Admin User'}</p>
                                            <p className="text-[9px] text-gray-500 font-bold truncate opacity-60">{user.email}</p>
                                        </div>

                                        <div className="px-4 py-3 grid grid-cols-2 gap-2 mb-2">
                                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                                <Activity size={10} className="text-green-500 mb-1" />
                                                <p className="text-[7px] text-gray-500 font-bold uppercase tracking-widest">Uptime</p>
                                                <p className="text-[10px] font-black text-white">99.9%</p>
                                            </div>
                                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                                <ShieldCheck size={10} className="text-primary mb-1" />
                                                <p className="text-[7px] text-gray-500 font-bold uppercase tracking-widest">Security</p>
                                                <p className="text-[10px] font-black text-white">Level 4</p>
                                            </div>
                                        </div>

                                        {isAdmin && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setIsMenuOpen(false)}
                                                className="w-full px-5 py-3 text-[10px] text-primary hover:bg-white/5 flex items-center gap-3 transition-all border-b border-white/5 font-black uppercase tracking-[0.2em] rounded-xl group"
                                            >
                                                <LayoutDashboard size={14} className="group-hover:rotate-12 transition-transform" /> System Console
                                            </Link>
                                        )}

                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full px-5 py-4 text-[10px] text-red-500 hover:bg-red-500/10 flex items-center gap-3 transition-all font-black uppercase tracking-[0.2em] rounded-2xl group"
                                        >
                                            <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" /> Terminate Session
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl lg:hidden flex flex-col pointer-events-auto"
                    >
                        {/* Close button inside overlay */}
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="absolute top-6 right-6 p-4 text-white hover:text-primary transition-colors z-50 touch-manipulation active:scale-90"
                            aria-label="Close menu"
                        >
                            <X size={32} strokeWidth={2.5} />
                        </button>

                        <div className="flex flex-col items-center justify-center flex-1 gap-8 p-10">
                            <div className="w-full space-y-2">
                                <p className="text-[10px] text-primary font-black uppercase tracking-[0.4em] mb-6 text-center halation">Navigation Node</p>
                                {navItems.map((item) => (
                                    <motion.button
                                        key={item.id}
                                        whileHover={{ x: 10 }}
                                        onClick={() => {
                                            scrollToSection(item.id);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full py-4 text-3xl font-black text-white uppercase tracking-tighter border-b border-white/5 hover:text-primary transition-colors text-center"
                                    >
                                        {item.label}
                                    </motion.button>
                                ))}
                            </div>

                            <div className="w-full pt-10 mt-auto border-t border-white/10 flex flex-col gap-4">
                                {user ? (
                                    <>
                                        <div className="flex items-center gap-4 px-6 py-4 bg-white/5 rounded-2xl mb-4">
                                            {user.user_metadata?.avatar_url && !avatarError ? (
                                                <img src={user.user_metadata.avatar_url} className="w-10 h-10 rounded-full" alt="" />
                                            ) : <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"><User size={20} /></div>}
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-white">{user.user_metadata?.full_name || 'Admin'}</span>
                                                <span className="text-[9px] text-gray-500 uppercase tracking-widest">{user.email}</span>
                                            </div>
                                        </div>
                                        {isAdmin && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="w-full py-4 bg-primary text-white text-center font-black uppercase tracking-widest text-xs rounded-2xl"
                                            >
                                                SYSTEM CONSOLE
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full py-4 bg-red-500/10 text-red-500 text-center font-black uppercase tracking-widest text-xs rounded-2xl border border-red-500/20"
                                        >
                                            TERMINATE SESSION
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => {
                                            login();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full py-5 bg-white/[0.05] border border-white/10 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:bg-white/10 transition-all flex items-center justify-center gap-3 group"
                                    >
                                        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-primary">
                                                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                                            </svg>
                                        </div>
                                        <span>LOG IN WITH GOOGLE</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
