import AuthForm from '@/components/auth-form/auth-form';
import LoginPageMessage from '@/components/auth-form/message';
import Logo from '@/components/icons/logo';
import BluePrintForgeBg from '@/components/ui/forge-bg';
import PageWrapper from '@/components/wrappers/page-wrapper';
import { isAuthenticated } from '@/utlils/amplify/server-utils';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
    // Server-side auth gate using Amplify: redirect authenticated users
    const authed = await isAuthenticated();
    if (authed) {
        redirect('/forge');
    }

    /*
        If not authenticated: Render the Auth UI.
        If user needs confirmation, the form will switch to verify code via zustand state
    */

    const restricted = process.env.AVAILABILITY_MODE;
    console.log(restricted);
    const message = restricted === 'RESTRICTED' ? <LoginPageMessage /> : null;

    return (
        <PageWrapper>
            <main className="min-h-screen flex items-start justify-center relative bg-gradient-to-br md:pt-20 from-slate-900 via-slate-800 to-slate-900">
                <BluePrintForgeBg />

                <div className="w-full max-w-md relative z-10 p-5">
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <Logo
                                    size={200}
                                    color="var(--color-forge-orange)"
                                    borderColor="#393939"
                                    borderWidth={10}
                                    className="drop-shadow-[0_0_30px_rgba(249,115,22,0.5)]"
                                />
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight mb-2 text-white">
                                SkillForge
                            </h1>
                        </div>
                        <p className="text-gray-300">
                            Welcome! Please sign in to continue.
                        </p>
                    </div>
                    <AuthForm message={message} />
                </div>
            </main>
        </PageWrapper>
    );
}
