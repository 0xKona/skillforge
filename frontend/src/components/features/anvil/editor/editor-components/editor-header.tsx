import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff, Loader2, Save } from 'lucide-react';
import { Button } from '@/ui/shadcn/button';

interface EditorHeaderProps {
    title: string;
    typeLabel?: string;
    loading: boolean;
    preview: boolean;
    onPreview: () => void;
    onSave: () => void;
    redirectToCv?: string | null;
}

interface EditorFooterProps {
    loading: boolean;
    preview: boolean;
    onPreview: () => void;
    onSave: () => void;
    redirectToCv?: string | null;
}

function BackLink({ redirectToCv }: { redirectToCv?: string | null }) {
    return (
        <Button
            variant="ghost"
            size="sm"
            className="-ml-2 text-ash hover:bg-transparent hover:text-text-primary"
            asChild
        >
            <Link href={redirectToCv ? `/forge/cv/${redirectToCv}` : '/anvil'}>
                <ArrowLeft className="mr-1 h-4 w-4" />
                {redirectToCv ? 'Back to CV' : 'Back to ingots'}
            </Link>
        </Button>
    );
}

function PreviewButton({
    preview,
    onPreview,
}: {
    preview: boolean;
    onPreview: () => void;
}) {
    return (
        <Button
            variant="outline"
            onClick={onPreview}
            className={
                preview
                    ? 'border-flux/40 bg-flux/10 text-flux hover:bg-flux/15 hover:text-flux'
                    : 'border-border-default text-ash hover:bg-slag hover:text-text-primary'
            }
        >
            {preview ? (
                <EyeOff className="mr-2 h-4 w-4" />
            ) : (
                <Eye className="mr-2 h-4 w-4" />
            )}
            {preview ? 'Hide preview' : 'Show preview'}
        </Button>
    );
}

export function EditorHeader({
    title,
    typeLabel,
    loading,
    preview,
    onPreview,
    onSave,
    redirectToCv,
}: EditorHeaderProps) {
    return (
        <div className="space-y-4">
            <BackLink redirectToCv={redirectToCv} />
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="font-display text-2xl font-semibold text-text-primary">
                        {title}
                    </h1>
                    {typeLabel && (
                        <span className="rounded-full border border-flux/20 bg-flux/10 px-2 py-0.5 font-mono text-xs text-flux">
                            {typeLabel}
                        </span>
                    )}
                </div>
                <div className="hidden md:flex md:items-center gap-4">
                    <PreviewButton preview={preview} onPreview={onPreview} />
                    <Button
                        onClick={onSave}
                        disabled={loading}
                        className="bg-flux hover:bg-flux-hover text-white min-w-[120px]"
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
        </div>
    );
}

export function EditorFooter({
    loading,
    preview,
    onPreview,
    onSave,
    redirectToCv,
}: EditorFooterProps) {
    return (
        <div className="flex justify-end gap-4 md:hidden">
            <BackLink redirectToCv={redirectToCv} />
            <PreviewButton preview={preview} onPreview={onPreview} />
            <Button
                onClick={onSave}
                disabled={loading}
                className="bg-flux hover:bg-flux-hover text-white min-w-[120px]"
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
