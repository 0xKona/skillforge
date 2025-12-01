import PageWrapper from '@/components/wrappers/page-wrapper';

export default function AnvilLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PageWrapper className="flex flex-col items-start justify-start relative md:pt-20">
            {children}
        </PageWrapper>
    );
}
