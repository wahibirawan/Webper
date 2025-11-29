import React from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { BackgroundBeams } from '@/components/ui/background-beams';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white">
            <BackgroundBeams className="-z-10" />
            <Navbar />

            <main className="container mx-auto px-6 pt-32 pb-16 relative z-10">
                <div className="max-w-3xl mx-auto space-y-8">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Terms of Service</h1>

                    <div className="space-y-12">
                        <section className="space-y-4">
                            <p className="text-zinc-400 leading-relaxed">
                                By using Webper, you agree to these simple terms.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">Usage</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                Webper is provided "as is" for free. You may use it for personal or commercial purposes to compress images.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">Liability</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                We are not responsible for any data loss or damages that may occur from using this tool. While we strive for reliability, always keep backups of your original files.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
