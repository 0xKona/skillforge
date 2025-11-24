import { PropsWithChildren } from 'react';
import NavBar from '../navigation-bar/navigation-bar';
import Footer from '../footer/footer';

export default function PageWrapper(props: PropsWithChildren) {
    return (
        <div className="min-h-dvh flex flex-col">
            <NavBar />
            {props.children}
            <Footer />
        </div>
    );
}
