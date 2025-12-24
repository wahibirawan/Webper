import React from 'react';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="w-full py-16 mt-24 border-t border-white/5 bg-black">
            <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12">
                <div className="col-span-2 space-y-4">
                    <h3 className="font-bold text-xl tracking-tight text-white">Webper</h3>
                    <p className="text-sm text-zinc-500 max-w-xs">
                        Professional, client-side image compression for modern web development.
                        Privacy-first and open source.
                    </p>
                    <div className="pt-4">
                        <Button size="sm" variant="outline" className="gap-2 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white" asChild>
                            <a href="https://github.com/wahibirawan/Webper" target="_blank" rel="noopener noreferrer">
                                <Github className="w-4 h-4" />
                                Star on GitHub
                            </a>
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Product</h4>
                    <ul className="space-y-2 text-sm text-zinc-500">
                        <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                        <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                        <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
                        <li><Link href="/changelog" className="hover:text-white transition-colors">Changelog</Link></li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Legal</h4>
                    <ul className="space-y-2 text-sm text-zinc-500">
                        <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        <li><p>&copy; {new Date().getFullYear()} Webper</p></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}
