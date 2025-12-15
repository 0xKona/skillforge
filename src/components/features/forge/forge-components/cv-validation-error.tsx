'use client';

import { useCvEditorState } from '@/lib/store/use-cv-editor';

export default function CvValidationError() {
    const { validationErrors } = useCvEditorState();

    return (
        validationErrors.length > 0 && (
            <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
            >
                <strong className="font-bold">
                    Please fix the following errors:
                </strong>
                <ul className="list-disc list-inside mt-1">
                    {validationErrors.map((err, i) => (
                        <li key={i}>{err}</li>
                    ))}
                </ul>
            </div>
        )
    );
}
