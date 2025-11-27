import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
<<<<<<< HEAD
// import { data } from './data/resource';
// import { storage } from './storage/resource';
=======
import { data } from './data/resource';
>>>>>>> 858d52f (Initialize amplify backend (#4))

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
defineBackend({
    auth,
<<<<<<< HEAD
    // data,
    // storage,
=======
    data,
>>>>>>> 858d52f (Initialize amplify backend (#4))
});
