'use client';

import { useState } from 'react';
import { X, Square, CheckSquare } from 'lucide-react';
import { PDFViewer } from '@react-pdf/renderer';
import { Button } from '@/components/shadcn-components/button';
import { IngotPDF } from './ingot-pdf';
import { Card } from '@/components/shadcn-components/card';

interface PreviewBillet {
    id: string;
    content: Record<string, unknown>;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    ingotName: string;
    ingotType: string;
    ingotContent: Record<string, unknown>;
    billets: PreviewBillet[];
}

export default function PreviewModal({
    isOpen,
    onClose,
    ingotName,
    ingotType,
    ingotContent,
    billets,
}: Props) {
    const [selectedBilletIds, setSelectedBilletIds] = useState<Set<string>>(
        () => new Set(billets.map((b) => b.id))
    );

    if (!isOpen) return null;

    const toggleBillet = (id: string) => {
        const newSet = new Set(selectedBilletIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedBilletIds(newSet);
    };

    const filteredBillets = billets.filter((b) => selectedBilletIds.has(b.id));

    // Generate a key based on selected billets to force re-render of PDF document
    // This helps avoid reconciliation errors in react-pdf when removing items
    const pdfKey = Array.from(selectedBilletIds).sort().join('-');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8">
            <div className="bg-slate-900 w-full h-full max-w-7xl rounded-xl border border-slate-700 flex flex-col overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
                    <h2 className="text-xl font-semibold text-slate-100">
                        Ingot Preview
                    </h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="text-slate-400 hover:text-white hover:bg-slate-700"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Body */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    {/* Left Panel: Controls */}
                    <div className="w-full md:w-1/3 lg:w-1/4 border-r border-slate-700 bg-slate-800/50 p-4 overflow-y-auto">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">
                                    Ingot Details
                                </h3>
                                <Card className="p-3 bg-slate-800 border-slate-700">
                                    <p className="text-slate-200 font-medium">
                                        {ingotName}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {ingotType
                                            .replace('ingot_', '')
                                            .replace(/_/g, ' ')}
                                    </p>
                                </Card>
                            </div>

                            {billets.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                                            Include Billets
                                        </h3>
                                        <span className="text-xs text-slate-500">
                                            {selectedBilletIds.size} /{' '}
                                            {billets.length}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {billets.map((billet) => {
                                            const isSelected =
                                                selectedBilletIds.has(
                                                    billet.id
                                                );
                                            return (
                                                <div
                                                    key={billet.id}
                                                    onClick={() =>
                                                        toggleBillet(billet.id)
                                                    }
                                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                                        isSelected
                                                            ? 'bg-forge-orange/10 border-forge-orange/50'
                                                            : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                                                    }`}
                                                >
                                                    <div
                                                        className={`flex-shrink-0 ${
                                                            isSelected
                                                                ? 'text-forge-orange'
                                                                : 'text-slate-500'
                                                        }`}
                                                    >
                                                        {isSelected ? (
                                                            <CheckSquare className="h-5 w-5" />
                                                        ) : (
                                                            <Square className="h-5 w-5" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p
                                                            className={`text-sm font-medium truncate ${
                                                                isSelected
                                                                    ? 'text-slate-200'
                                                                    : 'text-slate-400'
                                                            }`}
                                                        >
                                                            {(billet.content
                                                                .name as string) ||
                                                                (billet.content
                                                                    .jobTitle as string) ||
                                                                (billet.content
                                                                    .projectName as string) ||
                                                                (billet.content
                                                                    .certName as string) ||
                                                                (billet.content
                                                                    .platform as string) ||
                                                                'Untitled'}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: PDF Preview */}
                    <div className="flex-1 bg-slate-900 flex flex-col">
                        <PDFViewer
                            key={pdfKey}
                            className="w-full h-full border-none"
                            showToolbar={true}
                        >
                            <IngotPDF
                                ingotName={ingotName}
                                ingotType={ingotType}
                                ingotContent={ingotContent}
                                billets={filteredBillets}
                            />
                        </PDFViewer>
                    </div>
                </div>
            </div>
        </div>
    );
}
