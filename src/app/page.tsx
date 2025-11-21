import Logo from '@/components/icons/logo';
import BackgroundGrid from '@/components/ui/styling/background-grid';
import BottomForgeGlow from '@/components/ui/styling/bottom-glow';
import FireEmbers from '@/components/ui/styling/fire-embers';

export default async function Home() {
    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
            {/* Grid pattern - positioned to cover only this page container */}
            <BackgroundGrid />

            {/* Orange glow from bottom */}
            <BottomForgeGlow />

            {/* Fire embers */}
            <div className="md:hidden">
                <FireEmbers count={50} />
            </div>

            <div className="hidden md:block">
                <FireEmbers count={25} />
            </div>
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start relative z-10">
                <p>Home Page</p>
                <Logo size={400} />
            </main>
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
        </div>
    );
}
