import type { CvDocument, NewCvDocument } from '../types/cv-document-types';
import type { Ingot } from '../types/ingot-types';

// Common technical & professional keywords across engineering, product, and business
const COMMON_SKILL_KEYWORDS = new Set([
    'react',
    'typescript',
    'javascript',
    'next.js',
    'nextjs',
    'vue',
    'angular',
    'node',
    'nodejs',
    'python',
    'go',
    'golang',
    'java',
    'c++',
    'c#',
    '.net',
    'rust',
    'aws',
    'gcp',
    'azure',
    'cloud',
    'docker',
    'kubernetes',
    'k8s',
    'terraform',
    'ci/cd',
    'github actions',
    'jenkins',
    'devops',
    'microservices',
    'serverless',
    'sql',
    'postgresql',
    'postgres',
    'mysql',
    'mongodb',
    'redis',
    'dynamodb',
    'graphql',
    'rest',
    'api',
    'grpc',
    'kafka',
    'rabbitmq',
    'tailwind',
    'css',
    'html',
    'sass',
    'webpack',
    'vite',
    'jest',
    'cypress',
    'playwright',
    'testing',
    'tdd',
    'linux',
    'git',
    'security',
    'oauth',
    'saml',
    'performance',
    'latency',
    'scalability',
    'distributed systems',
    'architecture',
    'system design',
    'agile',
    'scrum',
    'kanban',
    'jira',
    'mentorship',
    'leadership',
    'cross-functional',
    'stakeholder management',
    'product strategy',
    'analytics',
    'monitoring',
    'datadog',
]);

const STOP_WORDS = new Set([
    'about',
    'above',
    'after',
    'again',
    'against',
    'all',
    'and',
    'any',
    'are',
    'because',
    'been',
    'before',
    'being',
    'below',
    'between',
    'both',
    'but',
    'by',
    'could',
    'did',
    'does',
    'doing',
    'down',
    'during',
    'each',
    'few',
    'for',
    'from',
    'further',
    'had',
    'has',
    'have',
    'having',
    'her',
    'here',
    'hers',
    'herself',
    'him',
    'himself',
    'his',
    'how',
    'into',
    'its',
    'itself',
    'just',
    'more',
    'most',
    'myself',
    'nor',
    'not',
    'now',
    'off',
    'once',
    'only',
    'other',
    'our',
    'ours',
    'ourselves',
    'out',
    'over',
    'own',
    'same',
    'should',
    'some',
    'such',
    'than',
    'that',
    'the',
    'their',
    'theirs',
    'them',
    'themselves',
    'then',
    'there',
    'these',
    'they',
    'this',
    'those',
    'through',
    'too',
    'under',
    'until',
    'very',
    'was',
    'were',
    'what',
    'when',
    'where',
    'which',
    'while',
    'who',
    'whom',
    'why',
    'will',
    'with',
    'you',
    'your',
    'yours',
    'yourself',
    'yourselves',
    'role',
    'team',
    'work',
    'years',
    'experience',
    'candidate',
    'looking',
    'join',
    'company',
]);

/**
 * Extracts meaningful tech, skill, and industry keywords from a job description.
 */
