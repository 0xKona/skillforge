'use client';

import { Controller, UseFormReturn } from 'react-hook-form';
import { Label } from '@/ui/shadcn/label';
import { Input } from '@/ui/shadcn/input';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import React from 'react';
import { TypographyP } from './typography/typography';

export type FormInputType = 'email' | 'text' | 'password';

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<any>;
    id: string;
    inputName: string;
    placeholder: string;
    label: string;
    type?: FormInputType;
    disabled?: boolean;
}

export default function FormInput({
    form,
    id,
    inputName,
    placeholder,
    label,
    type = 'text',
    disabled = false,
}: Props) {
    const [showPassword, setShowPassword] = React.useState<boolean>(false);

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
                        {type !== 'password' && (
                            <Input
                                {...field}
                                id={id}
                                data-testid={id}
                                type={type}
                                placeholder={placeholder}
                                disabled={disabled}
                            />
                        )}
                        {/* If it is an input for sensitive data, need to include logic to hide and show text */}
                        {type === 'password' && (
                            <div className="relative">
                                <Input
                                    {...field}
                                    id={id}
                                    data-testid={id}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder={placeholder}
                                    disabled={disabled}
                                />
                                <button
                                    type="button"
                                    data-testid={`${id}-show-pass`}
                                    className="absolute right-1 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-ash transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                                    aria-label={
                                        showPassword
                                            ? 'Hide password'
                                            : 'Show password'
                                    }
                                    aria-pressed={showPassword}
                                    onClick={() =>
                                        setShowPassword((visible) => !visible)
                                    }
                                >
                                    {showPassword ? (
                                        <FaEye size={16} />
                                    ) : (
                                        <FaEyeSlash size={16} />
                                    )}
                                </button>
                            </div>
                        )}{' '}
                        {fieldState.error && (
                            <TypographyP
                                data-testid={`${id}-error`}
                                className="text-xs text-red-500"
                            >
                                {fieldState.error.message}
                            </TypographyP>
                        )}
                    </>
                )}
            />
        </div>
    );
}

/*
  Assignment note:

  Before I would have to repeat this code for each input field,
  this component means I can reuse it within any Form like this:

  <FormInput
    form={form}
    id="signup-email"
    inputName="email"
    placeholder="blacksmith@skillforge.com"
    label="Email"
  />

*/
