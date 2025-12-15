import { Button } from '@/ui/shadcn/button';
import { RefreshButton } from '@/widgets/refresh-button';
import {
    TypographyH2,
    TypographyP,
} from '@/ui/typography/typography';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface Props {
    isLoading: boolean;
    onRefresh: () => void;
    mainButtonText: string;
    mainButtonLink: string;
    headerTitleText: string;
    headerDescriptionText?: string;
}

export default function LibraryHeader({
    isLoading,
    onRefresh,
    mainButtonText,
    mainButtonLink,
    headerTitleText,
    headerDescriptionText,
}: Props) {
    function RefreshButtonWithSettings() {
        return <RefreshButton isLoading={isLoading} onClick={onRefresh} />;
    }

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex justify-between w-full">
                <div>
                    <TypographyH2 className="text-slate-50 border-none m-0">
                        {headerTitleText}
                    </TypographyH2>
                    {headerDescriptionText && (
                        <TypographyP className="text-slate-400 mt-1">
                            {headerDescriptionText}
                        </TypographyP>
                    )}
                </div>
                <div className="sm:hidden">
                    <RefreshButtonWithSettings />
                </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
                <div className="hidden sm:block">
                    <RefreshButtonWithSettings />
                </div>

                <Link href={mainButtonLink} className="w-full sm:w-auto">
                    <Button className="bg-forge-orange text-white w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        {mainButtonText}
                    </Button>
                </Link>
            </div>
        </div>
    );
}
