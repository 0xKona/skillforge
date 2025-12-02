import BackButton from '@/components/back-button/back';
import PageWrapper from '@/components/wrappers/page-wrapper';

export default function AnvilLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PageWrapper className="flex flex-col items-start justify-start relative md:pt-10 md:px-5">
            <div className="flex-1 flex flex-col w-full max-w-screen-2xl mx-auto">
                <BackButton />
                {children}
            </div>
        </PageWrapper>
    );
}
