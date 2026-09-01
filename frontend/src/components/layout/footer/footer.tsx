import Link from 'next/link';
import Logo from '@/components/common/icons/logo';

const productLinks = [
    { label: 'Home', href: '/' },
    { label: 'Forge', href: '/forge' },
    { label: 'Anvil', href: '/anvil' },
];

const year = new Date().getFullYear();

export function Footer() {
    return (
        <footer className="border-t border-border-default bg-crucible">
            <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
                <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                    {/* Wordmark + tagline */}
                    <div className="flex flex-col gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <Logo size={20} color="#e8630a" />
                            <span className="font-display text-base font-semibold text-text-primary">
                                SkillForge
                            </span>
                        </Link>
                        <p className="font-mono text-[10px] text-ash">
                            Build once. Tailor for every role.
                        </p>
                        <p className="font-mono text-[10px] text-ash">
                            © {year} SkillForge
                        </p>
                    </div>

                    {/* Link groups */}
                    <div className="flex gap-12">
                        {/* Product */}
                        <div className="flex flex-col gap-2">
                            <p className="font-mono text-[9px] font-medium uppercase tracking-[0.15em] text-ash/60">
                                Product
                            </p>
                            {productLinks.map(({ label, href }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    className="text-xs text-ash transition-colors hover:text-text-primary"
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>

                        {/* Legal */}
                        <div className="flex flex-col gap-2">
                            <p className="font-mono text-[9px] font-medium uppercase tracking-[0.15em] text-ash/60">
                                Legal
                            </p>
                            <Link
                                href="/privacy"
                                className="text-xs text-ash transition-colors hover:text-text-primary"
                            >
                                Privacy Policy
                            </Link>
                            <p className="max-w-[200px] text-[10px] leading-relaxed text-ash/60">
                                Educational project. Do not enter sensitive
                                data.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
