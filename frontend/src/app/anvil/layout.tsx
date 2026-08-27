import { AuthGuard } from '@/components/providers/auth-guard';

export default function AnvilLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="flex flex-col min-h-screen">{children}</div>
        </AuthGuard>
    );
}
