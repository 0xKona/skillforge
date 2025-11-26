import { create } from 'zustand';

interface UserAvatarState {
    avatarUrl: string | undefined;
    setAvatarUrl: (url: string) => void;
}

export const useGlobalAvatar = create<UserAvatarState>((set) => ({
    avatarUrl: undefined,
    setAvatarUrl: (url: string) => set({ avatarUrl: url }),
}));
