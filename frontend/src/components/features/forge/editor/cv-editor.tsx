'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCvEditorState } from '@/lib/store/use-cv-editor';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { useCvAutoSave } from '@/hooks/use-cv-auto-save';
import { useCv, useUpdateCv, useCreateCv } from '@/hooks/use-cvs';
import { useIngots } from '@/hooks/use-ingots';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/shadcn/tabs';
import { Button } from '@/ui/shadcn/button';
import { Loader2, Save } from 'lucide-react';
import { CvHeader } from './cv-header';
import { SectionList } from './section-list';
import { SectionEditor } from './section-editor';
import { CvPreview } from '../../pdf/cv-preview';
import { TypographyH3 } from '@/ui/typography/typography';
import CvValidationError from '../forge-components/cv-validation-error';
import CvEditorSkeleton from '../forge-components/cv-editor-skeleton';
import { CV, NewCV } from '@/lib/types/cv-types';

interface CvEditorProps {
    cvId?: string;
}

export function CvEditor({ cvId }: CvEditorProps) {
    const router = useRouter();
    const {
        loading,
        saving,
        cv,
        activeSectionIndex,
        availableIngots,
        setCvData,
        setSaving,
        resetState,
        runValidation,
    } = useCvEditorState();

    const isMobile = useIsMobile();

    // Fetch CV data (only if editing existing)
    const { data: fetchedCv, isLoading: cvLoading } = useCv(cvId || '');
    // Fetch all ingots for section assignment
    const { data: ingots = [], isLoading: ingotsLoading } = useIngots();

    const updateCv = useUpdateCv();
    const createCv = useCreateCv();

    // Auto-save every 60 seconds
    useCvAutoSave(60000);

    // Initialize store when data arrives
    useEffect(() => {
        if (ingotsLoading || (cvId && cvLoading)) return;

        if (cvId && fetchedCv) {
            // Check for missing ingots and clean sections
            const availableIngotIds = new Set(ingots.map((i) => i.id));
            let missingIngotsFound = false;

            const cleanedSections = fetchedCv.cvContent.sections.map(
                (section) => {
                    const validIngotIds = section.ingotIds.filter((id) =>
                        availableIngotIds.has(id)
                    );
                    if (validIngotIds.length !== section.ingotIds.length) {
                        missingIngotsFound = true;
                    }
                    return { ...section, ingotIds: validIngotIds };
                }
            );

            const cvData = missingIngotsFound
                ? { ...fetchedCv, cvContent: { sections: cleanedSections } }
                : fetchedCv;

            if (missingIngotsFound) {
                toast.warning(
                    'Some ingots in this CV were missing and have been removed.'
                );
            }

            setCvData(cvData, ingots);
        } else if (!cvId) {
            // New CV
            setCvData(
                {
                    version: 1,
                    title: 'My New CV',
                    description: '',
                    cvContent: { sections: [] },
                },
                ingots
            );
        }
    }, [cvId, fetchedCv, ingots, cvLoading, ingotsLoading, setCvData]);

    // Reset state on unmount
    useEffect(() => {
        return () => resetState();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleSave() {
        if (!cv) return;

        const { errors } = runValidation();
        if (errors.length > 0) {
            toast.error('Please fix validation errors before saving');
            return;
        }

        setSaving(true);

        if ('id' in cv) {
            updateCv.mutate(cv as CV, {
                onSuccess: () => {
                    toast.success('CV saved successfully');
                    router.push('/forge');
                },
                onError: () => {
                    toast.error('Failed to save CV, please try again');
                    setSaving(false);
                },
            });
        } else {
            createCv.mutate(cv as NewCV, {
                onSuccess: (created) => {
                    toast.success('CV created successfully');
                    router.push(`/forge/cv/${created.id}`);
                },
                onError: () => {
                    toast.error('Failed to create CV, please try again');
                    setSaving(false);
                },
            });
        }
    }

    if (loading || cvLoading || ingotsLoading) {
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
                <Button onClick={handleSave} disabled={saving}>
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
