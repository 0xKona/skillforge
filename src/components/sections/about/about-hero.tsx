import {
    HighlightSpanTextP,
    TypographyH1,
    TypographyP,
} from '@/ui/typography/typography';
import { Button } from '@/ui/shadcn/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function AboutHero() {
    return (
        <div className="flex flex-col items-center text-center space-y-6 py-12 md:py-24 max-w-4xl mx-auto px-6">
            <div className="space-y-4">
                <TypographyH1 className="text-5xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">
                    Forge Your Professional Future
                </TypographyH1>
                <TypographyP className="text-xl text-slate-400 max-w-2xl mx-auto">
                    <HighlightSpanTextP>SkillForge</HighlightSpanTextP> is the
                    ultimate tool for crafting dynamic, tailored CVs. Manage
                    your skills, experience, and achievements as reusable
                    <HighlightSpanTextP> Ingots</HighlightSpanTextP> and then
                    forge them into the perfect CV, tailored directly for every
                    opportunity.
                </TypographyP>
            </div>

            <div className="flex gap-4 pt-4">
                <Link href="/login">
                    <Button
                        size="lg"
                        className="bg-forge-orange hover:bg-orange-600 text-white font-semibold"
                    >
                        Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
                <Link href="#how-it-works">
                    <Button
                        variant="outline"
                        size="lg"
                        className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                        Learn More
                    </Button>
                </Link>
            </div>
        </div>
    );
}
