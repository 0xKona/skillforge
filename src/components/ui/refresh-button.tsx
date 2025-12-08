import { RefreshCw } from 'lucide-react';
import { Button } from '../shadcn-components/button';

interface RefreshButtonProps {
    onClick: () => void;
    isLoading: boolean;
}

export function RefreshButton(props: RefreshButtonProps) {
    return (
        <Button
            variant="outline"
            size="icon"
            onClick={props.onClick}
            className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
            disabled={props.isLoading}
        >
            <RefreshCw
                className={`h-4 w-4 ${props.isLoading ? 'animate-spin' : ''}`}
            />
        </Button>
    );
}
