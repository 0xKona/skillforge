import { render, screen } from '@testing-library/react';
import NavIcon from './nav-icon';

// Mock icons
jest.mock('../../common/icons/about', () => {
    const AboutIcon = (props: { color: string }) => (
        <div data-testid="about-icon" data-color={props.color} />
    );
    AboutIcon.displayName = 'AboutIcon';
    return AboutIcon;
});
jest.mock('../../common/icons/anvil', () => {
    const AnvilIcon = (props: { color: string }) => (
        <div data-testid="anvil-icon" data-color={props.color} />
    );
    AnvilIcon.displayName = 'AnvilIcon';
    return AnvilIcon;
});
jest.mock('../../common/icons/forge', () => {
    const ForgeIcon = (props: { color: string }) => (
        <div data-testid="forge-icon" data-color={props.color} />
    );
    ForgeIcon.displayName = 'ForgeIcon';
    return ForgeIcon;
});
jest.mock('../../common/icons/home', () => {
    const HomeIcon = (props: { color: string }) => (
        <div data-testid="home-icon" data-color={props.color} />
    );
    HomeIcon.displayName = 'HomeIcon';
    return HomeIcon;
});

describe('NavIcon', () => {
    it('renders HomeIcon for / route', () => {
        render(<NavIcon route="/" isActive={false} />);
        expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    });

    it('renders ForgeIcon for /forge route', () => {
        render(<NavIcon route="/forge" isActive={false} />);
        expect(screen.getByTestId('forge-icon')).toBeInTheDocument();
    });

    it('renders AnvilIcon for /anvil route', () => {
        render(<NavIcon route="/anvil" isActive={false} />);
        expect(screen.getByTestId('anvil-icon')).toBeInTheDocument();
    });

    it('renders AboutIcon for /about route', () => {
        render(<NavIcon route="/about" isActive={false} />);
        expect(screen.getByTestId('about-icon')).toBeInTheDocument();
    });

    it('renders nothing for unknown route', () => {
        const { container } = render(
            <NavIcon route="/unknown" isActive={false} />
        );
        expect(container).toBeEmptyDOMElement();
    });

    it('passes correct color when active', () => {
        render(<NavIcon route="/" isActive={true} />);
        const icon = screen.getByTestId('home-icon');
        expect(icon).toHaveAttribute('data-color', '#f97316');
    });

    it('passes correct color when inactive', () => {
        render(<NavIcon route="/" isActive={false} />);
        const icon = screen.getByTestId('home-icon');
        expect(icon).toHaveAttribute('data-color', 'currentColor');
    });
});
