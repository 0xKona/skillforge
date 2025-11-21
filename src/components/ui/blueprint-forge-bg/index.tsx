import BottomForgeGlow from './bottom-glow';
import FireEmbers from './fire-embers';

export default function BluePrintForgeBg() {
    return (
        <>
            {/* Orange glow from bottom */}
            <BottomForgeGlow />

            {/* Fire embers */}
            <div className="md:hidden">
                <FireEmbers count={50} />
            </div>

            <div className="hidden md:block">
                <FireEmbers count={25} />
            </div>
        </>
    );
}
