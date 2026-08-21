import { App, Stack } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { applyStandardTags } from './tagging';

describe('applyStandardTags', () => {
    function createTaggedStack(stage: 'dev' | 'test' | 'prod') {
        const app = new App();
        const stack = new Stack(app, 'TagTestStack');
        new s3.Bucket(stack, 'TestBucket');
        applyStandardTags(stack, stage);
        return Template.fromStack(stack);
    }

    it('applies Project tag', () => {
        const template = createTaggedStack('test');
        template.hasResourceProperties('AWS::S3::Bucket', {
            Tags: Match.arrayWith([
                Match.objectLike({ Key: 'Project', Value: 'skillforge' }),
            ]),
        });
    });

    it('applies Stage tag matching the stage argument', () => {
        const template = createTaggedStack('prod');
        template.hasResourceProperties('AWS::S3::Bucket', {
            Tags: Match.arrayWith([
                Match.objectLike({ Key: 'Stage', Value: 'prod' }),
            ]),
        });
    });

    it('applies ManagedBy tag with value cdk', () => {
        const template = createTaggedStack('dev');
        template.hasResourceProperties('AWS::S3::Bucket', {
            Tags: Match.arrayWith([
                Match.objectLike({ Key: 'ManagedBy', Value: 'cdk' }),
            ]),
        });
    });

    it('applies Owner tag', () => {
        const template = createTaggedStack('test');
        template.hasResourceProperties('AWS::S3::Bucket', {
            Tags: Match.arrayWith([
                Match.objectLike({ Key: 'Owner', Value: 'skillforge-team' }),
            ]),
        });
    });

    it('applies all four standard tags', () => {
        const template = createTaggedStack('test');
        const resources = template.findResources('AWS::S3::Bucket');
        const bucket = Object.values(resources)[0];
        const tags = bucket.Properties.Tags as Array<{
            Key: string;
            Value: string;
        }>;

        const tagKeys = tags.map((t) => t.Key);
        expect(tagKeys).toContain('Project');
        expect(tagKeys).toContain('Stage');
        expect(tagKeys).toContain('ManagedBy');
        expect(tagKeys).toContain('Owner');
    });

    it('sets correct stage for each environment', () => {
        const devTemplate = createTaggedStack('dev');
        devTemplate.hasResourceProperties('AWS::S3::Bucket', {
            Tags: Match.arrayWith([
                Match.objectLike({ Key: 'Stage', Value: 'dev' }),
            ]),
        });

        const prodTemplate = createTaggedStack('prod');
        prodTemplate.hasResourceProperties('AWS::S3::Bucket', {
            Tags: Match.arrayWith([
                Match.objectLike({ Key: 'Stage', Value: 'prod' }),
            ]),
        });
    });
});
