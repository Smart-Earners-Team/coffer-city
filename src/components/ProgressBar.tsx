import React from 'react';
import { animated, useSpring } from 'react-spring';

interface ProgressBarProps {
    percentage: number | string;
    decimalPlaces?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage = 0 , decimalPlaces = 3 }) => {
    const { width } = useSpring({
        from: { width: '0%' },
        to: { width: `${percentage.toString()}%` },
        config: {
            tension: 50,
            friction: 20,
        },
    });

    return (
        <div className='relative'>
            <div className="w-full rounded-l-xl rounded-r-xl h-6 bg-slate-50/80 flex items-center justify-start overflow-hidden">
                <animated.div
                    style={{
                        width,
                    }}
                    className="h-full bg-green-600/80"
                />
                <div
                    className="w-[99%] mx-auto text-center text-xs text-slate-700 absolute"
                >
                    {Number(percentage).toFixed(decimalPlaces)} %
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;
