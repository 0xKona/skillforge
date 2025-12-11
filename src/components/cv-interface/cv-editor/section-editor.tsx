'use client';

import { useCvEditorState } from '@/lib/store/use-cv-editor';
import { Checkbox } from '@/components/shadcn-components/checkbox';
import { Label } from '@/components/shadcn-components/label';
import { sortBillets } from '@/lib/helpers/sort-helpers';
import { getIngotLabelByValue } from '@/lib/mappings/ingot-mappings';
import { TypographyP } from '@/components/ui/typography/typography';
import CvSectionEditorBilletSortDropdown from '../components/cv-section-editor-billet-sort-dropdown';
import CvEditorHeader from '../components/cv-editor-header';

// TODO TOMORROW - Continue Refactor

export function SectionEditor() {
    const {
        cv,
        activeSectionIndex,
        availableIngots,
        toggleIngotInSection,
        toggleBillet,
    } = useCvEditorState();

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

    // Check is there are billets that can be sorted
    const canSortBillets = relevantIngots.some(
        (ingot) =>
            ingot.content.billets.length > 0 &&
            ingot.content.billets.some((billet) =>
                Object.values(billet.fields).some((f) => f.inputType === 'date')
            )
    );

    return (
        <div className="space-y-6">
            {/* Section Editor Header */}
            <CvEditorHeader section={section} />

            {/* Billet Sorting Dropdown Select */}
            {canSortBillets && (
                <CvSectionEditorBilletSortDropdown
                    section={section}
                    activeSectionIndex={activeSectionIndex}
                />
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
                        {relevantIngots.map((ingot) => (
                            <div
                                key={ingot.id}
                                className="border rounded-md p-3 space-y-3"
                            >
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

                                {section.ingotIds.includes(ingot.id) &&
                                    ingot.content.billets.length > 0 && (
                                        <div className="ml-7 space-y-2 border-l-2 pl-3">
                                            <p className="text-xs font-semibold text-muted-foreground">
                                                Select items to include:
                                            </p>
                                            {sortBillets(
                                                ingot.content.billets,
                                                section.sortBilletsBy
                                            ).map((billet) => (
                                                <div
                                                    key={billet.id}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <Checkbox
                                                        id={billet.id}
                                                        checked={section.billetIds.includes(
                                                            billet.id
                                                        )}
                                                        onCheckedChange={() => {
                                                            toggleBillet(
                                                                activeSectionIndex,
                                                                billet.id
                                                            );
                                                        }}
                                                    />
                                                    <Label
                                                        htmlFor={billet.id}
                                                        className="text-sm font-normal"
                                                    >
                                                        {Object.values(
                                                            billet.fields
                                                        ).find((f) => f.value)
                                                            ?.value ||
                                                            'Untitled Item'}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
