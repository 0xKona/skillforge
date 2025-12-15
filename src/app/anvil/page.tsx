import AnvilInterface from '@/components/features/anvil/library/anvil-interface';

export default async function AnvilPage() {
    return (
        <div className="flex-1 flex flex-col w-full max-w-screen-2xl mx-auto">
            <AnvilInterface />
        </div>
    );
}
