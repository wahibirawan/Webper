"use client";

import { Shell } from "@/components/shell";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function HowToUsePage() {
    return (
        <Shell>
            <Navbar />

            <div className="fixed inset-0 z-0 pointer-events-none">
                <BackgroundBeams />
            </div>

            <div className="relative z-10 pt-20 pb-12 space-y-16 max-w-3xl mx-auto">
                <div className="text-center space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
                        Documentation
                    </h1>
                    <p className="text-xl text-zinc-400 font-light leading-relaxed">
                        Learn how to get the most out of Webper.
                    </p>
                </div>

                <div className="space-y-12">
                    <section className="space-y-8">
                        <div className="flex gap-6">
                            <div className="flex-none w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-bold text-xl">1</div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white">Upload Images</h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    Drag and drop your images (JPG, PNG, WebP) into the dropzone, or click to select files from your device. You can upload multiple files at once.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="flex-none w-12 h-12 rounded-full bg-white/10 text-white border border-white/20 flex items-center justify-center font-bold text-xl">2</div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white">Configure Settings</h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    Adjust the compression quality using the slider. You can also set maximum dimensions (width/height) to resize images, and toggle metadata stripping to further reduce file size.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="flex-none w-12 h-12 rounded-full bg-white/10 text-white border border-white/20 flex items-center justify-center font-bold text-xl">3</div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white">Compress & Download</h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    Click "Start Compressing" to process your images. Once done, you can download individual files or get everything in a single ZIP archive.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-4">
                        <h3 className="text-xl font-bold text-white">Pro Tips</h3>
                        <ul className="space-y-3 text-zinc-400 list-disc list-inside">
                            <li>For web use, a quality setting of 75-85% usually offers the best balance.</li>
                            <li>Stripping metadata is recommended for public-facing images to protect privacy.</li>
                            <li>Webper works offline! You can use it even without an internet connection.</li>
                        </ul>
                    </section>
                </div>
            </div>

            <Footer />
        </Shell>
    );
}
