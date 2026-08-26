import { Input } from '@/ui/shadcn/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/ui/shadcn/select';
import { Search, X } from 'lucide-react';
import { Button } from '@/ui/shadcn/button';
import { mappingHelpers } from '@/lib/helpers/mapping';
import { IngotType } from '@/lib/types/ingot-types';

interface AnvilInterfaceFiltersProps {
    searchQuery: string;
    typeFilter: string;
    onSearchChange: (query: string) => void;
    onTypeChange: (type: string) => void;
    onReset: () => void;
}

export default function AnvilInterfaceFilters({
    searchQuery,
    typeFilter,
    onSearchChange,
    onTypeChange,
    onReset,
}: AnvilInterfaceFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                    placeholder="Search ingots..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-8 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-400 focus-visible:ring-forge-orange"
                />
            </div>
            <Select
                value={typeFilter}
                onValueChange={(value) => onTypeChange(value)}
            >
                <SelectTrigger className="w-full sm:w-[200px] bg-slate-800 border-slate-700 text-slate-100 focus:ring-forge-orange">
                    <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                    <SelectItem value="ALL">All Types</SelectItem>
                    {mappingHelpers
                        .getIngotTypeList()
                        .map((type: IngotType) => (
                            <SelectItem key={type} value={type}>
                                {mappingHelpers.getIngotLabel(type)}
                            </SelectItem>
                        ))}
                </SelectContent>
            </Select>
            {(searchQuery || typeFilter !== 'ALL') && (
                <Button
                    variant="ghost"
                    onClick={onReset}
                    className="text-slate-400 hover:text-white hover:bg-slate-800"
                >
                    <X className="mr-2 h-4 w-4" />
                    Reset
                </Button>
            )}
        </div>
    );
}
