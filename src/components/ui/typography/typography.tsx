import React from 'react';

export function TypographyH1({ children }: React.PropsWithChildren) {
    return (
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
            {children}
        </h1>
    );
}

interface TypographyH3Props extends React.PropsWithChildren {
    className?: string;
}

export function TypographyH3({ children, className }: TypographyH3Props) {
    return (
        <h3
            className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className || ''}`}
        >
            {children}
        </h3>
    );
}
