import Link from 'next/link';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../shadcn-components/card';
import { Button } from '../shadcn-components/button';
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
} from '../shadcn-components/alert-dialog';
import { Edit, Trash2 } from 'lucide-react';
import { Ingot } from '@/lib/types/ingot';
import { redirect } from 'next/navigation';

interface Props {
    ingot: Ingot;
    handleDeleteIngot: (id: string) => void;
}

export default function IngotCard({ ingot, handleDeleteIngot }: Props) {
    return (
        <Card
            key={ingot.id}
            className="bg-slate-800 border-slate-700 hover:border-forge-orange transition-colors group cursor-pointer"
            onClick={() => redirect(`/anvil/edit/${ingot.id}`)}
        >
            {/* Top Row of content */}
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    {/* Ingot Name */}
                    <CardTitle className="text-slate-100 truncate pr-2">
                        {ingot.name || 'Untitled Ingot'}
                    </CardTitle>
                    {/* Ingot Links */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Edit Ingot */}
                        <Link href={`/anvil/edit/${ingot.id}`}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        </Link>
                        {/* Delete Ingot */}
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
                                        This action cannot be undone. This will
                                        permanently delete the ingot &quot;
                                        {ingot.name}
                                        &quot;.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-slate-700 text-slate-200 hover:bg-slate-600 border-none">
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() =>
                                            handleDeleteIngot(ingot.id)
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
                {/* Ingot Type */}
                <CardDescription className="text-slate-400 text-xs font-mono mt-1">
                    {ingot.type?.replace('ingot_', '').toUpperCase()}
                </CardDescription>
            </CardHeader>
            {/* Metadata  */}
            <CardContent>
                <p className="text-xs text-slate-500">
                    Last updated:{' '}
                    {new Date(
                        ingot.updatedAt || Date.now()
                    ).toLocaleDateString()}
                </p>
            </CardContent>
        </Card>
    );
}
