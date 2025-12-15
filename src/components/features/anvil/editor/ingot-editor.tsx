'use client';

import { useEffect } from 'react';
import { INGOT_TEMPLATES } from '@/lib/templates/ingot-templates';
import { IngotEditorData, IngotType } from '@/lib/types/ingot-types';
import { EditorFooter, EditorHeader } from './editor-components/editor-header';
import { IngotDetails } from './editor-components/ingot-details';
import { BilletSection } from './editor-components/billet-section';
import {
    Tabs,
    TabsContent,
    TabsContents,
    TabsList,
} from '@/components/animate-ui/animate/tabs';
import { TabsTrigger } from '@/components/animate-ui/components/animate/tabs';
import { redirect } from 'next/navigation';
import { useIngotEditorState } from '@/lib/store/use-ingot-editor';
import IngotEditorSkeleton from './ingot-editor-skeleton';
import { useIngotPreviewState } from '@/lib/store/use-ingot-preview';
import { IngotFormHelper } from '@/lib/classes/helpers/ingot-form-helpers';
import IngotPreviewModal from '@/components/features/pdf/ingot-preview-modal';
import MappingHelpers from '@/lib/classes/helpers/mapping-helpers';

interface Props {
    initialIngotData: IngotEditorData;
}

export default function IngotEditor({ initialIngotData }: Props) {
    const {
        isLoading,
        ingotData,
        errors,
        initialize,
        initializeNewIngot,
        setIngotName,
        handleContentChange,
        handleBilletsChange,
        saveIngot,
    } = useIngotEditorState();

    const { showPreviewModal, openPreviewModal } = useIngotPreviewState();

    const ingotId = 'id' in ingotData ? ingotData.id : null;
    const ingotType = ingotData.type as IngotType;
    const ingotName = ingotData.name;
    const ingotContent = ingotData.content;

    const currentTemplate = ingotType ? INGOT_TEMPLATES[ingotType] : null;

    // On component mount, load props into state
    useEffect(() => {
        initialize(initialIngotData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Initialize data from template when type is selected for new ingot
    useEffect(() => {
        if (
            !ingotId &&
            ingotType &&
            currentTemplate &&
            Object.keys(ingotContent.fields).length === 0
        ) {
            initializeNewIngot(currentTemplate);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ingotType, currentTemplate, ingotId, ingotContent.fields]);

    // Handle Saving Ingot Data
    async function handleSave() {
        const success = await saveIngot();
        if (success) {
            redirect('/anvil');
        }
    }

    const activeBilletType = currentTemplate?.content.billetFormat || null;
    const showBillets = !!activeBilletType;

    // Show skeleton whilst loading content
    if (isLoading && !currentTemplate) {
        return <IngotEditorSkeleton />;
    }

    if (!currentTemplate) {
        return (
            <div>
                Error: Ingot Type Template not found, please contact an
                administrator.
            </div>
        );
    }

    const IngotDetailsColumn = (
        <div
            className={
                showBillets
                    ? 'lg:col-span-7 space-y-6'
                    : 'lg:col-span-12 space-y-6'
            }
        >
            <IngotDetails
                ingotName={ingotName}
                onNameChange={setIngotName}
                fields={ingotContent.fields}
                values={IngotFormHelper.getIngotFieldValues(
                    ingotContent.fields
                )}
                onFieldChange={handleContentChange}
                errors={errors}
            />
        </div>
    );

    const BilletColumn = showBillets && activeBilletType && (
        <div className="lg:col-span-5 space-y-6">
            <BilletSection
                billets={ingotContent.billets}
                activeType={activeBilletType}
                onChange={handleBilletsChange}
            />
        </div>
    );

    return (
        <div className="w-full mx-auto p-6 space-y-6">
            <EditorHeader
                title={ingotId ? 'Edit Ingot' : 'Create Ingot'}
                typeLabel={MappingHelpers.getIngotLabelByType(ingotType)}
                loading={isLoading}
                onPreview={openPreviewModal}
                onSave={handleSave}
            />
            {currentTemplate && showPreviewModal && (
                <IngotPreviewModal
                    isOpen={showPreviewModal}
                    ingotData={ingotData}
                />
            )}

            {/* On mobile present content in tabs */}
            <div className="md:hidden">
                <Tabs
                    defaultValue="details"
                    className="w-full overflow-visible"
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="details">Ingot Details</TabsTrigger>
                        <TabsTrigger value="billets">Billets</TabsTrigger>
                    </TabsList>
                    <TabsContents>
                        <TabsContent value="details">
                            {IngotDetailsColumn}
                        </TabsContent>

                        <TabsContent value="billets">
                            {BilletColumn}
                        </TabsContent>
                    </TabsContents>
                </Tabs>
            </div>

            {/* On desktop and higher show side by side */}
            <div className="hidden md:grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Ingot Details */}
                {IngotDetailsColumn}

                {/* Right Column: Billets (if supported) */}
                {BilletColumn}
            </div>

            <EditorFooter
                loading={isLoading}
                onPreview={openPreviewModal}
                onSave={handleSave}
            />
        </div>
    );
}
