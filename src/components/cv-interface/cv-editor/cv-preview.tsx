'use client';

import dynamic from 'next/dynamic';
import React, { useMemo } from 'react';
import { CV, Section } from '@/lib/types/cv-types';
import { Ingot } from '@/lib/types/ingot-types';
import { CvPDF } from '../../pdf-preview/cv-pdf';

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

interface CvPreviewProps {
    sections: Section[];
    availableIngots: Ingot[];
}

const CvPreviewComponent = ({ sections, availableIngots }: CvPreviewProps) => {
    // VERY IMPORTANT - CAUSES NIGHTMARE ISSUES
    // Generate a key to force re-render of PDFViewer when structure changes
    // This prevents "Eo is not a function" errors from @react-pdf/renderer
    // when removing items from the document tree.
    const structureKey = JSON.stringify(sections);

    // Create a temporary CV object to satisfy the CvPDF props
    const cv = useMemo(() => {
        return {
            cvContent: {
                sections: sections,
            },
        } as CV;
    }, [sections]);

    return (
        <div className="h-full w-full flex items-center justify-center">
            <PDFViewer
                key={structureKey}
                className="w-full h-full border-none"
                showToolbar={true}
            >
                <CvPDF cv={cv} availableIngots={availableIngots} />
            </PDFViewer>
        </div>
    );
};

// This is memoized, this means the component is only rerendered if the content is changed (deep)
// Which is why the object is stringified to json before comparison.
export const CvPreview = React.memo(
    CvPreviewComponent,
    (prevProps, nextProps) => {
        // Deep comparison to prevent unnecessary re-renders
        const sectionsChanged =
            JSON.stringify(prevProps.sections) !==
            JSON.stringify(nextProps.sections);
        const ingotsChanged =
            JSON.stringify(prevProps.availableIngots) !==
            JSON.stringify(nextProps.availableIngots);

        return !sectionsChanged && !ingotsChanged;
    }
);
