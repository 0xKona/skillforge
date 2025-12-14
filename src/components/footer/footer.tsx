import Link from 'next/link';
import Logo from '@/components/icons/logo';
import { TypographyP } from '../ui/typography/typography';
import { Github } from 'lucide-react';
import { PrivacyModal } from './privacy-modal';

export default function Footer() {
    return (
        <footer className="bg-slate-950 border-t border-slate-800/50 pt-16 pb-8 mt-auto">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <div className="flex items-center gap-2">
                            <Logo size={40} color="#f97316" />
                            <span className="text-xl font-bold text-slate-100">
                                SkillForge
                            </span>
                        </div>
                        <TypographyP className="text-slate-400 text-sm max-w-sm">
                            Forging future careers. Modular, dynamic, and built
                            for the modern professional.
                        </TypographyP>
                    </div>

                    {/* Navigation Column */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
                            Navigation
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/"
                                    className="text-slate-400 hover:text-forge-orange transition-colors text-sm"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="text-slate-400 hover:text-forge-orange transition-colors text-sm"
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/forge"
                                    className="text-slate-400 hover:text-forge-orange transition-colors text-sm"
                                >
                                    The Forge
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/anvil"
                                    className="text-slate-400 hover:text-forge-orange transition-colors text-sm"
                                >
                                    The Anvil
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Project Info Column */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
                            Project Info
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="https://github.com/0xKona/SkillForge"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-slate-400 hover:text-forge-orange transition-colors text-sm"
                                >
                                    <Github className="h-4 w-4" />
                                    GitHub Repository
                                </a>
                            </li>
                            <li>
                                <PrivacyModal />
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Disclaimer Section */}
                <div className="border-t border-slate-800/50 pt-8 pb-8">
                    <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-800">
                        <h4 className="text-sm font-semibold text-amber-500 mb-2">
                            Educational Project Disclaimer
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            SkillForge is an educational project developed for
                            demonstration and learning purposes. It is not
                            intended for widespread commercial use. Please be
                            aware that this service may:
                        </p>
                        <ul className="list-disc list-inside text-xs text-slate-400 mt-2 space-y-1 ml-2">
                            <li>Change and update.</li>
                            <li>Go offline without notice.</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} SkillForge.
                    </p>
                </div>
            </div>
        </footer>
    );
}
