import { StyleSheet } from '@react-pdf/renderer';
import type { DocumentSettings } from '@/lib/types/cv-document-types';
import { getCvFontOption } from './font-options';
import { getDocumentTokens } from '@/lib/cv-layout/cv-document-tokens';

/**
 * Creates StyleSheet for @react-pdf/renderer with calibrated 1:1 metrics
 * mirroring the live HTML preview (CvPreviewSheet).
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

    return StyleSheet.create({
        page: {
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            padding: tokens.paddingPt,
            fontFamily,
            fontSize: 11,
            color: '#000000',
            lineHeight: tokens.lineHeight,
        },

        // Header (Personal Info)
        headerContainer: {
            marginBottom: 20,
            alignItems: 'center',
        },
        headerName: {
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 0,
            textTransform: 'uppercase',
            letterSpacing: 1,
        },
        headerSubtitle: {
            fontSize: 10.5,
            fontWeight: 700,
            marginBottom: 6,
            textAlign: 'center',
        },
        headerContact: {
            marginTop: 8,
            fontSize: 10,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
        },
        separator: {
            marginHorizontal: tokens.spacing.separatorMarginHorizontalPt,
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
            fontSize: 11,
            fontWeight: 700,
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
            fontWeight: 400,
        },
        bold: {
            fontWeight: 700,
        },
        italic: {
            fontStyle: 'italic',
            fontWeight: 400,
        },
        boldItalic: {
            fontStyle: 'italic',
            fontWeight: 700,
        },

        // Lists/Bullets
        bulletPoint: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingLeft: tokens.spacing.bulletIndentPt,
            marginTop: 1.5,
        },
        bullet: {
            width: tokens.spacing.bulletWidthPt,
            fontSize: 10.5,
            fontWeight: 400,
            lineHeight: tokens.lineHeight,
        },
        bulletContent: {
            flex: 1,
            fontSize: 10.5,
            fontWeight: 400,
            lineHeight: tokens.lineHeight,
        },

        // Specific Item Styles
        itemTitle: {
            fontSize: 10.5,
            fontWeight: 700,
        },
        itemSubtitle: {
            fontSize: 10.5,
            fontStyle: 'italic',
            fontWeight: 400,
        },
        subtitleRow: {
            marginTop: 1,
        },
        date: {
            fontSize: 10.5,
            fontWeight: 400,
            textAlign: 'right',
        },
        description: {
            fontSize: 10.5,
            fontWeight: 400,
            textAlign: 'justify',
            marginTop: tokens.spacing.descriptionTopMarginPt,
            lineHeight: tokens.lineHeight,
        },
        link: {
            color: '#000000',
            textDecoration: 'underline',
        },
        groupChild: {
            marginTop: tokens.spacing.groupChildTopMarginPt,
        },
    });
}

export const pdfStyles = createPdfStyles('Inter');
