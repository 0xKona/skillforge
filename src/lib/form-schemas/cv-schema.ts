import { z } from 'zod';
import { INGOT_TYPE_LABELS } from '../mappings/ingot-mappings';

export const cvSectionSchema = z.object({
    sectionType: z.string(),
    ingotIds: z.array(z.string()),
    billetIds: z.array(z.string()),
    sortIngotsBy: z.enum(['date-desc', 'date-asc', 'none']).optional(),
    sortBilletsBy: z.enum(['date-desc', 'date-asc', 'none']).optional(),
    customTitle: z.string().optional(),
    isVisible: z.boolean().optional(),
});

export const cvContentSchema = z.object({
    sections: z.array(cvSectionSchema),
});

export const cvSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    version: z.number(),
    cvContent: cvContentSchema,
});

export type CvFormValues = z.infer<typeof cvSchema>;

export const validateCv = (cv: CvFormValues) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for Personal Info
    const hasPersonalInfo = cv.cvContent.sections.some(
        (s) => s.sectionType === 'ingot_personal_info' && s.isVisible !== false
    );
    if (!hasPersonalInfo) {
        errors.push('A Personal Info section is required.');
    }

    // Check for Experience
    const hasExperience = cv.cvContent.sections.some(
        (s) => s.sectionType === 'ingot_experience' && s.isVisible !== false
    );
    if (!hasExperience) {
        warnings.push('An Experience section is recommended.');
    }

    // Check for empty sections
    cv.cvContent.sections.forEach((section) => {
        if (section.isVisible !== false && section.ingotIds.length === 0) {
            const label =
                INGOT_TYPE_LABELS.find((t) => t.value === section.sectionType)
                    ?.label || section.sectionType;
            warnings.push(`The ${label} section is empty.`);
        }
    });

    return { errors, warnings };
};