export function extractKeywords(text: string): string[] {
    if (!text || text.trim() === '') return [];

    const normalized = text.toLowerCase();
    const found = new Set<string>();

    // 1. Check known multi-word / special keywords first
    for (const kw of COMMON_SKILL_KEYWORDS) {
        // Escaped regex for word boundary
        const regex = new RegExp(
            `(^|[^a-z0-9])${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`,
            'i'
        );
        if (regex.test(normalized)) {
            found.add(kw);
        }
    }

    // 2. Tokenize remaining words to catch other capitalised / capitalized technical words
    const tokens = normalized.match(/[a-z][a-z0-9+#.-]{1,24}/g) ?? [];
    const frequency = new Map<string, number>();

    for (const token of tokens) {
        const cleaned = token.replace(/^[.-]+|[.-]+$/g, '');
        if (cleaned.length < 3 || STOP_WORDS.has(cleaned)) continue;
        frequency.set(cleaned, (frequency.get(cleaned) ?? 0) + 1);
    }

    // Include words that appear frequently (>2 times) or match our dictionary
    for (const [word, count] of frequency.entries()) {
        if (count >= 2 && !STOP_WORDS.has(word)) {
            found.add(word);
        }
    }

    return Array.from(found).slice(0, 30);
}

export interface AnvilSuggestion {
    ingotId: string;
    ingotTitle: string;
    matchedKeywords: string[];
}

export interface JobMatchResult {
    score: number;
    totalKeywords: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    anvilSuggestions: AnvilSuggestion[];
}

/**
 * Analyzes a CV against a job description, computing keyword coverage and
 * cross-referencing untapped achievements from the candidate's Anvil.
 */
export function analyzeJobMatch(
    jobDescription: string,
    cvDoc: CvDocument | NewCvDocument,
    anvilIngots?: Ingot[]
): JobMatchResult {
    const jdKeywords = extractKeywords(jobDescription);
    if (jdKeywords.length === 0) {
        return {
            score: 0,
            totalKeywords: 0,
            matchedKeywords: [],
            missingKeywords: [],
            anvilSuggestions: [],
        };
    }

    // Gather all text from CV document
    const cvTextPieces: string[] = [];
    cvTextPieces.push(cvDoc.title);
    if (cvDoc.description) cvTextPieces.push(cvDoc.description);

    for (const section of cvDoc.content.sections) {
        if (!section.visible) continue;
        cvTextPieces.push(section.title);
        for (const item of section.items) {
            for (const val of Object.values(item.fields)) {
                cvTextPieces.push(val);
            }
            if (item.subItems) {
                for (const sub of item.subItems) {
                    for (const val of Object.values(sub.fields)) {
                        cvTextPieces.push(val);
                    }
                }
            }
        }
    }

    const cvAllText = cvTextPieces.join(' ').toLowerCase();

    const matchedKeywords: string[] = [];
    const missingKeywords: string[] = [];

    for (const kw of jdKeywords) {
        if (cvAllText.includes(kw)) {
            matchedKeywords.push(kw);
        } else {
            missingKeywords.push(kw);
        }
    }

    const score = Math.round(
        (matchedKeywords.length / jdKeywords.length) * 100
    );

    // Cross-reference missing keywords with Anvil Ingots
    const anvilSuggestions: AnvilSuggestion[] = [];
    if (anvilIngots && anvilIngots.length > 0 && missingKeywords.length > 0) {
        // Collect ingots that are NOT currently in the CV
        const cvIngotIds = new Set<string>();
        for (const section of cvDoc.content.sections) {
            for (const item of section.items) {
                if (item.sourceIngotId) cvIngotIds.add(item.sourceIngotId);
            }
        }

        for (const ingot of anvilIngots) {
            if (cvIngotIds.has(ingot.id)) continue;

            const ingotPieces: string[] = [ingot.name];
            for (const field of Object.values(ingot.content.fields ?? {})) {
                if (field.value) ingotPieces.push(field.value);
            }
            for (const billet of ingot.content.billets ?? []) {
                for (const field of Object.values(billet.fields ?? {})) {
                    if (field.value) ingotPieces.push(field.value);
                }
            }

            const ingotAllText = ingotPieces.join(' ').toLowerCase();
            const matchingMissing = missingKeywords.filter((kw) =>
                ingotAllText.includes(kw)
            );

            if (matchingMissing.length > 0) {
                anvilSuggestions.push({
                    ingotId: ingot.id,
                    ingotTitle: ingot.name,
                    matchedKeywords: matchingMissing,
                });
            }
        }
    }

    return {
        score,
        totalKeywords: jdKeywords.length,
        matchedKeywords,
        missingKeywords,
        anvilSuggestions,
    };
}
