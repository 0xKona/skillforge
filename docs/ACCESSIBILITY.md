# Accessibility Implementation

This document outlines the accessibility improvements implemented in the SkillForge application to meet WCAG 2.1 AA standards.

## 1. Icon Accessibility

All SVG icons in the application have been updated to support ARIA attributes.

- **Implementation**: All icon components in `src/components/common/icons/` now extend `React.SVGProps<SVGSVGElement>` and spread `...props` to the SVG element.
- **Usage**: Icons can now accept `aria-label`, `aria-hidden`, and `role` attributes.
- **Example**:
    ```tsx
    <Logo aria-label="SkillForge Logo" />
    <HomeIcon aria-hidden="true" />
    ```

## 2. Reduced Motion Support

The application now respects the user's system preference for reduced motion.

- **Implementation**: The `motion-safe:` Tailwind variant is used for animations that involve significant movement.
- **Key Areas**:
    - `src/components/common/effects/forge-background/fire-embers.tsx`: The floating embers animation is now disabled when `prefers-reduced-motion: reduce` is set.
    - Class used: `motion-safe:animate-float`

## 3. Color Contrast Improvements

Text colors have been adjusted to ensure sufficient contrast against dark backgrounds, improving readability for users with visual impairments.

- **Implementation**: Replaced instances of `text-slate-500` (which has a contrast ratio of ~4.2:1 on dark backgrounds) with `text-slate-400` (which provides better contrast).
- **Affected Components**:
    - `LibraryCard`
    - `IngotTypeSelection`
    - `IngotPreviewModal`
    - `CvLibrarySearch`
    - `CvSectionEditorBillet`
    - `AnvilFilters`
    - `BilletList`
    - `BilletForm`
    - `BilletItem`
    - `IngotDetails`
    - `Footer`

## Future Improvements

- Continue to audit new components for color contrast.
- Ensure all interactive elements have visible focus states.
- Verify keyboard navigation flow across all pages.
