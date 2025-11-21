import { PropsWithChildren } from 'react';
import NavBar from '../navigation-bar/navigation-bar';

export default function PageWrapper(props: PropsWithChildren) {
    return (
        <div>
            <NavBar />
            {props.children}
        </div>
    );
}
