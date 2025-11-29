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
            {/* Inner Glow - Blue (Top Spotlight) */}
            <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 0.8, scaleY: 1 }}
                transition={{ duration: 2, delay: 0.2, ease: "easeOut" }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[80vh] bg-blue-500/30 blur-[60px] origin-top z-0"
            />

            {/* Outer Glow - Purple/Blue (Top Spotlight) */}
            <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 0.5, scaleY: 1 }}
                transition={{ duration: 2.5, delay: 0.4, ease: "easeOut" }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[70vh] bg-indigo-600/20 blur-[100px] origin-top -z-10"
            />

            {/* Wide Top Gradient - "Lamp Effect" */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 3, delay: 0.5 }}
                className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[150vw] h-[800px] bg-gradient-to-b from-blue-600/10 via-indigo-900/5 to-transparent blur-[100px] rounded-[100%] -z-10"
            />

            {/* Base Light - White/Blue at the top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-400/10 blur-[100px] rounded-b-full -z-10" />


        </div>
    );
};
