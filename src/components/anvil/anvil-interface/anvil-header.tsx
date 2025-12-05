import { Button } from '@/components/shadcn-components/button';
import { RefreshButton } from '@/components/ui/refresh-button';
import { TypographyH2 } from '@/components/ui/typography/typography';
import { useAnvilInterfaceState } from '@/lib/store/use-anvil-interface';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function AnvilHeader() {
    const { loading, loadAnvilIngots } = useAnvilInterfaceState();

    function RefreshButtonWithSettings() {
        return <RefreshButton isLoading={loading} onClick={loadAnvilIngots} />;
    }

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex justify-between w-full">
                <TypographyH2 className="text-slate-50 border-none m-0">
                    My Ingots
                </TypographyH2>
                <div className="sm:hidden">
                    <RefreshButtonWithSettings />
                </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
                <div className="hidden sm:block">
                    <RefreshButtonWithSettings />
                </div>

                <Link href="/anvil/create" className="w-full sm:w-auto">
                    <Button className="bg-forge-orange text-white w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Ingot
                    </Button>
                </Link>
            </div>
        </div>
    );
}
