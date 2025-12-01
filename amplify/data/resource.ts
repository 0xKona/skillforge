import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
    // The CV Entity
    CV: a
        .model({
            title: a.string().required(),
            description: a.string(),
            // JSON string storing the layout/order of sections and selected Ingot IDs
            // Example: { "sections": [ { "name": "Education", "ingotIds": ["id1", "id2"] } ] }
            structure: a.json(),
            isPublic: a.boolean().default(false),
        })
        .authorization((allow) => [allow.owner()]),

    // The Ingot Entity
    Ingot: a
        .model({
            name: a.string().required(), // Friendly name for the user to identify it
            type: a.string().required(), // e.g., 'ingot_education'

            // Stores the dynamic fields defined in the templates (schoolName, dates, etc.)
            content: a.json(),

            // Stores the embedded billets list
            billets: a.json(),
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
