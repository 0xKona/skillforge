import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
    auth,
    data,
    storage,
});

const { bucket } = backend.storage.resources;

// 1. Adjust S3 Block Public Access settings to allow a public bucket policy
// We access the L1 CfnBucket construct to override these properties
const cfnBucket = bucket.node.defaultChild as s3.CfnBucket;
cfnBucket.publicAccessBlockConfiguration = {
    blockPublicAcls: true,
    ignorePublicAcls: true,
    blockPublicPolicy: false, // Allow public bucket policies
    restrictPublicBuckets: false, // Allow public bucket policies
};

// 2. Add the Bucket Policy to allow public read access to the 'avatars/*' path
bucket.addToResourcePolicy(
    new iam.PolicyStatement({
        sid: 'AllowPublicReadForAvatars',
        effect: iam.Effect.ALLOW,
        actions: ['s3:GetObject'],
        principals: [new iam.AnyPrincipal()], // Principal: "*"
        resources: [bucket.arnForObjects('avatars/*')],
    })
);
