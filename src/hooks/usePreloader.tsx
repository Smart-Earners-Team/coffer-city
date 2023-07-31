import React, { useEffect, useState } from 'react';
import { useSprings, animated } from 'react-spring';

interface PreloaderProps {
    text?: string;
    children?: React.ReactNode;
}

export const Preloader: React.FC<PreloaderProps> = ({ text, children }) => {
    const items = Array.from({ length: 6 });

    // Create the spring animation for each item
    const springs = useSprings(
        items.length,
        items.map((_, index) => ({
            from: { opacity: 0 }, // Starting opacity
            to: async (next: any) => {
                // Create a loop to continuously fade in and out
                while (true) {
                    // Wait for the turn of this item based on its index
                    await new Promise((resolve) => setTimeout(resolve, index * 50));
                    // Fade in
                    await next({ opacity: 1 });
                    // Stay visible for a moment
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    // Fade out
                    await next({ opacity: 0 });
                }
            },
        }))
    );

    return (
        <div className='grid justify-center items-center h-screen select-none'>
            <div className="flex flex-col gap-4 items-center">
                <div className="flex gap-2">
                    <div className="grid grid-cols-3 gap-2">
                        {springs.map((props, index) => (
                            <animated.div
                                key={index}
                                style={props}
                                className="w-2 h-2 bg-red-400 flex justify-center items-center"
                            ></animated.div>
                        ))}
                    </div>
                    <div className='text-center'>
                        {text}
                    </div>
                </div>
                <div className='text-center'>
                    {children}
                </div>
            </div>
        </div>
    );
};

interface UsePreloaderOptions {
    checks?: () => Promise<boolean | undefined>;
    text?: string;
}

const usePreloader = ({ checks, text }: UsePreloaderOptions = {}) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const performChecks = async () => {
            if (checks) {
                const canProceed = await checks();
                setLoading(!canProceed); // Will set loading to false if canProceed is true
            }
        };

        performChecks();
    }, [checks]);

    return { loading, text };
};

export default usePreloader;
