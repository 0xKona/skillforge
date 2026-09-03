import { cn } from '@/lib/utils';

interface SettingsCardProps {
    children: React.ReactNode;
    className?: string;
}

export function SettingsCard({ children, className }: SettingsCardProps) {
    return (
        <div
            className={cn(
                'max-w-xl rounded-lg border border-border-default bg-gunmetal p-6',
                className
            )}
        >
            {children}
        </div>
    );
}

interface SettingsSectionHeaderProps {
    title: string;
    description: string;
    destructive?: boolean;
}

export function SettingsSectionHeader({
    title,
    description,
    destructive = false,
}: SettingsSectionHeaderProps) {
    return (
        <div className="mb-6">
            <h2
                className={cn(
                    'text-lg font-semibold',
                    destructive ? 'text-destructive' : 'text-text-primary'
                )}
            >
                {title}
            </h2>
            <p className="mt-1 text-sm text-ash">{description}</p>
        </div>
    );
}
