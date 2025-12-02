import AnvilInterface from '@/components/anvil/anvil-interface';
import BackButton from '@/components/back-button/back';

export default async function AnvilPage() {
    return (
        <div className="flex-1 flex flex-col w-full max-w-screen-2xl mx-auto">
            <BackButton />
            <AnvilInterface />
        </div>
    );
}
