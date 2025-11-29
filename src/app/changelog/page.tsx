import React from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { BackgroundBeams } from '@/components/ui/background-beams';

export default function ChangelogPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white">
            <BackgroundBeams className="-z-10" />
            <Navbar />

            <main className="container mx-auto px-6 pt-32 pb-16 relative z-10">
                <div className="max-w-3xl mx-auto space-y-8">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Changelog</h1>

                    <div className="space-y-12">
                        <section className="space-y-4">
                            <div className="flex items-center gap-4">
                                <h2 className="text-2xl font-bold text-white">v1.0.0</h2>
                                <span className="px-2 py-1 rounded-full bg-white/10 text-xs font-mono text-zinc-400">Latest</span>
                            </div>
                            <ul className="list-disc list-inside space-y-2 text-zinc-400">
                                <li>Initial release of Webper</li>
                                <li>Client-side image compression engine</li>
                                <li>Support for WebP, PNG, and JPEG formats</li>
                                <li>Smart PNG quantization (TinyPNG style)</li>
                                <li>Lanczos3 high-quality resizing</li>
                                <li>Batch processing and ZIP download</li>
                                <li>Premium dark mode UI</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
