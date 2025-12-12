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
} from '@/components/shadcn-components/tabs';
import { Button } from '@/components/shadcn-components/button';
import { Loader2, Save } from 'lucide-react';
import { CvHeader } from './cv-header';
import { SectionList } from './section-list';
import { SectionEditor } from './section-editor';

import { CvPreview } from './cv-preview';
import { TypographyH3 } from '@/components/ui/typography/typography';
import CvValidationError from '../components/cv-validation-error';
import CvEditorSkeleton from '../components/cv-editor-skeleton';
import { toast } from 'sonner';

interface CvEditorProps {
    cvId?: string;
}

export function CvEditor({ cvId }: CvEditorProps) {
    const {
        initializeEditor,
        loading,
        saving,
        isAutoSaving,
        saveCv,
        cv,
        activeSectionIndex,
        resetState,
        availableIngots,
    } = useCvEditorState();

    const isMobile = useIsMobile();

    // Auto-save every 30 seconds (default option)
    useCvAutoSave();

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

    if (isMobile) {
        return (
            <Tabs
                defaultValue="edit"
                className="w-full min-h-device flex flex-col"
            >
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                </TabsList>
                <TabsContent value="preview" className="flex-1 overflow-hidden">
                    {PreviewContent}
                </TabsContent>
                <TabsContent value="edit" className="flex-1 overflow-hidden">
                    {EditorContent}
                </TabsContent>
            </Tabs>
        );
    }

    return (
        <div className="bg-slate-900 w-full min-h-[1200px] rounded-xl border border-slate-700 flex flex-col overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
                <TypographyH3 className="text-2xl font-bold">
                    Edit CV
                </TypographyH3>
                <div className="flex items-center gap-3">
                    {isAutoSaving && toast('Autosaving...')}
                    <Button onClick={saveCv} disabled={saving}>
                        {saving && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        <Save className="mr-2 h-4 w-4" />
                        Save
                    </Button>
                </div>
            </div>
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
