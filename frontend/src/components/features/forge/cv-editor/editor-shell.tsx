'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/shadcn/tabs';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { SectionList } from './section-list';
import { AddSectionPicker } from './add-section-picker';
import { CvPreviewPane } from '@/components/features/forge/cv-document-preview/cv-preview-pane';

export function EditorShell() {
    const isMobile = useIsMobile(1024);

    if (isMobile) {
        return (
            <Tabs defaultValue="edit" className="min-h-0 flex-1">
                <div className="border-b border-border-default bg-graphite px-4">
                    <TabsList className="mx-auto flex h-10 w-full max-w-3xl">
                        <TabsTrigger value="edit" className="flex-1">
                            Edit
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="flex-1">
                            Preview
                        </TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="edit" className="m-0">
                    <div className="mx-auto w-full max-w-3xl px-4 py-6">
                        <SectionList />
                        <AddSectionPicker />
                    </div>
                </TabsContent>
                <TabsContent value="preview" className="m-0">
                    <div className="h-[calc(100vh-7rem-2.5rem)] px-4 py-4">
                        <CvPreviewPane />
                    </div>
                </TabsContent>
            </Tabs>
        );
    }

    return (
        <div className="min-h-0 flex-1">
            <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-6xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,480px)]">
                <div className="mx-auto w-full max-w-2xl self-start">
                    <SectionList />
                    <AddSectionPicker />
                </div>
                <div className="min-h-0 xl:sticky xl:top-28 xl:h-[calc(100vh-7rem)]">
                    <CvPreviewPane />
                </div>
            </div>
        </div>
    );
}
