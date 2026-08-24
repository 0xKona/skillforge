'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { INGOT_TEMPLATES } from '@/lib/templates/ingot-templates';
import { IngotEditorData, IngotType } from '@/lib/types/ingot-types';
import { EditorFooter, EditorHeader } from './editor-components/editor-header';
import { IngotDetails } from './editor-components/ingot-details';
import { BilletSection } from './editor-components/billet-section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/shadcn/tabs';
import { useIngotEditorState } from '@/lib/store/use-ingot-editor';
import { useCreateIngot, useUpdateIngot } from '@/hooks/use-ingots';
import IngotEditorSkeleton from './ingot-editor-skeleton';
import { IngotFormHelper } from '@/lib/classes/helpers/ingot-form-helpers';
import IngotPreviewModal from '@/components/features/pdf/ingot-preview-modal';
import MappingHelpers from '@/lib/classes/helpers/mapping-helpers';

interface Props {
    initialIngotData: IngotEditorData;
}

export default function IngotEditor({ initialIngotData }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const {
        isLoading,
        ingotData,
        errors,
        initialize,
        initializeNewIngot,
        setIngotName,
        handleContentChange,
        handleBilletsChange,
    } = useIngotEditorState();

    const createIngot = useCreateIngot();
    const updateIngot = useUpdateIngot();

    const [showPreviewModal, setShowPreviewModal] = useState(false);

    const ingotId = 'id' in ingotData ? ingotData.id : null;
    const ingotType = ingotData.type as IngotType;
    const ingotName = ingotData.name;
    const ingotContent = ingotData.content;

    const currentTemplate = ingotType ? INGOT_TEMPLATES[ingotType] : null;
    const isSaving = createIngot.isPending || updateIngot.isPending;

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
        if (!ingotType) return;

        // Validate name
        if (!ingotName.trim()) {
            toast.error('Display Name is required');
            return;
        }

        // Validate fields
        const { valid, errors: fieldErrors } =
            IngotFormHelper.validateIngotFields(ingotContent.fields);

        if (!valid) {
            useIngotEditorState.setState({ errors: fieldErrors });
            toast.error('Please fix the errors in the form');
            return;
        }

        useIngotEditorState.setState({ errors: {} });

        const redirectToCv = searchParams.get('redirectToCv');

        if (ingotId) {
            updateIngot.mutate(
                { id: ingotId, name: ingotName, content: ingotContent },
                {
                    onSuccess: () => {
                        toast.success('Ingot updated successfully');
                        if (redirectToCv) {
                            router.push(`/forge/cv/${redirectToCv}`);
                        } else {
                            router.push('/anvil');
                        }
                    },
                    onError: () => toast.error('Failed to save ingot'),
                }
            );
        } else {
            createIngot.mutate(
                {
                    type: ingotType,
                    name: ingotName || 'Untitled Ingot',
                    content: ingotContent,
                },
                {
                    onSuccess: () => {
                        toast.success('Ingot created successfully');
                        if (redirectToCv) {
                            router.push(`/forge/cv/${redirectToCv}`);
                        } else {
                            router.push('/anvil');
                        }
                    },
                    onError: () => toast.error('Failed to save ingot'),
                }
            );
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
                loading={isSaving}
                onPreview={() => setShowPreviewModal(true)}
                onSave={handleSave}
            />
            {currentTemplate && showPreviewModal && (
                <IngotPreviewModal
                    isOpen={showPreviewModal}
                    onClose={() => setShowPreviewModal(false)}
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
                    <TabsContent value="details">
                        {IngotDetailsColumn}
                    </TabsContent>

                    <TabsContent value="billets">{BilletColumn}</TabsContent>
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
                loading={isSaving}
                onPreview={() => setShowPreviewModal(true)}
                onSave={handleSave}
            />
        </div>
    );
}
