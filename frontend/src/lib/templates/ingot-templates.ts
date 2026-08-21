import { IngotTemplate, BilletTemplate } from '../types/ingot-types';

export const BILLET_TEMPLATES: Record<string, BilletTemplate> = {
    billet_edu_subject: {
        type: 'billet_edu_subject',
        fields: {
            name: { mandatory: true, value: '', inputType: 'text' },
            description: { mandatory: false, value: '', inputType: 'textarea' },
            grade: { mandatory: false, value: '', inputType: 'text' },
        },
    },
    billet_exp_job: {
        type: 'billet_exp_job',
        fields: {
            jobTitle: { mandatory: true, value: '', inputType: 'text' },
            jobDescription: {
                mandatory: false,
                value: '',
                inputType: 'textarea',
            },
            startDate: { mandatory: true, value: '', inputType: 'date' },
            endDate: { mandatory: true, value: '', inputType: 'date' },
        },
    },
    billet_grouped_certfication: {
        type: 'billet_grouped_certfication',
        fields: {
            certName: { mandatory: true, value: '', inputType: 'text' },
            certDescription: {
                mandatory: false,
                value: '',
                inputType: 'textarea',
            },
            dateAcquired: { mandatory: false, value: '', inputType: 'date' },
        },
    },
    billet_pi_social: {
        type: 'billet_pi_social',
        fields: {
            platform: { mandatory: true, value: 'Twitter', inputType: 'text' },
            username: { mandatory: false, value: '', inputType: 'text' },
            url: { mandatory: false, value: '', inputType: 'url' },
        },
    },
    cert: {
        type: 'cert',
        fields: {
            name: { mandatory: true, value: '', inputType: 'text' },
            issuer: { mandatory: true, value: '', inputType: 'text' },
            date: { mandatory: true, value: '', inputType: 'date' },
        },
    },
    billet_skill: {
        type: 'billet_skill',
        fields: {
            skillName: { mandatory: true, value: '', inputType: 'text' },
            description: { mandatory: false, value: '', inputType: 'text' },
        },
    },
};

export const INGOT_TEMPLATES: Record<string, IngotTemplate> = {
    ingot_personal_info: {
        type: 'ingot_personal_info',
        content: {
            fields: {
                name: { mandatory: true, value: '', inputType: 'text' },
                email: { mandatory: false, value: '', inputType: 'email' },
                phone: { mandatory: false, value: '', inputType: 'tel' },
                address: { mandatory: false, value: '', inputType: 'text' },
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
                    value: 'my personal_statement',
                    inputType: 'text',
                },
                statement: {
                    mandatory: true,
                    value: 'lorem ipsum x100',
                    inputType: 'textarea',
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
                schoolName: { mandatory: true, value: '', inputType: 'text' },
                location: { mandatory: false, value: '', inputType: 'text' },
                startDate: { mandatory: true, value: '', inputType: 'date' },
                endDate: { mandatory: true, value: '', inputType: 'date' },
                qualificationLevel: {
                    mandatory: false,
                    value: 'GCSE',
                    inputType: 'select',
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
                    value: 'Tech Solutions Ltd',
                    inputType: 'text',
                },
                startDate: {
                    mandatory: true,
                    value: '2022-01-01',
                    inputType: 'date',
                },
                endDate: {
                    mandatory: true,
                    value: '2022-12-31',
                    inputType: 'date',
                },
                location: {
                    mandatory: false,
                    value: 'Remote',
                    inputType: 'text',
                },
            },
            billetFormat: 'billet_exp_job',
            billets: [],
        },
    },
    ingot_skill: {
        type: 'ingot_skill',
        content: {
            fields: {
                groupName: { mandatory: true, value: '', inputType: 'text' },
            },
            billetFormat: 'billet_skill',
            billets: [],
        },
    },
    ingot_certification: {
        type: 'ingot_certification',
        content: {
            fields: {
                certName: { mandatory: true, value: '', inputType: 'text' },
                certDate: { mandatory: true, value: '', inputType: 'date' },
                certDescription: {
                    mandatory: false,
                    value: '',
                    inputType: 'textarea',
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
                projectTitle: { mandatory: true, value: '', inputType: 'text' },
                projectDescription: {
                    mandatory: true,
                    value: '',
                    inputType: 'textarea',
                },
                projectURL: { mandatory: false, value: '', inputType: 'url' },
            },
            billetFormat: null,
            billets: [],
        },
    },
    ingot_hobby: {
        type: 'ingot_hobby',
        content: {
            fields: {
                hobbyName: { mandatory: true, value: '', inputType: 'text' },
                hobbyDescription: {
                    mandatory: false,
                    value: '',
                    inputType: 'textarea',
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
                referenceName: {
                    mandatory: true,
                    value: '',
                    inputType: 'text',
                },
                referenceCompany: {
                    mandatory: true,
                    value: '',
                    inputType: 'text',
                },
                referenceContact: {
                    mandatory: true,
                    value: '',
                    inputType: 'text',
                },
            },
            billetFormat: null,
            billets: [],
        },
    },
};
