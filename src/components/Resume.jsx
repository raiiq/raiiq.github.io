import React from 'react';
import { motion } from 'framer-motion';
import { Download, Briefcase, Cpu, User, Target, Shield, Globe, Award } from 'lucide-react';
import { useData } from '../context/DataContext';

const Resume = () => {
    const { experience, skills, settings } = useData();

    const professional_title = settings?.professional_title || "Filmmaker | AI Prompt Engineer | Creative Director";
    const hero_bio = settings?.hero_bio || "Iraq-Based Visionary crafting cutting-edge cinematic sequences.";
    const bio_detailed = settings?.bio_detailed || "Iraq-Based Visionary crafting cutting-edge cinematic sequences. I blend the raw power of traditional cinematography with the precision of AI-driven creative systems to deliver visual experiences that reside on the frontier of modern storytelling. Focused on the intersection of generative technology and high-fidelity video production, I serve as a catalyst for brands and studios looking to evolve their narrative capabilities in the post-digital era.";

    const handleDownloadPDF = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const margin = 20;
        let yPos = 30;

        const addBackground = () => {
            doc.setFillColor(0, 0, 0);
            doc.rect(0, 0, 210, 297, 'F');
        };

        const drawAccentLine = (y) => {
            doc.setDrawColor(255, 59, 48);
            doc.setLineWidth(0.5);
            doc.line(margin, y, margin + 5, y);
            doc.setDrawColor(40, 40, 40);
            doc.line(margin + 7, y, 210 - margin, y);
        };

        // Page 1: Strategic Intelligence Overview
        addBackground();

        // Header System Marker
        doc.setTextColor(255, 59, 48);
        doc.setFontSize(8);
        doc.setFont("courier", "bold");
        doc.text("INTELLIGENCE SYSTEM // V.04 // AUTHORIZED ONLY", margin, 15);

        // Name and Title
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(32);
        doc.setFont("helvetica", "bold");
        doc.text("BARAA BASIM", margin, yPos);

        yPos += 10;
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(150, 150, 150);
        doc.text(professional_title.toUpperCase(), margin, yPos);

        yPos += 6;
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(110, 110, 110);
        doc.text(hero_bio, margin, yPos);

        yPos += 8;
        doc.setFontSize(8);
        doc.setTextColor(80, 80, 80);
        doc.text("LOCATION: IRAQ // STATUS: ACTIVE // IDENTITY: VERIFIED", margin, yPos);

        yPos += 15;
        drawAccentLine(yPos);

        // Strategic Summary
        yPos += 15;
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("STRATEGIC SUMMARY", margin, yPos);

        yPos += 10;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(180, 180, 180);
        const bioLines = doc.splitTextToSize(bio_detailed, 210 - (margin * 2));
        doc.text(bioLines, margin, yPos);
        yPos += (bioLines.length * 6) + 15;

        // Visionary Parameters (Quick Stats)
        drawAccentLine(yPos);
        yPos += 15;
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("VISIONARY PARAMETERS", margin, yPos);

        const stats = [
            { label: "Narrative Depth", pct: 95 },
            { label: "AI Creative Integration", pct: 98 },
            { label: "Cinematographic Fidelity", pct: 92 },
            { label: "Director's Vision", pct: 100 }
        ];

        yPos += 10;
        stats.forEach((stat, i) => {
            doc.setFontSize(9);
            doc.setTextColor(150, 150, 150);
            doc.text(stat.label.toUpperCase(), margin, yPos);
            doc.setTextColor(255, 59, 48);
            doc.text(`${stat.pct}%`, 190 - margin, yPos);

            yPos += 4;
            doc.setDrawColor(40, 40, 40);
            doc.rect(margin, yPos, 170, 1, 'F');
            doc.setFillColor(255, 59, 48);
            doc.rect(margin, yPos, 170 * (stat.pct / 100), 1, 'F');
            yPos += 12;
        });

        // Page 2: Operational History & Technical Arsenal
        doc.addPage();
        yPos = 30;
        addBackground();

        doc.setTextColor(255, 59, 48);
        doc.setFontSize(8);
        doc.setFont("courier", "bold");
        doc.text("OPERATIONAL RECORDS // LOGIC ARSENAL", margin, 15);

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("OPERATIONAL HISTORY", margin, yPos);

        experience.forEach(job => {
            yPos += 12;
            if (yPos > 260) { doc.addPage(); addBackground(); yPos = 30; }

            doc.setDrawColor(255, 59, 48);
            doc.rect(margin, yPos, 1, 15, 'F');

            doc.setFontSize(11);
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.text(`${job.role}`, margin + 5, yPos + 4);

            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);
            doc.text(`${job.company} // ${job.period}`, margin + 5, yPos + 10);

            yPos += 18;
            doc.setFontSize(9);
            doc.setTextColor(150, 150, 150);
            doc.setFont("helvetica", "normal");
            const lines = doc.splitTextToSize(job.description, 210 - (margin * 2) - 5);
            doc.text(lines, margin + 5, yPos);
            yPos += (lines.length * 5) + 5;
        });

        yPos += 15;
        if (yPos > 240) { doc.addPage(); addBackground(); yPos = 30; }

        drawAccentLine(yPos);
        yPos += 15;
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("TECHNICAL ARSENAL", margin, yPos);

        skills.forEach((group, i) => {
            yPos += 12;
            if (yPos > 270) { doc.addPage(); addBackground(); yPos = 30; }

            doc.setFontSize(10);
            doc.setTextColor(255, 59, 48);
            doc.text(`[ ${group.category.toUpperCase()} ]`, margin, yPos);

            yPos += 6;
            doc.setFontSize(9);
            doc.setTextColor(150, 150, 150);
            const skillLine = group.items.join(" // ");
            const lines = doc.splitTextToSize(skillLine, 210 - (margin * 2));
            doc.text(lines, margin, yPos);
            yPos += (lines.length * 5);
        });

        // Footer marker on last page (removed)

        doc.save("baraa-basim-intelligence-dossier.pdf");
    };

    return (
        <section className="py-12 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 lg:px-20 relative min-h-screen flex flex-col justify-center overflow-hidden bg-black" id="resume">
            {/* Ambient System Grid - Hidden on mobile for performance */}
            <div className="hidden sm:block absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,59,48,0.05)_0%,transparent_50%)]" />
            </div>

            {/* Simpler background for mobile */}
            <div className="sm:hidden absolute inset-0 pointer-events-none bg-black" />

            <div className="w-full relative z-10 text-left">
                {/* Global Command Header */}
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-16 md:mb-32 px-0 sm:px-4">
                    <div className="max-w-3xl space-y-4 sm:space-y-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            style={{ willChange: 'opacity' }}
                            className="flex items-center gap-2 sm:gap-3"
                        >
                            <div className="w-6 sm:w-8 h-[1px] bg-primary shadow-[0_0_10px_rgba(255,59,48,0.5)]" />
                            <span className="text-primary text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] sm:tracking-[0.6em] halation">Intelligence System // V.04</span>
                        </motion.div>

                        <h2 className="text-[clamp(2rem,10vw,8rem)] sm:text-[clamp(2.5rem,10vw,8rem)] font-black text-white uppercase tracking-tighter leading-[0.85] mb-4 sm:mb-6 shadow-black drop-shadow-2xl">
                            MASTER<br />
                            <span className="text-white/20 hover:text-white transition-colors duration-1000 cursor-default">DOSSIER.</span>
                        </h2>

                        <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm font-medium uppercase tracking-[0.1em] sm:tracking-[0.2em] leading-relaxed max-w-xl border-l border-white/10 pl-4 sm:pl-6">
                            Authorized personnel only. Accessing fully consolidated professional intelligence for <span className="text-white">Baraa Basim</span>.
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02, x: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDownloadPDF}
                        className="group flex items-center justify-center gap-3 sm:gap-4 px-6 sm:px-8 md:px-10 py-4 sm:py-5 bg-white text-black rounded-xl sm:rounded-2xl transition-all font-black uppercase tracking-widest text-[9px] sm:text-[10px] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] touch-target w-full sm:w-auto"
                    >
                        <Download size={16} className="group-hover:translate-y-1 transition-transform" />
                        <span>Export Intelligence Report</span>
                    </motion.button>
                </div>

                {/* Grid Layer 1: Core Profile */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-12 mb-6 sm:mb-8 md:mb-12">

                    {/* Strategic Identity */}
                    <div className="lg:col-span-12 xl:col-span-4 h-full">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            style={{ willChange: 'opacity' }}
                            className="bg-white/[0.02] sm:backdrop-blur-3xl border border-white/5 p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-[2.5rem] md:rounded-[3.5rem] relative overflow-hidden group h-full"
                        >
                            <div className="hidden sm:block absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-all pointer-events-none" />

                            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                                <div className="p-3 sm:p-4 bg-primary/10 rounded-xl sm:rounded-2xl">
                                    <User className="text-primary" size={20} />
                                </div>
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic">Strategic Identity</h3>
                            </div>

                            <div className="space-y-6 sm:space-y-8">
                                <div className="space-y-3 sm:space-y-4">
                                    <p className="text-lg sm:text-xl md:text-2xl text-white font-black leading-tight uppercase tracking-tighter">
                                        {professional_title}
                                    </p>
                                    <div className="h-px w-12 sm:w-20 bg-primary/30" />
                                </div>

                                <p className="text-gray-400 text-[13px] sm:text-base leading-relaxed font-medium">
                                    {bio_detailed}
                                </p>

                                <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-6 sm:mt-8">
                                    {[
                                        { icon: Globe, label: "Origin", val: "Iraq" },
                                        { icon: Target, label: "Objective", val: "Innovation" },
                                        { icon: Shield, label: "Identity", val: "Verified" },
                                        { icon: Award, label: "Status", val: "Active" }
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white/[0.02] border border-white/5 p-4 sm:p-6 rounded-xl sm:rounded-2xl flex flex-col gap-2">
                                            <stat.icon className="text-primary/40" size={14} />
                                            <div>
                                                <p className="text-[7px] sm:text-[8px] text-gray-600 font-black uppercase tracking-widest">{stat.label}</p>
                                                <p className="text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest">{stat.val}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Operational History */}
                    <div className="lg:col-span-12 xl:col-span-8 space-y-6 sm:space-y-8">
                        <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4 px-2 sm:px-4">
                            <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl">
                                <Briefcase className="text-primary" size={18} />
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter">Operational History</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            {experience.map((job, index) => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: window.innerWidth > 640 ? index * 0.05 : 0 }}
                                    style={{ willChange: 'opacity' }}
                                    className="group bg-white/[0.02] sm:backdrop-blur-3xl border border-white/5 p-5 sm:p-8 md:p-10 rounded-xl sm:rounded-[2rem] md:rounded-[2.5rem] sm:hover:bg-white/[0.04] sm:hover:border-primary/40 transition-all duration-700 relative overflow-hidden flex flex-col"
                                >
                                    <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
                                        <div>
                                            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                                <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(255,59,48,0.8)]" />
                                                <span className="text-primary text-[8px] sm:text-[9px] font-mono tracking-[0.2em] sm:tracking-[0.3em] font-black uppercase">{job.period}</span>
                                            </div>
                                            <h4 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none group-hover:text-primary transition-colors">
                                                {job.role}
                                            </h4>
                                            <p className="text-gray-500 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mt-1 sm:mt-2">{job.company}</p>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-medium opacity-80 sm:opacity-60 group-hover:opacity-100 transition-opacity">
                                        {job.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Technical Arsenal - Moved Under Operational History */}
                        <div className="pt-10 sm:pt-16 md:pt-20 border-t border-white/5 space-y-6 sm:space-y-8 mt-6 sm:mt-8 md:mt-12">
                            <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4 px-2 sm:px-4">
                                <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl">
                                    <Cpu className="text-primary" size={18} />
                                </div>
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">Technical Arsenal</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                {skills.map((group, index) => (
                                    <motion.div
                                        key={group.id}
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: window.innerWidth > 640 ? index * 0.05 : 0 }}
                                        style={{ willChange: 'opacity' }}
                                        className="group bg-white/[0.02] sm:backdrop-blur-3xl border border-white/5 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-[2rem] md:rounded-[2.5rem] sm:hover:bg-white/[0.04] sm:hover:border-primary/40 transition-all duration-700 relative overflow-hidden flex flex-col h-full"
                                    >
                                        <div className="flex flex-col gap-3 sm:gap-4 mb-3 sm:mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(255,59,48,0.8)]" />
                                                <h4 className="text-lg sm:text-xl md:text-2xl font-black text-white uppercase tracking-tighter leading-none group-hover:text-primary transition-colors">
                                                    {group.category.replace('_', ' ')}
                                                </h4>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 sm:gap-2.5 mt-auto">
                                            {group.items.map((skill, sIdx) => (
                                                <span
                                                    key={sIdx}
                                                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-black/40 border border-white/10 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black text-gray-400 hover:text-white hover:border-primary/40 transition-all uppercase tracking-[0.1em] sm:tracking-[0.2em] cursor-default flex items-center gap-1.5 sm:gap-2"
                                                >
                                                    <div className="w-1 h-1 bg-primary/30 rounded-full" />
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* FULL WIDTH: VISIONARY PARAMETERS & STRATEGIC OUTPUT */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    style={{ willChange: 'opacity' }}
                    className="mb-6 sm:mb-8 md:mb-12 bg-white/[0.01] border border-white/5 p-5 sm:p-8 md:p-12 lg:p-20 rounded-2xl sm:rounded-[2.5rem] md:rounded-[4rem] relative overflow-hidden"
                >
                    <div className="hidden sm:block absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-primary/5 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none" />

                    <div className="flex flex-col xl:flex-row gap-10 sm:gap-16 md:gap-20">
                        {/* Header & Visionary Stats */}
                        <div className="xl:w-1/3 space-y-8 sm:space-y-12">
                            <div className="space-y-4 sm:space-y-6">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                    <span className="text-primary text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] sm:tracking-[0.6em]">Visionary Parameters // Strategic Output</span>
                                </div>
                                <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                                    Strategic <br /><span className="text-white/20 italic">Intelligence.</span>
                                </h3>
                                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed uppercase tracking-widest font-medium opacity-60">
                                    A unified quantification of creative architecture and technical mastery, summarizing the core philosophical and operational drive.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:gap-8">
                                {[
                                    { label: "Narrative Depth", pct: "95%", desc: "Emotional resonance and structural complexity." },
                                    { label: "AI Creative Integration", pct: "98%", desc: "Neural network efficiency in creative workflows." },
                                    { label: "Cinematographic Fidelity", pct: "92%", desc: "Visual precision and technical execution protocols." },
                                    { label: "Director's Vision", pct: "100%", desc: "Absolute adherence to primary objectives." }
                                ].map((stat, i) => (
                                    <div key={i} className="space-y-3 sm:space-y-4 group">
                                        <div className="flex justify-between items-end gap-2">
                                            <div className="space-y-0.5 sm:space-y-1 flex-1 min-w-0">
                                                <span className="text-[10px] sm:text-xs font-black text-white uppercase tracking-widest group-hover:text-primary transition-colors block truncate">{stat.label}</span>
                                                <p className="text-[7px] sm:text-[8px] text-gray-600 font-bold uppercase tracking-widest truncate">{stat.desc}</p>
                                            </div>
                                            <span className="text-lg sm:text-xl font-black text-primary font-mono flex-shrink-0">{stat.pct}</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: stat.pct }}
                                                transition={{ duration: 2, delay: i * 0.1 }}
                                                className="h-full bg-primary shadow-[0_0_15px_rgba(255,59,48,0.5)]"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Technical Mastery Dashboard */}
                        <div className="xl:w-2/3">
                            <div className="bg-black/40 sm:backdrop-blur-3xl border border-white/5 p-5 sm:p-8 md:p-12 lg:p-16 rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] h-full flex flex-col justify-center">
                                <div className="flex items-center gap-2 sm:gap-3 mb-8 sm:mb-12">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                    <h4 className="text-lg sm:text-xl font-black text-white uppercase tracking-tighter">Technical Mastery Index</h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 sm:gap-x-12 md:gap-x-16 gap-y-8 sm:gap-y-12">
                                    {skills.map((group, i) => {
                                        const ratings = {
                                            'AI Creative Suite': '98%',
                                            'Cinematic Production': '95%',
                                            'Technical Gear': '92%',
                                            'Post-Production': '94%',
                                            'default': '90%'
                                        };
                                        const pct = ratings[group.category] || ratings['default'];

                                        return (
                                            <div key={group.id} className="space-y-4 sm:space-y-6">
                                                <div className="flex justify-between items-end gap-2">
                                                    <div className="space-y-0.5 sm:space-y-1 min-w-0">
                                                        <span className="text-primary font-mono text-[9px] sm:text-[10px]">{`0${i + 1}.`}</span>
                                                        <p className="text-[10px] sm:text-xs font-black text-white uppercase tracking-widest truncate">{group.category.replace('_', ' ')}</p>
                                                    </div>
                                                    <span className="text-xl sm:text-2xl font-black text-white/40 font-mono tracking-tighter flex-shrink-0">{pct}</span>
                                                </div>
                                                <div className="h-[2px] w-full bg-white/5 relative">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: pct }}
                                                        transition={{ duration: 2, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                                                        className="h-full bg-gradient-to-r from-primary to-red-600 shadow-[0_0_20px_rgba(255,59,48,0.4)] relative"
                                                    >
                                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-3 sm:h-4 bg-white shadow-[0_0_10px_#fff]" />
                                                    </motion.div>
                                                </div>
                                                <p className="text-[7px] sm:text-[8px] text-gray-600 font-black uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                                                    Operational Index: Optimized
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default Resume;
