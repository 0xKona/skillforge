import {
    getDocumentTokens,
    PAPER_DIMENSIONS,
    PADDING_METRICS,
    LINE_HEIGHT_METRICS,
} from './cv-document-tokens';

describe('cv-document-tokens', () => {
    it('returns default calibrated tokens for undefined settings', () => {
        const tokens = getDocumentTokens();
        expect(tokens.paperFormat).toBe('a4');
        expect(tokens.dimensions).toEqual(PAPER_DIMENSIONS.a4);
        expect(tokens.paddingPt).toBe(PADDING_METRICS.normal.pt);
        expect(tokens.paddingPx).toBe(PADDING_METRICS.normal.px);
        expect(tokens.lineHeight).toBe(LINE_HEIGHT_METRICS.normal.value);
    });

    it('respects letter paper format', () => {
        const tokens = getDocumentTokens({ paperFormat: 'letter' });
        expect(tokens.paperFormat).toBe('letter');
        expect(tokens.dimensions).toEqual(PAPER_DIMENSIONS.letter);
    });

    it('respects compact margin and tight line height', () => {
        const tokens = getDocumentTokens({
            marginPreset: 'compact',
            lineHeight: 'tight',
        });
        expect(tokens.paddingPt).toBe(PADDING_METRICS.compact.pt);
        expect(tokens.paddingPx).toBe(PADDING_METRICS.compact.px);
        expect(tokens.lineHeight).toBe(LINE_HEIGHT_METRICS.tight.value);
    });

    it('respects spacious margin and relaxed line height', () => {
        const tokens = getDocumentTokens({
            marginPreset: 'spacious',
            lineHeight: 'relaxed',
        });
        expect(tokens.paddingPt).toBe(PADDING_METRICS.spacious.pt);
        expect(tokens.paddingPx).toBe(PADDING_METRICS.spacious.px);
        expect(tokens.lineHeight).toBe(LINE_HEIGHT_METRICS.relaxed.value);
    });
});
