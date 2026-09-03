import { StyleSheet } from '@react-pdf/renderer';

export function createPdfStyles(fontFamily: string) {
    return StyleSheet.create({
        page: {
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            padding: 40,
            fontFamily,
            fontSize: 11,
            color: '#000000',
            lineHeight: 1.45,
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
            gap: 5,
        },
        separator: {
            marginHorizontal: 3,
        },
        // Section Headers
        sectionContainer: {
            marginBottom: 16,
        },
        sectionTitle: {
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            borderBottomWidth: 1,
            borderBottomColor: '#000000',
            marginBottom: 8,
            paddingBottom: 2,
            letterSpacing: 0.5,
        },

        // Content Rows
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 2,
        },
        leftColumn: {
            flex: 1,
            paddingRight: 10,
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
            marginBottom: 2,
            paddingLeft: 10,
        },
        bullet: {
            width: 12,
            fontSize: 10.5,
            fontWeight: 400,
        },
        bulletContent: {
            flex: 1,
            fontSize: 10.5,
            fontWeight: 400,
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
        date: {
            fontSize: 10.5,
            fontWeight: 400,
            textAlign: 'right',
        },
        description: {
            fontSize: 10.5,
            fontWeight: 400,
            textAlign: 'justify',
        },
        link: {
            color: '#000000',
            textDecoration: 'underline',
        },
        groupChild: {
            marginTop: 8,
        },
    });
}

export const pdfStyles = createPdfStyles('Inter');
