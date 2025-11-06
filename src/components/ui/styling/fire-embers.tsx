import { cn } from '@/lib/utils';

interface FireEmbersProps {
    count?: number;
}

export default function FireEmbers({ count = 15 }: FireEmbersProps) {
    // Generate random values for each ember
    const embers = Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${-Math.random() * 12}s`, // Negative delay to start mid-animation
        duration: `${7 + Math.random() * 5}s`, // 7-12 seconds
    }));

    const emberStyle = cn(
        'absolute bottom-0 w-[3px] h-[3px] rounded-full animate-float',
        '[background:radial-gradient(circle,var(--color-forge-ember)_0%,var(--color-forge-ember-light)_50%,transparent_100%)]',
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
