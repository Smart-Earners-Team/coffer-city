import { useSpring, animated } from 'react-spring';
import React, { memo } from 'react';

interface TransitionProps {
    children: React.ReactNode;
    direction?: 'left' | 'right' | 'top' | 'bottom' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
    tension?: number;
    friction?: number;
}

const Transition = memo(({ children, direction = 'right', tension = 170, friction = 26 }: TransitionProps) => {
    const translateDirection = {
        right: 'translate3d(100%,0,0)',
        left: 'translate3d(-100%,0,0)',
        top: 'translate3d(0,-100%,0)',
        bottom: 'translate3d(0,100%,0)',
        topleft: 'translate3d(-100%,-100%,0)',
        topright: 'translate3d(100%,-100%,0)',
        bottomleft: 'translate3d(-100%,100%,0)',
        bottomright: 'translate3d(100%,100%,0)',
    }[direction];

    const props = useSpring({
        from: { opacity: 0, transform: `${translateDirection} scale(0)` },
        to: { opacity: 1, transform: 'translate3d(0%,0,0) scale(1)' },
        config: { tension, friction },
    });

    return (
        <animated.div style={props}>
            {children}
        </animated.div>
    );
});

export default Transition;
