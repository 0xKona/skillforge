import { Button } from '@/components/ui/component-library/shadcn-components/button';
import { TypographyH4 } from '@/components/ui/typography/typography';
import MappingHelpers from '@/lib/classes/helpers/mapping-helpers';
import { useCvEditorState } from '@/lib/store/use-cv-editor';
import { Section } from '@/lib/types/cv-types';
import { ArrowLeft } from 'lucide-react';

interface Props {
    section: Section;
}

export default function CvEditorHeader({ section }: Props) {
    const { setActiveSection } = useCvEditorState();

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveSection(null)}
            >
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <TypographyH4 className="text-lg font-semibold capitalize">
                {`Edit ${MappingHelpers.getCvSectionLabelBySectionType(section.sectionType)} section`}
            </TypographyH4>
        </div>
    );
}
