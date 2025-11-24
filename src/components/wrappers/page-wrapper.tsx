import { PropsWithChildren } from 'react';
import NavBar from '../navigation-bar/navigation-bar';
import Footer from '../footer/footer';
import BluePrintForgeBg from '../ui/forge-bg';

interface Props extends PropsWithChildren {
    className?: string;
}

export default function PageWrapper({ children, className }: Props) {
    return (
        <>
            <NavBar />
            <main
                className={`min-h-screen relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900  ${className}`}
            >
                <BluePrintForgeBg />
                {children}
            </main>
            <Footer />
        </>
    );
}
