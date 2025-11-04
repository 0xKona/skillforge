import { cn } from '@/lib/utils';

export default function BackgroundGrid() {
    const gridStyle = cn(
        'absolute inset-0',
        'bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]',
        'bg-[size:24px_24px]'
    );

    return <div className={gridStyle} />;
}
