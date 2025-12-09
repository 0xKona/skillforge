// THIS IS A PSUEDOCODE TEMPLATE OF WHAT A INGOT SHOULD LOOK LIKE

const ingot = {
    id: 'fdfdfd', // string, generated in storage.
    name: 'My Ingot for University', // User freindly name used only to identify in interface
    type: 'ingot_education', // one of INGOT_TEMPLATES from src/lib/ingot-templates.ts
    content: {/* OBJECT CONTAINING CONTENT */},
    createdAt: 'DATE',
    updatedAt: 'DATE'
}

const exampleContent = {
    fields: { /* FROM INGOT_TEMPLATE.fields */},
    billetFormat: 'billet_edu_subject', // string | null (if null assume billets not supported) there should be a map of available formats by ingot type,
    billets: [] // array of billetFormat type
}