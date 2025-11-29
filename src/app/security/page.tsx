import React from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { BackgroundBeams } from '@/components/ui/background-beams';

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white">
            <BackgroundBeams className="-z-10" />
            <Navbar />

            <main className="container mx-auto px-6 pt-32 pb-16 relative z-10">
                <div className="max-w-3xl mx-auto space-y-8">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Security</h1>

                    <div className="space-y-12">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">Zero-Knowledge Architecture</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                Webper operates entirely within your browser sandbox. Unlike traditional online compressors that require you to upload files to a remote server, Webper processes everything locally on your machine using WebAssembly and modern JavaScript APIs.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">No Data Collection</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                We do not track your files, store your images, or collect personal data. The application is stateless and runs in isolation on your device.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">Open Source</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                Our code is open source and available for audit on GitHub. You can verify exactly how your data is handled (or rather, not handled) by reviewing the source code.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
