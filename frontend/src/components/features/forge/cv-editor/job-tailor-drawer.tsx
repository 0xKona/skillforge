'use client';

import { useState, useMemo } from 'react';
import {
    Sparkles,
    CheckCircle2,
    AlertCircle,
    ArrowUpRight,
    Copy,
    Check,
} from 'lucide-react';
import { Button } from '@/ui/shadcn/button';
import { Textarea } from '@/ui/shadcn/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/ui/shadcn/dialog';
import { useCvDocumentStore } from '@/lib/store/use-cv-document';
import { useIngots } from '@/hooks/use-ingots';
import {
    analyzeJobMatch,
    type JobMatchResult,
} from '@/lib/helpers/job-tailoring';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface JobTailorDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const SAMPLE_JD = `We are seeking a Senior Full-Stack Engineer to lead development on our cloud platform.
Required Skills:
- 5+ years building distributed web applications with TypeScript, React, and Next.js.
- Strong backend experience with Node.js, PostgreSQL, and Redis.
- Hands-on experience with AWS, Docker, Kubernetes, and CI/CD pipelines.
- Deep focus on performance optimization, security, and scalable system architecture.
- Excellent communication and cross-functional leadership skills.`;

export function JobTailorDrawer({ open, onOpenChange }: JobTailorDrawerProps) {
    const document = useCvDocumentStore((s) => s.document);
    const { data: ingots } = useIngots();
    const [jobDescription, setJobDescription] = useState('');
    const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

    const matchResult: JobMatchResult | null = useMemo(() => {
        if (!document || !jobDescription.trim()) return null;
        return analyzeJobMatch(jobDescription, document, ingots);
    }, [jobDescription, document, ingots]);

    const handleCopyKeyword = (kw: string) => {
        navigator.clipboard.writeText(kw);
        setCopiedKeyword(kw);
        toast.info(`Copied "${kw}" to clipboard`);
        setTimeout(() => setCopiedKeyword(null), 1500);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto border-border-default bg-gunmetal text-text-primary">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-flux/10 text-flux">
                            <Sparkles className="h-4 w-4" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-semibold">
                                The Quench: Job Spec Matcher
                            </DialogTitle>
                            <DialogDescription className="text-xs text-ash">
                                Paste a target job description to analyze
                                keyword coverage and uncover matching
                                achievements in your Anvil.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                    {/* Input Area */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-medium text-ash">
                                Target Job Description
                            </label>
                            <button
                                type="button"
                                onClick={() => setJobDescription(SAMPLE_JD)}
                                className="text-[11px] font-medium text-flux hover:underline"
                            >
                                Load Sample Spec
                            </button>
                        </div>
                        <Textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the job requirements, responsibilities, or technical stack here..."
                            className="min-h-[110px] resize-none border-border-default bg-crucible text-xs font-mono placeholder:text-ash/50"
                        />
                    </div>

                    {/* Results Panel */}
                    {matchResult && matchResult.totalKeywords > 0 && (
                        <div className="space-y-4 rounded-lg border border-border-default bg-graphite/60 p-4">
                            {/* Score Card */}
                            <div className="flex items-center justify-between border-b border-border-default pb-3">
                                <div>
                                    <div className="flex items-baseline gap-2">
                                        <span
                                            className={cn(
                                                'text-2xl font-bold font-mono',
                                                matchResult.score >= 70
                                                    ? 'text-emerald-400'
                                                    : matchResult.score >= 40
                                                      ? 'text-amber-400'
                                                      : 'text-ash'
                                            )}
                                        >
                                            {matchResult.score}%
                                        </span>
                                        <span className="text-xs text-ash">
                                            Keyword Coverage
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-ash">
                                        {matchResult.matchedKeywords.length} of{' '}
                                        {matchResult.totalKeywords} target
                                        keywords addressed in your CV
                                    </p>
                                </div>
                                <div className="h-2 w-32 overflow-hidden rounded-full bg-crucible">
                                    <div
                                        className={cn(
                                            'h-full transition-all duration-300',
                                            matchResult.score >= 70
                                                ? 'bg-emerald-500'
                                                : matchResult.score >= 40
                                                  ? 'bg-amber-500'
                                                  : 'bg-ash'
                                        )}
                                        style={{
                                            width: `${matchResult.score}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Covered Keywords */}
                            <div>
                                <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    <span>
                                        Covered in CV (
                                        {matchResult.matchedKeywords.length})
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {matchResult.matchedKeywords.length ===
                                    0 ? (
                                        <span className="text-xs text-ash">
                                            No matching keywords found yet.
                                        </span>
                                    ) : (
                                        matchResult.matchedKeywords.map(
                                            (kw) => (
                                                <span
                                                    key={kw}
                                                    className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-mono font-medium text-emerald-300"
                                                >
                                                    {kw}
                                                </span>
                                            )
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Missing Keywords */}
                            <div>
                                <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-amber-400">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    <span>
                                        Missing from CV (
                                        {matchResult.missingKeywords.length})
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {matchResult.missingKeywords.length ===
                                    0 ? (
                                        <span className="text-xs text-emerald-400">
                                            All detected target keywords are
                                            covered!
                                        </span>
                                    ) : (
                                        matchResult.missingKeywords.map(
                                            (kw) => (
                                                <button
                                                    key={kw}
                                                    type="button"
                                                    onClick={() =>
                                                        handleCopyKeyword(kw)
                                                    }
                                                    className="group inline-flex items-center gap-1 rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[11px] font-mono font-medium text-amber-300 hover:bg-amber-500/20 transition-colors"
                                                    title="Click to copy keyword"
                                                >
                                                    <span>{kw}</span>
                                                    {copiedKeyword === kw ? (
                                                        <Check className="h-3 w-3" />
                                                    ) : (
                                                        <Copy className="h-2.5 w-2.5 opacity-60 group-hover:opacity-100" />
                                                    )}
                                                </button>
                                            )
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Anvil Suggestions */}
                            {matchResult.anvilSuggestions.length > 0 && (
                                <div className="border-t border-border-default pt-3">
                                    <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-flux">
                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                        <span>
                                            Untapped Ingot in your Anvil
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {matchResult.anvilSuggestions.map(
                                            (sug) => (
                                                <div
                                                    key={sug.ingotId}
                                                    className="flex items-center justify-between rounded-md border border-border-default bg-crucible p-2.5"
                                                >
                                                    <div>
                                                        <p className="text-xs font-semibold text-text-primary">
                                                            {sug.ingotTitle}
                                                        </p>
                                                        <p className="text-[10px] text-ash">
                                                            Contains missing
                                                            keywords:{' '}
                                                            <span className="font-mono text-flux">
                                                                {sug.matchedKeywords.join(
                                                                    ', '
                                                                )}
                                                            </span>
                                                        </p>
                                                    </div>
                                                    <a
                                                        href={`/anvil/edit/?id=${sug.ingotId}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium text-ash hover:bg-graphite hover:text-text-primary"
                                                    >
                                                        View Ingot
                                                        <ArrowUpRight className="h-3 w-3" />
                                                    </a>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end pt-1">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onOpenChange(false)}
                            className="text-xs"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
