'use client';

import { useEffect } from 'react';
import { useCvEditorState } from '@/lib/store/use-cv-editor';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { useCvAutoSave } from '@/hooks/use-cv-auto-save';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/component-library/shadcn-components/tabs';
import { Button } from '@/components/ui/component-library/shadcn-components/button';
import { Loader2, Save } from 'lucide-react';
import { CvHeader } from './cv-header';
import { SectionList } from './section-list';
import { SectionEditor } from './section-editor';

import { CvPreview } from '../../pdf/cv-preview';
import { TypographyH3 } from '@/components/ui/typography/typography';
import CvValidationError from '../forge-components/cv-validation-error';
import CvEditorSkeleton from '../forge-components/cv-editor-skeleton';

interface CvEditorProps {
    cvId?: string;
}

export function CvEditor({ cvId }: CvEditorProps) {
    const {
        initializeEditor,
        loading,
        saving,
        saveCv,
        cv,
        activeSectionIndex,
        resetState,
        availableIngots,
    } = useCvEditorState();

    const isMobile = useIsMobile();

    // Auto-save every 60 seconds (default option)
    useCvAutoSave(60000);

    useEffect(() => {
        return () => {
            // Reset state when the component unmounts
            resetState();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        initializeEditor(cvId);
    }, [cvId, initializeEditor]);

    if (loading) {
        return <CvEditorSkeleton />;
    }

    if (!cv) return <div>Failed to load CV</div>;

    const EditorContent = (
        <div className="space-y-6 p-4 h-full overflow-y-auto">
            <CvValidationError />
            <CvHeader />

            {activeSectionIndex !== null ? <SectionEditor /> : <SectionList />}
        </div>
    );

    const PreviewContent = (
        <div className="h-full overflow-hidden bg-slate-900">
            <CvPreview
                sections={cv.cvContent.sections}
                availableIngots={availableIngots}
            />
        </div>
    );

    const HeaderContent = (
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
            <TypographyH3 className="text-2xl font-bold">Edit CV</TypographyH3>
            <div className="flex items-center gap-3">
                <Button onClick={saveCv} disabled={saving}>
                    {saving && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <Save className="mr-2 h-4 w-4" />
                    Save & Close
                </Button>
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <div className="h-[calc(100dvh-100px)] w-full flex flex-col">
                {HeaderContent}
                <Tabs
                    defaultValue="edit"
                    className="w-full flex-1 flex flex-col min-h-0"
                >
                    <div className="px-4 py-2">
                        <TabsList className="grid w-full grid-cols-2 shrink-0">
                            <TabsTrigger value="preview">Preview</TabsTrigger>
                            <TabsTrigger value="edit">Edit</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent
                        value="preview"
                        className="flex-1 overflow-hidden min-h-0"
                    >
                        {PreviewContent}
                    </TabsContent>
                    <TabsContent
                        value="edit"
                        className="flex-1 overflow-hidden min-h-0"
                    >
                        {EditorContent}
                    </TabsContent>
                </Tabs>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 w-full min-h-[1200px] rounded-xl border border-slate-700 flex flex-col overflow-hidden shadow-2xl">
            {HeaderContent}
            {/* Body */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden ">
                {/* Left Panel (Preview) */}
                <div className="w-full md:w-1/2 bg-slate-900 flex flex-col border-r border-slate-700 ">
                    {PreviewContent}
                </div>
                {/* Right Panel (Options) */}
                <div className="w-full md:w-1/2 bg-slate-800/50 p-4 overflow-y-auto">
                    {EditorContent}
                </div>
            </div>
        </div>
    );
}
