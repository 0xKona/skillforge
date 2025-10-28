'use client';

import { Button } from '../ui/shadcn/button';

interface Props {
    id?: string;
    buttonText: string;
    buttonLoadingText: string;
    isLoading: boolean;
}

export default function SubmitAuthForm({
    id,
    buttonText,
    buttonLoadingText,
    isLoading,
}: Props) {
    return (
        <Button
            id={id}
            data-testid={id}
            type="submit"
            className="w-full mb-2"
            disabled={isLoading}
        >
            {isLoading ? buttonLoadingText : buttonText}
        </Button>
    );
}
