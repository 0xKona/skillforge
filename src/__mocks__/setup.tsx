/* eslint-disable @next/next/no-img-element */
/**
 * Global mock setup for Jest
 */

// Mock AWS Amplify globally to prevent real API calls during tests
jest.mock('aws-amplify/auth', () => ({
    resetPassword: jest.fn(),
    confirmResetPassword: jest.fn(),
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    getCurrentUser: jest.fn(),
    confirmSignUp: jest.fn(),
    resendSignUpCode: jest.fn(),
}));

// Mock ResizeObserver (Needed for OTP component)
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Mock document.elementFromPoint
document.elementFromPoint = jest.fn();

// Global UI Component Mocks
import React from 'react';

// Mock shadcn components
jest.mock('@/ui/shadcn/avatar', () => ({
    Avatar: ({
        children,
        className,
    }: {
        children: React.ReactNode;
        className?: string;
    }) => (
        <div data-testid="avatar" className={className}>
            {children}
        </div>
    ),
    AvatarImage: ({ src }: { src: string }) => (
        <img src={src} alt="avatar" data-testid="avatar-image" />
    ),
    AvatarFallback: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="avatar-fallback">{children}</div>
    ),
}));

jest.mock('@/ui/shadcn/skeleton', () => ({
    Skeleton: () => <div data-testid="skeleton" />,
}));

jest.mock('@/ui/shadcn/button', () => ({
    Button: ({
        children,
        ...props
    }: {
        children: React.ReactNode;
    } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
        <button data-testid="button" {...props}>
            {children}
        </button>
    ),
}));

jest.mock('@/ui/shadcn/dropdown-menu', () => ({
    DropdownMenu: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
        <button data-testid="dropdown-trigger">{children}</button>
    ),
    DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="dropdown-content">{children}</div>
    ),
    DropdownMenuGroup: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    DropdownMenuItem: ({
        children,
        onClick,
    }: {
        children: React.ReactNode;
        onClick?: () => void;
    }) => (
        <div role="menuitem" onClick={onClick}>
            {children}
        </div>
    ),
    DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    DropdownMenuSeparator: () => <hr />,
}));

jest.mock('@/ui/shadcn/alert-dialog', () => ({
    AlertDialog: ({
        children,
        open,
    }: {
        children: React.ReactNode;
        open: boolean;
    }) => (open ? <div data-testid="alert-dialog">{children}</div> : null),
    AlertDialogContent: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    AlertDialogHeader: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    AlertDialogTitle: ({ children }: { children: React.ReactNode }) => (
        <h2>{children}</h2>
    ),
    AlertDialogDescription: ({ children }: { children: React.ReactNode }) => (
        <p>{children}</p>
    ),
    AlertDialogFooter: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    AlertDialogCancel: ({
        children,
        onClick,
    }: {
        children: React.ReactNode;
        onClick: () => void;
    }) => (
        <button onClick={onClick} data-testid="cancel-button">
            {children}
        </button>
    ),
    AlertDialogAction: ({
        children,
        onClick,
    }: {
        children: React.ReactNode;
        onClick: () => void;
    }) => (
        <button onClick={onClick} data-testid="confirm-button">
            {children}
        </button>
    ),
}));

jest.mock('@/ui/typography/typography', () => ({
    TypographyP: ({ children }: { children: React.ReactNode }) => (
        <p>{children}</p>
    ),
    TypographyH1: ({ children }: { children: React.ReactNode }) => (
        <h1>{children}</h1>
    ),
    TypographyH3: ({ children }: { children: React.ReactNode }) => (
        <h3>{children}</h3>
    ),
    TypographyH4: ({ children }: { children: React.ReactNode }) => (
        <h4>{children}</h4>
    ),
}));

jest.mock('@/ui/shadcn/input', () => ({
    Input: (props: React.ComponentProps<'input'>) => (
        <input data-testid="input" {...props} />
    ),
}));

jest.mock('@/ui/shadcn/textarea', () => ({
    Textarea: (props: React.ComponentProps<'textarea'>) => (
        <textarea data-testid="textarea" {...props} />
    ),
}));

jest.mock('@/ui/shadcn/label', () => ({
    Label: ({
        children,
        ...props
    }: { children: React.ReactNode } & React.ComponentProps<'label'>) => (
        <label {...props}>{children}</label>
    ),
}));

jest.mock('@/ui/shadcn/checkbox', () => ({
    Checkbox: ({
        onCheckedChange,
        ...props
    }: React.ComponentProps<'input'> & {
        onCheckedChange?: (checked: boolean) => void;
    }) => (
        <input
            type="checkbox"
            data-testid="checkbox"
            onChange={(e) =>
                onCheckedChange && onCheckedChange(e.target.checked)
            }
            {...props}
        />
    ),
}));

jest.mock('@/ui/shadcn/tabs', () => ({
    Tabs: ({
        children,
        ...props
    }: { children: React.ReactNode } & React.ComponentProps<'div'>) => (
        <div data-testid="tabs" {...props}>
            {children}
        </div>
    ),
    TabsList: ({
        children,
        ...props
    }: { children: React.ReactNode } & React.ComponentProps<'div'>) => (
        <div data-testid="tabs-list" {...props}>
            {children}
        </div>
    ),
    TabsTrigger: ({
        children,
        ...props
    }: { children: React.ReactNode } & React.ComponentProps<'button'>) => (
        <button data-testid="tabs-trigger" {...props}>
            {children}
        </button>
    ),
    TabsContent: ({
        children,
        ...props
    }: { children: React.ReactNode } & React.ComponentProps<'div'>) => (
        <div data-testid="tabs-content" {...props}>
            {children}
        </div>
    ),
}));
