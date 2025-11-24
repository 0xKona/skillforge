import { ThemeToggle } from '../ui/theme-toggle';
import { TypographyP } from '../ui/typography/typography';

export default function Footer() {
    return (
        <footer className="flex gap-6 flex-wrap items-center justify-center bg-slate-950 absolute w-full bottom-0">
            <TypographyP>Temporary footer</TypographyP>
            <ThemeToggle />
        </footer>
    );
}
