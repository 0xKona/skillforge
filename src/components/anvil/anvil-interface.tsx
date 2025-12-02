'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IngotService } from '@/lib/classes/ingot-service';
import { Button } from '@/components/shadcn-components/button';
import { TypographyH2 } from '@/components/ui/typography/typography';
import { Plus, Loader2 } from 'lucide-react';
import IngotCard from './ingot-card';
import { Ingot } from '@/lib/types/ingot';
import { toast } from 'sonner';

export default function AnvilInterface() {
    const [ingots, setIngots] = useState<Ingot[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadIngots();
    }, []);

    async function loadIngots() {
        setLoading(true);
        try {
            const data = await IngotService.listIngots();
            setIngots(data);
        } catch (error) {
            console.error('Failed to list ingots', error);
            toast.error('Failed to load ingots, please try again!');
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteIngot(id: string) {
        try {
            await IngotService.deleteIngot(id);
            setIngots(ingots.filter((i) => i.id !== id));
        } catch (error) {
            console.error('Failed to delete ingot', error);
        }
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6">
            {/* Titles / Header */}
            <div className="flex items-center justify-between">
                <TypographyH2 className="text-slate-50 border-none m-0">
                    My Ingots
                </TypographyH2>

                <Link href="/anvil/create">
                    <Button className="bg-forge-orange  text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Ingot
                    </Button>
                </Link>
            </div>

            {/* Loading */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-forge-orange" />
                </div>
            ) : ingots.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-lg bg-slate-800/50">
                    <p className="text-slate-400 mb-4">
                        You haven&apos;t created any ingots yet.
                    </p>
                    <Link href="/anvil/create">
                        <Button
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                        >
                            Create your first Ingot
                        </Button>
                    </Link>
                </div>
            ) : (
                // Ingot Grid
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ingots.map((ingot: Ingot) => (
                        <IngotCard
                            key={ingot.id}
                            ingot={ingot}
                            handleDeleteIngot={handleDeleteIngot}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
