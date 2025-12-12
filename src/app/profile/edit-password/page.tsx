'use client';

import { Button } from '@/components/ui/component-library/shadcn-components/button';
import FormInput, { FormInputType } from '@/components/ui/form-input';
import { ProfileService } from '@/lib/classes/services/profile-service';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
    editPasswordFormSchema,
    EditPasswordFormValues,
} from '@/lib/form-schemas/edit-password-schema';
import {
    TypographyH3,
    TypographyP,
} from '@/components/ui/typography/typography';

export default function EditPasswordPage() {
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<EditPasswordFormValues>({
        resolver: zodResolver(editPasswordFormSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    async function onSubmit(data: EditPasswordFormValues) {
        setIsSaving(true);
        try {
            await ProfileService.updateUserPassword(
                data.currentPassword,
                data.newPassword
            );
            toast.success('Password updated successfully');
            form.reset();
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Failed to update password');
            }
        } finally {
            setIsSaving(false);
        }
    }

    interface FormInputParams {
        id: string;
        inputName: string;
        label: string;
        placeholder: string;
        type: FormInputType;
    }

    const inputs: FormInputParams[] = [
        {
            id: 'currentPassword',
            inputName: 'currentPassword',
            label: 'Current Password',
            placeholder: 'Enter your current password',
            type: 'password',
        },
        {
            id: 'newPassword',
            inputName: 'newPassword',
            label: 'New Password',
            placeholder: 'Enter your new password',
            type: 'password',
        },
        {
            id: 'confirmPassword',
            inputName: 'confirmPassword',
            label: 'Confirm New Password',
            placeholder: 'Confirm your new password',
            type: 'password',
        },
    ];

    return (
        <div className="space-y-6 w-full">
            <div>
                <TypographyH3>Edit Password</TypographyH3>
                <TypographyP className="text-muted-foreground">
                    Change your password to keep your account secure.
                </TypographyP>
            </div>
            <div className="h-[1px] bg-border" />
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {inputs.map((input: FormInputParams) => (
                    <FormInput
                        key={input.id + input.inputName}
                        form={form}
                        id={input.id}
                        inputName={input.inputName}
                        label={input.label}
                        placeholder={input.placeholder}
                        type={input.type}
                    />
                ))}

                <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
