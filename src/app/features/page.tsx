import React from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { BackgroundBeams } from '@/components/ui/background-beams';

export default function FeaturesPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
            <Navbar />

            <main className="flex-1 container mx-auto px-6 pt-32 pb-24 relative z-10 w-full">
                <div className="max-w-3xl mx-auto space-y-12">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">Features</h1>
                        <p className="text-lg text-gray-500">Powerful tools, simple interface.</p>
                    </div>

                    <div className="space-y-12">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900">Client-Side Compression</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                All compression happens directly in your browser. Your images never leave your device, ensuring 100% privacy and security. No server uploads, no data transfer fees, just pure speed.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900">Advanced Algorithms</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                We use industry-standard algorithms like Lanczos3 for resizing and smart quantization for PNGs (similar to TinyPNG) to deliver the best balance between file size and visual quality.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900">Multiple Formats</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                Support for modern WebP, classic JPEG, and transparent PNG formats. Convert between formats easily while optimizing file size.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900">Batch Processing</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
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
