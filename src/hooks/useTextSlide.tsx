import React, { useState, useEffect } from 'react';
import { useTransition, animated } from 'react-spring';

export type Direction = 'top' | 'bottom' | 'left' | 'right';

interface Props {
    items: string[];
    interval?: number;
    direction?: Direction;
}

interface AnimatedTextProps {
    items: string[];
    interval?: number;
    direction?: Direction;
    className?: React.ReactNode;
}

const directionMap = {
    top: { from: 'translate3d(0,-100%,0)', enter: 'translate3d(0,0%,0)', leave: 'translate3d(0,50%,0)' },
    bottom: { from: 'translate3d(0,100%,0)', enter: 'translate3d(0,0%,0)', leave: 'translate3d(0,-50%,0)' },
    left: { from: 'translate3d(-100%,0,0)', enter: 'translate3d(0%,0,0)', leave: 'translate3d(50%,0,0)' },
    right: { from: 'translate3d(100%,0,0)', enter: 'translate3d(0%,0,0)', leave: 'translate3d(-50%,0,0)' }
};

export const useTextSlide = ({ items, interval = 3000, direction = 'right' }: Props) => {
    const [index, setIndex] = useState(0);

    const { from, enter, leave } = directionMap[direction];

    // Slide transition
    const transitions = useTransition(items[index], {
        from: { opacity: 0, transform: from },
        enter: { opacity: 1, transform: enter },
        leave: { opacity: 0, transform: leave },
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((state) => (state + 1) % items.length);
        }, interval);

        // Clean up the interval on unmount
        return () => {
            clearInterval(timer);
        };
    }, [items, interval]);

    return { transitions };
};

export const AnimatedText: React.FC<AnimatedTextProps> = React.memo(({ items, interval, direction, className }) => {
    const { transitions } = useTextSlide({ items, interval, direction });

    return (
        <div style={{ position: 'relative', height: '1.2em' }}> {/* Adjust the height as needed */}
            {transitions((styles, item) => (
                <animated.div className={`${className}`} style={{ ...styles, position: 'absolute' }}>
                    {item}
                </animated.div>
            ))}
        </div>
    );
});
