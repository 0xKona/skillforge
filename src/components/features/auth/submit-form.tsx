'use client';

import { Button } from '@/components/ui/component-library/shadcn-components/button';

interface Props {
    id?: string;
    buttonText: string;
    buttonLoadingText: string;
    isLoading: boolean;
    disabled?: boolean;
}

export default function SubmitAuthForm({
    id,
    buttonText,
    buttonLoadingText,
    isLoading,
    disabled = false,
}: Props) {
    return (
        <Button
            id={id}
            data-testid={id}
            type="submit"
            className="w-full mb-2"
            disabled={disabled || isLoading}
        >
            {isLoading ? buttonLoadingText : buttonText}
        </Button>
    );
}
