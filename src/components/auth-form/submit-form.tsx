'use client';

import { Button } from '../ui/shadcn/button';

interface Props {
    buttonText: string;
    buttonLoadingText: string;
    isLoading: boolean;
    setIsLoading: (newLoading: boolean) => void;
    setError: (newError: string) => void;
}

export default function SubmitAuthForm({
    buttonText,
    buttonLoadingText,
    isLoading,
}: Props) {
    return (
        <Button type="submit" className="w-full mb-2" disabled={isLoading}>
            {isLoading ? buttonLoadingText : buttonText}
        </Button>
    );
}
