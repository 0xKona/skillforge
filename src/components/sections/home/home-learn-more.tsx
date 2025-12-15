import { Button } from '@/components/ui/component-library/shadcn-components/button';
import {
    TypographyH2,
    TypographyP,
} from '@/components/ui/typography/typography';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function HomeLearnMore() {
    return (
        <div className="py-24 bg-slate-950/60 text-center px-6 z-10">
            <div className="max-w-3xl mx-auto space-y-8">
                <TypographyH2 className="text-3xl md:text-4xl font-bold text-slate-100 border-none">
                    Want to find out more?
                </TypographyH2>
                <TypographyP className="text-xl text-slate-400 leading-relaxed">
                    Learn how SkillForge works with it&apos;s modular approach
                </TypographyP>

                <div className="pt-4">
                    <Link href="/about">
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white text-lg px-8 py-4 h-auto cursor-pointer"
                        >
                            Learn More About SkillForge
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
