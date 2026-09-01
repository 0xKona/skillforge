import { Layers, LayoutGrid, FileDown } from 'lucide-react';

const features = [
    {
        icon: Layers,
        heading: 'Ingots',
        copy: 'Reusable blocks of experience, education, and skills. Write once, use in any CV.',
    },
    {
        icon: LayoutGrid,
        heading: 'Forge',
        copy: 'Drag sections into place. Reorder, hide, and tailor for each application.',
    },
    {
        icon: FileDown,
        heading: 'Export',
        copy: 'One click to PDF. Every time, formatted the same way.',
    },
];

export function HomeFeatures() {
    return (
        <section
            id="how-it-works"
            className="grid grid-cols-1 gap-4 py-12 md:grid-cols-3"
        >
            {features.map(({ icon: Icon, heading, copy }) => (
                <div
                    key={heading}
                    className="rounded-lg border border-border-default bg-gunmetal p-4"
                >
                    <Icon className="h-5 w-5 text-flux mb-3" />
                    <h3 className="text-base font-semibold text-text-primary">
                        {heading}
                    </h3>
                    <p className="mt-1 text-sm text-ash">{copy}</p>
                </div>
            ))}
        </section>
    );
}
