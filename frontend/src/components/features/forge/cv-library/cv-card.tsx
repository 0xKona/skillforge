'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CvDocument } from '@/lib/types/cv-document-types';
import { formatRelativeDate } from '@/lib/utils/format-date';
import { useDeleteCv } from '@/hooks/use-cvs';
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

interface CvCardProps {
    cv: CvDocument;
}

export function CvCard({ cv }: CvCardProps) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const { mutate: deleteCv, isPending } = useDeleteCv();

    const sectionCount = cv.content.sections.length;
    const lastEdited = formatRelativeDate(cv.updatedAt);

    return (
        <>
            <div className="group relative rounded-lg border border-border-default bg-gunmetal transition-colors duration-150 hover:border-border-warm">
                <Link href={`/forge/cv/${cv.id}`} className="block p-5">
                    <h3 className="text-base font-semibold text-text-primary truncate pr-6">
                        {cv.title}
                    </h3>
                    <div className="mt-3 flex items-center justify-between border-t border-border-default pt-3">
                        <span className="font-mono text-xs text-ash">
                            {sectionCount}{' '}
                            {sectionCount === 1 ? 'section' : 'sections'}
                        </span>
                        <span className="font-mono text-xs text-ash">
                            {lastEdited}
                        </span>
                    </div>
                </Link>

                <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className="flex h-7 w-7 items-center justify-center rounded-md text-ash hover:bg-slag hover:text-text-primary transition-colors"
                                aria-label="CV actions"
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
                            Delete &ldquo;{cv.title}&rdquo;?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This cannot be undone. The CV and all its sections
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
                            onClick={() => deleteCv(cv.id)}
                        >
                            {isPending ? 'Deleting…' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
