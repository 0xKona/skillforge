import AuthForm from '@/components/auth-form/auth-form';
import Logo from '@/components/logo/logo';
import FireEmbers from '@/components/ui/fire-embers';
import { isAuthenticated } from '@/utlils/amplify/server-utils';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
    // Server-side auth gate using Amplify: redirect authenticated users
    const authed = await isAuthenticated();
    if (authed) {
        redirect('/dashboard');
    }

    /*
        If not authenticated: Render the Auth UI.
        If user needs confirmation, the form will switch to verify code via zustand state
    */
    return (
        <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Orange glow from bottom */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-forge-orange/20 via-forge-orange/5 to-transparent pointer-events-none"></div>

            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            {/* Fire embers */}
            <div className="md:hidden">
                <FireEmbers count={50} />
            </div>

            <div className="hidden md:block">
                <FireEmbers count={25} />
            </div>

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
                <AuthForm />
            </div>
        </main>
    );
}
