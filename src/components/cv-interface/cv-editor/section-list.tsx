'use client';

import { useCvEditorState } from '@/lib/store/use-cv-editor';

import { IngotType } from '@/lib/types/ingot-types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/component-library/shadcn-components/select';
import { TypographyH4 } from '@/components/ui/typography/typography';
import {
    CV_SECTION_LABELS,
    CvSectionLabelMap,
    getCvSectionLabelByValue,
} from '@/lib/mappings/cv-mappings';
import { toast } from 'sonner';
import CvSectionEditorCard from '../components/cv-section-editor-card';

export function SectionList() {
    const { cv, addSection } = useCvEditorState();

    if (!cv) return null;

    const sections = cv.cvContent.sections;

    const checkSectionAlreadyExists = (type: IngotType): boolean => {
        const existingSectionTypes = sections.map(
            (section) => section.sectionType
        );
        return existingSectionTypes.includes(type);
    };

    const handleAddSection = (type: IngotType) => {
        if (checkSectionAlreadyExists(type)) {
            toast.warning(
                `You already have an ${getCvSectionLabelByValue(type)} section!`
            );
        } else {
            addSection(type as IngotType);
        }
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                {/* Title */}
                <TypographyH4 className="text-lg font-semibold">
                    Sections
                </TypographyH4>
                {/* Create New Section Dropdown */}
                <Select onValueChange={handleAddSection}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Add Section" />
                    </SelectTrigger>
                    <SelectContent>
                        {CV_SECTION_LABELS.map(
                            (sectionObj: CvSectionLabelMap) => (
                                <SelectItem
                                    key={JSON.stringify(sectionObj)}
                                    value={sectionObj.value}
                                >
                                    {sectionObj.label}
                                </SelectItem>
                            )
                        )}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                {sections.map((section, index) => (
                    <CvSectionEditorCard
                        key={section.sectionType + index}
                        section={section}
                        index={index}
                    />
                ))}

                {sections.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                        No sections added yet. Add one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
