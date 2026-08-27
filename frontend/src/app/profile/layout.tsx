import { AuthGuard } from '@/components/providers/auth-guard';

export default function ProfileLayout({
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
