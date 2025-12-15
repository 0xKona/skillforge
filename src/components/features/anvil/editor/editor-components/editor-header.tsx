import { Badge } from '@/ui/shadcn/badge';
import { Button } from '@/ui/shadcn/button';
import { TypographyH2 } from '@/ui/typography/typography';
import { Eye, Loader2, Save } from 'lucide-react';

interface EditorHeaderProps {
    title: string;
    typeLabel?: string;
    loading: boolean;
    onPreview: () => void;
    onSave: () => void;
}

interface EditorFooterProps {
    loading: boolean;
    onPreview: () => void;
    onSave: () => void;
}

export function EditorHeader({
    title,
    typeLabel,
    loading,
    onPreview,
    onSave,
}: EditorHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="flex items-center gap-4">
                <TypographyH2 className="text-slate-50 border-none m-0">
                    {title}
                </TypographyH2>
                {typeLabel && <Badge>{typeLabel}</Badge>}
            </div>
            <div className="hidden md:flex md:items-center gap-4">
                <Button
                    variant="outline"
                    onClick={onPreview}
                    className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                >
                    <Eye className="mr-2 h-4 w-4" /> Preview
                </Button>
                <Button
                    onClick={onSave}
                    disabled={loading}
                    className="bg-forge-orange hover:bg-forge-ember text-white min-w-[120px]"
                >
                    {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-2 h-4 w-4" />
                    )}
                    {loading ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </div>
    );
}

export function EditorFooter({
    loading,
    onPreview,
    onSave,
}: EditorFooterProps) {
    return (
        <div className="flex justify-end md:hidden gap-4">
            <Button
                variant="outline"
                onClick={onPreview}
                className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
            >
                <Eye className="mr-2 h-4 w-4" /> Preview
            </Button>
            <Button
                onClick={onSave}
                disabled={loading}
                className="bg-forge-orange hover:bg-forge-ember text-white min-w-[120px]"
            >
                {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Save className="mr-2 h-4 w-4" />
                )}
                {loading ? 'Saving...' : 'Save'}
            </Button>
        </div>
    );
}
