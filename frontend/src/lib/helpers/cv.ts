import type { NewCvDocument } from '../types/cv-document-types';

export function buildBlankNewCv(): NewCvDocument {
    return {
        title: '',
        description: undefined,
        version: 1,
        content: { sections: [] },
    };
}
