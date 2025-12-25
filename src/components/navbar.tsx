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
                            ? "bg-white/80 backdrop-blur-xl border border-gray-200 shadow-lg shadow-gray-200/50"
                            : "bg-transparent border border-transparent"
                    )}
                >
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 text-gray-900">
                            <Image
                                src="/webper-logo.svg"
                                alt="Webper Logo"
                                width={120}
                                height={40}
                                priority
                                className="h-8 w-auto object-contain"
                            />
                        </Link>
                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/base64" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Image to Base64</Link>
                            <Link href="/pdf-compress" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">PDF Tools</Link>
                            <Link href="/how-to-use" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">How to Use</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            size="sm"
                            className="hidden md:flex gap-2 bg-gray-900 text-white hover:bg-gray-800 border-none rounded-full font-medium h-9 px-4 btn-tactile"
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
                            className="md:hidden text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
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
                        initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-2xl md:hidden flex flex-col p-6"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <span className="font-bold text-2xl text-gray-900 tracking-tight">Webper</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full hover:bg-black/5 text-gray-900"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="w-6 h-6" />
                            </Button>
                        </div>

                        <div className="flex flex-col gap-6 flex-1 pt-8">
                            <Link
                                href="/base64"
                                className="text-4xl font-bold text-gray-900 -tracking-[0.03em] hover:text-blue-600 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                Image to Base64
                            </Link>
                            <Link
                                href="/pdf-compress"
                                className="text-4xl font-bold text-gray-900 -tracking-[0.03em] hover:text-blue-600 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                PDF Tools
                            </Link>
                            <div className="h-px bg-gray-100 w-full my-4" />
                            <Link
                                href="/how-to-use"
                                className="text-2xl font-medium text-gray-500 hover:text-gray-900 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                How to Use
                            </Link>

                            <div className="mt-auto pb-safe">
                                <Button className="w-full gap-3 h-14 text-lg rounded-2xl bg-gray-900 text-white hover:bg-gray-800 border-none font-bold shadow-tactile active:scale-95 transition-all" asChild>
                                    <a href="https://buymeacoffee.com/wahibirawan" target="_blank" rel="noopener noreferrer">
                                        <Coffee className="w-5 h-5" />
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
