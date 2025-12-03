'use client';

import { useState, useEffect } from 'react';
import { IngotService } from '@/lib/classes/ingot-service';
import { toast } from 'sonner';
import { INGOT_TEMPLATES } from '@/lib/ingot-templates';
import { Billet, IngotContent, IngotField } from '@/lib/types/ingot';
import PreviewModal from '../pdf-preview/preview-modal';
import { EditorFooter, EditorHeader } from './components/editor-header';
import { IngotDetails } from './components/ingot-details';
import { BilletSection } from './components/billet-section';
import { generateSchemaFromIngotFields } from '@/lib/form-schemas/ingot-form-generator';
import {
    Tabs,
    TabsContent,
    TabsContents,
    TabsList,
} from '@/components/animate-ui/animate/tabs';
import { TabsTrigger } from '@/components/animate-ui/components/animate/tabs';
import { Skeleton } from '@/components/shadcn-components/skeleton';

interface Props {
    ingotId: string | null;
    initialType?: string | null;
}

export default function IngotEditor({ ingotId, initialType }: Props) {
    const [loading, setLoading] = useState(!!ingotId);
    const [selectedType, setSelectedType] = useState<string | null>(
        initialType || null
    );
    const [ingotName, setIngotName] = useState('');
    const [ingotData, setIngotData] = useState<IngotContent>({
        fields: {},
        billetFormat: null,
        billets: [],
    });
    const [showPreview, setShowPreview] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (ingotId) {
            loadIngot(ingotId);
        }
    }, [ingotId]);

    // Load Ingot Data
    async function loadIngot(id: string) {
        setLoading(true);
        try {
            const data = await IngotService.getIngot(id);

            if (!data) {
                console.error('Ingot not found');
                return;
            }

            setIngotName(data.name || '');
            setSelectedType(data.type || null);

            if (data.content) {
                setIngotData(data.content);
            }
        } catch (error) {
            console.error('Failed to load ingot', error);
        } finally {
            setLoading(false);
        }
    }

    // Helper to extract values for DynamicForm and Preview
    const getFieldValues = (fields: Record<string, IngotField>) => {
        const values: Record<string, string> = {};
        Object.keys(fields).forEach((key) => {
            const field = fields[key];
            const value = field?.value;

            // Handle potential object values (nested fields)
            if (typeof value === 'object' && value !== null) {
                // @ts-expect-error - Handle runtime data issue
                values[key] = value.value || '';
            } else {
                values[key] = String(value || '');
            }
        });
        return values;
    };

    // Handle Saving Ingot Data
    async function handleSave() {
        if (!selectedType) return;

        // Validation
        if (!ingotName.trim()) {
            toast.error('Display Name is required');
            return;
        }

        // Zod Validation
        const schema = generateSchemaFromIngotFields(ingotData.fields);
        const values = getFieldValues(ingotData.fields);

        const result = schema.safeParse(values);

        if (!result.success) {
            const newErrors: Record<string, string> = {};
            result.error.issues.forEach((err) => {
                if (err.path[0]) {
                    newErrors[err.path[0] as string] = err.message;
                }
            });
            setErrors(newErrors);
            toast.error('Please fix the errors in the form');
            return;
        }

        setErrors({});

        setLoading(true);
        try {
            if (ingotId) {
                await IngotService.updateIngot(ingotId, ingotName, ingotData);
                toast.success('Ingot updated successfully');
            } else {
                await IngotService.createIngot(
                    selectedType,
                    ingotName || 'Untitled Ingot',
                    ingotData
                );
                toast.success('Ingot created successfully');
            }
        } catch (error) {
            console.error('Failed to save', error);
            toast.error('Failed to save ingot');
        } finally {
            setLoading(false);
        }
    }

    const handleContentChange = (key: string, value: string) => {
        setIngotData((prev) => ({
            ...prev,
            fields: {
                ...prev.fields,
                [key]: {
                    ...prev.fields[key],
                    value,
                },
            },
        }));

        // Clear error when user types
        if (errors[key]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        }
    };

    const handleBilletsChange = (newBillets: Billet[]) => {
        setIngotData((prev) => ({
            ...prev,
            billets: newBillets,
        }));
    };

    // Helper to map billets for preview (flattening fields to content)
    const mapBilletsForPreview = (billets: Billet[]) => {
        return billets.map((b) => ({
            ...b,
            content: getFieldValues(b.fields),
        }));
    };

    const currentTemplate = selectedType ? INGOT_TEMPLATES[selectedType] : null;

    // Initialize data from template when type is selected for new ingot
    useEffect(() => {
        if (
            !ingotId &&
            selectedType &&
            currentTemplate &&
            Object.keys(ingotData.fields).length === 0
        ) {
            // Deep copy to avoid mutating template
            setIngotData(JSON.parse(JSON.stringify(currentTemplate.content)));
        }
    }, [selectedType, currentTemplate, ingotId, ingotData.fields]);

    const activeBilletType = currentTemplate?.content.billetFormat || null;
    const showBillets = !!activeBilletType;

    // Show skeleton whilst loading content
    if (loading && !currentTemplate) {
        return (
            <div className="w-full mx-auto p-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48 bg-slate-800" />
                        <Skeleton className="h-4 w-32 bg-slate-800" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-24 bg-slate-800" />
                        <Skeleton className="h-10 w-24 bg-slate-800" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7 space-y-6">
                        <Skeleton className="h-[600px] w-full bg-slate-800 rounded-xl" />
                    </div>
                    <div className="hidden lg:block lg:col-span-5 space-y-6">
                        <Skeleton className="h-[600px] w-full bg-slate-800 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (!currentTemplate) {
        return <div>Error: Template not found</div>;
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
                fields={ingotData.fields}
                values={getFieldValues(ingotData.fields)}
                onFieldChange={handleContentChange}
                errors={errors}
            />
        </div>
    );

    const BilletColumn = showBillets && activeBilletType && (
        <div className="lg:col-span-5 space-y-6">
            <BilletSection
                billets={ingotData.billets}
                activeType={activeBilletType}
                onChange={handleBilletsChange}
            />
        </div>
    );

    return (
        <div className="w-full mx-auto p-6 space-y-6">
            <EditorHeader
                title={ingotId ? 'Edit Ingot' : 'Create Ingot'}
                typeLabel={selectedType
                    ?.replace('ingot_', '')
                    .replace(/_/g, ' ')}
                loading={loading}
                onPreview={() => setShowPreview(true)}
                onSave={handleSave}
            />
            {currentTemplate && showPreview && (
                <PreviewModal
                    isOpen={showPreview}
                    onClose={() => setShowPreview(false)}
                    ingotName={ingotName}
                    ingotType={selectedType || ''}
                    ingotContent={getFieldValues(ingotData.fields)}
                    billets={mapBilletsForPreview(ingotData.billets)}
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
                    {/* <Card> */}
                    <TabsContents>
                        <TabsContent value="details">
                            {IngotDetailsColumn}
                        </TabsContent>

                        <TabsContent value="billets">
                            {BilletColumn}
                        </TabsContent>
                    </TabsContents>
                    {/* </Card> */}
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
                loading={loading}
                onPreview={() => setShowPreview(true)}
                onSave={handleSave}
            />
        </div>
    );
}
