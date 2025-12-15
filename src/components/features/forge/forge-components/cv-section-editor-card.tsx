'use client';

import { Button } from '@/ui/shadcn/button';
import { Card } from '@/ui/shadcn/card';
import { useCvEditorState } from '@/lib/store/use-cv-editor';
import { Section } from '@/lib/types/cv-types';
import { Trash2, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';

interface CvSectionEditorCardProps {
    section: Section;
    index: number;
}

export default function CvSectionEditorCard({
    section,
    index,
}: CvSectionEditorCardProps) {
    const { cv, removeSection, setActiveSection, reorderSections } =
        useCvEditorState();

    if (!cv) return null;

    const sections = cv.cvContent.sections;

    return (
        <Card
            key={index}
            className="p-3 flex flex-row items-center gap-3 hover:bg-accent/50 transition-colors cursor-pointer"
            onClick={() => setActiveSection(index)}
        >
            {/* Move Up / Down Arrows */}
            <div className="flex flex-col gap-1 mr-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    disabled={index === 0}
                    onClick={(e) => {
                        e.stopPropagation();
                        reorderSections(index, index - 1);
                    }}
                >
                    <ArrowUp className="h-3 w-3" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    disabled={index === sections.length - 1}
                    onClick={(e) => {
                        e.stopPropagation();
                        reorderSections(index, index + 1);
                    }}
                >
                    <ArrowDown className="h-3 w-3" />
                </Button>
            </div>
            {/* Section Info */}
            <div className="flex-1">
                <span className="font-medium capitalize">
                    {section.sectionType
                        .replace('ingot_', '')
                        .replace(/_/g, ' ')}
                </span>
                <div className="text-xs text-muted-foreground">
                    {section.ingotIds.length} items
                </div>
            </div>
            {/* Delete Button */}
            <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={(e) => {
                    e.stopPropagation();
                    removeSection(index);
                }}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
            <ChevronRight className="text-muted-foreground h-4 w-4" />
        </Card>
    );
}
