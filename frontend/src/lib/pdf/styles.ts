import { StyleSheet } from '@react-pdf/renderer';
import type { DocumentSettings } from '@/lib/types/cv-document-types';
import { getCvFontOption } from './font-options';
import { getDocumentTokens } from '@/lib/cv-layout/cv-document-tokens';

/**
 * Creates StyleSheet for @react-pdf/renderer with calibrated 1:1 metrics
 * mirroring the live HTML preview (CvPreviewSheet).
 *
 * NOTE: In @react-pdf/renderer, `lineHeight` and `fontFamily` do NOT reliably
 * inherit down to descendant Text nodes unless explicitly declared on the
 * individual text styles.
 */
export function createPdfStyles(
    fontFamilyOrSettings?: string | DocumentSettings,
    explicitSettings?: DocumentSettings
) {
    const settings =
        typeof fontFamilyOrSettings === 'object'
            ? fontFamilyOrSettings
            : explicitSettings;

    const fontFamily =
        typeof fontFamilyOrSettings === 'string'
            ? fontFamilyOrSettings
            : getCvFontOption(settings?.fontFamily).pdfFamily;

    const tokens = getDocumentTokens(settings);
    const lh = tokens.lineHeight;

    return StyleSheet.create({
        page: {
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            padding: tokens.paddingPt,
            fontFamily,
            fontSize: 11,
            color: '#000000',
            lineHeight: lh,
        },

        // Header (Personal Info)
        headerContainer: {
            marginBottom: 16,
            alignItems: 'center',
        },
        headerName: {
            fontFamily,
            fontSize: 24,
            fontWeight: 700,
            lineHeight: 1.25,
            marginBottom: 6,
            textTransform: 'uppercase',
            letterSpacing: 0.96,
            textAlign: 'center',
        },
        headerSubtitle: {
            fontFamily,
            fontSize: 10.5,
            fontWeight: 700,
            lineHeight: lh,
            marginBottom: 6,
            textAlign: 'center',
        },
        headerContact: {
            fontFamily,
            fontSize: 10,
            lineHeight: 1.45,
            textAlign: 'center',
        },
        separator: {
            fontFamily,
            fontSize: 10,
            color: tokens.spacing.separatorColor,
        },

        // Section Headers
        section: {
            marginTop: tokens.spacing.sectionGapPt,
        },
        sectionFirst: {
            marginTop: 0,
        },
        sectionTitle: {
            fontFamily,
            fontSize: 11,
            fontWeight: 700,
            lineHeight: 1.35,
            textTransform: 'uppercase',
            borderBottomWidth: 1,
            borderBottomColor: '#000000',
            marginBottom: tokens.spacing.sectionTitleBottomMarginPt,
            paddingBottom: tokens.spacing.sectionTitleBottomPaddingPt,
            letterSpacing: 0.55,
        },

        // Section Blocks
        sectionBlock: {
            marginBottom: tokens.spacing.blockGapPt,
        },

        // Content Rows
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
        },
        leftColumn: {
            flex: 1,
            paddingRight: 8,
        },
        rightColumn: {
            flexShrink: 0,
            alignItems: 'flex-end',
        },

        // Text Styles
        regular: {
            fontFamily,
            fontWeight: 400,
            lineHeight: lh,
        },
        bold: {
            fontFamily,
            fontWeight: 700,
            lineHeight: lh,
        },
        italic: {
            fontFamily,
            fontStyle: 'italic',
            fontWeight: 400,
            lineHeight: lh,
        },
        boldItalic: {
            fontFamily,
            fontStyle: 'italic',
            fontWeight: 700,
            lineHeight: lh,
        },

        // Lists/Bullets
        bulletListContainer: {
            marginTop: 3,
        },
        bulletPoint: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingLeft: tokens.spacing.bulletIndentPt,
            marginTop: 2,
        },
        bullet: {
            fontFamily,
            width: tokens.spacing.bulletWidthPt,
            fontSize: 10.5,
            fontWeight: 400,
            lineHeight: lh,
        },
        bulletContent: {
            fontFamily,
            flex: 1,
            fontSize: 10.5,
            fontWeight: 400,
            lineHeight: lh,
        },

        // Specific Item Styles
        itemTitle: {
            fontFamily,
            fontSize: 10.5,
            fontWeight: 700,
            lineHeight: lh,
        },
        itemSubtitle: {
            fontFamily,
            fontSize: 10.5,
            fontStyle: 'italic',
            fontWeight: 400,
            lineHeight: lh,
        },
        subtitleRow: {
            marginTop: 2,
        },
        date: {
            fontFamily,
            fontSize: 10.5,
            fontWeight: 400,
            lineHeight: lh,
            textAlign: 'right',
        },
        description: {
            fontFamily,
            fontSize: 10.5,
            fontWeight: 400,
            lineHeight: lh,
            textAlign: 'justify',
            marginTop: tokens.spacing.descriptionTopMarginPt,
        },
        link: {
            fontFamily,
            color: '#000000',
            textDecoration: 'underline',
        },
        groupChild: {
            marginTop: tokens.spacing.groupChildTopMarginPt,
        },
    });
}

export const pdfStyles = createPdfStyles('Inter');
