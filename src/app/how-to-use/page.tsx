"use client";

import { Shell } from "@/components/shell";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function HowToUsePage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-1">

                <div className="relative z-10 pt-40 pb-12 space-y-16 max-w-3xl mx-auto px-4">
                    <div className="text-center space-y-6">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-gray-900">
                            How to Use
                        </h1>
                        <p className="text-xl text-gray-500 font-light leading-relaxed">
                            Learn how to get the most out of Webper.
                        </p>
                    </div>

                    <div className="space-y-12">
                        <section className="space-y-8">
                            <div className="flex gap-6">
                                <div className="flex-none w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-gray-200">1</div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-gray-900">Upload Images</h3>
                                    <p className="text-gray-500 leading-relaxed">
                                        Drag and drop your images (JPG, PNG, WebP) into the dropzone, or click to select files from your device. You can upload multiple files at once.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="flex-none w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-gray-200">2</div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-gray-900">Configure Settings</h3>
                                    <p className="text-gray-500 leading-relaxed">
                                        Adjust the compression quality using the slider. You can also set maximum dimensions (width/height) to resize images, and toggle metadata stripping to further reduce file size.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="flex-none w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-gray-200">3</div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-gray-900">Compress & Download</h3>
                                    <p className="text-gray-500 leading-relaxed">
                                        Click "Start Compressing" to process your images. Once done, you can download individual files or get everything in a single ZIP archive.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="p-8 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
                            <h3 className="text-xl font-bold text-gray-900">Pro Tips</h3>
                            <ul className="space-y-3 text-gray-600 list-disc list-inside">
                                <li>For web use, a quality setting of 75-85% usually offers the best balance.</li>
                                <li>Stripping metadata is recommended for public-facing images to protect privacy.</li>
                                <li>Webper works offline! You can use it even without an internet connection.</li>
                            </ul>
                        </section>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
}
