import React from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { BackgroundBeams } from '@/components/ui/background-beams';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white">
            <BackgroundBeams className="-z-10" />
            <Navbar />

            <main className="container mx-auto px-6 pt-32 pb-16 relative z-10">
                <div className="max-w-3xl mx-auto space-y-8">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Privacy Policy</h1>

                    <div className="space-y-12">
                        <section className="space-y-4">
                            <p className="text-zinc-400 leading-relaxed">
                                At Webper, we take your privacy seriously. Because our application runs entirely in your browser, we have a unique approach to privacy: <strong>we don't collect your data.</strong>
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">Data Processing</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                All image processing is performed locally on your device. Your images are never uploaded to our servers, never analyzed by us, and never shared with third parties.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">Analytics</h2>
                            <p className="text-zinc-400 leading-relaxed">
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
