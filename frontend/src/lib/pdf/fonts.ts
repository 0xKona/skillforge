import { Font } from '@react-pdf/renderer';

/**
 * Registers the Inter family with @react-pdf/renderer so the CV PDF can use the
 * app's default font. react-pdf cannot consume next/font CSS fonts, so we host
 * static TTFs in /public/fonts/inter and fetch them at render time.
 *
 * Font selection (future CV-editor feature) will override the family/weight per
 * document — for now Inter is the default everywhere.
 */

let registered = false;

export function registerCvFonts() {
    if (registered) return;
    registered = true;

    Font.register({
        family: 'Inter',
        fonts: [
            { src: '/fonts/inter/Inter-Regular.ttf', fontWeight: 400 },
            { src: '/fonts/inter/Inter-Bold.ttf', fontWeight: 700 },
            {
                src: '/fonts/inter/Inter-Italic.ttf',
                fontWeight: 400,
                fontStyle: 'italic',
            },
            {
                src: '/fonts/inter/Inter-BoldItalic.ttf',
                fontWeight: 700,
                fontStyle: 'italic',
            },
        ],
    });
}
