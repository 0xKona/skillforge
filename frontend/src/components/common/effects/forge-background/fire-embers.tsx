'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface FireEmbersProps {
    count?: number;
}

interface Ember {
    id: number;
    left: string;
    delay: string;
    duration: string;
}

export default function FireEmbers({ count = 15 }: FireEmbersProps) {
    const [embers, setEmbers] = useState<Ember[]>([]);

    useEffect(() => {
        setEmbers(
            Array.from({ length: count }, (_, i) => ({
                id: i,
                left: `${(Math.random() * 100).toFixed(2)}%`,
                delay: `${-(Math.random() * 12).toFixed(2)}s`,
                duration: `${(7 + Math.random() * 5).toFixed(2)}s`,
            }))
        );
    }, [count]);

    const emberStyle = cn(
        // Position at bottom, fixed size (3px), circle shape, apply float animation
        // Added will-change-transform to promote to own layer and prevent repaint on animation
        'absolute bottom-0 w-[3px] h-[3px] rounded-full motion-safe:animate-float will-change-[transform,opacity]',
        // Radial gradient: bright ember center -> lighter ring -> transparent edge
        '[background:radial-gradient(circle,var(--color-forge-ember)_0%,var(--color-forge-ember-light)_50%,transparent_100%)]',
        // Outer glow using box-shadow with ember color
        'shadow-[0_0_10px_var(--color-forge-ember)]'
    );

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {embers.map((ember) => (
                <div
                    key={`ember-${ember.id}`}
                    className={emberStyle}
                    style={{
                        left: ember.left,
                        animationDelay: ember.delay,
                        animationDuration: ember.duration,
                    }}
                />
            ))}
        </div>
    );
}
