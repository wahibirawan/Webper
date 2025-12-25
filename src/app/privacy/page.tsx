import React from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { BackgroundBeams } from '@/components/ui/background-beams';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
            <Navbar />

            <main className="flex-1 container mx-auto px-6 pt-32 pb-24 relative z-10 w-full">
                <div className="max-w-3xl mx-auto space-y-12">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">Privacy Policy</h1>
                        <p className="text-lg text-gray-500">Last updated: December 2025</p>
                    </div>

                    <div className="space-y-12">
                        <section className="space-y-4">
                            <p className="text-gray-600 leading-relaxed text-lg">
                                At Webper, we take your privacy seriously. Because our application runs entirely in your browser, we have a unique approach to privacy: <strong className="font-semibold text-gray-900">we don't collect your data.</strong>
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900">Data Processing</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                All image processing is performed locally on your device. Your images are never uploaded to our servers, never analyzed by us, and never shared with third parties.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                We may use privacy-focused, anonymous analytics to understand general usage patterns (e.g., number of visitors), but this data is never linked to your files or personal identity.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
