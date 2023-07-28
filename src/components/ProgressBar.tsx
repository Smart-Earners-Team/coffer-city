import React from 'react';
import { animated, useSpring } from 'react-spring';

interface ProgressBarProps {
    percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage = 0 }) => {
    const { width } = useSpring({
        from: { width: '0%' },
        to: { width: `${percentage}%` },
        config: {
            tension: 50,
            friction: 20,
        },
    });

    return (
        <div className="w-full rounded-l-xl rounded-r-xl h-6 bg-slate-50/70 flex items-center justify-start overflow-hidden">
            <animated.div
                style={{
                    width,
                }}
                className="h-full bg-green-600/80"
            />
            <div className="m-2 text-xs text-slate-600">
                {percentage.toFixed(4)} %
            </div>
        </div>
    );
};

export default ProgressBar;
