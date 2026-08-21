import { resourceName, constructId } from './naming';

describe('resourceName', () => {
    it('generates correct name for dev stage', () => {
        expect(resourceName('dev', 'user-pool')).toBe('skillforge-dev-user-pool');
    });

    it('generates correct name for test stage', () => {
        expect(resourceName('test', 'cv-table')).toBe('skillforge-test-cv-table');
    });

    it('generates correct name for prod stage', () => {
        expect(resourceName('prod', 'api')).toBe('skillforge-prod-api');
    });

    it('handles multi-word resource names', () => {
        expect(resourceName('prod', 'ingot-handler')).toBe('skillforge-prod-ingot-handler');
    });

    it('handles single-word resource names', () => {
        expect(resourceName('test', 'avatars')).toBe('skillforge-test-avatars');
    });
});

describe('constructId', () => {
    it('converts hyphenated name to PascalCase', () => {
        expect(constructId('user-pool')).toBe('UserPool');
    });

    it('converts multi-segment name to PascalCase', () => {
        expect(constructId('cv-editor-table')).toBe('CvEditorTable');
    });

    it('handles single word', () => {
        expect(constructId('api')).toBe('Api');
    });

    it('handles already capitalised segments', () => {
        expect(constructId('Auth')).toBe('Auth');
    });
});
