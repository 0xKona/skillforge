'use client';

import { motion, type Variants } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface CvPreviewViewProps {
    onBack: () => void;
}

// Stagger parent — children animate in sequence
const containerVariants: Variants = {
    initial: {},
    animate: {
        transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
    exit: {},
};

// Individual section entry/exit
const sectionVariants: Variants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
};

// Shared transition for section entries (ease-out cubic)
const sectionTransition = { duration: 0.35, ease: [0.23, 1, 0.32, 1] as const };

// ── Sub-components ──────────────────────────────────────────────────────────

function SectionRule({ title }: { title: string }) {
    return (
        <div className="mb-2 border-b border-black/70 pb-0.5">
            <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-black">
                {title}
            </span>
        </div>
    );
}

function Bullet({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex gap-1.5 leading-tight">
            <span className="mt-px shrink-0 text-[9px] text-black">•</span>
            <span className="text-[9px] text-black/80">{children}</span>
        </div>
    );
}

// ── Main component ──────────────────────────────────────────────────────────

export function CvPreviewView({ onBack }: CvPreviewViewProps) {
    return (
        <motion.div
            key="cv-view"
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -6 }}
            transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] as const }}
            className="flex h-full flex-col overflow-hidden"
        >
            {/* Paper surface — fills remaining height, scrolls if needed */}
            <div className="flex h-full flex-col bg-white shadow-[0_4px_32px_rgba(0,0,0,0.22)]">
                {/* Document chrome bar — matches Anvil header style */}
                <div className="flex items-center gap-2 border-b border-border-default bg-crucible px-4 py-3">
                    {/* Back button */}
                    <button
                        onClick={onBack}
                        className="flex items-center gap-1.5 text-ash transition-colors hover:text-text-primary"
                        aria-label="Back to ingot library"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span className="font-display text-xs font-semibold">
                            Back
                        </span>
                    </button>

                    {/* Filename — right-aligned */}
                    <span className="ml-auto font-mono text-[10px] text-ash">
                        product-designer-cv.pdf
                    </span>
                </div>

                {/* CV content — scrollable so nothing is clipped */}
                <motion.div
                    className="flex flex-col gap-3 overflow-y-auto px-7 py-5"
                    variants={containerVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    {/* ── Personal Info header ── */}
                    <motion.div
                        variants={sectionVariants}
                        transition={sectionTransition}
                        className="flex flex-col items-center gap-1 pb-1"
                    >
                        <p className="text-[15px] font-bold uppercase tracking-[0.18em] text-black">
                            Alex Johnson
                        </p>
                        <p className="text-[8.5px] text-black/60">
                            alex@example.com&nbsp;&nbsp;|&nbsp;&nbsp;+44 7700
                            900000&nbsp;&nbsp;|&nbsp;&nbsp;London, UK
                        </p>
                    </motion.div>

                    {/* ── Experience ── */}
                    <motion.div
                        variants={sectionVariants}
                        transition={sectionTransition}
                    >
                        <SectionRule title="Experience" />
                        <div className="flex flex-col gap-2">
                            <div>
                                <div className="flex items-baseline justify-between">
                                    <span className="text-[9px] font-bold text-black">
                                        Senior Engineer, Acme Corp
                                    </span>
                                    <span className="text-[8.5px] text-black/60">
                                        2021 – Present
                                    </span>
                                </div>
                                <p className="mb-1 text-[8.5px] italic text-black/50">
                                    London, UK
                                </p>
                                <div className="flex flex-col gap-0.5 pl-2">
                                    <Bullet>
                                        Led front-end architecture across 3
                                        product squads
                                    </Bullet>
                                    <Bullet>
                                        Reduced bundle size by 38% through code
                                        splitting
                                    </Bullet>
                                    <Bullet>
                                        Mentored 4 junior engineers to mid-level
                                    </Bullet>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Skills ── */}
                    <motion.div
                        variants={sectionVariants}
                        transition={sectionTransition}
                    >
                        <SectionRule title="Skills" />
                        <div className="flex flex-col gap-0.5 pl-2">
                            <div className="mb-0.5">
                                <span className="text-[9px] font-bold text-black">
                                    Frontend:
                                </span>
                            </div>
                            <Bullet>React · TypeScript · Next.js</Bullet>
                            <Bullet>CSS architecture, design systems</Bullet>
                            <Bullet>
                                Performance optimisation &amp; Core Web Vitals
                            </Bullet>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
}
