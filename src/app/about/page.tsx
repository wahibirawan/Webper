"use client";

import { Shell } from "@/components/shell";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
            <Navbar />

            <main className="flex-1 relative z-10 pt-24 pb-16 md:pt-32 md:pb-24 max-w-4xl mx-auto px-6 w-full">
                <div className="text-center space-y-6 mb-20">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-gray-900">
                        About Webper
                    </h1>
                    <p className="text-xl text-gray-500 font-normal leading-relaxed max-w-2xl mx-auto">
                        The professional, privacy-first image compression tool for the modern web.
                    </p>
                </div>

                <div className="space-y-20">
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Our Mission</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            Webper was built to solve a simple problem: developers and designers need a fast, reliable way to optimize images without sacrificing privacy or quality. Most online tools upload your files to a server, which can be slow and insecure. Webper processes everything locally in your browser using WebAssembly.
                        </p>
                    </section>

                    <section className="space-y-8">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Why Webper?</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Privacy First</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">Your images never leave your device. All compression happens locally in your browser.</p>
                            </div>
                            <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Blazing Fast</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">Powered by WebAssembly for near-native performance, even on large files.</p>
                            </div>
                            <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Professional Quality</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">Advanced algorithms ensure the best balance between file size and visual fidelity.</p>
                            </div>
                            <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Open Source</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">Transparent and community-driven. You can inspect our code on GitHub.</p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-8">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Performance Benchmarks</h2>
                        <p className="text-gray-500 text-lg">
                            Typical compression results for a 2MB high-resolution photograph.
                        </p>

                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 font-medium uppercase tracking-wider text-xs border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4">Format</th>
                                        <th className="px-6 py-4">Original Size</th>
                                        <th className="px-6 py-4">Compressed Size</th>
                                        <th className="px-6 py-4 text-right">Reduction</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-gray-600">
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900">WebP</td>
                                        <td className="px-6 py-4 font-mono text-gray-400">2.0 MB</td>
                                        <td className="px-6 py-4 font-mono text-gray-900">0.3 MB</td>
                                        <td className="px-6 py-4 text-right font-mono font-bold text-green-600">~85%</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900">JPEG</td>
                                        <td className="px-6 py-4 font-mono text-gray-400">2.0 MB</td>
                                        <td className="px-6 py-4 font-mono text-gray-900">0.5 MB</td>
                                        <td className="px-6 py-4 text-right font-mono font-bold text-green-600">~75%</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900">PNG <span className="text-xs font-normal text-gray-400 ml-1">(Quantized)</span></td>
                                        <td className="px-6 py-4 font-mono text-gray-400">2.0 MB</td>
                                        <td className="px-6 py-4 font-mono text-gray-900">0.6 MB</td>
                                        <td className="px-6 py-4 text-right font-mono font-bold text-green-600">~70%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-gray-400 italic text-center">
                            * Results may vary depending on image complexity and quality settings.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
