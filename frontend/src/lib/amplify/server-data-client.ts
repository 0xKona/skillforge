import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data';
import { cookies } from 'next/headers';
import { type Schema } from '../../../amplify/data/resource';
import outputs from '../../../amplify_outputs.json';

export const serverClient = generateServerClientUsingCookies<Schema>({
    config: outputs,
    cookies,
});
