import React from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { BackgroundBeams } from '@/components/ui/background-beams';

export default function ChangelogPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
            <Navbar />

            <main className="flex-1 container mx-auto px-6 pt-32 pb-24 relative z-10 w-full">
                <div className="max-w-3xl mx-auto space-y-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">Changelog</h1>

                    <div className="space-y-12">
                        <section className="space-y-6 relative border-l-2 border-gray-200 pl-8 ml-2">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-gray-50" />
                            <div className="flex items-center gap-4">
                                <h2 className="text-2xl font-bold text-gray-900">v1.1.0</h2>
                                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-xs font-bold font-mono text-blue-600 border border-blue-200 uppercase tracking-wide">Latest</span>
                            </div>
                            <ul className="space-y-4 text-gray-600">
                                <li className="flex items-start gap-3">
                                    <span className="inline-flex items-center justify-center flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 mt-0.5">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                    <div>
                                        <span className="font-semibold text-gray-900 block mb-1">Advanced Image Compression</span>
                                        <span className="text-sm leading-relaxed">
                                            Professional-grade client-side compression for JPG, PNG, and WebP formats. Supports batch processing and smart quality optimization.
                                        </span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="inline-flex items-center justify-center flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 mt-0.5">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                    <div>
                                        <span className="font-semibold text-gray-900 block mb-1">PDF Tools Suite</span>
                                        <span className="text-sm leading-relaxed">
                                            Powerful local PDF compression and merging capabilities. Organize, optimize, and combine documents without them ever leaving your device.
                                        </span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="inline-flex items-center justify-center flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 mt-0.5">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                    <div>
                                        <span className="font-semibold text-gray-900 block mb-1">Developer Utilities (Base64)</span>
                                        <span className="text-sm leading-relaxed">
                                            Convert images to Base64 instantly. Features "Copy as HTML" for bloggers and developers to embed images directly into code.
                                        </span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="inline-flex items-center justify-center flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 mt-0.5">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                    <div>
                                        <span className="font-semibold text-gray-900 block mb-1">Premium Light Experience</span>
                                        <span className="text-sm leading-relaxed">
                                            A completely redesigned UI featuring a clean light theme, tactile controls, Geist typography, and a refined mobile-first experience.
                                        </span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="inline-flex items-center justify-center flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 mt-0.5">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                    <div>
                                        <span className="font-semibold text-gray-900 block mb-1">Privacy-First Architecture</span>
                                        <span className="text-sm leading-relaxed">
                                            Zero-upload policy enforced. All processing is powered by WebAssembly running securely within your browser sandbox.
                                        </span>
                                    </div>
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-6 relative border-l-2 border-gray-200 pl-8 ml-2">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-300 ring-4 ring-gray-50" />
                            <div className="flex items-center gap-4">
                                <h2 className="text-2xl font-bold text-gray-500">v1.0.0</h2>
                                <span className="text-sm text-gray-400 font-mono">December 10, 2025</span>
                            </div>
                            <ul className="space-y-3 text-gray-500">
                                <li className="flex items-start gap-2">
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300 mt-2" />
                                    Initial release of Webper
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300 mt-2" />
                                    Client-side image compression engine (WASM)
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300 mt-2" />
                                    Support for WebP, PNG, and JPEG formats
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300 mt-2" />
                                    Smart PNG quantization
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300 mt-2" />
                                    Lanczos3 high-quality resizing
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300 mt-2" />
                                    Batch processing and ZIP download
                                </li>
                            </ul>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
