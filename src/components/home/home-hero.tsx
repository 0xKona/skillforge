import Logo from '@/components/icons/logo';
import { Button } from '@/components/ui/component-library/shadcn-components/button';
import {
    HighlightSpanTextP,
    TypographyH1,
    TypographyP,
} from '@/components/ui/typography/typography';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface HomeHeroProps {
    isLoggedIn: boolean;
}

export function HomeHero({ isLoggedIn }: HomeHeroProps) {
    return (
        <div className="flex flex-col items-center text-center space-y-8 py-16 md:py-32 max-w-5xl mx-auto px-6 relative z-10">
            <div className="animate-in fade-in zoom-in duration-800">
                <Logo size={180} color="#f97316" />
            </div>

            <div className="space-y-6 max-w-3xl">
                <TypographyH1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-slate-50 to-slate-400 pb-1.5">
                    Forge the Ultimate CV
                </TypographyH1>
                <TypographyP className="text-xl md:text-2xl text-slate-400 leading-relaxed">
                    Craft <HighlightSpanTextP>modular</HighlightSpanTextP>,
                    dynamic resumes that adapt to every opportunity.
                </TypographyP>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8 animate-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-backwards">
                <Link href={isLoggedIn ? '/forge' : '/login'}>
                    <Button
                        size="lg"
                        className="bg-forge-orange hover:bg-orange-600 text-white font-bold text-lg px-8 py-4 h-auto shadow-lg shadow-orange-900/20 cursor-pointer"
                    >
                        {isLoggedIn ? 'Enter the Forge' : 'Start Forging Now'}
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
