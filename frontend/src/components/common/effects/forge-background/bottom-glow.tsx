import { cn } from '@/lib/utils';

/**
 * Using this component applies a soft orange haze from the bottom of the page,
 * used for 'forge' styling
 */
export default function BottomForgeGlow() {
    const glowStyle = cn(
        'absolute inset-x-0 bottom-0 h-1/3 pointer-events-none',
        'bg-gradient-to-t from-forge-orange/20 via-forge-orange/5 to-transparent'
    );

    return <div className={glowStyle} />;
}
