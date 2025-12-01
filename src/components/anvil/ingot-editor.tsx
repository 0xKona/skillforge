'use client';

import { useState, useEffect, useMemo } from 'react';
import { IngotService } from '@/lib/classes/ingot-service';
import { Button } from '@/components/shadcn-components/button';
import { Input } from '@/components/shadcn-components/input';
import { Label } from '@/components/shadcn-components/label';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/shadcn-components/card';
import { TypographyH2 } from '@/components/ui/typography/typography';
import { ArrowLeft, Save, Loader2, Eye } from 'lucide-react';
import { INGOT_TEMPLATES } from '@/lib/ingot-templates';
import { Billet, IngotTemplate } from '@/lib/types/ingot';
import DynamicForm from './dynamic-form';
import BilletEditor from './billet-editor';
import PreviewModal from './pdf-preview/preview-modal';

interface Props {
    ingotId: string | null;
    onBack: () => void;
}

export default function IngotEditor({ ingotId, onBack }: Props) {
    const [loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [ingotName, setIngotName] = useState('');
    const [ingotContent, setIngotContent] = useState<Record<string, unknown>>(
        {}
    );
    const [billets, setBillets] = useState<Billet[]>([]);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        if (ingotId) {
            loadIngot(ingotId);
        }
    }, [ingotId]);

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

            // Parse content
            let parsedContent = {};
            if (typeof data.content === 'string') {
                try {
                    parsedContent = JSON.parse(data.content);
                } catch (e) {
                    console.error('Failed to parse ingot content', e);
                }
            } else if (data.content) {
                parsedContent = data.content;
            }
            setIngotContent(parsedContent);

            // Parse billets
            let parsedBillets: Billet[] = [];
            if (data.billets) {
                if (typeof data.billets === 'string') {
                    try {
                        parsedBillets = JSON.parse(data.billets);
                    } catch (e) {
                        console.error('Failed to parse billets', e);
                    }
                } else if (Array.isArray(data.billets)) {
                    parsedBillets = data.billets as Billet[];
                }
            }
            setBillets(parsedBillets);
        } catch (error) {
            console.error('Failed to load ingot', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        if (!selectedType) return;

        setLoading(true);
        try {
            if (ingotId) {
                await IngotService.updateIngot(
                    ingotId,
                    ingotName,
                    ingotContent,
                    billets as unknown[]
                );
            } else {
                await IngotService.createIngot(
                    selectedType,
                    ingotName || 'Untitled Ingot',
                    ingotContent,
                    billets as unknown[]
                );
            }
            onBack();
        } catch (error) {
            console.error('Failed to save', error);
        } finally {
            setLoading(false);
        }
    }

    const handleContentChange = (key: string, value: string) => {
        setIngotContent((prev) => ({ ...prev, [key]: value }));
    };

    // Helper to parse allowed billet types from template
    const getAllowedBilletTypes = (template: IngotTemplate): string[] => {
        const typeString = template.fields.billetTemplateType?.value || '';
        if (!typeString) return [];
        return typeString
            .split('|')
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
    };

    // Helper to get the currently active billet type
    const getActiveBilletType = (template: IngotTemplate): string | null => {
        // If user has selected one in the form, use that
        if (ingotContent.billetTemplateType) {
            return ingotContent.billetTemplateType as string;
        }

        // Otherwise default to the first one in the list
        const allowed = getAllowedBilletTypes(template);
        if (allowed.length > 0) {
            return allowed[0];
        }

        return null;
    };

    const currentTemplate = selectedType ? INGOT_TEMPLATES[selectedType] : null;

    const allowedBilletTypes = useMemo(() => {
        return currentTemplate ? getAllowedBilletTypes(currentTemplate) : [];
    }, [currentTemplate]);

    const showBillets = allowedBilletTypes.length > 0;

    const activeBilletType = useMemo(() => {
        return currentTemplate ? getActiveBilletType(currentTemplate) : null;
    }, [currentTemplate, ingotContent.billetTemplateType]);

    // Auto-select billet type if only one option is available
    useEffect(() => {
        if (allowedBilletTypes.length === 1) {
            const singleType = allowedBilletTypes[0];
            if (ingotContent.billetTemplateType !== singleType) {
                handleContentChange('billetTemplateType', singleType);
            }
        }
    }, [allowedBilletTypes, ingotContent.billetTemplateType]);

    // If creating new and no type selected, show selector
    if (!ingotId && !selectedType) {
        return (
            <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <TypographyH2 className="text-slate-50 border-none m-0">
                        Select Ingot Type
                    </TypographyH2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.values(INGOT_TEMPLATES).map((template) => (
                        <Card
                            key={template.type}
                            className="bg-slate-800 border-slate-700 hover:border-forge-orange cursor-pointer transition-all hover:scale-[1.02]"
                            onClick={() => setSelectedType(template.type)}
                        >
                            <CardHeader>
                                <CardTitle className="text-slate-100 text-lg">
                                    {template.type
                                        .replace('ingot_', '')
                                        .replace(/_/g, ' ')
                                        .replace(/\b\w/g, (l) =>
                                            l.toUpperCase()
                                        )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-400 text-sm">
                                    Create a new{' '}
                                    {template.type
                                        .replace('ingot_', '')
                                        .replace(/_/g, ' ')}{' '}
                                    entry.
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (!currentTemplate) {
        return <div>Error: Template not found</div>;
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <TypographyH2 className="text-slate-50 border-none m-0">
                        {ingotId ? 'Edit Ingot' : 'Create Ingot'}
                    </TypographyH2>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-500 font-mono uppercase">
                        {selectedType?.replace('ingot_', '').replace(/_/g, ' ')}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => setShowPreview(true)}
                        className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                    >
                        <Eye className="mr-2 h-4 w-4" /> Preview
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-forge-orange hover:bg-forge-ember text-white min-w-[120px]"
                    >
                        {loading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </div>

            {currentTemplate && showPreview && (
                <PreviewModal
                    isOpen={showPreview}
                    onClose={() => setShowPreview(false)}
                    ingotName={ingotName}
                    ingotType={selectedType || ''}
                    ingotContent={ingotContent}
                    billets={billets}
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Ingot Details */}
                <div
                    className={
                        showBillets
                            ? 'lg:col-span-7 space-y-6'
                            : 'lg:col-span-12 space-y-6'
                    }
                >
                    <Card className="bg-slate-800 border-slate-700">
                        <CardHeader>
                            <CardTitle className="text-slate-100">
                                Ingot Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Top Level Name Field */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="ingotName"
                                    className="text-slate-200"
                                >
                                    Display Name{' '}
                                    <span className="text-red-400">*</span>
                                </Label>
                                <Input
                                    id="ingotName"
                                    value={ingotName}
                                    onChange={(e) =>
                                        setIngotName(e.target.value)
                                    }
                                    className="bg-slate-900 border-slate-700 text-slate-100 focus:border-forge-orange"
                                    placeholder="e.g. My Degree, Senior Dev Role"
                                />
                                <p className="text-xs text-slate-500">
                                    This name is used to identify this ingot in
                                    your list.
                                </p>
                            </div>

                            <div className="border-t border-slate-700/50 pt-6">
                                <DynamicForm
                                    fields={currentTemplate.fields}
                                    values={ingotContent}
                                    onChange={handleContentChange}
                                    readOnlyFields={
                                        billets.length > 0
                                            ? ['billetTemplateType']
                                            : []
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Billets (if supported) */}
                {showBillets && activeBilletType && (
                    <div className="lg:col-span-5 space-y-6">
                        <BilletEditor
                            billets={billets}
                            activeType={activeBilletType}
                            onChange={setBillets}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
