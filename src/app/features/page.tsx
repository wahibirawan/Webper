import React from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { BackgroundBeams } from '@/components/ui/background-beams';

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white">
            <BackgroundBeams className="-z-10" />
            <Navbar />

            <main className="container mx-auto px-6 pt-32 pb-16 relative z-10">
                <div className="max-w-3xl mx-auto space-y-8">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Features</h1>

                    <div className="space-y-12">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">Client-Side Compression</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                All compression happens directly in your browser. Your images never leave your device, ensuring 100% privacy and security. No server uploads, no data transfer fees, just pure speed.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">Advanced Algorithms</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                We use industry-standard algorithms like Lanczos3 for resizing and smart quantization for PNGs (similar to TinyPNG) to deliver the best balance between file size and visual quality.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">Multiple Formats</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                Support for modern WebP, classic JPEG, and transparent PNG formats. Convert between formats easily while optimizing file size.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">Batch Processing</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                Drag and drop multiple files at once. Process dozens of images in seconds and download them individually or as a ZIP archive.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
