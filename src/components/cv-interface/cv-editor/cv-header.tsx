'use client';

import { useCvEditorState } from '@/lib/store/use-cv-editor';
import { Input } from '@/components/shadcn-components/input';
import { Textarea } from '@/components/shadcn-components/textarea';
import { Label } from '@/components/shadcn-components/label';

export function CvHeader() {
    const { cv, updateMetadata } = useCvEditorState();

    if (!cv) return null;

    return (
        <div className="space-y-4 border p-4 rounded-lg bg-card">
            <div className="space-y-2">
                <Label htmlFor="cv-title">CV Title</Label>
                <Input
                    id="cv-title"
                    value={cv.title}
                    onChange={(e) =>
                        updateMetadata(e.target.value, cv.description || '')
                    }
                    placeholder="e.g. Software Engineer CV"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="cv-desc">Description</Label>
                <Textarea
                    id="cv-desc"
                    value={cv.description || ''}
                    onChange={(e) => updateMetadata(cv.title, e.target.value)}
                    placeholder="Internal notes about this CV..."
                />
            </div>
        </div>
    );
}
