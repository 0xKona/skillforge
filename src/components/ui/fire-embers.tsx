'use client';

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

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {embers.map((ember) => (
                <div
                    key={`ember-${ember.id}`}
                    className="ember"
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
