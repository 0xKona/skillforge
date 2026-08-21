import { render, screen } from '@testing-library/react';
import SectionRenderer from './section-renderer';
import { Ingot, IngotType } from '@/lib/types/ingot-types';

// Mock child components
jest.mock(
    '@/components/features/pdf/pdf-sections/personal-info-section',
    () => ({
        PersonalInfoSection: () => <div data-testid="personal-info-section" />,
    })
);
jest.mock('@/components/features/pdf/pdf-sections/experience-section', () => ({
    ExperienceSection: () => <div data-testid="experience-section" />,
}));
jest.mock('@/components/features/pdf/pdf-sections/education-section', () => ({
    EducationSection: () => <div data-testid="education-section" />,
}));
jest.mock('@/components/features/pdf/pdf-sections/skills-section', () => ({
    SkillsSection: () => <div data-testid="skills-section" />,
}));
jest.mock(
    '@/components/features/pdf/pdf-sections/certifications-section',
    () => ({
        CertificationSection: () => <div data-testid="certification-section" />,
    })
);
jest.mock('@/components/features/pdf/pdf-sections/projects-section', () => ({
    ProjectsSection: () => <div data-testid="projects-section" />,
}));
jest.mock(
    '@/components/features/pdf/pdf-sections/personal-statement-section',
    () => ({
        PersonalStatementSection: () => (
            <div data-testid="personal-statement-section" />
        ),
    })
);
jest.mock('@/components/features/pdf/pdf-sections/reference-section', () => ({
    ReferenceSection: () => <div data-testid="reference-section" />,
}));
jest.mock('@/components/features/pdf/pdf-sections/generic-section', () => ({
    GenericSection: () => <div data-testid="generic-section" />,
}));

describe('SectionRenderer', () => {
    const mockIngot: Ingot = {
        id: '1',
        name: 'Test Ingot',
        type: 'ingot_personal_info',
        content: {
            fields: {},
            billets: [],
            billetFormat: null,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    it('returns null if no ingots provided', () => {
        const { container } = render(
            <SectionRenderer sectionType="ingot_personal_info" ingots={[]} />
        );
        expect(container).toBeEmptyDOMElement();
    });

    it('renders PersonalInfoSection for ingot_personal_info', () => {
        render(
            <SectionRenderer
                sectionType="ingot_personal_info"
                ingots={[mockIngot]}
            />
        );
        expect(screen.getByTestId('personal-info-section')).toBeInTheDocument();
    });

    it('renders ExperienceSection for ingot_experience', () => {
        render(
            <SectionRenderer
                sectionType="ingot_experience"
                ingots={[mockIngot]}
            />
        );
        expect(screen.getByTestId('experience-section')).toBeInTheDocument();
    });

    it('renders EducationSection for ingot_education', () => {
        render(
            <SectionRenderer
                sectionType="ingot_education"
                ingots={[mockIngot]}
            />
        );
        expect(screen.getByTestId('education-section')).toBeInTheDocument();
    });

    it('renders SkillsSection for ingot_skill', () => {
        render(
            <SectionRenderer sectionType="ingot_skill" ingots={[mockIngot]} />
        );
        expect(screen.getByTestId('skills-section')).toBeInTheDocument();
    });

    it('renders CertificationSection for ingot_certification', () => {
        render(
            <SectionRenderer
                sectionType="ingot_certification"
                ingots={[mockIngot]}
            />
        );
        expect(screen.getByTestId('certification-section')).toBeInTheDocument();
    });

    it('renders ProjectsSection for ingot_project', () => {
        render(
            <SectionRenderer sectionType="ingot_project" ingots={[mockIngot]} />
        );
        expect(screen.getByTestId('projects-section')).toBeInTheDocument();
    });

    it('renders PersonalStatementSection for ingot_personal_statement', () => {
        render(
            <SectionRenderer
                sectionType="ingot_personal_statement"
                ingots={[mockIngot]}
            />
        );
        expect(
            screen.getByTestId('personal-statement-section')
        ).toBeInTheDocument();
    });

    it('renders ReferenceSection for ingot_reference', () => {
        render(
            <SectionRenderer
                sectionType="ingot_reference"
                ingots={[mockIngot]}
            />
        );
        expect(screen.getByTestId('reference-section')).toBeInTheDocument();
    });

    it('renders GenericSection for ingot_hobby', () => {
        render(
            <SectionRenderer sectionType="ingot_hobby" ingots={[mockIngot]} />
        );
        expect(screen.getByTestId('generic-section')).toBeInTheDocument();
    });

    it('renders GenericSection for unknown type', () => {
        render(
            <SectionRenderer
                sectionType={'unknown_type' as unknown as IngotType}
                ingots={[mockIngot]}
            />
        );
        expect(screen.getByTestId('generic-section')).toBeInTheDocument();
    });
});
