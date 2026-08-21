import { StyleSheet } from '@react-pdf/renderer';

export const pdfStyles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 40,
        fontFamily: 'Times-Roman',
        fontSize: 10.5,
        color: '#000000',
        lineHeight: 1.4,
    },
    // Header (Personal Info)
    headerContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    headerName: {
        fontSize: 24,
        fontFamily: 'Times-Bold',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    headerSubtitle: {
        fontSize: 10.5,
        fontFamily: 'Times-Bold',
        marginBottom: 6,
        textAlign: 'center',
    },
    headerContact: {
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
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 11,
        fontFamily: 'Times-Bold',
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
        fontFamily: 'Times-Roman',
    },
    bold: {
        fontFamily: 'Times-Bold',
    },
    italic: {
        fontFamily: 'Times-Italic',
    },
    boldItalic: {
        fontFamily: 'Times-BoldItalic',
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
        fontFamily: 'Times-Roman',
    },
    bulletContent: {
        flex: 1,
        fontSize: 10.5,
        fontFamily: 'Times-Roman',
    },

    // Specific Item Styles
    itemTitle: {
        fontSize: 10.5,
        fontFamily: 'Times-Bold',
    },
    itemSubtitle: {
        fontSize: 10.5,
        fontFamily: 'Times-Bold',
    },
    date: {
        fontSize: 10.5,
        fontFamily: 'Times-Roman',
        textAlign: 'right',
    },
    description: {
        fontSize: 10.5,
        fontFamily: 'Times-Roman',
        textAlign: 'justify',
    },
});
