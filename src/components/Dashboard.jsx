import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash, Edit, Save, Film, Briefcase, Cpu, Settings, Eye, ChevronRight, ChevronUp, ChevronDown, User, X, Menu, Upload, Youtube, Image, Loader2, Link2, Calendar, ChevronLeft, LogOut } from 'lucide-react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { isAdmin, user, logout } = useAuth();
    const {
        projects, addProject, updateProject, deleteProject, reorderProject,
        experience, addExperience, updateExperience, deleteExperience, reorderExperience, saveExperienceOrder,
        skills, addSkill, updateSkills, deleteSkill, reorderSkill, saveSkillsOrder,
        settings, updateSettings,
        loading
    } = useData();
    const [activeTab, setActiveTab] = useState('gallery');

    // Editor State
    const [editingProject, setEditingProject] = useState(null);
    const [newProject, setNewProject] = useState({ title: '', category: '', role: '', image: '', video: '', description: '', gear: [], aspect_ratio: '16/9', release_date: '', font: 'IBM Plex Sans Arabic' });

    const [avatarError, setAvatarError] = useState(false);
    const [gearInput, setGearInput] = useState('');

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface border border-white/10 p-8 rounded-2xl max-w-md text-center shadow-2xl"
                >
                    <Settings className="w-16 h-16 text-primary mx-auto mb-6 opacity-50" />
                    <h1 className="text-2xl font-bold mb-4 uppercase tracking-widest">Restricted Access</h1>
                    <p className="text-gray-400 mb-8">This portal is reserved for high-level cinematic operations. Please sign in with administrator credentials.</p>
                    <Link to="/" className="inline-block px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-primary hover:text-white transition-all">
                        Return to Site
                    </Link>
                </motion.div>
            </div>
        );
    }

    const convertYouTubeToEmbed = (url) => {
        if (!url) return '';
        let videoId = '';
        if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1];
            const ampersandPosition = videoId.indexOf('&');
            if (ampersandPosition !== -1) videoId = videoId.substring(0, ampersandPosition);
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1];
        } else {
            return url;
        }
        return `https://www.youtube.com/embed/${videoId}`;
    };

    const handleSaveProject = (e) => {
        e.preventDefault();
        const projectToSave = {
            ...newProject,
            video: convertYouTubeToEmbed(newProject.video),
            sort_order: editingProject ? newProject.sort_order : projects.length,
            aspect_ratio: newProject.aspect_ratio
        };
        if (editingProject) {
            updateProject(editingProject.id, projectToSave);
            setEditingProject(null);
        } else {
            addProject(projectToSave);
        }
        setNewProject({ title: '', category: '', role: '', image: '', video: '', description: '', gear: [], aspect_ratio: '16/9', release_date: '', font: 'IBM Plex Sans Arabic' });
        setGearInput('');
    };

    const startEdit = (project) => {
        setEditingProject(project);
        setNewProject({ ...project, aspect_ratio: project.aspect_ratio || project.aspectRatio || '16/9', font: project.font || 'IBM Plex Sans Arabic' });
        setGearInput('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    const handleGearKeyDown = (e) => {
        if (e.key === 'Enter' && gearInput.trim()) {
            e.preventDefault();
            if (!newProject.gear.includes(gearInput.trim())) {
                setNewProject(prev => ({ ...prev, gear: [...prev.gear, gearInput.trim()] }));
            }
            setGearInput('');
        } else if (e.key === 'Backspace' && !gearInput && newProject.gear.length > 0) {
            setNewProject(prev => ({ ...prev, gear: prev.gear.slice(0, -1) }));
        }
    };

    const removeGear = (gearToRemove) => {
        setNewProject(prev => ({ ...prev, gear: prev.gear.filter(g => g !== gearToRemove) }));
    };

    return (
        <div className="h-screen text-white relative flex flex-col bg-[#050505] overflow-hidden">
            {/* Unified Dashboard Navigation - Desktop Only */}
            <nav className="hidden md:block z-[200] bg-black/40 backdrop-blur-2xl border-b border-white/5 px-8 py-5">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-6">
                    <div className="flex items-center justify-between w-auto">
                        <Link to="/admin" className="flex items-center gap-3 group">
                            <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_15px_rgba(255,59,48,0.8)]" />
                            <span className="text-[11px] sm:text-xs font-black tracking-[0.35em] uppercase text-white group-hover:text-primary transition-colors">
                                Dashboard // Console
                            </span>
                        </Link>

                        <div className="flex items-center gap-5 md:hidden">
                            <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                                <Eye size={18} />
                            </Link>
                            <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors">
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Navigation Tabs - Hidden on mobile, shown on desktop */}
                    <div className="hidden md:flex items-center gap-1.5 px-1 sm:px-0">
                        {[
                            { id: 'gallery', icon: <Film size={14} />, label: 'Gallery' },
                            { id: 'resume', icon: <Briefcase size={14} />, label: 'Career' },
                            { id: 'skills', icon: <Cpu size={14} />, label: 'Arsenal' },
                            { id: 'settings', icon: <Settings size={14} />, label: 'Systems' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap border ${activeTab === tab.id
                                    ? 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_20px_rgba(255,59,48,0.1)]'
                                    : 'text-gray-500 border-white/5 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <span className={activeTab === tab.id ? 'text-primary' : 'text-inherit'}>{tab.icon}</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.15em]">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Desktop Actions & Profile */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2 text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-all">
                            <Eye size={14} className="group-hover:text-primary" /> Preview Site
                        </Link>

                        <div className="h-5 w-px bg-white/10" />

                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-white uppercase tracking-tighter leading-none mb-0.5">
                                    {user?.user_metadata?.full_name?.split(' ')[0] || 'ADMIN'}
                                </span>
                                <span className="text-[8px] font-bold text-primary/80 uppercase tracking-widest opacity-80">Root Access</span>
                            </div>

                            <div className="relative group/profile">
                                <div className="w-10 h-10 rounded-xl border border-white/10 overflow-hidden shadow-2xl bg-white/5 group-hover/profile:border-primary/50 transition-colors">
                                    {user?.user_metadata?.avatar_url && !avatarError ? (
                                        <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" alt="" onError={() => setAvatarError(true)} />
                                    ) : <User size={20} className="text-primary m-2.5" />}
                                </div>

                                {/* Dropdown on Hover/Click could go here, but for now just logout button next to it */}
                            </div>

                            <button
                                onClick={logout}
                                className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 lg:p-12 pb-32 sm:pb-10 lg:pb-12 relative">
                {/* Ambient dynamic background spot */}
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/2 blur-[150px] rounded-full pointer-events-none -z-10" />

                {/* Perspective Header */}
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white mb-2 uppercase">COMMAND CENTER</h1>
                        <p className="text-gray-500 font-medium tracking-widest text-[10px] sm:text-xs uppercase">Precision Content Management Architecture</p>
                    </div>

                    {/* Quick Stats Overview */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full md:w-auto">
                        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 flex flex-col items-center justify-center min-w-[80px] sm:min-w-[100px]">
                            <span className="text-lg sm:text-2xl font-black text-primary">{projects.length}</span>
                            <span className="text-[8px] sm:text-[10px] text-gray-500 uppercase tracking-widest font-bold">Projects</span>
                        </div>
                        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 flex flex-col items-center justify-center min-w-[80px] sm:min-w-[100px]">
                            <span className="text-lg sm:text-2xl font-black text-white">{experience.length}</span>
                            <span className="text-[8px] sm:text-[10px] text-gray-500 uppercase tracking-widest font-bold">Roles</span>
                        </div>
                        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 flex flex-col items-center justify-center min-w-[80px] sm:min-w-[100px]">
                            <span className="text-lg sm:text-2xl font-black text-blue-400">{skills.reduce((acc, s) => acc + s.items.length, 0)}</span>
                            <span className="text-[8px] sm:text-[10px] text-gray-500 uppercase tracking-widest font-bold">Techs</span>
                        </div>
                    </div>
                </header>
                {activeTab === 'gallery' && (
                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                        {/* Editor Form */}
                        <div className="xl:col-span-3 space-y-6">
                            <section className="bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-10 relative overflow-hidden group shadow-2xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors" />
                                <div className="flex items-center justify-between mb-10 relative z-10">
                                    <div>
                                        <h2 className="text-2xl sm:text-3xl font-black flex items-center gap-4 text-white uppercase tracking-tighter leading-none">
                                            {editingProject ? <Edit className="text-primary" size={24} /> : <Film className="text-primary" size={24} />}
                                            {editingProject ? 'Modify Sequence' : 'Ingest New Asset'}
                                        </h2>
                                        <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-bold">Project Configuration Module</p>
                                    </div>
                                    {editingProject && (
                                        <button
                                            onClick={() => { setEditingProject(null); setNewProject({ title: '', category: '', role: '', image: '', video: '', description: '', gear: [], aspect_ratio: '16/9', release_date: '', font: 'IBM Plex Sans Arabic' }); setGearInput(''); }}
                                            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-white transition-all"
                                        >
                                            Abort Ingest
                                        </button>
                                    )}
                                </div>

                                <form onSubmit={handleSaveProject} className="space-y-8 relative z-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Project Title</label>
                                            <input
                                                placeholder="The Silent Frame"
                                                value={newProject.title}
                                                onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-primary/50 focus:bg-white/[0.06] outline-none transition-all placeholder:text-gray-700 font-medium"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Cinematic Genre</label>
                                            <input
                                                placeholder="Short Film / Commercial"
                                                value={newProject.category}
                                                onChange={e => setNewProject({ ...newProject, category: e.target.value })}
                                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-primary/50 focus:bg-white/[0.06] outline-none transition-all placeholder:text-gray-700 font-medium"
                                            />
                                        </div>
                                    </div>

                                    <CinematicDatePicker
                                        label="Release Date"
                                        value={newProject.release_date || ''}
                                        onChange={date => setNewProject({ ...newProject, release_date: date })}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Role</label>
                                            <input
                                                placeholder="e.g. Director of Photography"
                                                value={newProject.role}
                                                onChange={e => setNewProject({ ...newProject, role: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:border-primary/50 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Aspect Ratio</label>
                                            <select
                                                value={newProject.aspect_ratio}
                                                onChange={e => setNewProject({ ...newProject, aspect_ratio: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:border-primary/50 outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="16/9">16:9 Cinematic</option>
                                                <option value="21/9">21:9 Ultrawide</option>
                                                <option value="9/16">9:16 Vertical</option>
                                                <option value="4/3">4:3 TV</option>
                                                <option value="1/1">1:1 Square</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Typography</label>
                                            <select
                                                value={newProject.font || 'IBM Plex Sans Arabic'}
                                                onChange={e => setNewProject({ ...newProject, font: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:border-primary/50 outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="IBM Plex Sans Arabic">Default (Spotify Arabic)</option>
                                                <option value="Playfair Display">Cinematic Serif</option>
                                                <option value="Courier Prime">Technical Mono</option>
                                                <option value="Inter">Modern Sans</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Video Asset</label>
                                            <div className="flex gap-2 text-[8px] font-black uppercase tracking-widest">
                                                <span className="text-primary bg-primary/10 px-2 py-0.5 rounded">YouTube / Supabase Storage</span>
                                            </div>
                                        </div>
                                        <VideoManager
                                            videoUrl={newProject.video}
                                            onVideoChange={(url) => setNewProject({ ...newProject, video: url })}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Project Thumbnail</label>
                                            <div className="flex gap-2 text-[8px] font-black uppercase tracking-widest">
                                                <span className="text-primary bg-primary/10 px-2 py-0.5 rounded">Supabase Storage Enabled</span>
                                            </div>
                                        </div>
                                        <ThumbnailManager
                                            currentImage={newProject.image}
                                            videoUrl={newProject.video}
                                            onImageChange={(url) => setNewProject({ ...newProject, image: url })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Narrative / Description</label>
                                        <textarea
                                            placeholder="Tell the story behind this project..."
                                            value={newProject.description}
                                            onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                                            rows={4}
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:border-primary/50 outline-none transition-all resize-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Technical Gear</label>
                                        <div className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 min-h-[50px] flex flex-wrap gap-2 focus-within:border-primary/50 transition-all cursor-text" onClick={() => document.getElementById('gear-input').focus()}>
                                            {newProject.gear.map((item, index) => (
                                                <span key={index} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-white group/tag hover:bg-white/20 transition-colors">
                                                    {item}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); removeGear(item); }}
                                                        className="text-gray-400 hover:text-red-400 transition-colors"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </span>
                                            ))}
                                            <input
                                                id="gear-input"
                                                value={gearInput}
                                                onChange={e => setGearInput(e.target.value)}
                                                onKeyDown={handleGearKeyDown}
                                                className="bg-transparent border-none outline-none text-white text-sm placeholder:text-gray-600 min-w-[150px] flex-1"
                                                placeholder="Type gear & press Enter..."
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-primary text-white py-4 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 hover:bg-red-600 transition-colors shadow-xl shadow-primary/20"
                                    >
                                        {loading ? 'Processing Frame...' : (
                                            <>
                                                {editingProject ? <Save size={20} /> : <Plus size={20} />}
                                                {editingProject ? 'Apply Master Changes' : 'Broadcast Project'}
                                            </>
                                        )}
                                    </button>
                                </form>
                            </section>
                        </div>

                        {/* Project Archive List */}
                        <div className="xl:col-span-2 space-y-6">
                            <section className="p-4 rounded-[2rem] bg-white/[0.02] backdrop-blur-2xl border border-white/5 h-full">
                                <div className="flex items-center justify-between px-6 py-4 mb-4">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-white">Active Catalog</h3>
                                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">{projects.length} Files</span>
                                </div>
                                <div className="space-y-3 overflow-y-auto max-h-[800px] custom-scrollbar pr-2">
                                    {projects.map((project, index) => (
                                        <motion.div
                                            key={project.id}
                                            layout
                                            className="group relative bg-white/[0.02] border border-white/5 rounded-2xl p-4 hover:bg-white/5 transition-all duration-300 shadow-xl"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 relative group-hover:scale-105 transition-transform duration-500">
                                                    <img src={project.image} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                                                        <Edit size={16} className="text-white" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors uppercase tracking-tight">{project.title}</h4>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{project.category}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex flex-col gap-1 pr-2 border-r border-white/5">
                                                        <button
                                                            onClick={() => index > 0 && reorderProject(project.id, projects[index - 1].sort_order - 1)}
                                                            className="p-1 hover:text-primary transition-colors opacity-30 hover:opacity-100"
                                                        >
                                                            <ChevronUp size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => index < projects.length - 1 && reorderProject(project.id, projects[index + 1].sort_order + 1)}
                                                            className="p-1 hover:text-primary transition-colors opacity-30 hover:opacity-100"
                                                        >
                                                            <ChevronDown size={16} />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => startEdit(project)}
                                                        className="p-2.5 rounded-xl bg-white/5 hover:bg-primary transition-all group-hover:shadow-[0_0_15px_rgba(255,59,48,0.3)] text-gray-400 hover:text-white"
                                                        title="Edit Project"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteProject(project.id)}
                                                        className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500 transition-all text-gray-400 hover:text-white"
                                                        title="Delete Project"
                                                    >
                                                        <Trash size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                )}

                {(activeTab === 'resume' || activeTab === 'skills') && (
                    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <section className="bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />

                            {activeTab === 'resume' ? (
                                <div className="space-y-8 relative z-10">
                                    {/* Enhanced Header */}
                                    <div className="relative">
                                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-2xl">
                                                        <Briefcase className="text-primary" size={24} />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                                                            Career <span className="text-primary">Hub</span>
                                                        </h2>
                                                        <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-[0.3em] mt-1 font-bold">Professional Timeline & Milestones</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <button
                                                    onClick={saveExperienceOrder}
                                                    disabled={loading}
                                                    className="flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/10 text-white text-[10px] sm:text-xs font-black rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
                                                >
                                                    <Save size={16} className={loading && activeTab === 'resume' ? 'animate-spin' : ''} />
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => addExperience({ company: 'New Studio', role: 'Position Title', period: '2024 - Present', description: 'Describe your role and achievements here...' })}
                                                    className="flex-1 sm:flex-none group px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-red-600 text-white text-[10px] sm:text-xs font-black rounded-2xl hover:shadow-2xl hover:shadow-primary/50 hover:scale-105 transition-all duration-300 uppercase tracking-widest flex items-center justify-center gap-3"
                                                >
                                                    <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                                                    Add Entry
                                                </button>
                                            </div>
                                        </div>

                                        {/* Stats Overview */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                                            <div className="bg-white/[0.02] border border-white/5 rounded-xl px-4 sm:px-6 py-3 hover:bg-white/[0.05] transition-all flex items-center gap-3 sm:gap-4">
                                                <div className="text-xl sm:text-2xl font-black text-primary">{experience.length}</div>
                                                <div className="text-[8px] sm:text-[9px] text-gray-500 uppercase tracking-widest font-bold">Positions</div>
                                            </div>
                                            <div className="bg-white/[0.02] border border-white/5 rounded-xl px-4 sm:px-6 py-3 hover:bg-white/[0.05] transition-all flex items-center gap-3 sm:gap-4">
                                                <div className="text-xl sm:text-2xl font-black text-blue-400">{new Set(experience.map(e => e.company)).size}</div>
                                                <div className="text-[8px] sm:text-[9px] text-gray-500 uppercase tracking-widest font-bold">Studios</div>
                                            </div>
                                            <div className="bg-white/[0.02] border border-white/5 rounded-xl px-4 sm:px-6 py-3 hover:bg-white/[0.05] transition-all flex items-center gap-3 sm:gap-4">
                                                <div className="text-xl sm:text-2xl font-black text-green-400">{experience.filter(e => e.period?.includes('Present')).length}</div>
                                                <div className="text-[8px] sm:text-[9px] text-gray-500 uppercase tracking-widest font-bold">Active</div>
                                            </div>
                                            <div className="bg-white/[0.02] border border-white/5 rounded-xl px-4 sm:px-6 py-3 hover:bg-white/[0.05] transition-all flex items-center gap-3 sm:gap-4">
                                                <div className="text-xl sm:text-2xl font-black text-purple-400">{experience.reduce((acc, e) => acc + (e.description?.split(' ').length || 0), 0)}</div>
                                                <div className="text-[8px] sm:text-[9px] text-gray-500 uppercase tracking-widest font-bold">Words</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timeline Container */}
                                    <div className="space-y-6">
                                        {experience.length === 0 ? (
                                            <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
                                                <Briefcase size={48} className="mx-auto text-gray-700 mb-6" />
                                                <h3 className="text-2xl font-black text-white/30 uppercase tracking-tighter mb-2">No Experience Entries</h3>
                                                <p className="text-sm text-gray-600 mb-8">Start building your professional timeline</p>
                                                <button
                                                    onClick={() => addExperience({ company: 'New Studio', role: 'Position Title', period: '2024 - Present', description: 'Describe your role and achievements here...' })}
                                                    className="px-6 py-3 bg-primary text-white text-xs font-black rounded-full hover:bg-red-600 transition-all uppercase tracking-widest"
                                                >
                                                    Create First Entry
                                                </button>
                                            </div>
                                        ) : (
                                            experience.map((job, index) => (
                                                <motion.div
                                                    key={job.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                >
                                                    <ExperienceEntry
                                                        job={job}
                                                        onUpdate={updateExperience}
                                                        onDelete={deleteExperience}
                                                        onReorder={(newOrder) => reorderExperience(job.id, newOrder)}
                                                        isFirst={index === 0}
                                                        isLast={index === experience.length - 1}
                                                        prevOrder={index > 0 ? experience[index - 1].sort_order : null}
                                                        nextOrder={index < experience.length - 1 ? experience[index + 1].sort_order : null}
                                                    />
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8 relative z-10">
                                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                                                    <Cpu className="text-blue-400" size={24} />
                                                </div>
                                                <div>
                                                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                                                        Tech <span className="text-blue-400">Arsenal</span>
                                                    </h2>
                                                    <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-[0.3em] mt-1 font-bold">Technical Skills & Software Mastery</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <button
                                                onClick={saveSkillsOrder}
                                                disabled={loading}
                                                className="flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/10 text-white text-[10px] sm:text-xs font-black rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
                                            >
                                                <Save size={16} className={loading && activeTab === 'skills' ? 'animate-spin' : ''} />
                                                Save
                                            </button>
                                            <button
                                                onClick={() => addSkill({ category: 'New Category', items: [] })}
                                                className="flex-1 sm:flex-none group px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[10px] sm:text-xs font-black rounded-2xl hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 uppercase tracking-widest flex items-center justify-center gap-3"
                                            >
                                                <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                                                Add Category
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {skills.map((group, index) => (
                                            <SkillGroupEntry
                                                key={group.id}
                                                group={group}
                                                onUpdate={updateSkills}
                                                onDelete={deleteSkill}
                                                onReorder={(newOrder) => reorderSkill(group.id, newOrder)}
                                                isFirst={index === 0}
                                                isLast={index === skills.length - 1}
                                                prevOrder={index > 0 ? skills[index - 1].sort_order : null}
                                                nextOrder={index < skills.length - 1 ? skills[index + 1].sort_order : null}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                )}
                {activeTab === 'settings' && (
                    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <section className="bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />

                            <div className="space-y-10 relative z-10">
                                <div className="border-b border-white/5 pb-6">
                                    <h2 className="text-3xl font-black flex items-center gap-4 text-white uppercase tracking-tighter">
                                        <Settings className="text-primary" size={28} /> Site Configuration
                                    </h2>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-bold">Global Hero & Identity Systems</p>
                                </div>

                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        {/* Hero Image preview & edit */}
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Hero Vertical Asset (9:16)</label>
                                                <div className="relative aspect-[9/16] rounded-[2rem] overflow-hidden border border-white/10 bg-black/40 group">
                                                    <img
                                                        src={settings.hero_image}
                                                        alt="Hero Preview"
                                                        className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[8px] font-black uppercase tracking-widest text-white/40">
                                                            Live System Preview
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <input
                                                value={settings.hero_image}
                                                onChange={(e) => updateSettings({ hero_image: e.target.value })}
                                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-xs text-white focus:border-primary/50 outline-none transition-all font-mono"
                                                placeholder="Hero Image URL..."
                                            />
                                        </div>

                                        {/* Showreel & Core Meta */}
                                        <div className="space-y-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Main Showreel URL (YouTube Embed)</label>
                                                <input
                                                    value={settings.hero_video}
                                                    onChange={(e) => updateSettings({ hero_video: e.target.value })}
                                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-xs text-white focus:border-primary/50 outline-none transition-all font-mono"
                                                    placeholder="Showreel URL..."
                                                />
                                                <p className="text-[8px] text-gray-600 uppercase tracking-widest font-bold pl-1 pt-1">This video triggers when 'Initialize Showreel' is clicked.</p>
                                            </div>

                                            <div className="p-8 bg-primary/5 border border-primary/10 rounded-[2rem] space-y-4">
                                                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Operational Note</h4>
                                                <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                                    Changes to Global Systems propagate immediately to the live site. Ensure vertical assets are exactly 9:16 for optimal cinematic alignment.
                                                </p>
                                                <div className="flex items-center gap-2 pt-2">
                                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                                    <span className="text-[8px] text-primary font-black uppercase tracking-widest">System Synchronized</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}
            </main>

            {/* Safari-style Bottom Mobile Navigation */}
            <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-[300]">
                <nav className="bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between px-4 relative overflow-hidden">
                    {/* Active Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

                    {/* Home Link */}
                    <Link to="/" className="flex flex-col items-center gap-1.5 py-3 px-2 text-gray-500 hover:text-white transition-all relative z-10">
                        <div className="p-2 rounded-2xl">
                            <Eye size={20} />
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-[0.2em]">Site</span>
                    </Link>

                    <div className="w-px h-8 bg-white/10 mx-1" />

                    {[
                        { id: 'gallery', icon: <Film size={20} />, label: 'Work' },
                        { id: 'resume', icon: <Briefcase size={20} />, label: 'Path' },
                        { id: 'skills', icon: <Cpu size={20} />, label: 'Core' },
                        { id: 'settings', icon: <Settings size={20} />, label: 'Sys' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col items-center gap-1.5 py-3 px-2 transition-all relative z-10 ${activeTab === tab.id ? 'text-primary scale-110' : 'text-gray-500'
                                }`}
                        >
                            <div className={`p-2 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-primary/10 shadow-[0_0_15px_rgba(255,59,48,0.2)]' : ''
                                }`}>
                                {tab.icon}
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-[0.2em]">{tab.label}</span>

                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="bottom-nav-indicator"
                                    className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(255,59,48,1)]"
                                />
                            )}
                        </button>
                    ))}

                    <div className="w-px h-8 bg-white/10 mx-1" />

                    {/* Logout Button */}
                    <button onClick={logout} className="flex flex-col items-center gap-1.5 py-3 px-2 text-gray-500 hover:text-red-500 transition-all relative z-10">
                        <div className="p-2 rounded-2xl">
                            <LogOut size={20} />
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-[0.2em]">Exit</span>
                    </button>
                </nav>
            </div>
        </div>
    );
};

const CinematicDatePicker = ({ value, onChange, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date(value || new Date()));

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const handleDateSelect = (day) => {
        const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        onChange(selectedDate.toISOString().split('T')[0]);
        setIsOpen(false);
    };

    const changeMonth = (offset) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
    };

    const monthName = currentMonth.toLocaleString('default', { month: 'long' });
    const year = currentMonth.getFullYear();

    const renderDays = () => {
        const days = [];
        const totalDays = daysInMonth(year, currentMonth.getMonth());
        const startOffset = firstDayOfMonth(year, currentMonth.getMonth());

        for (let i = 0; i < startOffset; i++) {
            days.push(<div key={`empty-${i}`} className="w-8 h-8 md:w-10 md:h-10" />);
        }

        for (let d = 1; d <= totalDays; d++) {
            const isSelected = value && new Date(value).toDateString() === new Date(year, currentMonth.getMonth(), d).toDateString();
            days.push(
                <button
                    key={d}
                    type="button"
                    onClick={() => handleDateSelect(d)}
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-[10px] md:text-xs font-bold transition-all ${isSelected
                        ? 'bg-primary text-white shadow-[0_0_15px_rgba(255,59,48,0.5)] scale-110'
                        : 'hover:bg-white/10 text-gray-400 hover:text-white'
                        }`}
                >
                    {d}
                </button>
            );
        }
        return days;
    };

    return (
        <div className="space-y-3 relative">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">{label}</label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-primary/50 focus:bg-white/[0.06] outline-none transition-all flex items-center justify-between group h-[56px]"
                >
                    <span className={value ? 'text-white' : 'text-gray-700'}>
                        {value ? formatDate(value) : 'Select Release Date'}
                    </span>
                    <Calendar size={18} className="text-gray-500 group-hover:text-primary transition-colors" />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(20px)' }}
                                animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(20px)' }}
                                className="absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 w-[290px] sm:w-[320px] top-[calc(100%+16px)] p-4 sm:p-6 bg-white/[0.01] backdrop-blur-[80px] border border-white/10 rounded-[2.5rem] shadow-[0_50px_120px_rgba(0,0,0,0.9)] z-[100] overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
                                <div className="flex items-center justify-between mb-6">
                                    <button type="button" onClick={() => changeMonth(-1)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                                        <ChevronLeft size={16} className="text-gray-400 hover:text-white" />
                                    </button>
                                    <div className="text-center">
                                        <h4 className="text-xs font-black text-white uppercase tracking-widest leading-none">{monthName}</h4>
                                        <p className="text-[9px] font-bold text-primary mt-1">{year}</p>
                                    </div>
                                    <button type="button" onClick={() => changeMonth(1)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                                        <ChevronRight size={16} className="text-gray-400 hover:text-white" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-7 gap-1 mb-2">
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                                        <div key={day} className="text-center text-[8px] font-black text-gray-600 uppercase py-2">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-1">
                                    {renderDays()}
                                </div>
                            </motion.div>
                            <div
                                className="fixed inset-0 z-[90] pointer-events-auto"
                                onClick={() => setIsOpen(false)}
                            />
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// Sub-component for individual experience entries with timeline design
const ExperienceEntry = ({ job, onUpdate, onDelete, onReorder, isFirst, isLast, prevOrder, nextOrder }) => {
    const [localJob, setLocalJob] = useState(job);
    const [isSaving, setIsSaving] = useState(false);
    const [justSaved, setJustSaved] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleChange = (field, value) => {
        setLocalJob(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
        setJustSaved(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onUpdate(job.id, localJob);
            setIsDirty(false);
            setJustSaved(true);
            setTimeout(() => setJustSaved(false), 2000);
        } catch (err) {
            console.error('Save failed:', err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div
            layout
            className="relative group mb-12"
        >
            <div className="absolute left-[26px] sm:left-[34px] top-12 bottom-[-48px] w-px bg-gradient-to-b from-primary via-primary/10 to-transparent z-0" />

            <div className="relative z-10 bg-white/[0.03] backdrop-blur-3xl border border-white/5 p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] hover:bg-white/[0.05] hover:border-primary/30 transition-all duration-500 shadow-2xl overflow-hidden">
                {/* Ambient Glow */}
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary/5 blur-[100px] rounded-full group-hover:bg-primary/10 transition-all pointer-events-none" />

                <div className="flex flex-col xl:flex-row gap-6 sm:gap-10">
                    {/* Left Column: Core Info */}
                    <div className="flex-1 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-primary uppercase tracking-[0.3em] pl-1 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                    Mission Sector
                                </label>
                                <input
                                    value={localJob.company}
                                    onChange={(e) => handleChange('company', e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 text-lg sm:text-xl font-black text-white focus:border-primary/50 outline-none transition-all hover:bg-black/60 placeholder:text-gray-800 uppercase tracking-tighter"
                                    placeholder="Agency / Studio Name"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] pl-1 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-gray-700 rounded-full" />
                                    Active Timeline
                                </label>
                                <input
                                    value={localJob.period}
                                    onChange={(e) => handleChange('period', e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 text-xs sm:text-sm font-mono text-primary focus:border-primary/50 outline-none transition-all hover:bg-black/60 placeholder:text-gray-800 uppercase tracking-widest"
                                    placeholder="2024 - PRESENT"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] pl-1">Professional Assignment</label>
                            <input
                                value={localJob.role}
                                onChange={(e) => handleChange('role', e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 text-xl sm:text-2xl font-black text-white focus:border-primary/50 outline-none transition-all hover:bg-black/60 placeholder:text-gray-800 uppercase tracking-tighter"
                                placeholder="e.g. Lead Colorist"
                            />
                        </div>
                    </div>

                    {/* Right Column: Narrative & Actions */}
                    <div className="xl:w-80 flex flex-col gap-6">
                        <div className="flex items-center justify-between xl:justify-end gap-3 p-3 bg-black/20 rounded-2xl border border-white/5 order-last xl:order-first">
                            {/* Unified Reorder Stack */}
                            <div className="flex flex-col gap-1 pr-3 border-r border-white/5">
                                <button
                                    onClick={() => !isFirst && onReorder(prevOrder - 1)}
                                    disabled={isFirst}
                                    className={`p-1 transition-all ${isFirst ? 'opacity-5 text-gray-800' : 'hover:text-primary opacity-30 hover:opacity-100 scale-110'}`}
                                    title="Move Up"
                                >
                                    <ChevronUp size={16} />
                                </button>
                                <button
                                    onClick={() => !isLast && onReorder(nextOrder + 1)}
                                    disabled={isLast}
                                    className={`p-1 transition-all ${isLast ? 'opacity-5 text-gray-800' : 'hover:text-primary opacity-30 hover:opacity-100 scale-110'}`}
                                    title="Move Down"
                                >
                                    <ChevronDown size={16} />
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                {isDirty && (
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="p-2.5 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:bg-red-600 transition-colors"
                                    >
                                        <Save size={16} className={isSaving ? 'animate-spin' : ''} />
                                    </button>
                                )}
                                <button
                                    onClick={() => onDelete(job.id)}
                                    className="p-2.5 bg-white/5 text-gray-400 hover:text-white hover:bg-red-500 rounded-xl transition-all border border-white/5"
                                    title="Delete Entry"
                                >
                                    <Trash size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] pl-1">Briefing</label>
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="text-[8px] font-black text-primary hover:text-white transition-colors uppercase tracking-widest"
                                >
                                    {isExpanded ? '[ COLLAPSE ]' : '[ FULL LOG ]'}
                                </button>
                            </div>
                            <textarea
                                value={localJob.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                className={`w-full bg-black/40 border border-white/5 rounded-[2rem] px-6 py-6 text-sm text-gray-400 focus:text-white focus:border-primary/50 outline-none transition-all hover:bg-black/60 resize-none font-medium leading-relaxed ${isExpanded ? 'h-64' : 'h-32'}`}
                                placeholder="Mission objectives and achievements..."
                            />
                        </div>
                    </div>
                </div>

                {/* Status Bar */}
                {justSaved && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-green-500/10 border border-green-500/20 px-6 py-2 rounded-full backdrop-blur-md"
                    >
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                        <span className="text-[9px] font-black text-green-500 uppercase tracking-[0.4em]">Grid Synchronized</span>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

const SkillGroupEntry = ({ group, onUpdate, onDelete, onReorder, isFirst, isLast, prevOrder, nextOrder }) => {
    const [localGroup, setLocalGroup] = useState(group);
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            if (!localGroup.items.includes(inputValue.trim())) {
                setLocalGroup(prev => ({ ...prev, items: [...prev.items, inputValue.trim()] }));
                setIsDirty(true);
            }
            setInputValue('');
        } else if (e.key === 'Backspace' && !inputValue && localGroup.items.length > 0) {
            setLocalGroup(prev => ({ ...prev, items: prev.items.slice(0, -1) }));
            setIsDirty(true);
        }
    };

    const removeSkill = (skillToRemove) => {
        setLocalGroup(prev => ({ ...prev, items: prev.items.filter(skill => skill !== skillToRemove) }));
        setIsDirty(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onUpdate(group.id, localGroup);
            setIsDirty(false);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div
            layout
            className="group relative bg-white/[0.03] backdrop-blur-3xl border border-white/5 p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] hover:bg-white/[0.05] hover:border-blue-500/30 transition-all duration-500 shadow-2xl overflow-hidden flex flex-col h-full"
        >
            {/* Ambient Bloom */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 blur-[80px] rounded-full group-hover:bg-blue-500/10 transition-all pointer-events-none" />

            <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="flex-1 mr-8">
                    <label className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] pl-1 block mb-3">Module Category</label>
                    <input
                        value={localGroup.category}
                        onChange={(e) => {
                            setLocalGroup({ ...localGroup, category: e.target.value });
                            setIsDirty(true);
                        }}
                        className="w-full bg-transparent border-none p-0 text-xl sm:text-3xl font-black text-white hover:text-blue-400 transition-colors outline-none uppercase tracking-tighter"
                        placeholder="e.g. Post Production"
                    />
                </div>

                <div className="flex items-center gap-3">
                    {/* Reorder Stack - Gallery Style */}
                    <div className="flex flex-col gap-1 pr-3 border-r border-white/5">
                        <button
                            onClick={() => !isFirst && onReorder(prevOrder - 1)}
                            disabled={isFirst}
                            className={`p-1 transition-all ${isFirst ? 'opacity-5 text-gray-700' : 'hover:text-blue-400 opacity-30 hover:opacity-100 scale-110'}`}
                            title="Shift Up"
                        >
                            <ChevronUp size={16} />
                        </button>
                        <button
                            onClick={() => !isLast && onReorder(nextOrder + 1)}
                            disabled={isLast}
                            className={`p-1 transition-all ${isLast ? 'opacity-5 text-gray-700' : 'hover:text-blue-400 opacity-30 hover:opacity-100 scale-110'}`}
                            title="Shift Down"
                        >
                            <ChevronDown size={16} />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        {isDirty && (
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="p-3 bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-600 transition-colors group/save"
                            >
                                <Save size={20} className={isSaving ? 'animate-spin' : 'group-hover:scale-110 transition-transform'} />
                            </button>
                        )}
                        <button
                            onClick={() => onDelete(group.id)}
                            className="p-3 bg-white/5 text-gray-600 hover:text-white hover:bg-red-500 rounded-2xl transition-all border border-white/5 group/trash"
                            title="Decommission Module"
                        >
                            <Trash size={20} className="group-hover:rotate-12 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-4 relative z-10 flex-1">
                <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] pl-1 block">Component Nodes</label>
                <div
                    className="w-full bg-black/40 border border-white/5 rounded-[2rem] p-6 min-h-[140px] flex flex-wrap gap-2.5 focus-within:bg-black/60 focus-within:border-blue-500/30 transition-all cursor-text"
                    onClick={() => document.getElementById(`skill-input-${group.id}`).focus()}
                >
                    {localGroup.items.map((skill, index) => (
                        <motion.span
                            key={index}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-gray-300 group/tag hover:bg-blue-500/10 hover:border-blue-500/20 hover:text-white transition-all"
                        >
                            <div className="w-1 h-1 bg-blue-500/50 rounded-full" />
                            {skill}
                            <button
                                onClick={(e) => { e.stopPropagation(); removeSkill(skill); }}
                                className="ml-1 text-gray-600 hover:text-red-400 transition-colors"
                            >
                                <X size={12} />
                            </button>
                        </motion.span>
                    ))}
                    <input
                        id={`skill-input-${group.id}`}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="bg-transparent border-none outline-none text-white text-sm placeholder:text-gray-700 min-w-[200px] flex-1 py-1 px-2"
                        placeholder="Add technology asset..."
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 pt-8 mt-10 border-t border-white/5 relative z-10">
                <div className="flex gap-1">
                    {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-blue-500/20 rounded-full" />)}
                </div>
                <span className="text-[9px] text-gray-600 font-black uppercase tracking-[0.4em]">Sector Status: Operational</span>
                <span className="ml-auto text-[10px] font-mono text-blue-400/50">{localGroup.items.length.toString().padStart(2, '0')}</span>
            </div>
        </motion.div>
    );
};

// --- Advanced Thumbnail Management Components ---

const VideoManager = ({ videoUrl, onVideoChange }) => {
    const [activeTab, setActiveTab] = useState('youtube');
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `videos/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('videos')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('videos')
                .getPublicUrl(filePath);

            onVideoChange(publicUrl);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Ensure you have a "videos" bucket in Supabase.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('video/')) {
            const simulatedEvent = { target: { files: [file] } };
            handleFileUpload(simulatedEvent);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2 p-1 bg-black/40 border border-white/5 rounded-2xl w-fit">
                {[
                    { id: 'youtube', icon: Youtube, label: 'YouTube' },
                    { id: 'upload', icon: Upload, label: 'Upload' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                    >
                        <tab.icon size={14} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    {activeTab === 'youtube' && (
                        <div className="space-y-2">
                            <input
                                placeholder="https://www.youtube.com/watch?v=..."
                                value={videoUrl}
                                onChange={(e) => onVideoChange(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:border-primary/50 outline-none transition-all"
                            />
                        </div>
                    )}

                    {activeTab === 'upload' && (
                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            className="relative aspect-video rounded-3xl border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-4 group/drop hover:border-primary/40 hover:bg-primary/[0.02] transition-all cursor-pointer overflow-hidden"
                            onClick={() => document.getElementById('video-upload').click()}
                        >
                            <input
                                id="video-upload"
                                type="file"
                                accept="video/mp4,video/webm"
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                            {isUploading ? (
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="text-primary animate-spin" size={32} />
                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Uploading Asset...</span>
                                </div>
                            ) : (
                                <>
                                    <div className="p-4 bg-white/5 rounded-2xl group-hover/drop:bg-primary/10 group-hover/drop:scale-110 transition-all z-10">
                                        <Film className="text-gray-500 group-hover/drop:text-primary" size={24} />
                                    </div>
                                    <div className="text-center z-10">
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Drop Video or Click</p>
                                        <p className="text-[8px] text-gray-600 uppercase tracking-widest mt-1">MP4, WebM up to 50MB</p>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Live Video Preview */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest pl-1">Video Preview</label>
                    <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black group/preview shadow-2xl">
                        {videoUrl && !videoUrl.includes('youtube') ? (
                            <>
                                <video
                                    src={videoUrl}
                                    controls
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm pointer-events-none">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onVideoChange('');
                                        }}
                                        className="p-3 bg-red-500 text-white rounded-2xl shadow-xl shadow-red-500/20 hover:scale-110 transition-all pointer-events-auto"
                                    >
                                        <Trash size={18} />
                                    </button>
                                </div>
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[8px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                        Video Ready
                                    </div>
                                </div>
                            </>
                        ) : videoUrl && videoUrl.includes('youtube') ? (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-gray-500">
                                <Youtube size={48} className="opacity-30" />
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-50">YouTube Link Active</p>
                            </div>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-gray-700">
                                <Film size={48} className="opacity-20" />
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-30">No Video Selected</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ThumbnailManager = ({ currentImage, videoUrl, onImageChange }) => {
    const [activeTab, setActiveTab] = useState('upload'); // upload, link, youtube
    const [isUploading, setIsUploading] = useState(false);
    const [urlInput, setUrlInput] = useState('');

    const extractYoutubeId = (url) => {
        if (!url) return null;
        const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const match = url.match(regExp);
        return (match && match[1]) ? match[1] : null;
    };

    const handleYoutubeExtraction = () => {
        const videoId = extractYoutubeId(videoUrl);
        if (videoId) {
            // Using hqdefault as it's guaranteed to exist for all videos
            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            onImageChange(thumbnailUrl);
        } else {
            alert("No valid YouTube ID found. Please ensure the Video Source field contains a YouTube link (e.g., watch?v=..., shorts/..., or embed/...).");
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `thumbnails/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('thumbnails')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('thumbnails')
                .getPublicUrl(filePath);

            onImageChange(publicUrl);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Ensure you have a "thumbnails" bucket in Supabase.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const simulatedEvent = { target: { files: [file] } };
            handleFileUpload(simulatedEvent);
        }
    };

    return (
        <div className="space-y-4">
            {/* Source Selector tabs */}
            <div className="flex gap-2 p-1 bg-black/40 border border-white/5 rounded-2xl w-fit">
                {[
                    { id: 'upload', icon: Upload, label: 'Upload' },
                    { id: 'youtube', icon: Youtube, label: 'YouTube' },
                    { id: 'link', icon: Link2, label: 'Custom Link' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                    >
                        <tab.icon size={14} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Interaction Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    {activeTab === 'upload' && (
                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            className="relative aspect-video rounded-3xl border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-4 group/drop hover:border-primary/40 hover:bg-primary/[0.02] transition-all cursor-pointer overflow-hidden"
                            onClick={() => document.getElementById('thumbnail-upload').click()}
                        >
                            <input
                                id="thumbnail-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                            {isUploading ? (
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="text-primary animate-spin" size={32} />
                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Uploading...</span>
                                </div>
                            ) : (
                                <>
                                    <div className="p-4 bg-white/5 rounded-2xl group-hover/drop:bg-primary/10 group-hover/drop:scale-110 transition-all">
                                        <Upload className="text-gray-500 group-hover/drop:text-primary" size={24} />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Drop Image or Click</p>
                                        <p className="text-[8px] text-gray-600 uppercase tracking-widest mt-1">PNG, JPG up to 10MB</p>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'youtube' && (
                        <div className="aspect-video rounded-3xl bg-black/40 border border-white/5 p-8 flex flex-col items-center justify-center text-center gap-6">
                            <div className="p-5 bg-red-500/10 rounded-full">
                                <Youtube className="text-red-500" size={32} />
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2">Auto-Extract Thumbnail</h4>
                                <p className="text-[10px] text-gray-500 leading-relaxed max-w-[200px] mx-auto">Click below to pull the high-resolution cover from your YouTube URL.</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleYoutubeExtraction}
                                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary transition-all flex items-center gap-2"
                            >
                                <Plus size={14} /> Synchronize Asset
                            </button>
                        </div>
                    )}

                    {activeTab === 'link' && (
                        <div className="aspect-video rounded-3xl bg-black/40 border border-white/5 p-8 flex flex-col justify-center gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">External Asset Link</label>
                                <div className="relative">
                                    <input
                                        placeholder="https://images.unsplash.com/..."
                                        value={urlInput}
                                        onChange={(e) => setUrlInput(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-xs text-white focus:border-primary/50 outline-none transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => { if (urlInput) onImageChange(urlInput); }}
                                        className="absolute right-2 top-2 bottom-2 px-4 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-3">
                                <Image className="text-gray-500 mt-0.5" size={14} />
                                <p className="text-[9px] text-gray-500 leading-relaxed uppercase font-bold tracking-tight">Paste a direct link to a high-quality JPEG or PNG frame.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Live Preview Area */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest pl-1 uppercase">Asset Preview</label>
                    <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black group/preview shadow-2xl">
                        {currentImage ? (
                            <>
                                <img
                                    src={currentImage}
                                    alt="Thumbnail Preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                                    <button
                                        type="button"
                                        onClick={() => onImageChange('')}
                                        className="p-3 bg-red-500 text-white rounded-2xl shadow-xl shadow-red-500/20 hover:scale-110 transition-all"
                                    >
                                        <Trash size={18} />
                                    </button>
                                </div>
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[8px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                        Frame Verified
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-gray-700">
                                <Image size={48} className="opacity-20" />
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-30">No Asset Selected</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
