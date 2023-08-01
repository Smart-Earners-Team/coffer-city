import { useState, useEffect, useCallback } from "react";
import { useSpring, animated } from "react-spring";

// useToast hook
export const useToast = (initialIsActive = false) => {
    const [isActive, setIsActive] = useState(initialIsActive);

    const show = useCallback((duration = 3000) => {
        setIsActive(true);
        const timerId = window.setTimeout(() => setIsActive(false), duration);
        return () => window.clearTimeout(timerId); // cleanup to prevent memory leak
    }, []);

    const hide = useCallback(() => setIsActive(false), []);

    return { isActive, show, hide };
};

// Toast Component
interface ToastProps {
    isActive: boolean;
    title?: string;
    subtitle: string;
    icon?: React.ReactNode;
    hide: () => void; // New hide prop
}

export const Toast: React.FC<ToastProps> = ({ isActive, title, subtitle, icon, hide }) => {
    const styles = useSpring({
        transform: isActive
            ? "translate3d(0%, 0, 0) scale(1)"  // fully visible and at normal size
            : "translate3d(100%, 0, 0) scale(0)",  // fully off screen and scale down to 0
        config: { tension: 150, friction: 30 },
    });

    useEffect(() => {
        if (isActive) {
            const timerId = window.setTimeout(hide, 3000); // Hide the toast after 3 seconds
            return () => window.clearTimeout(timerId); // cleanup to prevent memory leak
        }
    }, [isActive, hide]); // Add hide to the dependency array

    if (!isActive) return null;

    return (
        <div className="overflow-hidden">
            <animated.div style={styles} className="absolute top-6 right-6 origin-top-left rounded bg-white p-5 shadow-md">
                <div className="flex items-center">
                    <div className="flex items-center justify-center h-9 w-9 bg-blue-900 text-white rounded-full">
                        {icon}
                    </div>
                    <div className="ml-5">
                        <span className="block text-lg font-bold text-gray-800">{title}</span>
                        <span className="block text-base font-light text-gray-600">{subtitle}</span>
                    </div>
                </div>
                {/* <FaTimes onClick={hide} className="absolute top-2.5 right-4 p-1 cursor-pointer opacity-70 hover:opacity-100" /> */}
            </animated.div>
        </div>
    );
};
