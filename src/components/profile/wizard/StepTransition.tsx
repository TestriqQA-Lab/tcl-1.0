"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StepTransitionProps {
    children: React.ReactNode;
    stepId: number;
    direction: 'forward' | 'backward';
}

export const StepTransition: React.FC<StepTransitionProps> = ({
    children,
    stepId,
    direction,
}) => {
    const variants = {
        enter: (direction: 'forward' | 'backward') => ({
            x: direction === 'forward' ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: 'forward' | 'backward') => ({
            zIndex: 0,
            x: direction === 'forward' ? -1000 : 1000,
            opacity: 0,
        }),
    };

    return (
        <AnimatePresence mode="wait" custom={direction}>
            <motion.div
                key={stepId}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};
