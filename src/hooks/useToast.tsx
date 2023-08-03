import React, { useState, useCallback, useEffect } from "react";
import { useSpring, animated } from "react-spring";

interface ToastProps {
    title: string,
    subtitle: string,
    icon: React.ReactNode
}

export function useToastBox({ title, subtitle, icon }: ToastProps) {
    const [isActive, setIsActive] = useState(false);

    const styles = useSpring({
        transform: isActive
            ? "translate3d(0%, 0, 0) scale(1)"  // fully visible and at normal size
            : "translate3d(100%, 0, 0) scale(0)",  // fully off screen and scale down to 0
        config: { tension: 150, friction: 30 },
    });

    const hide = useCallback(() => setIsActive(false), []);

    const show = useCallback((duration = 3000) => {
        setIsActive(true);
        const timerId = window.setTimeout(hide, duration);
        return () => window.clearTimeout(timerId); // cleanup to prevent memory leak
    }, [hide]);

    useEffect(() => {
        if (isActive) {
            const timerId = window.setTimeout(hide, 3000); // Hide the toast after 3 seconds
            return () => window.clearTimeout(timerId); // cleanup to prevent memory leak
        }
    }, [isActive, hide]); // Add hide to the dependency array

    const ToastComponent = isActive && (
        <div className="overflow-hidden">
            <animated.div style={styles} className="fixed top-6 right-6 origin-top-right rounded bg-white p-5 shadow-md">
                <div className="flex items-center">
                    <div className="flex items-center justify-center">
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

    return [ToastComponent, show, hide] as const;
}
