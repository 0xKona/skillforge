import Link from 'next/link';
import { PageContainer } from '@/components/layout/wrappers/page-container';

export const metadata = {
    title: 'Privacy Policy | SkillForge',
    description:
        'How SkillForge collects, uses, and protects your personal data under UK GDPR.',
};

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="flex flex-col gap-3">
            <h2 className="font-display text-lg font-semibold text-text-primary">
                {title}
            </h2>
            <div className="flex flex-col gap-2 text-sm leading-7 text-ash">
                {children}
            </div>
        </section>
    );
}

function Notice({ children }: { children: React.ReactNode }) {
    return (
        <div className="rounded-lg border border-flux/30 bg-flux/5 px-4 py-3 text-sm leading-7 text-ash">
            {children}
        </div>
    );
}

const LAST_UPDATED = '1 September 2026';
const CONTROLLER_NAME = 'Connor Robinson';
const CONTROLLER_EMAIL = 'konarobinson@proton.me';

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-graphite py-12 md:py-16">
            <PageContainer>
                <div className="mx-auto max-w-2xl">
                    {/* Page header */}
                    <div className="mb-10">
                        <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-flux">
                            Legal
                        </p>
                        <h1 className="font-display text-4xl font-semibold tracking-tight text-text-primary">
                            Privacy Policy
                        </h1>
                        <p className="mt-3 text-sm text-ash">
                            Last updated: {LAST_UPDATED}
                        </p>
                    </div>

                    {/* Educational notice */}
                    <Notice>
                        <strong className="text-text-primary">
                            Educational project notice.
                        </strong>{' '}
                        SkillForge is an educational project built for learning
                        purposes only. It is not intended for commercial or
                        professional use. While we follow good practices,
                        security cannot be fully guaranteed. Please do not store
                        sensitive, confidential, or critical personal
                        information.
                    </Notice>

                    <div className="mt-8 flex flex-col gap-8">
                        <Section title="1. Who we are">
                            <p>
                                The data controller for SkillForge is{' '}
                                <strong className="text-text-primary">
                                    {CONTROLLER_NAME}
                                </strong>
                                . You can contact us at any time regarding your
                                personal data:
                            </p>
                            <p>
                                <strong className="text-text-primary">
                                    Email:
                                </strong>{' '}
                                <a
                                    href={`mailto:${CONTROLLER_EMAIL}`}
                                    className="text-flux hover:underline"
                                >
                                    {CONTROLLER_EMAIL}
                                </a>
                            </p>
                        </Section>

                        <Section title="2. What data we collect">
                            <p>
                                We collect only the data you provide directly:
                            </p>
                            <ul className="list-disc space-y-1 pl-5">
                                <li>
                                    <strong className="text-text-primary">
                                        Account data:
                                    </strong>{' '}
                                    your email address and password (stored as a
                                    cryptographic hash via AWS Cognito).
                                </li>
                                <li>
                                    <strong className="text-text-primary">
                                        CV content:
                                    </strong>{' '}
                                    the CV documents and sections you create
                                    inside the Forge.
                                </li>
                                <li>
                                    <strong className="text-text-primary">
                                        Ingot content:
                                    </strong>{' '}
                                    the reusable experience, education, and
                                    skills blocks you create in the Anvil.
                                </li>
                            </ul>
                            <p>
                                We do not collect analytics, tracking cookies,
                                advertising identifiers, or any data beyond what
                                is needed to operate the service.
                            </p>
                        </Section>

                        <Section title="3. How we use your data">
                            <p>Your data is used solely to:</p>
                            <ul className="list-disc space-y-1 pl-5">
                                <li>
                                    Authenticate you and maintain your session.
                                </li>
                                <li>Store and retrieve your CVs and ingots.</li>
                                <li>Allow you to export your CVs as PDF.</li>
                            </ul>
                            <p>
                                We do not use your data for marketing,
                                profiling, or any automated decision-making.
                            </p>
                        </Section>

                        <Section title="4. Lawful basis for processing">
                            <p>
                                Under UK GDPR Article 6(1)(f), we process your
                                data on the basis of{' '}
                                <strong className="text-text-primary">
                                    legitimate interests
                                </strong>
                                . Specifically, operating an educational
                                software project and providing you with the
                                service you signed up for. This interest is not
                                overridden by your rights given the limited,
                                non-commercial nature of the project.
                            </p>
                        </Section>

                        <Section title="5. Data storage and security">
                            <p>
                                Your data is stored on AWS infrastructure
                                (DynamoDB, Cognito, S3) in the{' '}
                                <strong className="text-text-primary">
                                    eu-west-2 (London)
                                </strong>{' '}
                                region.
                            </p>
                            <p>
                                Passwords are never stored in plain text.
                                Authentication is handled entirely by AWS
                                Cognito. CV and ingot data is stored in DynamoDB
                                and accessible only via authenticated API
                                requests.
                            </p>
                            <Notice>
                                As an educational project, we cannot guarantee
                                the same standard of security as a commercial
                                service. Do not store sensitive, confidential,
                                or professionally critical information.
                            </Notice>
                        </Section>

                        <Section title="6. Data retention">
                            <p>
                                Your data is retained for as long as you hold an
                                account. You can permanently delete your account
                                and all associated data at any time from the{' '}
                                <Link
                                    href="/profile/delete-account"
                                    className="text-flux hover:underline"
                                >
                                    profile settings
                                </Link>{' '}
                                page. Deletion is immediate and irreversible.
                            </p>
                        </Section>

                        <Section title="7. Third-party sharing">
                            <p>
                                We do not sell, rent, or share your personal
                                data with any third parties. The only processors
                                involved are AWS services (Cognito, DynamoDB,
                                S3, API Gateway, Lambda) used to run the
                                infrastructure.
                            </p>
                        </Section>

                        <Section title="8. Your rights under UK GDPR">
                            <p>
                                You have the following rights regarding your
                                personal data:
                            </p>
                            <ul className="list-disc space-y-1 pl-5">
                                <li>
                                    <strong className="text-text-primary">
                                        Right of access:
                                    </strong>{' '}
                                    you can request a copy of the data we hold
                                    about you.
                                </li>
                                <li>
                                    <strong className="text-text-primary">
                                        Right to erasure:
                                    </strong>{' '}
                                    you can delete all your data by deleting
                                    your account in profile settings.
                                </li>
                                <li>
                                    <strong className="text-text-primary">
                                        Right to rectification:
                                    </strong>{' '}
                                    you can update your account details at any
                                    time via profile settings.
                                </li>
                                <li>
                                    <strong className="text-text-primary">
                                        Right to data portability:
                                    </strong>{' '}
                                    you can export your CVs as PDF at any time
                                    from the Forge.
                                </li>
                                <li>
                                    <strong className="text-text-primary">
                                        Right to object:
                                    </strong>{' '}
                                    you can object to processing at any time by
                                    contacting us, and we will delete your
                                    account.
                                </li>
                                <li>
                                    <strong className="text-text-primary">
                                        Right to restrict processing:
                                    </strong>{' '}
                                    you can request we restrict processing of
                                    your data while any objection is resolved.
                                </li>
                            </ul>
                            <p>
                                To exercise any right other than account
                                deletion (which is self-service), contact us at{' '}
                                <a
                                    href={`mailto:${CONTROLLER_EMAIL}`}
                                    className="text-flux hover:underline"
                                >
                                    {CONTROLLER_EMAIL}
                                </a>
                                . We will respond within 30 days.
                            </p>
                        </Section>

                        <Section title="9. Complaints">
                            <p>
                                If you believe we have not handled your data
                                correctly, you have the right to lodge a
                                complaint with the UK supervisory authority:
                            </p>
                            <p>
                                <strong className="text-text-primary">
                                    Information Commissioner&apos;s Office (ICO)
                                </strong>
                                <br />
                                <a
                                    href="https://ico.org.uk"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-flux hover:underline"
                                >
                                    ico.org.uk
                                </a>{' '}
                                · 0303 123 1113
                            </p>
                        </Section>

                        <Section title="10. Changes to this policy">
                            <p>
                                We may update this policy as the project
                                evolves. The date at the top of this page
                                reflects the most recent revision. Continued use
                                of SkillForge after changes are posted
                                constitutes acceptance of the updated policy.
                            </p>
                        </Section>
                    </div>

                    <div className="mt-10 border-t border-border-default pt-6">
                        <Link
                            href="/"
                            className="text-sm text-ash transition-colors hover:text-text-primary"
                        >
                            Back to SkillForge
                        </Link>
                    </div>
                </div>
            </PageContainer>
        </main>
    );
}
