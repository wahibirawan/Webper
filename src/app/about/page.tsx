"use client";

import { Shell } from "@/components/shell";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function AboutPage() {
    return (
        <Shell>
            <Navbar />

            <div className="fixed inset-0 z-0 pointer-events-none">
                <BackgroundBeams />
            </div>

            <div className="relative z-10 pt-20 pb-12 space-y-16 max-w-3xl mx-auto">
                <div className="text-center space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
                        About Webper
                    </h1>
                    <p className="text-xl text-zinc-400 font-light leading-relaxed">
                        The professional, privacy-first image compression tool for the modern web.
                    </p>
                </div>

                <div className="space-y-12">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white tracking-tight">Our Mission</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            Webper was built to solve a simple problem: developers and designers need a fast, reliable way to optimize images without sacrificing privacy or quality. Most online tools upload your files to a server, which can be slow and insecure. Webper processes everything locally in your browser using WebAssembly.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white tracking-tight">Why Webper?</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <h3 className="text-lg font-bold text-white mb-2">Privacy First</h3>
                                <p className="text-sm text-zinc-400">Your images never leave your device. All compression happens locally in your browser.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <h3 className="text-lg font-bold text-white mb-2">Blazing Fast</h3>
                                <p className="text-sm text-zinc-400">Powered by WebAssembly for near-native performance, even on large files.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <h3 className="text-lg font-bold text-white mb-2">Professional Quality</h3>
                                <p className="text-sm text-zinc-400">Advanced algorithms ensure the best balance between file size and visual fidelity.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <h3 className="text-lg font-bold text-white mb-2">Open Source</h3>
                                <p className="text-sm text-zinc-400">Transparent and community-driven. You can inspect our code on GitHub.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <Footer />
        </Shell>
    );
}
