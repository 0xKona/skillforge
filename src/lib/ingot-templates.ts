import { IngotTemplate, BilletTemplate } from './types/ingot';

export const BILLET_TEMPLATES: Record<string, BilletTemplate> = {
    billet_edu_module: {
        type: 'billet_edu_module',
        fields: {
            name: { mandatory: 'true', included: 'true', value: '' },
            description: { mandatory: 'false', included: 'true', value: '' },
            grade: { mandatory: 'false', included: 'true', value: '' },
        },
    },
    billet_edu_subject: {
        type: 'billet_edu_subject',
        fields: {
            name: { mandatory: 'true', included: 'true', value: '' },
            description: { mandatory: 'false', included: 'true', value: '' },
            grade: { mandatory: 'false', included: 'true', value: '' },
        },
    },
    billet_exp_job: {
        type: 'billet_exp_job',
        fields: {
            startDate: { mandatory: 'true', included: 'true', value: '' },
            endDate: { mandatory: 'true', included: 'true', value: '' },
            jobTitle: { mandatory: 'true', included: 'true', value: '' },
            jobDescription: { mandatory: 'false', included: 'true', value: '' },
        },
    },
    billet_exp_project: {
        type: 'billet_exp_project',
        fields: {
            startDate: { mandatory: 'true', included: 'true', value: '' },
            endDate: { mandatory: 'true', included: 'true', value: '' },
            projectName: { mandatory: 'true', included: 'true', value: '' },
            projectDesc: { mandatory: 'false', included: 'true', value: '' },
        },
    },
    billet_grouped_certfication: {
        type: 'billet_grouped_certfication',
        fields: {
            certName: { mandatory: 'true', included: 'true', value: '' },
            certDescription: {
                mandatory: 'false',
                included: 'true',
                value: '',
            },
            dateAquired: { mandatory: 'false', included: 'true', value: '' },
        },
    },
    billet_pi_social: {
        type: 'billet_pi_social',
        fields: {
            platform: { mandatory: 'true', included: 'true', value: 'Twitter' },
            username: { mandatory: 'false', included: 'true', value: '' },
            url: { mandatory: 'false', included: 'true', value: '' },
        },
    },
    cert: {
        type: 'cert',
        fields: {
            name: { mandatory: 'true', included: 'true', value: '' },
            issuer: { mandatory: 'true', included: 'true', value: '' },
            date: { mandatory: 'true', included: 'true', value: '' },
        },
    },
};

export const INGOT_TEMPLATES: Record<string, IngotTemplate> = {
    ingot_education: {
        type: 'ingot_education',
        fields: {
            schoolName: { mandatory: 'true', included: 'true', value: '' },
            location: { mandatory: 'false', included: 'true', value: '' },
            startDate: { mandatory: 'true', included: 'true', value: '' },
            endDate: { mandatory: 'true', included: 'true', value: '' },
            qualificationLevel: {
                mandatory: 'false',
                included: 'true',
                value: 'GCSE',
            },
            billetTemplateType: {
                mandatory: 'true',
                included: 'true',
                value: 'billet_edu_subject | billet_edu_module',
            },
        },
        billets: [],
    },
    ingot_experience: {
        type: 'ingot_experience',
        fields: {
            companyName: {
                mandatory: 'true',
                included: 'true',
                value: 'Tech Solutions Ltd',
            },
            startDate: {
                mandatory: 'true',
                included: 'true',
                value: '2022-01-01',
            },
            endDate: {
                mandatory: 'true',
                included: 'true',
                value: '2022-12-31',
            },
            location: { mandatory: 'false', included: 'true', value: 'Remote' },
            billetTemplateType: {
                mandatory: 'true',
                included: 'true',
                value: 'billet_exp_job | billet_exp_project',
            },
        },
        billets: [],
    },
    ingot_skill: {
        type: 'ingot_skill',
        fields: {
            skillName: { mandatory: 'true', included: 'true', value: '' },
            skillDescription: {
                mandatory: 'true',
                included: 'true',
                value: '',
            },
            proficiencyLevel: {
                mandatory: 'false',
                included: 'true',
                value: '',
            },
        },
        billets: [],
    },
    ingot_grouped_certification: {
        type: 'ingot_grouped_certification',
        fields: {
            certName: { mandatory: 'true', included: 'true', value: '' },
            certDescription: {
                mandatory: 'false',
                included: 'true',
                value: '',
            },
            billetTemplateType: {
                mandatory: 'true',
                included: 'true',
                value: 'billet_grouped_certfication',
            },
        },
        billets: [],
    },
    ingot_hobby: {
        type: 'ingot_hobby',
        fields: {
            hobbyName: { mandatory: 'true', included: 'true', value: '' },
            hobbyDescription: {
                mandatory: 'false',
                included: 'true',
                value: '',
            },
        },
        billets: [],
    },
    ingot_personal_info: {
        type: 'ingot_personal_info',
        fields: {
            name: { mandatory: 'true', included: 'true', value: '' },
            email: { mandatory: 'false', included: 'true', value: '' },
            phone: { mandatory: 'false', included: 'true', value: '' },
            address: { mandatory: 'false', included: 'true', value: '' },
            billetTemplateType: {
                mandatory: 'false',
                included: 'true',
                value: 'billet_pi_social',
            },
        },
        billets: [],
    },
    ingot_personal_statement: {
        type: 'ingot_personal_statement',
        fields: {
            title: {
                mandatory: 'true',
                included: 'true',
                value: 'my personal_statement',
            },
            statement: {
                mandatory: 'true',
                included: 'true',
                value: 'lorem ipsum x100',
            },
        },
        billets: [],
    },
    ingot_project: {
        type: 'ingot_project',
        fields: {
            projectTitle: { mandatory: 'true', included: 'true', value: '' },
            projectDescription: {
                mandatory: 'true',
                included: 'true',
                value: '',
            },
            projectURL: { mandatory: 'false', included: 'true', value: '' },
        },
        billets: [],
    },
    ingot_reference: {
        type: 'ingot_reference',
        fields: {
            referenceName: { mandatory: 'true', included: 'true', value: '' },
            referenceCompany: {
                mandatory: 'true',
                included: 'true',
                value: '',
            },
            referenceContact: {
                mandatory: 'true',
                included: 'true',
                value: '',
            },
        },
        billets: [],
    },
    ingot_single_certification: {
        type: 'ingot_single_certification',
        fields: {
            certName: { mandatory: 'true', included: 'true', value: '' },
            certDate: { mandatory: 'true', included: 'true', value: '' },
            certDescription: {
                mandatory: 'false',
                included: 'true',
                value: '',
            },
        },
        billets: [],
    },
};
