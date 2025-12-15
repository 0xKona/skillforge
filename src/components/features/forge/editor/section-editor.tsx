'use client';

import { useCvEditorState } from '@/lib/store/use-cv-editor';
import { Checkbox } from '@/ui/shadcn/checkbox';
import { Label } from '@/ui/shadcn/label';
import { TypographyP } from '@/ui/typography/typography';
import CvSectionEditorSortDropdown from '../forge-components/cv-section-editor-billet-sort-dropdown';
import CvEditorHeader from '../forge-components/cv-editor-header';
import CvSectionEditorBillets from '../forge-components/cv-section-editor-billet';
import IngotHelpers from '@/lib/classes/helpers/ingot-helpers';
import Link from 'next/link';
import { Button } from '@/ui/shadcn/button';
import React from 'react';
import { CV } from '@/lib/types/cv-types';
import MappingHelpers from '@/lib/classes/helpers/mapping-helpers';

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
    const canSortBillets =
        IngotHelpers.checkBilletsCanBeSortedByDate(relevantIngots);

    // Checks if any ingots have a date value, implying they can be sorted by date
    const canSortIngots =
        IngotHelpers.checkIngotsCanBeSortedByDate(relevantIngots);

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
                    <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-lg bg-slate-800/50">
                        <p className="text-slate-400 mb-4">
                            {`You haven't created any ${MappingHelpers.getCvSectionLabelBySectionType(section.sectionType).toLowerCase()} yet.`}
                        </p>

                        <Link
                            href={`/anvil/create?ingotType=${section.sectionType}&redirectToCv=${(cv as CV).id}`}
                        >
                            <Button
                                variant="outline"
                                className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                            >
                                {`Create a ${MappingHelpers.getCvSectionLabelBySectionType(section.sectionType).toLowerCase()} ingot`}
                            </Button>
                        </Link>
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
