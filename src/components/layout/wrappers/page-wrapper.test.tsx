import { render, screen } from '@testing-library/react';
import PageWrapper from './page-wrapper';

// Mock child components
jest.mock('../navigation/navigation-bar', () => {
    const NavBar = () => <div data-testid="nav-bar" />;
    NavBar.displayName = 'NavBar';
    return NavBar;
});

jest.mock('../footer/footer', () => {
    const Footer = () => <div data-testid="footer" />;
    Footer.displayName = 'Footer';
    return Footer;
});

jest.mock('@/effects/forge-background', () => {
    const BluePrintForgeBg = () => <div data-testid="forge-bg" />;
    BluePrintForgeBg.displayName = 'BluePrintForgeBg';
    return BluePrintForgeBg;
});

describe('PageWrapper', () => {
    it('renders children correctly', () => {
        render(
            <PageWrapper>
                <div data-testid="child-content">Child Content</div>
            </PageWrapper>
        );
        expect(screen.getByTestId('child-content')).toBeInTheDocument();
        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('renders layout components', () => {
        render(
            <PageWrapper>
                <div>Content</div>
            </PageWrapper>
        );
        expect(screen.getByTestId('nav-bar')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
        expect(screen.getByTestId('forge-bg')).toBeInTheDocument();
    });

    it('applies custom className to main element', () => {
        render(
            <PageWrapper className="custom-class">
                <div>Content</div>
            </PageWrapper>
        );
        const mainElement = screen.getByRole('main');
        expect(mainElement).toHaveClass('custom-class');
        // Should also preserve default classes
        expect(mainElement).toHaveClass('flex-1');
        expect(mainElement).toHaveClass('relative');
    });
});
