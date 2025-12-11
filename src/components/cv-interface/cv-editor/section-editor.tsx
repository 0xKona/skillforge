'use client';

import { useCvEditorState } from '@/lib/store/use-cv-editor';
import { Checkbox } from '@/components/shadcn-components/checkbox';
import { Label } from '@/components/shadcn-components/label';
import { getIngotLabelByValue } from '@/lib/mappings/ingot-mappings';
import { TypographyP } from '@/components/ui/typography/typography';
import CvSectionEditorSortDropdown from '../components/cv-section-editor-billet-sort-dropdown';
import CvEditorHeader from '../components/cv-editor-header';
import CvSectionEditorBillets from '../components/cv-section-editor-billet';

// TODO TOMORROW - Continue Refactor

export function SectionEditor() {
    const { cv, activeSectionIndex, availableIngots, toggleIngotInSection } =
        useCvEditorState();

    if (!cv || activeSectionIndex === null) return null;

    const section = cv.cvContent.sections[activeSectionIndex];

    // Filter ingots by section type
    let relevantIngots = availableIngots.filter(
        (ingot) => ingot.type === section?.sectionType
    );

    // Deduplicate ingots to prevent display issues
    relevantIngots = relevantIngots.filter(
        (ingot, index, self) =>
            index === self.findIndex((t) => t.id === ingot.id)
    );

    // Check is there are billets that can be sorted by date
    const canSortBillets: boolean = relevantIngots.some(
        (ingot) =>
            ingot.content.billets.length > 0 &&
            ingot.content.billets.some((billet) =>
                Object.values(billet.fields).some((f) => f.inputType === 'date')
            )
    );

    // Checks if any ingots have a date value, implying they can be sorted by date
    const canSortIngots: boolean = relevantIngots.some((ingot) =>
        Object.values(ingot.content.fields).some(
            (field) => field.inputType === 'date'
        )
    );

    return (
        <div className="space-y-6">
            {/* Section Editor Header */}
            <CvEditorHeader section={section} />

            {(canSortBillets || canSortIngots) && (
                <div className="flex">
                    {/* Ingot Sorting Dropdown Select */}
                    {canSortIngots && (
                        <CvSectionEditorSortDropdown
                            section={section}
                            activeSectionIndex={activeSectionIndex}
                            type="ingot"
                        />
                    )}

                    {/* Billet Sorting Dropdown Select */}
                    {canSortBillets && (
                        <CvSectionEditorSortDropdown
                            section={section}
                            activeSectionIndex={activeSectionIndex}
                            type="billet"
                        />
                    )}
                </div>
            )}

            {/* Ingot Selection */}
            <div className="space-y-4">
                <TypographyP className="text-sm font-medium text-muted-foreground">
                    Select Ingots and Billets to Include
                </TypographyP>

                {relevantIngots.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                        {`No ${getIngotLabelByValue(section.sectionType).toLowerCase()} items found in your library`}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {/* Render each ingot the user has in that section */}
                        {relevantIngots.map((ingot) => (
                            <div
                                key={ingot.id}
                                className="border rounded-md p-3 space-y-3"
                            >
                                {/* INGOT CARD */}
                                <div className="flex items-start space-x-3">
                                    <Checkbox
                                        id={ingot.id}
                                        checked={section.ingotIds.includes(
                                            ingot.id
                                        )}
                                        onCheckedChange={() => {
                                            toggleIngotInSection(
                                                activeSectionIndex,
                                                ingot.id
                                            );
                                        }}
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label
                                            htmlFor={ingot.id}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {ingot.name}
                                        </Label>
                                    </div>
                                </div>

                                {/* Render Billets for current ingot */}
                                {section.ingotIds.includes(ingot.id) &&
                                    ingot.content.billets.length > 0 && (
                                        <CvSectionEditorBillets
                                            ingot={ingot}
                                            section={section}
                                        />
                                    )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
