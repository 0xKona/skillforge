import { cn } from '@/lib/utils';

export default function BackgroundGrid() {
    // Styles explanation:
    // 'absolute inset-0' -> positions the grid layer to cover its containing element entirely.
    // Two linear gradients:
    //   linear-gradient(to_right, #80808012 1px, transparent 1px)
    //   linear-gradient(to_bottom, #80808012 1px, transparent 1px)
    // Each draws 1px lines then transparent, combining to form a subtle grid (horizontal + vertical).
    // 'bg-[size:24px_24px]' sets the repeat interval so lines appear every 24px horizontally and vertically.
    const gridStyle = cn(
        'absolute inset-0',
        'bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]',
        'bg-[size:24px_24px]'
    );

    return <div className={gridStyle} />;
}
