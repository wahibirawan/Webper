import React from 'react';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="w-full border-t border-gray-100 bg-white pt-16 pb-12 md:pt-16 md:pb-16 mt-12 md:mt-24 rounded-t-[32px]">
            <div className="w-full max-w-6xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
                    {/* Brand Section */}
                    <div className="md:col-span-5 flex flex-col items-start gap-6">
                        <Link href="/" className="inline-block">
                            <span className="font-bold text-xl text-gray-900 tracking-tight">Webper</span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            Professional, client-side image compression for modern web development.
                            Privacy-first and open source.
                        </p>
                        <div className="pt-2">
                            <Button size="sm" variant="outline" className="gap-2 rounded-full border-gray-200 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 shadow-sm transition-all hover:border-gray-300" asChild>
                                <a href="https://github.com/wahibirawan/Webper" target="_blank" rel="noopener noreferrer">
                                    <Github className="w-4 h-4" />
                                    Star on GitHub
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Navigation Section */}
                    <div className="md:col-span-7 grid grid-cols-2 gap-8 md:gap-12 md:justify-end md:flex md:flex-row md:ml-auto">
                        <div className="flex flex-col gap-4 min-w-[140px]">
                            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Product</h4>
                            <ul className="flex flex-col gap-3">
                                <li><Link href="/about" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">About</Link></li>
                                <li><Link href="/features" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Features</Link></li>
                                <li><Link href="/security" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Security</Link></li>
                                <li><Link href="/changelog" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Changelog</Link></li>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-4 min-w-[140px]">
                            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Legal</h4>
                            <ul className="flex flex-col gap-3">
                                <li><Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Terms of Service</Link></li>
                                <li className="pt-4 md:pt-2">
                                    <p className="text-sm text-gray-400">© {new Date().getFullYear()} Webper</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
