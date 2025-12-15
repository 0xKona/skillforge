import BottomForgeGlow from './bottom-glow';
import FireEmbers from './fire-embers';

export default function BluePrintForgeBg() {
    return (
        <>
            {/* Orange glow from bottom */}
            <BottomForgeGlow />

            {/* Fire embers */}
            <FireEmbers count={25} />
        </>
    );
}
