'use client';

import { useState } from 'react';
import { Hammer, Plus, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/ui/shadcn/button';
import { Input } from '@/ui/shadcn/input';
import { Textarea } from '@/ui/shadcn/textarea';
import { Label } from '@/ui/shadcn/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/ui/shadcn/dialog';
import { useCreateIngot } from '@/hooks/use-ingots';
import { SECTION_SCHEMAS, SECTION_META } from '@/lib/constants/cv-constants';
import type { DocumentItem, SectionType } from '@/lib/types/cv-document-types';
import type { Ingot, IngotField, Billet } from '@/lib/types/ingot-types';

interface QuickIngotDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sectionType: SectionType;
    initialItem?: DocumentItem;
    onIngotCreated?: (ingot: Ingot) => void;
}

export function QuickIngotDialog({
    open,
    onOpenChange,
    sectionType,
    initialItem,
    onIngotCreated,
}: QuickIngotDialogProps) {
    const meta = SECTION_META[sectionType];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto border-border-default bg-gunmetal text-text-primary">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-flux/10 text-flux">
                            <Hammer className="h-4 w-4" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-semibold">
                                {initialItem
                                    ? 'Promote to Anvil Ingot'
                                    : `Forge New ${meta.singularLabel} Ingot`}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-ash">
                                Save this canonical achievement to your reusable
                                Anvil library.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {open && (
                    <QuickIngotForm
                        sectionType={sectionType}
                        initialItem={initialItem}
                        onClose={() => onOpenChange(false)}
                        onIngotCreated={onIngotCreated}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}

interface QuickIngotFormProps {
    sectionType: SectionType;
    initialItem?: DocumentItem;
    onClose: () => void;
    onIngotCreated?: (ingot: Ingot) => void;
}

function QuickIngotForm({
    sectionType,
    initialItem,
    onClose,
    onIngotCreated,
}: QuickIngotFormProps) {
    const schema = SECTION_SCHEMAS[sectionType];
    const meta = SECTION_META[sectionType];
    const createIngot = useCreateIngot();

    const [name, setName] = useState(() => {
        if (initialItem) {
            const firstRequiredKey =
                Object.keys(schema.fields).find(
                    (k) => schema.fields[k].required
                ) ?? Object.keys(schema.fields)[0];
            return (
                initialItem.fields[firstRequiredKey] ||
                `New ${meta.singularLabel}`
            );
        }
        return '';
    });

    const [fields, setFields] = useState<Record<string, string>>(() => {
        if (initialItem) {
            return { ...initialItem.fields };
        }
        const initialFields: Record<string, string> = {};
        for (const key of Object.keys(schema.fields)) {
            initialFields[key] = '';
        }
        return initialFields;
    });

    const [billets, setBillets] = useState<
        Array<{ id: string; fields: Record<string, string> }>
    >(() => {
        if (initialItem) {
            return (initialItem.subItems ?? []).map((s) => ({
                id: s.id,
                fields: { ...s.fields },
            }));
        }
        return [];
    });

    const handleFieldChange = (key: string, value: string) => {
        setFields((prev) => ({ ...prev, [key]: value }));
    };

    const handleAddBillet = () => {
        if (!schema.subFields) return;
        const initialSub: Record<string, string> = {};
        for (const key of Object.keys(schema.subFields)) {
            initialSub[key] = '';
        }
        setBillets((prev) => [
            ...prev,
            { id: crypto.randomUUID(), fields: initialSub },
        ]);
    };

    const handleBilletFieldChange = (
        billetId: string,
        key: string,
        value: string
    ) => {
        setBillets((prev) =>
            prev.map((b) =>
                b.id === billetId
                    ? { ...b, fields: { ...b.fields, [key]: value } }
                    : b
            )
        );
    };

    const handleRemoveBillet = (billetId: string) => {
        setBillets((prev) => prev.filter((b) => b.id !== billetId));
    };

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error('Please enter an Ingot name');
            return;
        }

        try {
            const contentFields: Record<string, IngotField> = {};
            for (const [key, val] of Object.entries(fields)) {
                const def = schema.fields[key];
                contentFields[key] = {
                    mandatory: def?.required ?? false,
                    value: val,
                    inputType: (def?.type as IngotField['inputType']) ?? 'text',
                    label: def?.label,
                };
            }

            const contentBillets: Billet[] = billets.map((b) => {
                const bFields: Record<string, IngotField> = {};
                for (const [k, val] of Object.entries(b.fields)) {
                    const subDef = schema.subFields?.[k];
                    bFields[k] = {
                        mandatory: false,
                        value: val,
                        inputType:
                            (subDef?.type as IngotField['inputType']) ?? 'text',
                        label: subDef?.label,
                    };
                }
                return {
                    id: b.id,
                    type: schema.subFields
                        ? (Object.keys(schema.subFields)[0] ?? 'entry')
                        : 'entry',
                    fields: bFields,
                };
            });

            const newIngot = await createIngot.mutateAsync({
                type: `ingot_${sectionType}`,
                name: name.trim(),
                content: {
                    fields: contentFields,
                    billetFormat: null,
                    billets: contentBillets,
                },
            });

            toast.success(`Forged "${newIngot.name}" into Anvil library`);
            onIngotCreated?.(newIngot);
            onClose();
        } catch {
            toast.error('Failed to create Ingot');
        }
    };

    const subFieldEntries = schema.subFields
        ? Object.entries(schema.subFields)
        : [];

    return (
        <>
            <div className="space-y-4 pt-2">
                {/* Ingot Name */}
                <div className="space-y-1">
                    <Label className="text-xs text-ash">
                        Ingot Name <span className="text-flux">*</span>
                    </Label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Senior Frontend Engineer @ Acme"
                        className="h-8 bg-crucible border-border-default text-sm focus-visible:ring-1 focus-visible:ring-border-hot"
                    />
                </div>

                {/* Section Top-Level Fields */}
                <div className="grid grid-cols-2 gap-2.5">
                    {Object.entries(schema.fields).map(([key, def]) => (
                        <div
                            key={key}
                            className={
                                def.type === 'textarea'
                                    ? 'col-span-2 space-y-1'
                                    : 'space-y-1'
                            }
                        >
                            <Label className="text-xs text-ash">
                                {def.label}
                                {def.required && (
                                    <span className="text-flux ml-0.5">*</span>
                                )}
                            </Label>
                            {def.type === 'textarea' ? (
                                <Textarea
                                    value={fields[key] ?? ''}
                                    onChange={(e) =>
                                        handleFieldChange(key, e.target.value)
                                    }
                                    placeholder={def.placeholder}
                                    className="min-h-[50px] resize-y bg-crucible border-border-default text-xs"
                                />
                            ) : (
                                <Input
                                    value={fields[key] ?? ''}
                                    onChange={(e) =>
                                        handleFieldChange(key, e.target.value)
                                    }
                                    placeholder={def.placeholder}
                                    className="h-8 bg-crucible border-border-default text-xs"
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Billets / Sub-items */}
                {schema.allowSubItems && (
                    <div className="border-t border-border-default pt-3">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-medium text-ash">
                                Billets ({billets.length})
                            </span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleAddBillet}
                                className="h-6 text-[11px] text-flux hover:text-flux-hover"
                            >
                                <Plus className="mr-1 h-3 w-3" />
                                Add billet
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {billets.map((billet, bIdx) => (
                                <div
                                    key={billet.id}
                                    className="relative rounded-md border border-border-default bg-crucible p-2.5 space-y-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-[10px] text-ash uppercase tracking-wider">
                                            Entry #{bIdx + 1}
                                        </span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-5 w-5 text-ash hover:text-red-400"
                                            onClick={() =>
                                                handleRemoveBillet(billet.id)
                                            }
                                            aria-label="Remove billet"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>

                                    {subFieldEntries.map(([sKey, sDef]) => (
                                        <div key={sKey} className="space-y-0.5">
                                            <Label className="text-[11px] text-ash/80">
                                                {sDef.label}
                                            </Label>
                                            {sDef.type === 'textarea' ? (
                                                <Textarea
                                                    value={
                                                        billet.fields[sKey] ??
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        handleBilletFieldChange(
                                                            billet.id,
                                                            sKey,
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder={
                                                        sDef.placeholder
                                                    }
                                                    className="min-h-[40px] resize-y bg-gunmetal border-border-default text-xs"
                                                />
                                            ) : (
                                                <Input
                                                    value={
                                                        billet.fields[sKey] ??
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        handleBilletFieldChange(
                                                            billet.id,
                                                            sKey,
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder={
                                                        sDef.placeholder
                                                    }
                                                    className="h-7 bg-gunmetal border-border-default text-xs"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}

                            {billets.length === 0 && (
                                <p className="py-2 text-center text-xs text-ash/60">
                                    No billets added yet. Billets contain your
                                    specific roles or bullet points.
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <DialogFooter className="border-t border-border-default pt-3">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    disabled={createIngot.isPending}
                    className="text-xs text-ash"
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    size="sm"
                    onClick={handleSave}
                    disabled={createIngot.isPending}
                    className="bg-flux text-white hover:bg-flux-hover text-xs font-medium"
                >
                    {createIngot.isPending ? (
                        <>
                            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                            Forging...
                        </>
                    ) : (
                        'Save to Library'
                    )}
                </Button>
            </DialogFooter>
        </>
    );
}
