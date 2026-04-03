import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, Loader2 } from 'lucide-react';

const CinematicPlayer = ({ videoUrl, title, initialFullscreen }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isQualityMenuOpen, setIsQualityMenuOpen] = useState(false);
    const [currentQuality, setCurrentQuality] = useState('default');

    // Performance Refs (Direct DOM Access)
    const iframeRef = useRef(null);
    const videoRef = useRef(null);
    const progressRef = useRef(null);
    const progressBarRef = useRef(null);
    const timeDisplayRef = useRef(null);
    const playerRef = useRef(null);

    const qualities = [
        { label: 'AUTO', value: 'default' },
        { label: '1080P', value: 'hd1080' },
        { label: '720P', value: 'hd720' },
        { label: '480P', value: 'large' },
        { label: '360P', value: 'medium' }
    ];

    // YouTube URL detection
    const getYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeId(videoUrl);
    const isYouTube = !!videoId;

    // Time Formatter
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return [h, m, s]
            .map(v => v < 10 ? "0" + v : v)
            .filter((v, i) => v !== "00" || i > 0)
            .join(":");
    };

    // Native Video Handlers
    const handleNativeVideoPlay = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleNativeVideoPause = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleNativeVideoTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            if (progressBarRef.current && duration > 0) {
                const pct = (videoRef.current.currentTime / duration) * 100;
                progressBarRef.current.style.width = `${pct}%`;
            }
            if (timeDisplayRef.current) {
                timeDisplayRef.current.innerText = formatTime(videoRef.current.currentTime);
            }
        }
    };

    const handleNativeVideoLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
            setIsLoading(false);
        }
    };

    const toggleFullscreen = () => {
        if (!playerRef.current) return;

        // Check for any vendor-prefixed fullscreen element
        const isCurrentlyFullscreen =
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement;

        if (!isCurrentlyFullscreen) {
            // Support vendor prefixes for requestFullscreen
            const requestFS =
                playerRef.current.requestFullscreen ||
                playerRef.current.webkitRequestFullscreen ||
                playerRef.current.mozRequestFullScreen ||
                playerRef.current.msRequestFullscreen;

            if (requestFS) {
                try {
                    requestFS.call(playerRef.current);
                } catch (err) {
                    console.warn("Native fullscreen request failed:", err);
                }
            }
            // Always set state for our 'Fixed Inset' CSS fallback
            setIsFullscreen(true);
        } else {
            // Support vendor prefixes for exitFullscreen
            const exitFS =
                document.exitFullscreen ||
                document.webkitExitFullscreen ||
                document.mozCancelFullScreen ||
                document.msExitFullscreen;

            if (exitFS) {
                try {
                    exitFS.call(document);
                } catch (err) {
                    console.warn("Native fullscreen exit failed:", err);
                }
            }
            setIsFullscreen(false);
        }
    };

    const handleQualityChange = (quality) => {
        if (!iframeRef.current) return;

        iframeRef.current.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func: 'setPlaybackQuality',
            args: [quality]
        }), '*');

        setCurrentQuality(quality);
        setIsQualityMenuOpen(false);
    };

    // Listen for fullscreen changes (including prefixes)
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isPrefixedFullscreen =
                !!document.fullscreenElement ||
                !!document.webkitFullscreenElement ||
                !!document.mozFullScreenElement ||
                !!document.msFullscreenElement;

            // Only update if it was natively triggered (to sync state)
            if (isPrefixedFullscreen) setIsFullscreen(true);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);

        // Auto-fullscreen trigger
        if (initialFullscreen && !isLoading && !document.fullscreenElement) {
            toggleFullscreen();
        }

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
        };
    }, [isLoading, initialFullscreen]);

    // YouTube-specific message handling
    useEffect(() => {
        if (!isYouTube) return;

        const handleMessage = (event) => {
            if (event.origin !== "https://www.youtube.com") return;
            try {
                const data = JSON.parse(event.data);

                if (data.event === 'onPlaybackQualityChange') {
                    setCurrentQuality(data.info);
                }

                if (data.event === 'infoDelivery' && data.info) {
                    const cTime = data.info.currentTime;
                    const dur = data.info.duration || duration;

                    if (cTime !== undefined && dur > 0) {
                        if (progressBarRef.current) {
                            const pct = (cTime / dur) * 100;
                            progressBarRef.current.style.width = `${pct}%`;
                        }
                        if (timeDisplayRef.current) {
                            timeDisplayRef.current.innerText = formatTime(cTime);
                        }
                    }

                    if (data.info.duration !== undefined) setDuration(data.info.duration);
                    if (data.info.playbackQuality !== undefined) setCurrentQuality(data.info.playbackQuality);
                }

                if (data.event === 'onStateChange') {
                    if (data.info === 1) setIsPlaying(true);
                    if (data.info === 2) setIsPlaying(false);
                }
            } catch (e) {
                // Ignore non-json messages
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [duration, isYouTube]);

    // YouTube polling for progress
    useEffect(() => {
        if (!isYouTube) return;

        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                if (iframeRef.current) {
                    iframeRef.current.contentWindow.postMessage(JSON.stringify({
                        event: 'listening'
                    }), '*');
                }
            }, 200);
        }
        return () => clearInterval(interval);
    }, [isPlaying, isYouTube]);

    const togglePlay = () => {
        if (isYouTube) {
            if (!iframeRef.current) return;

            const nextState = !isPlaying;
            setIsPlaying(nextState);

            const command = nextState ? 'playVideo' : 'pauseVideo';
            iframeRef.current.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: command,
                args: ''
            }), '*');
        } else {
            if (!videoRef.current) return;
            if (isPlaying) {
                handleNativeVideoPause();
            } else {
                handleNativeVideoPlay();
            }
        }
    };

    const handleSeek = (e) => {
        if (!progressRef.current || !duration) return;

        const rect = progressRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, x / rect.width));
        const seekTime = percentage * duration;

        if (isYouTube && iframeRef.current) {
            iframeRef.current.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: 'seekTo',
                args: [seekTime, true]
            }), '*');
        } else if (videoRef.current) {
            videoRef.current.currentTime = seekTime;
        }

        // Immediate visual feedback
        if (progressBarRef.current) progressBarRef.current.style.width = `${(seekTime / duration) * 100}%`;
        if (timeDisplayRef.current) timeDisplayRef.current.innerText = formatTime(seekTime);
    };

    const handleVolumeToggle = () => {
        if (isYouTube) {
            setIsMuted(!isMuted);
        } else if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    return (
        <div
            ref={playerRef}
            className={`flex flex-col w-full bg-[#0a0a0a] overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 transform-gpu ${isFullscreen ? 'fixed inset-0 z-[1000] rounded-0' : 'rounded-[2rem]'}`}
            style={{ transform: 'translateZ(0)' }}
        >
            {/* 1. Video Frame */}
            <div className={`relative aspect-video w-full group overflow-hidden bg-black ${isFullscreen ? '' : 'rounded-t-[1.9rem]'}`}>
                {isYouTube ? (
                    <>
                        {/* YouTube iframe */}
                        <div className="absolute inset-0 z-0 pointer-events-none scale-[1.02] will-change-transform transform-gpu">
                            <iframe
                                ref={iframeRef}
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&enablejsapi=1&origin=${window.location.origin}`}
                                className="w-full h-full border-0"
                                allow="autoplay; encrypted-media; fullscreen"
                                onLoad={() => {
                                    setIsLoading(false);
                                    setIsPlaying(true);
                                }}
                            />
                        </div>

                        {/* Interaction Shield */}
                        <div
                            className="absolute inset-0 z-20 cursor-pointer"
                            onClick={() => {
                                togglePlay();
                                setIsQualityMenuOpen(false);
                            }}
                        />

                        {/* Crop Guards */}
                        <div className={`absolute inset-x-0 top-0 h-[8%] bg-black z-10 ${isFullscreen ? '' : 'rounded-t-[1.9rem]'}`} />
                        <div className="absolute inset-x-0 bottom-0 h-[8%] bg-black z-10" />

                        {/* Cinematic Edge Mask */}
                        <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.8)_120%)] shadow-[inset_0_0_120px_rgba(0,0,0,1)]" />
                    </>
                ) : (
                    <>
                        {/* Native HTML5 Video */}
                        <video
                            ref={videoRef}
                            src={videoUrl}
                            className="absolute inset-0 w-full h-full object-cover"
                            onTimeUpdate={handleNativeVideoTimeUpdate}
                            onLoadedMetadata={handleNativeVideoLoadedMetadata}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            onEnded={() => setIsPlaying(false)}
                            muted={isMuted}
                            autoPlay
                        />

                        {/* Interaction Shield for native video */}
                        <div
                            className="absolute inset-0 z-20 cursor-pointer"
                            onClick={() => {
                                togglePlay();
                                setIsQualityMenuOpen(false);
                            }}
                        />

                        {/* Cinematic Edge Mask */}
                        <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.8)_120%)] shadow-[inset_0_0_120px_rgba(0,0,0,1)]" />
                    </>
                )}

                {/* Loading Overlay */}
                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-30 bg-black flex items-center justify-center"
                        >
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 2. Control Shelf */}
            <div className="relative bg-[#111111] border-t border-white/5 p-4 md:p-5 flex flex-col gap-4 transform-gpu">
                {/* Quality Selector Menu (YouTube only) */}
                {isYouTube && (
                    <AnimatePresence>
                        {isQualityMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute bottom-full right-4 mb-4 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden z-50 min-w-[120px] shadow-2xl"
                            >
                                <div className="py-2 px-1">
                                    <div className="px-4 py-3 border-b border-white/10 mb-2">
                                        <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">Stream Quality</span>
                                    </div>
                                    <div className="space-y-1">
                                        {qualities.map((q) => (
                                            <button
                                                key={q.value}
                                                onClick={() => handleQualityChange(q.value)}
                                                className={`w-full px-4 py-3 text-left text-[11px] font-black transition-all flex items-center justify-between rounded-xl
                                                    ${currentQuality === q.value ? 'text-primary bg-primary/10' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                            >
                                                <span>{q.label}</span>
                                                {currentQuality === q.value && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(255,59,48,1)]" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}

                {/* Progress Bar */}
                <div
                    ref={progressRef}
                    className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden group/progress cursor-pointer"
                    onClick={handleSeek}
                >
                    <div
                        ref={progressBarRef}
                        className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_15px_rgba(255,59,48,0.8)] transition-[width] duration-150 ease-linear"
                        style={{ width: '0%' }}
                    />
                    <div className="absolute inset-0 opacity-0 group-hover/progress:opacity-100 transition-opacity bg-white/5" />
                </div>

                <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        {/* Play/Pause */}
                        <button onClick={togglePlay} className="text-white hover:text-primary transition-all active:scale-95">
                            {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
                        </button>

                        {/* Volume */}
                        <button onClick={handleVolumeToggle} className="text-white hover:text-primary transition-all active:scale-95">
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>

                        {/* Time Display */}
                        <div className="flex items-center gap-2 font-mono text-[10px] text-white/50">
                            <span ref={timeDisplayRef} className="text-white/80">00:00</span>
                            <span>/</span>
                            <span>{formatTime(duration)}</span>
                        </div>

                        <div className="hidden lg:flex flex-col">
                            <span className="text-[8px] uppercase tracking-[0.3em] text-white/30 font-black">Transmission Stream</span>
                            <span className="text-[11px] font-black text-white/70 uppercase tracking-tighter truncate max-w-[150px]">{title}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Quality Select Button (YouTube only) */}
                        {isYouTube && (
                            <button
                                onClick={() => setIsQualityMenuOpen(!isQualityMenuOpen)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all active:scale-95
                                    ${isQualityMenuOpen ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(255,59,48,0.4)]' : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/20'}`}
                            >
                                <span className="text-[9px] font-black tracking-widest uppercase">
                                    {qualities.find(q => q.value === currentQuality)?.label || 'AUTO'}
                                </span>
                            </button>
                        )}

                        <div className="hidden sm:block px-3 py-1 bg-primary/5 border border-primary/10 rounded-full">
                            <span className="text-[8px] font-black text-primary/60 uppercase tracking-[0.2em] halation">Active Sequence</span>
                        </div>

                        <button
                            onClick={toggleFullscreen}
                            className={`transition-all active:scale-95 ${isFullscreen ? 'text-primary' : 'text-white/40 hover:text-white'}`}
                        >
                            <Maximize size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CinematicPlayer;
