import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
    // The CV Entity
    CV: a
        .model({
            title: a.string().required(),
            description: a.string(),
            version: a.integer().required(),
            // JSON string storing the sections and configuration
            cvContent: a.json(),
        })
        .authorization((allow) => [allow.owner()]),

    // The Ingot Entity
    Ingot: a
        .model({
            name: a.string().required(), // Friendly name for the user to identify it
            type: a.string().required(), // e.g., 'ingot_education'

            // Stores the dynamic fields defined in the templates (schoolName, dates, etc.)
            content: a.json(),
        })
        .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: 'userPool',
    },
});
