import { PropsWithChildren } from 'react';
import NavBar from '../navigation-bar/navigation-bar';
import Footer from '../layout/footer/footer';
import BluePrintForgeBg from '../ui/forge-background';

interface Props extends PropsWithChildren {
    className?: string;
}

export default function PageWrapper({ children, className }: Props) {
    return (
        <div className="min-h-dvh flex flex-col">
            <NavBar />
            <main
                className={`flex-1 relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ${className}`}
            >
                <BluePrintForgeBg />
                {children}
            </main>
            <Footer />
        </div>
    );
}
