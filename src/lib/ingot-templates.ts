import { IngotTemplate, BilletTemplate } from './types/ingot';

export const BILLET_TEMPLATES: Record<string, BilletTemplate> = {
    billet_edu_subject: {
        type: 'billet_edu_subject',
        fields: {
            name: { mandatory: true, included: true, value: '' },
            description: { mandatory: false, included: true, value: '' },
            grade: { mandatory: false, included: true, value: '' },
        },
    },
    billet_exp_job: {
        type: 'billet_exp_job',
        fields: {
            startDate: { mandatory: true, included: true, value: '' },
            endDate: { mandatory: true, included: true, value: '' },
            jobTitle: { mandatory: true, included: true, value: '' },
            jobDescription: { mandatory: false, included: true, value: '' },
        },
    },
    billet_grouped_certfication: {
        type: 'billet_grouped_certfication',
        fields: {
            certName: { mandatory: true, included: true, value: '' },
            certDescription: {
                mandatory: false,
                included: true,
                value: '',
            },
            dateAquired: { mandatory: false, included: true, value: '' },
        },
    },
    billet_pi_social: {
        type: 'billet_pi_social',
        fields: {
            platform: { mandatory: true, included: true, value: 'Twitter' },
            username: { mandatory: false, included: true, value: '' },
            url: { mandatory: false, included: true, value: '' },
        },
    },
    cert: {
        type: 'cert',
        fields: {
            name: { mandatory: true, included: true, value: '' },
            issuer: { mandatory: true, included: true, value: '' },
            date: { mandatory: true, included: true, value: '' },
        },
    },
};

export const INGOT_TEMPLATES: Record<string, IngotTemplate> = {
    ingot_personal_info: {
        type: 'ingot_personal_info',
        content: {
            fields: {
                name: { mandatory: true, included: true, value: '' },
                email: { mandatory: false, included: true, value: '' },
                phone: { mandatory: false, included: true, value: '' },
                address: { mandatory: false, included: true, value: '' },
            },
            billetFormat: 'billet_pi_social',
            billets: [],
        },
    },
    ingot_personal_statement: {
        type: 'ingot_personal_statement',
        content: {
            fields: {
                title: {
                    mandatory: true,
                    included: true,
                    value: 'my personal_statement',
                },
                statement: {
                    mandatory: true,
                    included: true,
                    value: 'lorem ipsum x100',
                },
            },
            billetFormat: null,
            billets: [],
        },
    },
    ingot_education: {
        type: 'ingot_education',
        content: {
            fields: {
                schoolName: { mandatory: true, included: true, value: '' },
                location: { mandatory: false, included: true, value: '' },
                startDate: { mandatory: true, included: true, value: '' },
                endDate: { mandatory: true, included: true, value: '' },
                qualificationLevel: {
                    mandatory: false,
                    included: true,
                    value: 'GCSE',
                },
            },
            billetFormat: 'billet_edu_subject',
            billets: [],
        },
    },
    ingot_experience: {
        type: 'ingot_experience',
        content: {
            fields: {
                companyName: {
                    mandatory: true,
                    included: true,
                    value: 'Tech Solutions Ltd',
                },
                startDate: {
                    mandatory: true,
                    included: true,
                    value: '2022-01-01',
                },
                endDate: {
                    mandatory: true,
                    included: true,
                    value: '2022-12-31',
                },
                location: { mandatory: false, included: true, value: 'Remote' },
            },
            billetFormat: 'billet_exp_job',
            billets: [],
        },
    },
    ingot_skill: {
        type: 'ingot_skill',
        content: {
            fields: {
                skillName: { mandatory: true, included: true, value: '' },
                skillDescription: {
                    mandatory: true,
                    included: true,
                    value: '',
                },
                proficiencyLevel: {
                    mandatory: false,
                    included: true,
                    value: '',
                },
            },
            billetFormat: null,
            billets: [],
        },
    },
    ingot_single_certification: {
        type: 'ingot_single_certification',
        content: {
            fields: {
                certName: { mandatory: true, included: true, value: '' },
                certDate: { mandatory: true, included: true, value: '' },
                certDescription: {
                    mandatory: false,
                    included: true,
                    value: '',
                },
            },
            billetFormat: null,
            billets: [],
        },
    },
    ingot_project: {
        type: 'ingot_project',
        content: {
            fields: {
                projectTitle: { mandatory: true, included: true, value: '' },
                projectDescription: {
                    mandatory: true,
                    included: true,
                    value: '',
                },
                projectURL: { mandatory: false, included: true, value: '' },
            },
            billetFormat: null,
            billets: [],
        },
    },
    ingot_hobby: {
        type: 'ingot_hobby',
        content: {
            fields: {
                hobbyName: { mandatory: true, included: true, value: '' },
                hobbyDescription: {
                    mandatory: false,
                    included: true,
                    value: '',
                },
            },
            billetFormat: null,
            billets: [],
        },
    },
    ingot_reference: {
        type: 'ingot_reference',
        content: {
            fields: {
                referenceName: { mandatory: true, included: true, value: '' },
                referenceCompany: {
                    mandatory: true,
                    included: true,
                    value: '',
                },
                referenceContact: {
                    mandatory: true,
                    included: true,
                    value: '',
                },
            },
            billetFormat: null,
            billets: [],
        },
    },
};
