import Link from 'next/link';
import { TypographyH3, TypographyP } from '@/ui/typography/typography';
import { Card } from '@/ui/shadcn/card';
import { Button } from '@/ui/shadcn/button';
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
} from '@/ui/shadcn/alert-dialog';
import { Ingot } from '@/lib/types/ingot-types';
import { CV } from '@/lib/types/cv-types';
import { useCvInterfaceState } from '@/lib/store/use-cv-interface';
import { useAnvilInterfaceState } from '@/lib/store/use-anvil-interface';
import { cn } from '@/lib/utils';
import { IngotService } from '@/lib/classes/services/ingot-service';
import { Edit, Trash2, FileText, LucideIcon } from 'lucide-react';

interface LibraryCardProps {
    cardData: Ingot | CV;
}

export default function LibraryCard({ cardData }: LibraryCardProps) {
    const isIngot = 'type' in cardData;
    const cvState = useCvInterfaceState();
    const anvilState = useAnvilInterfaceState();

    let color: string,
        Icon: LucideIcon,
        label: string,
        title: string,
        description: string | undefined,
        editHref: string,
        openFn: (id: string) => void,
        deleteFn: (id: string) => void;

    if (isIngot) {
        const ingot = cardData as Ingot;
        const details = IngotService.getAnvilCardDisplayDetails(
            ingot.type || ''
        );
        color = details.color;
        Icon = details.icon;
        label = details.label;
        title = ingot.name || 'Untitled Ingot';
        editHref = `/anvil/edit/${ingot.id}`;
        openFn = anvilState.openAnvilIngot;
        deleteFn = anvilState.deleteAnvilIngot;
    } else {
        const cv = cardData as CV;
        color = 'bg-blue-600';
        Icon = FileText;
        label = 'CV';
        title = cv.title || 'Untitled CV';
        description = cv.description as string;
        editHref = `/forge/cv/${cv.id}`;
        openFn = cvState.openCv;
        deleteFn = cvState.deleteCv;
    }

    const updatedAt = cardData.updatedAt || Date.now();

    return (
        <Card
            key={cardData.id}
            className="group relative overflow-hidden bg-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col h-full p-0 gap-0"
            onClick={() => openFn(cardData.id)}
        >
            {/* Banner / Type Indicator */}
            <div className={cn('h-1.5 w-full absolute top-0 left-0', color)} />

            <div className="p-5 flex-1 flex flex-col gap-4 pt-6">
                {/* Header with Icon and Type */}
                <div className="flex justify-between items-start">
                    <div
                        className={cn(
                            'p-2 rounded-lg bg-slate-800/50 text-slate-300',
                            color.replace('bg-', 'text-')
                        )}
                    >
                        <Icon className="h-5 w-5" />
                    </div>
                    <span
                        className={cn(
                            'text-[10px] font-bold px-2 py-1 rounded-full bg-slate-800/80 uppercase tracking-wider border border-slate-700',
                            color.replace('bg-', 'text-')
                        )}
                    >
                        {label}
                    </span>
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                    <TypographyH3 className="font-semibold text-lg text-slate-100 leading-tight line-clamp-2 group-hover:text-forge-orange transition-colors">
                        {title}
                    </TypographyH3>
                    <TypographyP className="text-xs text-slate-500">
                        Updated {new Date(updatedAt).toLocaleDateString()}
                    </TypographyP>
                    {description && (
                        <TypographyP className="text-sm text-slate-400 line-clamp-2 mt-2">
                            {description}
                        </TypographyP>
                    )}
                </div>
            </div>

            {/* Actions Footer */}
            <div className="px-5 pb-5 pt-0 flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0">
                <Link href={editHref} onClick={(e) => e.stopPropagation()}>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                    >
                        <Edit className="h-3.5 w-3.5 mr-1.5" />
                        Edit
                    </Button>
                </Link>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 hover:bg-red-950/30 cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-900 border-slate-800">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-slate-100">
                                Delete {label}?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-400">
                                {`This action cannot be undone. This will permanently delete the ${label.toLowerCase()} "${title}".`}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteFn(cardData.id);
                                }}
                                className="bg-red-600 text-white hover:bg-red-700 border-none"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </Card>
    );
}
