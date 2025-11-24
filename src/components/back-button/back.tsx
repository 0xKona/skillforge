import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
    const router = useRouter();

    return (
        <button
            className="flex gap-2 cursor-pointer text-white font-bold py-2 px-4 rounded"
            onClick={() => router.back()}
        >
            <ArrowLeft />
            Back
        </button>
    );
}
