'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Coffee, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-5xl z-50">
                <div
                    className={cn(
                        "rounded-full px-6 py-3 flex items-center justify-between transition-all duration-300",
                        isScrolled
                            ? "glass shadow-2xl shadow-black/50"
                            : "bg-transparent border border-transparent"
                    )}
                >
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/webper-logo.png"
                                alt="Webper"
                                width={120}
                                height={40}
                                priority
                                className="h-8 w-auto object-contain"
                            />
                        </Link>
                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/about" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">About</Link>
                            <Link href="/how-to-use" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">How to Use</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            size="sm"
                            className="hidden md:flex gap-2 bg-white text-black hover:bg-zinc-200 border-none rounded-full font-medium h-9 px-4"
                            asChild
                        >
                            <a href="https://buymeacoffee.com/wahibirawan" target="_blank" rel="noopener noreferrer">
                                <Coffee className="w-4 h-4" />
                                <span className="text-sm font-semibold">Buy me a coffee</span>
                            </a>
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden text-zinc-400 hover:text-white hover:bg-white/10 rounded-full"
                            onClick={() => setIsOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl md:hidden flex flex-col p-6"
                    >
                        <div className="flex items-center justify-between mb-12">
                            <span className="font-bold text-2xl text-white">Webper</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full hover:bg-white/10 text-white"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="w-8 h-8" />
                            </Button>
                        </div>

                        <div className="flex flex-col gap-8 flex-1">
                            <Link href="/about" className="text-3xl font-medium text-zinc-400 hover:text-white transition-colors" onClick={() => setIsOpen(false)}>
                                About
                            </Link>
                            <Link href="/how-to-use" className="text-3xl font-medium text-zinc-400 hover:text-white transition-colors" onClick={() => setIsOpen(false)}>
                                How to Use
                            </Link>

                            <div className="mt-auto pb-8">
                                <Button className="w-full gap-2 h-14 text-lg rounded-full bg-white text-black hover:bg-zinc-200 border-none font-bold" asChild>
                                    <a href="https://buymeacoffee.com/wahibirawan" target="_blank" rel="noopener noreferrer">
                                        <Coffee className="w-6 h-6" />
                                        Support Project
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
