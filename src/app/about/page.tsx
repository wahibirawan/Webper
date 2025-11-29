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

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-white tracking-tight">Performance Benchmarks</h2>
                        <p className="text-zinc-400">
                            Typical compression results for a 2MB high-resolution photograph.
                        </p>

                        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 text-zinc-400 font-medium uppercase tracking-wider text-xs">
                                    <tr>
                                        <th className="px-6 py-4">Format</th>
                                        <th className="px-6 py-4">Original Size</th>
                                        <th className="px-6 py-4">Compressed Size</th>
                                        <th className="px-6 py-4 text-right">Reduction</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-zinc-300">
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-bold text-white">WebP</td>
                                        <td className="px-6 py-4 font-mono text-zinc-500">2.0 MB</td>
                                        <td className="px-6 py-4 font-mono text-white">0.3 MB</td>
                                        <td className="px-6 py-4 text-right font-mono font-bold text-green-400">~85%</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-bold text-white">JPEG</td>
                                        <td className="px-6 py-4 font-mono text-zinc-500">2.0 MB</td>
                                        <td className="px-6 py-4 font-mono text-white">0.5 MB</td>
                                        <td className="px-6 py-4 text-right font-mono font-bold text-green-400">~75%</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-bold text-white">PNG <span className="text-xs font-normal text-zinc-500 ml-1">(Quantized)</span></td>
                                        <td className="px-6 py-4 font-mono text-zinc-500">2.0 MB</td>
                                        <td className="px-6 py-4 font-mono text-white">0.6 MB</td>
                                        <td className="px-6 py-4 text-right font-mono font-bold text-green-400">~70%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-zinc-500 italic text-center">
                            * Results may vary depending on image complexity and quality settings.
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </Shell>
    );
}
