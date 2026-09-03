import {
    dateRange,
    hrefForUrl,
    joinComma,
    mailtoHref,
    skillPhrase,
    socialSpan,
    splitDescription,
    telHref,
} from './format';

describe('dateRange', () => {
    it('joins start and end with an en dash', () => {
        expect(dateRange('2018-09', '2022-06')).toBe('2018-09 – 2022-06');
    });

    it('uses Present when end is missing', () => {
        expect(dateRange('2022-01', '')).toBe('2022-01 – Present');
    });

    it('returns empty when both sides are empty', () => {
        expect(dateRange('', '')).toBe('');
        expect(dateRange()).toBe('');
    });

    it('returns the end value when only end is set', () => {
        expect(dateRange('', '2020')).toBe('2020');
    });
});

describe('splitDescription', () => {
    it('keeps a single paragraph as a paragraph', () => {
        expect(splitDescription('Built the billing service.')).toEqual({
            type: 'paragraph',
            text: 'Built the billing service.',
        });
    });

    it('splits multiple lines into bullets', () => {
        expect(splitDescription('Shipped v2\nCut latency 40%')).toEqual({
            type: 'bullets',
            items: ['Shipped v2', 'Cut latency 40%'],
        });
    });

    it('strips leading bullet markers', () => {
        expect(splitDescription('• First\n- Second')).toEqual({
            type: 'bullets',
            items: ['First', 'Second'],
        });
    });

    it('treats a single marked line as a list', () => {
        expect(splitDescription('• Only one')).toEqual({
            type: 'bullets',
            items: ['Only one'],
        });
    });

    it('returns undefined for blank input', () => {
        expect(splitDescription('')).toBeUndefined();
        expect(splitDescription('  \n  ')).toBeUndefined();
    });
});

describe('skillPhrase', () => {
    it('appends detail in parentheses', () => {
        expect(skillPhrase('TypeScript', '5 years')).toBe(
            'TypeScript (5 years)'
        );
    });

    it('omits empty detail', () => {
        expect(skillPhrase('React', '')).toBe('React');
    });

    it('returns empty when name is missing', () => {
        expect(skillPhrase('', '5 years')).toBe('');
    });
});

describe('hrefForUrl', () => {
    it('keeps an existing scheme', () => {
        expect(hrefForUrl('https://example.com')).toBe('https://example.com');
    });

    it('prefixes https for scheme-less url fields', () => {
        expect(hrefForUrl('linkedin.com/in/ada')).toBe(
            'https://linkedin.com/in/ada'
        );
    });

    it('does not treat a bare handle as a URL', () => {
        expect(hrefForUrl('/in/ada', 'maybe')).toBeUndefined();
        expect(hrefForUrl('john.smith', 'maybe')).toBeUndefined();
    });

    it('links www handles in maybe mode', () => {
        expect(hrefForUrl('www.example.com', 'maybe')).toBe(
            'https://www.example.com'
        );
    });
});

describe('socialSpan', () => {
    it('omits an empty platform prefix', () => {
        expect(socialSpan({ url: 'https://github.com/ada' })).toEqual({
            text: 'https://github.com/ada',
            href: 'https://github.com/ada',
        });
    });

    it('prefixes platform when present', () => {
        expect(
            socialSpan({
                platform: 'LinkedIn',
                url: 'https://linkedin.com/in/a',
            })
        ).toEqual({
            text: 'LinkedIn: https://linkedin.com/in/a',
            href: 'https://linkedin.com/in/a',
        });
    });

    it('falls back to handle without inventing a link', () => {
        expect(socialSpan({ platform: 'GitHub', handle: '@ada' })).toEqual({
            text: 'GitHub: @ada',
        });
    });
});

describe('contact hrefs', () => {
    it('builds mailto and tel links', () => {
        expect(mailtoHref('ada@example.com')).toBe('mailto:ada@example.com');
        expect(telHref('+44 7700 900000')).toBe('tel:+447700900000');
    });
});

describe('joinComma', () => {
    it('drops empty parts', () => {
        expect(joinComma('Acme', '', 'London')).toBe('Acme, London');
    });
});
