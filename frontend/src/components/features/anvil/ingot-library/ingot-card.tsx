'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Ingot } from '@/lib/types/ingot-types';
import { anvilEditPath } from '@/lib/constants/routing';
import { mappingHelpers } from '@/lib/helpers/mapping';
import { formatRelativeDate } from '@/lib/utils/format-date';
import { useDeleteIngot } from '@/hooks/use-ingots';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/ui/shadcn/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/ui/shadcn/alert-dialog';
import { MoreHorizontal } from 'lucide-react';

interface IngotCardProps {
    ingot: Ingot;
}

export function IngotCard({ ingot }: IngotCardProps) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const { mutate: deleteIngot, isPending } = useDeleteIngot();

    const billetCount = ingot.content.billets.length;
    const typeLabel = mappingHelpers.getIngotLabel(
        ingot.type as Parameters<typeof mappingHelpers.getIngotLabel>[0]
    );
    const lastEdited = formatRelativeDate(ingot.updatedAt);

    return (
        <>
            <div className="group relative rounded-lg border border-border-default bg-gunmetal transition-colors duration-150 hover:border-border-warm">
                <Link href={anvilEditPath(ingot.id)} className="block p-5">
                    <div className="mb-2">
                        <span className="inline-block rounded-full border border-flux/20 bg-flux/10 px-2 py-0.5 font-mono text-xs text-flux">
                            {typeLabel}
                        </span>
                    </div>
                    <h3 className="text-base font-semibold text-text-primary truncate pr-6">
                        {ingot.name}
                    </h3>
                    <div className="mt-3 flex items-center justify-between border-t border-border-default pt-3">
                        <span className="font-mono text-xs text-ash">
                            {billetCount}{' '}
                            {billetCount === 1 ? 'entry' : 'entries'}
                        </span>
                        <span className="font-mono text-xs text-ash">
                            {lastEdited}
                        </span>
                    </div>
                </Link>

                {/* Actions menu — sits outside the Link to avoid nesting */}
                <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className="flex h-7 w-7 items-center justify-center rounded-md text-ash hover:bg-slag hover:text-text-primary transition-colors"
                                aria-label="Ingot actions"
                                onClick={(e) => e.preventDefault()}
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                className="text-red-400 focus:text-red-400 cursor-pointer"
                                onSelect={() => setDeleteOpen(true)}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete &ldquo;{ingot.name}&rdquo;?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This cannot be undone. The ingot and all its billets
                            will be permanently removed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isPending}
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={() => deleteIngot(ingot.id)}
                        >
                            {isPending ? 'Deleting…' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
