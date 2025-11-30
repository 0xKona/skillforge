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

            // Relationship: An Ingot can have many Billets
            billets: a.hasMany('Billet', 'ingotId'),
        })
        .authorization((allow) => [allow.owner()]),

    // The Billet Entity
    Billet: a
        .model({
            ingotId: a.id().required(),
            ingot: a.belongsTo('Ingot', 'ingotId'),

            type: a.string().required(), // e.g., 'billet_edu_module'

            // Stores the dynamic fields (moduleName, grade, etc.)
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
