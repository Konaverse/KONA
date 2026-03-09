"use client";

import React, { useState, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FrameCanvasProps {
    isInitialLoaded: boolean;
}

export const FrameCanvas = forwardRef<HTMLCanvasElement, FrameCanvasProps>(
    ({ isInitialLoaded }, ref) => {
        const [showLoading, setShowLoading] = useState(true);

        useEffect(() => {
            if (isInitialLoaded) {
                const timer = setTimeout(() => setShowLoading(false), 300);
                return () => clearTimeout(timer);
            }
        }, [isInitialLoaded]);

        return (
            <>
                <div
                    className="fixed inset-0 w-screen h-screen z-[1] select-none pointer-events-none overflow-hidden"
                    style={{ backgroundColor: "#0a0b09" }}
                >
                    <canvas ref={ref} className="absolute inset-0 w-full h-full" />
                </div>

                {/* Loading overlay */}
                <AnimatePresence>
                    {showLoading && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#111]"
                        >
                            <motion.div
                                animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1.05, 0.95] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="w-12 h-12 flex items-center justify-center"
                            >
                                <svg
                                    width="48"
                                    height="48"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ color: "#6b7f62" }}
                                >
                                    <path
                                        d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </>
        );
    },
);

FrameCanvas.displayName = "FrameCanvas";
