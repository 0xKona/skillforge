import { Button } from '@/components/ui/component-library/shadcn-components/button';
import { Input } from '@/components/ui/component-library/shadcn-components/input';
import { useCvInterfaceState } from '@/lib/store/use-cv-interface';
import { X } from 'lucide-react';

export default function CvLibrarySearch() {
    const { searchQuery, setSearchQuery } = useCvInterfaceState();

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative w-full">
                <Input
                    placeholder="Search CVs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:ring-forge-orange/20 focus:border-forge-orange/50"
                />
            </div>
            {searchQuery && (
                <Button
                    variant="ghost"
                    onClick={() => setSearchQuery('')}
                    className="text-slate-400 hover:text-white hover:bg-slate-800"
                >
                    <X className="mr-2 h-4 w-4" />
                    Reset
                </Button>
            )}
        </div>
    );
}
