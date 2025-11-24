import { ThemeToggle } from '../ui/theme-toggle';
import { TypographyP } from '../ui/typography/typography';

export default function Footer() {
    return (
        <footer className="flex gap-6 p-6 flex-wrap items-center justify-center mt-auto bg-slate-950 w-full text-slate-50">
            <TypographyP>Temporary footer</TypographyP>
            <ThemeToggle />
        </footer>
    );
}
