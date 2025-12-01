'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IngotService } from '@/lib/classes/ingot-service';
import { Button } from '@/components/shadcn-components/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/shadcn-components/card';
import { TypographyH2 } from '@/components/ui/typography/typography';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
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

interface Ingot {
    id: string;
    name?: string | null;
    type?: string | null;
    updatedAt?: string;
}

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
        <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <TypographyH2 className="text-slate-50 border-none m-0">
                    My Ingots
                </TypographyH2>
                <Link href="/anvil/create">
                    <Button className="bg-forge-orange hover:bg-forge-ember text-white">
                        <Plus className="mr-2 h-4 w-4" /> Create New Ingot
                    </Button>
                </Link>
            </div>

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ingots.map((ingot) => (
                        <Card
                            key={ingot.id}
                            className="bg-slate-800 border-slate-700 hover:border-slate-500 transition-colors group"
                        >
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-slate-100 truncate pr-2">
                                        {ingot.name || 'Untitled Ingot'}
                                    </CardTitle>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link href={`/anvil/edit/${ingot.id}`}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-slate-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-slate-800 border-slate-700 text-slate-100">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Delete Ingot?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription className="text-slate-400">
                                                        This action cannot be
                                                        undone. This will
                                                        permanently delete the
                                                        ingot &quot;{ingot.name}
                                                        &quot;.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="bg-slate-700 text-slate-200 hover:bg-slate-600 border-none">
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handleDeleteIngot(
                                                                ingot.id
                                                            )
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
                                <CardDescription className="text-slate-400 text-xs font-mono mt-1">
                                    {ingot.type
                                        ?.replace('ingot_', '')
                                        .toUpperCase()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-slate-500">
                                    Last updated:{' '}
                                    {new Date(
                                        ingot.updatedAt || Date.now()
                                    ).toLocaleDateString()}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
