import {
    TypographyH2,
    TypographyH3,
    TypographyP,
} from '@/ui/typography/typography';

const steps = [
    {
        number: '01',
        title: 'Create Your Ingots',
        description:
            'Head to the Anvil to create modular blocks of content. Add your work history, education, certifications, and skills as individual Ingots.',
    },
    {
        number: '02',
        title: 'Enter the Forge',
        description:
            'Start a new CV project in the Forge. Choose which sections to include and set up the basic structure of your document.',
    },
    {
        number: '03',
        title: 'Assemble & Customize',
        description:
            'Select your Ingots to include them in the CV. Reorder sections, tweak the content for specific job applications, and preview the result in real-time.',
    },
    {
        number: '04',
        title: 'Export & Apply',
        description:
            'Once your masterpiece is ready, export it as a PDF. Your data remains safe in the Anvil, ready for the next opportunity.',
    },
];

export function AboutHowItWorks() {
    return (
        <div id="how-it-works" className="py-24 bg-slate-900/30">
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-16">
                    <TypographyH2 className="text-3xl md:text-4xl text-slate-100 border-none mb-4">
                        How It Works
                    </TypographyH2>
                    <TypographyP className="text-slate-400 max-w-2xl mx-auto">
                        From raw data to polished application in four simple
                        steps.
                    </TypographyP>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {steps.map((step, index) => (
                        <div key={index} className="flex gap-6">
                            <div className="flex-shrink-0">
                                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 text-forge-orange font-bold text-xl border border-slate-700">
                                    {step.number}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <TypographyH3 className="text-xl font-semibold text-slate-200">
                                    {step.title}
                                </TypographyH3>
                                <TypographyP className="text-slate-400 leading-relaxed">
                                    {step.description}
                                </TypographyP>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
