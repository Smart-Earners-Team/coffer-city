import React, { useState, useEffect } from "react";

// useToast hook
export const useToast = (initialIsActive: boolean) => {
    const [isActive, setIsActive] = useState(initialIsActive);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    const show = (duration: number) => {
        setIsActive(true);
        if (timer !== null) {
            clearTimeout(timer);
        }
        setTimer(
            setTimeout(() => {
                setIsActive(false);
            }, duration)
        );
    };

    const hide = () => {
        setIsActive(false);
        if (timer !== null) {
            clearTimeout(timer);
            setTimer(null);
        }
    };

    return { isActive, show, hide };
};

// Toast Component
export const Toast: React.FC<{
    isActive: boolean;
    duration: number;
    title: string;
    subtitle: string;
    Icon: React.ReactNode;
}> = ({ isActive, duration, title, subtitle, Icon }) => {
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isActive) {
            timer = setTimeout(() => {
                isActive = false;
            }, duration);
        }
        return () => {
            clearTimeout(timer);
        };
    }, [isActive, duration]);

    if (!isActive) return null;

    return (
        <div
            className="transform transition-transform duration-500 ease-in-out absolute top-6 right-8 rounded-3xl bg-white p-5 shadow-md overflow-hidden"
        >
            <div className="flex items-center">
                <div className="flex items-center justify-center h-9 w-9 bg-blue-600 text-white rounded-full">
                    {Icon}
                </div>
                <div className="ml-5">
                    <span className="block text-lg font-bold text-gray-800">{title}</span>
                    <span className="block text-base font-light text-gray-600">
                        {subtitle}
                    </span>
                </div>
            </div>
            <i className="fa-solid fa-xmark absolute top-2.5 right-4 p-1 cursor-pointer opacity-70 hover:opacity-100"></i>
            <div className="h-1 w-full bg-blue-600"></div>
        </div>
    );
};
