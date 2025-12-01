'use client';

import { useState } from 'react';
import { Billet, BilletTemplate, IngotContent } from '@/lib/types/ingot';
import { BILLET_TEMPLATES } from '@/lib/ingot-templates';
import DynamicForm from './dynamic-form';
import { Button } from '@/components/shadcn-components/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/shadcn-components/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/shadcn-components/alert-dialog';
import { Plus, Trash2, GripVertical, Edit2, X, Check } from 'lucide-react';

interface Props {
    billets: Billet[];
    activeType: string;
    onChange: (billets: Billet[]) => void;
}

export default function BilletEditor({ billets, activeType, onChange }: Props) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempBilletContent, setTempBilletContent] = useState<IngotContent>(
        {}
    );

    // Helper to get template for a type
    const getTemplate = (type: string): BilletTemplate | undefined => {
        return BILLET_TEMPLATES[type];
    };

    const handleStartAdd = () => {
        setTempBilletContent({});
        setIsAdding(true);
        setEditingId(null);
    };

    const handleStartEdit = (billet: Billet) => {
        setTempBilletContent({ ...billet.content });
        setEditingId(billet.id);
        setIsAdding(false);
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
        setTempBilletContent({});
    };

    const handleSave = () => {
        if (isAdding) {
            const newBillet: Billet = {
                id: crypto.randomUUID(),
                type: activeType,
                content: tempBilletContent,
            };
            onChange([...billets, newBillet]);
        } else if (editingId) {
            const updatedBillets = billets.map((b) =>
                b.id === editingId ? { ...b, content: tempBilletContent } : b
            );
            onChange(updatedBillets);
        }
        handleCancel();
    };

    const handleDelete = (id: string) => {
        onChange(billets.filter((b) => b.id !== id));
    };

    const handleContentChange = (key: string, value: string) => {
        setTempBilletContent((prev) => ({ ...prev, [key]: value }));
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
                    <div className="mb-6 p-4 rounded-lg bg-slate-900/50 border border-slate-700 animate-in fade-in slide-in-from-top-2 space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-medium text-slate-200">
                                {isAdding ? 'New Billet' : 'Edit Billet'}
                            </h4>
                            <span className="text-xs text-slate-500 uppercase font-mono">
                                {currentType
                                    .replace('billet_', '')
                                    .replace(/_/g, ' ')}
                            </span>
                        </div>

                        <DynamicForm
                            fields={currentTemplate.fields}
                            values={tempBilletContent}
                            onChange={handleContentChange}
                        />

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCancel}
                                className="h-8 text-slate-400 hover:text-white"
                            >
                                <X className="h-4 w-4 mr-1" /> Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSave}
                                className="h-8 bg-forge-orange hover:bg-forge-ember"
                            >
                                <Check className="h-4 w-4 mr-1" />{' '}
                                {isAdding ? 'Add' : 'Update'}
                            </Button>
                        </div>
                    </div>
                )}

                {/* List of Billets */}
                <div className="space-y-3">
                    {billets.length === 0 && !isAdding ? (
                        <div className="h-40 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-700/50 rounded-lg">
                            <p className="text-sm">No billets added yet.</p>
                        </div>
                    ) : (
                        billets.map((billet) => (
                            <div
                                key={billet.id}
                                className={`group p-3 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 transition-colors flex gap-3 items-start ${
                                    editingId === billet.id
                                        ? 'ring-1 ring-forge-orange border-forge-orange'
                                        : ''
                                }`}
                            >
                                <div className="mt-1 text-slate-600 cursor-grab active:cursor-grabbing">
                                    <GripVertical className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h5 className="text-slate-200 text-sm font-medium truncate">
                                        {(billet.content.name as string) ||
                                            (billet.content
                                                .jobTitle as string) ||
                                            (billet.content
                                                .projectName as string) ||
                                            (billet.content
                                                .certName as string) ||
                                            (billet.content
                                                .platform as string) ||
                                            'Untitled Billet'}
                                    </h5>
                                    <p className="text-slate-500 text-xs truncate mt-0.5">
                                        {billet.type
                                            .replace('billet_', '')
                                            .replace(/_/g, ' ')}
                                    </p>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                                        onClick={() => handleStartEdit(billet)}
                                        disabled={!!editingId || isAdding}
                                    >
                                        <Edit2 className="h-3 w-3" />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0 text-slate-500 hover:text-red-400"
                                                disabled={
                                                    !!editingId || isAdding
                                                }
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="bg-slate-800 border-slate-700 text-slate-100">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Delete Billet?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription className="text-slate-400">
                                                    This action cannot be
                                                    undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="bg-slate-700 text-slate-200 hover:bg-slate-600 border-none">
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() =>
                                                        handleDelete(billet.id)
                                                    }
                                                    className="bg-red-600 hover:bg-red-700 text-white"
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
