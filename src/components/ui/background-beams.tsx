"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const BackgroundBeams = ({ className }: { className?: string }) => {
    return (
        <div
            className={cn(
                "absolute inset-0 overflow-hidden flex items-end justify-center pointer-events-none",
                className
            )}
        >
            {/* Inner Glow - Blue */}
            <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 0.8, scaleY: 1 }}
                transition={{ duration: 2, delay: 0.2, ease: "easeOut" }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60px] h-[80vh] bg-blue-500/30 blur-[40px] origin-bottom z-10"
            />

            {/* Outer Glow - Purple/Blue */}
            <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 0.5, scaleY: 1 }}
                transition={{ duration: 2.5, delay: 0.4, ease: "easeOut" }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200px] h-[60vh] bg-indigo-600/20 blur-[80px] origin-bottom z-0"
            />

            {/* Wide Bottom Gradient - "Lamp Effect" */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 3, delay: 0.5 }}
                className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[120vw] h-[600px] bg-gradient-to-t from-blue-600/10 via-indigo-900/5 to-transparent blur-[80px] rounded-[100%]"
            />

            {/* Base Light - White/Blue at the bottom */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-blue-400/10 blur-[80px] rounded-t-full" />

            {/* Particles */}
            <div className="absolute inset-0 z-30 overflow-hidden">
                {[...Array(40)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            y: "100vh",
                            x: Math.random() * 400 - 200, // Wider spread
                            opacity: 0,
                            scale: Math.random() * 1.5 + 0.5 // Larger scale variation
                        }}
                        animate={{
                            y: "-20vh",
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: Math.random() * 7 + 5, // Random duration 5-10s
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: "linear"
                        }}
                        className="absolute bottom-0 left-1/2 w-1 h-1 bg-white rounded-full blur-[0.5px] shadow-[0_0_5px_rgba(255,255,255,0.5)]"
                        style={{
                            marginLeft: `${Math.random() * 100 - 50}px` // Additional random spread
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
