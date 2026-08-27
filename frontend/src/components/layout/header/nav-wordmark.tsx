import Link from 'next/link';
import Logo from '@/components/common/icons/logo';

export function NavWordmark() {
    return (
        <Link href="/" className="flex items-center gap-2">
            <Logo size={24} color="#e8630a" />
            <span className="font-display text-base font-semibold text-text-primary">
                SkillForge
            </span>
        </Link>
    );
}
