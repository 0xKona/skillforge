import Link from 'next/link';
import { Card } from '../../ui/component-library/shadcn-components/card';
import { Button } from '../../ui/component-library/shadcn-components/button';
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
} from '../../ui/component-library/shadcn-components/alert-dialog';
import { Ingot } from '@/lib/types/ingot-types';
import { useAnvilInterfaceState } from '@/lib/store/use-anvil-interface';
import { cn } from '@/lib/utils';
import { IngotService } from '@/lib/classes/ingot-service';
import { Edit, Trash2 } from 'lucide-react';

interface Props {
    ingotData: Ingot;
}

export default function IngotCard({ ingotData }: Props) {
    const { deleteAnvilIngot, openAnvilIngot } = useAnvilInterfaceState();
    const {
        color,
        icon: Icon,
        label,
    } = IngotService.getAnvilCardDisplayDetails(ingotData.type || '');

    return (
        <Card
            key={ingotData.id}
            className="group relative overflow-hidden bg-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col h-full p-0 gap-0"
            onClick={() => openAnvilIngot(ingotData.id)}
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
                    <h3 className="font-semibold text-lg text-slate-100 leading-tight line-clamp-2 group-hover:text-forge-orange transition-colors">
                        {ingotData.name || 'Untitled Ingot'}
                    </h3>
                    <p className="text-xs text-slate-500">
                        Updated{' '}
                        {new Date(
                            ingotData.updatedAt || Date.now()
                        ).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Actions Footer */}
            <div className="px-5 pb-5 pt-0 flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0">
                <Link
                    href={`/anvil/edit/${ingotData.id}`}
                    onClick={(e) => e.stopPropagation()}
                >
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
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent
                        className="bg-slate-900 border-slate-800 text-slate-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Ingot?</AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-400">
                                This action cannot be undone. This will
                                permanently delete the ingot &quot;
                                {ingotData.name}
                                &quot;.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteAnvilIngot(ingotData.id);
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white"
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
