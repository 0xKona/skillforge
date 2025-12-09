'use client';

import { useState } from 'react';
import { Billet, BilletTemplate, IngotField } from '@/lib/types/ingot';
import { BILLET_TEMPLATES } from '@/lib/ingot-templates';
import { Button } from '@/components/shadcn-components/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/shadcn-components/card';
import { Plus } from 'lucide-react';
import { BilletList } from './components/billet-list';
import { BilletForm } from './components/billet-form';

interface Props {
    billets: Billet[];
    activeType: string;
    onChange: (billets: Billet[]) => void;
}

export default function BilletEditor({ billets, activeType, onChange }: Props) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempBilletFields, setTempBilletFields] = useState<
        Record<string, IngotField>
    >({});

    // Helper to get template for a type
    const getTemplate = (type: string): BilletTemplate | undefined => {
        return BILLET_TEMPLATES[type];
    };

    const handleStartAdd = () => {
        const template = getTemplate(activeType);
        if (template) {
            setTempBilletFields(JSON.parse(JSON.stringify(template.fields)));
        }
        setIsAdding(true);
        setEditingId(null);
    };

    const handleStartEdit = (billet: Billet) => {
        setTempBilletFields(JSON.parse(JSON.stringify(billet.fields)));
        setEditingId(billet.id);
        setIsAdding(false);
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
        setTempBilletFields({});
    };

    const handleSave = (fields: Record<string, IngotField>) => {
        if (isAdding) {
            const newBillet: Billet = {
                id: crypto.randomUUID(),
                type: activeType,
                fields: fields,
            };
            onChange([...billets, newBillet]);
        } else if (editingId) {
            const updatedBillets = billets.map((b) =>
                b.id === editingId ? { ...b, fields: fields } : b
            );
            onChange(updatedBillets);
        }
        handleCancel();
    };

    const handleDelete = (id: string) => {
        onChange(billets.filter((b) => b.id !== id));
    };

    // Determine which template to use:
    // If adding, use activeType.
    // If editing, use the type of the billet being edited.
    const editingBillet = billets.find((b) => b.id === editingId);
    const currentType =
        editingId && editingBillet ? editingBillet.type : activeType;
    const currentTemplate = getTemplate(currentType);

    return (
        <Card className="bg-slate-800 border-slate-700 h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-slate-700/50">
                <CardTitle className="text-slate-100">Billets</CardTitle>
                {!isAdding && !editingId && (
                    <Button
                        size="sm"
                        className="bg-forge-orange hover:bg-forge-ember text-white"
                        onClick={handleStartAdd}
                        disabled={!activeType}
                    >
                        <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                )}
            </CardHeader>
            <CardContent className="flex-1 p-4 overflow-y-auto max-h-[600px]">
                {/* Editor Form (Add or Edit) */}
                {(isAdding || editingId) && currentTemplate && (
                    <BilletForm
                        template={currentTemplate}
                        initialFields={tempBilletFields}
                        type={currentType}
                        isAdding={isAdding}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                )}

                {/* List of Billets */}
                <BilletList
                    billets={billets}
                    editingId={editingId}
                    isAdding={isAdding}
                    onEdit={handleStartEdit}
                    onDelete={handleDelete}
                />
            </CardContent>
        </Card>
    );
}
