import React from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { BackgroundBeams } from '@/components/ui/background-beams';

export default function TermsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
            <Navbar />

            <main className="flex-1 container mx-auto px-6 pt-32 pb-24 relative z-10 w-full">
                <div className="max-w-3xl mx-auto space-y-12">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">Terms of Service</h1>
                        <p className="text-lg text-gray-500">Last updated: December 2025</p>
                    </div>

                    <div className="space-y-12">
                        <section className="space-y-4">
                            <p className="text-gray-600 leading-relaxed text-lg">
                                By using Webper, you agree to these simple terms.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900">Usage</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                Webper is provided "as is" for free. You may use it for personal or commercial purposes to compress images.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900">Liability</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
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
