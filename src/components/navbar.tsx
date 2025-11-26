'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Coffee, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <nav className="flex items-center justify-between px-6 py-3 bg-white border-2 border-black pixel-shadow max-w-5xl mx-auto w-full sticky top-4 z-[100]">
                <div className="flex items-center gap-8">
                    <Link href="/" className="font-bold text-xl tracking-tight uppercase font-pixel">
                        Webper
                    </Link>
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/about" className="text-sm uppercase font-bold hover:underline decoration-2 underline-offset-4">About</Link>
                        <Link href="/how-to-use" className="text-sm uppercase font-bold hover:underline decoration-2 underline-offset-4">How to Use</Link>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        className="hidden md:flex gap-2 bg-accent text-accent-foreground hover:bg-[#004D40] border-2 border-black"
                    >
                        <Coffee className="w-4 h-4" />
                        <span className="hidden sm:inline">Buy me a coffee</span>
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </Button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed inset-0 z-[100] bg-background border-l-4 border-black md:hidden flex flex-col p-6"
                    >
                        <div className="flex items-center justify-between mb-8 border-b-4 border-black pb-4">
                            <span className="font-bold text-2xl uppercase">Webper</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="w-8 h-8" />
                            </Button>
                        </div>

                        <div className="flex flex-col gap-6 flex-1">
                            <Link href="/about" className="text-2xl hover:bg-primary/10 p-2 border-2 border-transparent hover:border-black transition-none" onClick={() => setIsOpen(false)}>
                                About
                            </Link>
                            <Link href="/how-to-use" className="text-2xl hover:bg-primary/10 p-2 border-2 border-transparent hover:border-black transition-none" onClick={() => setIsOpen(false)}>
                                How to Use
                            </Link>

                            <div className="mt-auto pb-8">
                                <Button variant="outline" className="w-full gap-2 h-14 text-lg" onClick={() => setIsOpen(false)}>
                                    <Coffee className="w-6 h-6" />
                                    Buy me a coffee
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
