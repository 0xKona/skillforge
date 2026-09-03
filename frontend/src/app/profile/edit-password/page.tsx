'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/ui/shadcn/button';
import FormInput from '@/ui/form-input';
import {
    editPasswordFormSchema,
    EditPasswordFormValues,
} from '@/lib/schemas/edit-password-schema';
import { userApi } from '@/lib/api/user';
import {
    SettingsCard,
    SettingsSectionHeader,
} from '@/components/features/profile/settings-card';

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
            await userApi.updateUserPassword(
                data.currentPassword,
                data.newPassword
            );
            toast.success('Password updated');
            form.reset();
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : 'Failed to update password'
            );
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <SettingsCard>
            <SettingsSectionHeader
                title="Password"
                description="Change the password you use to sign in."
            />
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormInput
                    form={form}
                    id="current-password"
                    inputName="currentPassword"
                    label="Current password"
                    placeholder="Enter current password"
                    type="password"
                />
                <FormInput
                    form={form}
                    id="new-password"
                    inputName="newPassword"
                    label="New password"
                    placeholder="At least 8 characters"
                    type="password"
                />
                <FormInput
                    form={form}
                    id="confirm-password"
                    inputName="confirmPassword"
                    label="Confirm new password"
                    placeholder="Confirm new password"
                    type="password"
                />
                <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving} size="lg">
                        {isSaving ? 'Saving...' : 'Save changes'}
                    </Button>
                </div>
            </form>
        </SettingsCard>
    );
}
