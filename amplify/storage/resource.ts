import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
    name: 'userAvatars',
    access: (allow) => ({
        // 'avatars/{entity_id}/*' allows users to read/write ONLY their own folder
        'avatars/{entity_id}/*': [
            allow.authenticated.to(['read', 'write', 'delete']),
            allow.guest.to(['read']), // Optional: Allow guests to view avatars if profiles are public
        ],
    }),
});
