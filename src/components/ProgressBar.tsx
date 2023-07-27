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
            tension: 170,
            friction: 26,
        },
    });

    return (
        <div className="w-full h-full bg-slate-50 flex items-center justify-start overflow-hidden">
            <animated.div
                style={{
                    width,
                }}
                className="h-full bg-blue-900 rounded-r-sm"
            />
            <div className="m-2 text-xs text-blue-900">
                {percentage.toFixed(4)} %
            </div>
        </div>
    );
};

export default ProgressBar;
