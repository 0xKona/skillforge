import { redirect } from 'next/navigation';

export default function UserManagementPage() {
    redirect('/profile/edit-profile');
}
