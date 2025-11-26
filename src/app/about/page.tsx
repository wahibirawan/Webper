import { Shell } from '@/components/shell';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Shield, Zap, Lock, Heart } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col font-mono">
            <Shell>
                <Navbar />

                <div className="max-w-3xl mx-auto w-full space-y-12 py-12">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground font-pixel leading-relaxed">
                            About Webper
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            The retro-styled, privacy-first image compressor.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="bg-white border-2 border-black p-6 pixel-shadow space-y-4">
                            <div className="w-12 h-12 bg-primary/20 flex items-center justify-center border-2 border-black">
                                <Lock className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold uppercase tracking-wide">Privacy First</h2>
                            <p className="text-muted-foreground">
                                Your images never leave your device. All compression happens locally in your browser using advanced WebAssembly technology. No servers, no uploads, no worries.
                            </p>
                        </div>

                        <div className="bg-white border-2 border-black p-6 pixel-shadow space-y-4">
                            <div className="w-12 h-12 bg-accent/20 flex items-center justify-center border-2 border-black">
                                <Zap className="w-6 h-6 text-accent-foreground" />
                            </div>
                            <h2 className="text-xl font-bold uppercase tracking-wide">Blazing Fast</h2>
                            <p className="text-muted-foreground">
                                Powered by modern browser capabilities, Webper compresses your images instantly without the latency of network transfers.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6 bg-card border-2 border-black p-8 pixel-shadow">
                        <h2 className="text-2xl font-bold uppercase font-pixel">Our Mission</h2>
                        <p className="text-lg leading-relaxed">
                            In an age of cloud dependency, we believe in the power of local computing. Webper was built to prove that you don't need to sacrifice privacy for convenience. We combined the nostalgic aesthetics of the 8-bit era with cutting-edge web performance to create a tool that's both fun to use and incredibly powerful.
                        </p>
                        <div className="flex items-center gap-2 text-muted-foreground pt-4">
                            <Heart className="w-5 h-5 text-destructive" />
                            <span>Crafted with love for the web.</span>
                        </div>
                    </div>
                </div>
            </Shell>
            <Footer />
        </div>
    );
}
