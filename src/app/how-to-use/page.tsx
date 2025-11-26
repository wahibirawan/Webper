import { Shell } from '@/components/shell';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Upload, Sliders, Download, FileImage } from 'lucide-react';

export default function HowToUsePage() {
    return (
        <div className="min-h-screen flex flex-col font-mono">
            <Shell>
                <Navbar />

                <div className="max-w-4xl mx-auto w-full space-y-12 py-12">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground font-pixel leading-relaxed">
                            How to Use
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Master the art of pixel-perfect compression in 3 easy steps.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {/* Step 1 */}
                        <div className="relative flex flex-col md:flex-row gap-8 items-center">
                            <div className="w-full md:w-1/2 bg-white border-2 border-black p-8 pixel-shadow flex flex-col items-center text-center space-y-4">
                                <div className="w-16 h-16 bg-primary/20 border-2 border-black flex items-center justify-center rounded-none">
                                    <Upload className="w-8 h-8 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold uppercase font-pixel">1. Upload</h2>
                                <p className="text-muted-foreground">
                                    Drag and drop your images into the retro dropzone, or click to select files from your disk. We support JPG, PNG, and WEBP formats.
                                </p>
                            </div>
                            <div className="hidden md:block text-4xl font-pixel text-muted-foreground">→</div>
                            <div className="w-full md:w-1/2 flex justify-center">
                                {/* Visual representation of upload */}
                                <div className="w-48 h-32 border-4 border-black border-dashed bg-secondary/30 flex items-center justify-center">
                                    <span className="font-pixel text-xs">DROP HERE</span>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative flex flex-col md:flex-row-reverse gap-8 items-center">
                            <div className="w-full md:w-1/2 bg-white border-2 border-black p-8 pixel-shadow flex flex-col items-center text-center space-y-4">
                                <div className="w-16 h-16 bg-accent/20 border-2 border-black flex items-center justify-center rounded-none">
                                    <Sliders className="w-8 h-8 text-accent-foreground" />
                                </div>
                                <h2 className="text-2xl font-bold uppercase font-pixel">2. Configure</h2>
                                <p className="text-muted-foreground">
                                    Adjust the quality slider to balance file size and visual fidelity. You can also resize images by setting max width or height.
                                </p>
                            </div>
                            <div className="hidden md:block text-4xl font-pixel text-muted-foreground">←</div>
                            <div className="w-full md:w-1/2 flex justify-center">
                                {/* Visual representation of settings */}
                                <div className="w-48 h-32 border-2 border-black bg-white p-4 space-y-2">
                                    <div className="h-2 bg-black w-3/4"></div>
                                    <div className="h-2 bg-gray-300 w-full"></div>
                                    <div className="flex justify-between text-[10px] font-mono">
                                        <span>Low</span>
                                        <span>High</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative flex flex-col md:flex-row gap-8 items-center">
                            <div className="w-full md:w-1/2 bg-white border-2 border-black p-8 pixel-shadow flex flex-col items-center text-center space-y-4">
                                <div className="w-16 h-16 bg-destructive/20 border-2 border-black flex items-center justify-center rounded-none">
                                    <Download className="w-8 h-8 text-destructive" />
                                </div>
                                <h2 className="text-2xl font-bold uppercase font-pixel">3. Download</h2>
                                <p className="text-muted-foreground">
                                    Get your compressed images instantly. Download them individually or grab them all at once in a ZIP archive.
                                </p>
                            </div>
                            <div className="hidden md:block text-4xl font-pixel text-muted-foreground">→</div>
                            <div className="w-full md:w-1/2 flex justify-center">
                                {/* Visual representation of download */}
                                <div className="w-32 h-40 border-2 border-black bg-white relative">
                                    <div className="absolute -right-2 -bottom-2 w-full h-full bg-black -z-10"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <FileImage className="w-12 h-12" />
                                    </div>
                                    <div className="absolute bottom-0 w-full bg-primary text-white text-[10px] text-center py-1 font-bold">
                                        SAVED!
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Shell>
            <Footer />
        </div>
    );
}
