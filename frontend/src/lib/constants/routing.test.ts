import { anvilEditPath, forgeCvPath } from './routing';

describe('editor paths', () => {
    it('builds static-export query URLs for ingot and CV editors', () => {
        expect(anvilEditPath('abc-123')).toBe('/anvil/edit/?id=abc-123');
        expect(forgeCvPath('cv-9')).toBe('/forge/cv/?id=cv-9');
    });

    it('encodes ids', () => {
        expect(anvilEditPath('a b')).toBe('/anvil/edit/?id=a%20b');
    });
});
