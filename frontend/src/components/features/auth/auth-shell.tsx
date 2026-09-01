'use client';

import { motion, useReducedMotion } from 'motion/react';
import Logo from '@/components/common/icons/logo';

interface AuthShellProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

export function AuthShell({ title, description, children }: AuthShellProps) {
    const shouldReduceMotion = useReducedMotion();
    const entranceOffset = shouldReduceMotion ? 0 : 10;

    return (
        <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-xl border border-border-emphasis bg-gunmetal shadow-2xl shadow-crucible/35 lg:grid-cols-[0.9fr_1.1fr]">
            <aside className="relative hidden min-h-[620px] overflow-hidden border-r border-border-default bg-crucible px-10 py-10 lg:flex lg:flex-col">
                <div className="absolute inset-x-0 top-0 h-px bg-flux/65" />
                <motion.div
                    animate={
                        shouldReduceMotion
                            ? undefined
                            : {
                                  opacity: [0.45, 0.9, 0.45],
                                  scale: [1, 1.05, 1],
                              }
                    }
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="absolute -right-24 -top-24 h-64 w-64 rounded-full border border-flux/15"
                />
                <motion.div
                    animate={
                        shouldReduceMotion
                            ? undefined
                            : {
                                  opacity: [0.5, 0.85, 0.5],
                                  scale: [1, 1.035, 1],
                              }
                    }
                    transition={{
                        duration: 7,
                        delay: 0.4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="absolute -bottom-40 -left-24 h-72 w-72 rounded-full border border-border-emphasis"
                />

                <motion.div
                    initial={{ opacity: 0, y: entranceOffset }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="relative flex items-center gap-3"
                >
                    <div className="flex size-10 items-center justify-center rounded-lg border border-border-warm bg-flux/10">
                        <Logo size={24} color="#e8630a" />
                    </div>
                    <span className="font-display text-xl font-semibold tracking-[-0.035em] text-text-primary">
                        SkillForge
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: entranceOffset }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.34,
                        delay: shouldReduceMotion ? 0 : 0.08,
                        ease: [0.23, 1, 0.32, 1],
                    }}
                    className="relative mt-auto"
                >
                    <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-flux">
                        Your workbench
                    </p>
                    <h1 className="mt-4 max-w-sm text-balance font-display text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-text-primary">
                        Organise your experience.
                    </h1>
                    <p className="mt-5 max-w-xs text-pretty text-sm leading-6 text-ash">
                        Arrange reusable skills, projects, and experience into a
                        CV that can be exported in seconds.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: entranceOffset }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.3,
                        delay: shouldReduceMotion ? 0 : 0.14,
                        ease: [0.23, 1, 0.32, 1],
                    }}
                    className="relative mt-10 grid grid-cols-3 gap-2 border-t border-border-default pt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-ash"
                >
                    <span>Forge</span>
                    <span>Anvil</span>
                    <span>Arrange</span>
                </motion.div>
            </aside>

            <motion.section
                initial={{ opacity: 0, y: entranceOffset }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: shouldReduceMotion ? 0.01 : 0.32,
                    delay: shouldReduceMotion ? 0 : 0.06,
                    ease: [0.23, 1, 0.32, 1],
                }}
                className="flex min-h-[560px] flex-col justify-center px-6 py-10 sm:px-10 lg:px-14"
            >
                <motion.div
                    initial={{ opacity: 0, y: entranceOffset }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: shouldReduceMotion ? 0.01 : 0.28,
                        delay: shouldReduceMotion ? 0 : 0.12,
                        ease: [0.23, 1, 0.32, 1],
                    }}
                    className="mb-8 lg:hidden"
                >
                    <div className="flex items-center gap-2">
                        <Logo size={22} color="#e8630a" />
                        <span className="font-display text-lg font-semibold tracking-[-0.03em] text-text-primary">
                            SkillForge
                        </span>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: entranceOffset }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: shouldReduceMotion ? 0.01 : 0.3,
                        delay: shouldReduceMotion ? 0 : 0.16,
                        ease: [0.23, 1, 0.32, 1],
                    }}
                    className="mb-7"
                >
                    <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-flux">
                        Account access
                    </p>
                    <h2 className="mt-3 text-balance font-display text-3xl font-semibold tracking-[-0.04em] text-text-primary">
                        {title}
                    </h2>
                    <p className="mt-3 max-w-md text-pretty text-sm leading-6 text-ash">
                        {description}
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: entranceOffset }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: shouldReduceMotion ? 0.01 : 0.32,
                        delay: shouldReduceMotion ? 0 : 0.22,
                        ease: [0.23, 1, 0.32, 1],
                    }}
                >
                    {children}
                </motion.div>
            </motion.section>
        </div>
    );
}
