import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/component-library/shadcn-components/card';
import { Hammer, Anvil, FileText, RefreshCw } from 'lucide-react';
import { TypographyP } from '../ui/typography/typography';

const features = [
    {
        title: 'The Anvil',
        description:
            'Your personal workspace for crafting Ingots. Create detailed blocks of information for your education, experience, skills, and more.',
        icon: Anvil,
        color: 'text-blue-500',
    },
    {
        title: 'Ingots',
        description:
            'Reusable data blocks that serve as the building materials for your CVs. Update an Ingot once, and it updates everywhere.',
        icon: Hammer,
        color: 'text-orange-500',
    },
    {
        title: 'The Forge',
        description:
            'Assemble your Ingots into polished, professional CVs. Select and organize your content to tell your story.',
        icon: FileText,
        color: 'text-emerald-500',
    },
    {
        title: 'Dynamic Updates',
        description:
            'Keep your CVs in sync. When you refine an Ingot, every CV using that Ingot is automatically updated.',
        icon: RefreshCw,
        color: 'text-purple-500',
    },
];

export function AboutFeatures() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-6 py-12">
            {features.map((feature, index) => (
                <Card
                    key={index}
                    className="bg-slate-900/75 border-slate-800 hover:border-slate-700 transition-colors z-10"
                >
                    <CardHeader>
                        <feature.icon
                            className={`h-10 w-10 mb-4 ${feature.color}`}
                        />
                        <CardTitle className="text-xl text-slate-100">
                            {feature.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TypographyP className="text-slate-400 leading-relaxed">
                            {feature.description}
                        </TypographyP>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
