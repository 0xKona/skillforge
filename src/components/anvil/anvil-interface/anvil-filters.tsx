import { useAnvilInterfaceState } from '@/lib/store/use-anvil-interface';
import { Input } from '@/components/shadcn-components/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/shadcn-components/select';
import { Search, X } from 'lucide-react';
import { INGOT_TYPE_LABELS } from '@/lib/types/ingot';
import { Button } from '@/components/shadcn-components/button';

export default function AnvilInterfaceFilters() {
    const {
        searchQuery,
        typeFilter,
        setSearchQuery,
        setTypeFilter,
        resetFilters,
    } = useAnvilInterfaceState();

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                    placeholder="Search ingots..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-forge-orange"
                />
            </div>
            <Select
                value={typeFilter}
                onValueChange={(value) => setTypeFilter(value)}
            >
                <SelectTrigger className="w-full sm:w-[200px] bg-slate-800 border-slate-700 text-slate-100 focus:ring-forge-orange">
                    <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                    <SelectItem value="ALL">All Types</SelectItem>
                    {INGOT_TYPE_LABELS.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                            {type.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {(searchQuery || typeFilter !== 'ALL') && (
                <Button
                    variant="ghost"
                    onClick={resetFilters}
                    className="text-slate-400 hover:text-white hover:bg-slate-800"
                >
                    <X className="mr-2 h-4 w-4" />
                    Reset
                </Button>
            )}
        </div>
    );
}
