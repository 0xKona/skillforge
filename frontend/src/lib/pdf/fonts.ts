import { Font } from '@react-pdf/renderer';

/**
 * Registers the Inter family with @react-pdf/renderer so the CV PDF uses the
 * app's default font. react-pdf cannot consume next/font CSS fonts, so we host
 * static TTFs in /public/fonts/inter and fetch them at render time.
 */

let registered = false;

function resolveFontPath(path: string): string {
    if (typeof window !== 'undefined' && window.location?.origin) {
        // Build absolute URL so iframe / blob preview contexts can fetch successfully
        return `${window.location.origin}${path.startsWith('/') ? path : `/${path}`}`;
    }
    return path;
}

export function registerCvFonts() {
    if (registered) return;
    registered = true;

    Font.register({
        family: 'Inter',
        fonts: [
            {
                src: resolveFontPath('/fonts/inter/Inter-Regular.ttf'),
                fontWeight: 400,
            },
            {
                src: resolveFontPath('/fonts/inter/Inter-Bold.ttf'),
                fontWeight: 700,
            },
            {
                src: resolveFontPath('/fonts/inter/Inter-Italic.ttf'),
                fontWeight: 400,
                fontStyle: 'italic',
            },
            {
                src: resolveFontPath('/fonts/inter/Inter-BoldItalic.ttf'),
                fontWeight: 700,
                fontStyle: 'italic',
            },
        ],
    });
}
