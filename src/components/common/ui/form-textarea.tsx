'use client';

import { Controller, UseFormReturn } from 'react-hook-form';
import { Label } from '@/ui/shadcn/label';
import { Textarea } from '@/ui/shadcn/textarea';
import React from 'react';

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<any>;
    id: string;
    inputName: string;
    placeholder: string;
    label: string;
    disabled?: boolean;
    className?: string;
}

export default function FormTextarea({
    form,
    id,
    inputName,
    placeholder,
    label,
    disabled = false,
    className,
}: Props) {
    return (
        <div className="space-y-2">
            <Label data-testid={`${id}-label`} htmlFor={id}>
                {label}
            </Label>
            <Controller
                name={inputName}
                control={form.control}
                render={({ field, fieldState }) => (
                    <>
                        <Textarea
                            {...field}
                            id={id}
                            data-testid={id}
                            placeholder={placeholder}
                            disabled={disabled}
                            className={className}
                        />
                        {fieldState.error && (
                            <p className="text-sm font-medium text-destructive">
                                {fieldState.error.message}
                            </p>
                        )}
                    </>
                )}
            />
        </div>
    );
}
