import Link from 'next/link';
import Logo from '@/components/common/icons/logo';
import { TypographyP } from '../../ui/typography/typography';
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
                                <PrivacyModal />
                            </li>
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
