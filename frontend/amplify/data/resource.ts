/**
 * TEMPORARY STUB: This file will be removed in Task 4 when the service layer
 * is rewritten to use the REST API client instead of Amplify's generateClient.
 *
 * This provides just enough type information for the existing service files
 * to compile during the static export migration.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ModelFields = Record<string, any>;

interface ModelType {
    type: ModelFields;
}

export interface Schema {
    CV: ModelType;
    Ingot: ModelType;
}
