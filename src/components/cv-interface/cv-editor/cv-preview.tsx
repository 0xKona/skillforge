'use client';

import dynamic from 'next/dynamic';
import { useCvEditorState } from '@/lib/store/use-cv-editor';
import { CvPDF } from './cv-pdf';
import { CV } from '@/lib/types/cv-types';

const PDFViewer = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center h-full text-slate-400">
                Loading Preview...
            </div>
        ),
    }
);

export function CvPreview() {
    const { cv, availableIngots } = useCvEditorState();

    if (!cv) return null;

    // VERY IMPORTANT - CAUSES NIGHTMARE ISSUES
    // Generate a key to force re-render of PDFViewer when structure changes
    // This prevents "Eo is not a function" errors from @react-pdf/renderer
    // when removing items from the document tree.
    const structureKey = JSON.stringify(cv.cvContent.sections);

    return (
        <div className="h-full w-full flex items-center justify-center">
            <PDFViewer
                key={structureKey}
                className="w-full h-full border-none"
                showToolbar={true}
            >
                <CvPDF cv={cv as CV} availableIngots={availableIngots} />
            </PDFViewer>
        </div>
    );
}
