import Header from "../components/Header";
import { useEffect, useState } from 'react';
import DesktopView from "../components/DesktopView";
import MobileView from "../components/MobileView";

export default function HomePage() {
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
        document.title = "Home | EcoSnap";

         const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // 768px is a common breakpoint for mobile dimensions
        };

        handleResize(); // run on mount
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div>
            <Header />

            {isMobile ? <MobileView /> : <DesktopView />}
        </div>
    );
}

