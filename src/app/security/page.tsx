import React from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { BackgroundBeams } from '@/components/ui/background-beams';

export default function SecurityPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
            <Navbar />

            <main className="flex-1 container mx-auto px-6 pt-32 pb-24 relative z-10 w-full">
                <div className="max-w-3xl mx-auto space-y-12">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">Security</h1>
                        <p className="text-lg text-gray-500">Your security is our priority.</p>
                    </div>

                    <div className="space-y-12">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900">Zero-Knowledge Architecture</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                Webper operates entirely within your browser sandbox. Unlike traditional online compressors that require you to upload files to a remote server, Webper processes everything locally on your machine using WebAssembly and modern JavaScript APIs.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900">No Data Collection</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                We do not track your files, store your images, or collect personal data. The application is stateless and runs in isolation on your device.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900">Open Source</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
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
