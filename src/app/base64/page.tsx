'use client';

import { useState, useCallback } from 'react';
import { Shell } from '@/components/shell';
import { Dropzone } from '@/components/dropzone';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { BackgroundBeams } from "@/components/ui/background-beams";
import { compressImage } from '@/lib/compressor';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy, Check, FileIcon, X } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface Base64Item {
    id: string;
    file: File;
    preview: string;
    base64: string | null;
    status: 'processing' | 'done' | 'error';
    originalSize: number;
    compressedSize?: number;
}

export default function Base64Page() {
    const [items, setItems] = useState<Base64Item[]>([]);

    const convertToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result);
                } else {
                    reject(new Error('Failed to convert to base64'));
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const handleFilesDrop = useCallback(async (newFiles: File[]) => {
        const newItems: Base64Item[] = newFiles.map(file => ({
            id: Math.random().toString(36).substring(7),
            file,
            preview: URL.createObjectURL(file),
            base64: null,
            status: 'processing',
            originalSize: file.size
        }));

        setItems(prev => [...prev, ...newItems]);

        // Process files
        for (const item of newItems) {
            try {
                // Convert to WebP
                const webpBlob = await compressImage(item.file, {
                    quality: 80,
                    format: 'image/webp'
                });

                const webpUrl = URL.createObjectURL(webpBlob);
                const base64String = await convertToBase64(webpBlob);

                setItems(prev => prev.map(i => {
                    if (i.id === item.id) {
                        URL.revokeObjectURL(i.preview); // Cleanup old preview
                        return {
                            ...i,
                            status: 'done',
                            base64: base64String,
                            preview: webpUrl,
                            compressedSize: webpBlob.size
                        };
                    }
                    return i;
                }));
            } catch (error) {
                console.error(error);
                setItems(prev => prev.map(i =>
                    i.id === item.id
                        ? { ...i, status: 'error' }
                        : i
                ));
                toast.error(`Failed to process ${item.file.name}`);
            }
        }
    }, []);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success('Base64 copied to clipboard!', { position: 'bottom-center' });
        } catch (err) {
            toast.error('Failed to copy');
        }
    };

    const removeItem = (id: string) => {
        setItems(prev => {
            const item = prev.find(i => i.id === id);
            if (item) URL.revokeObjectURL(item.preview);
            return prev.filter(i => i.id !== id);
        });
    };

    return (
        <Shell>
            <Navbar />
            <div className="fixed inset-0 z-0 pointer-events-none">
                <BackgroundBeams />
            </div>

            <div className="relative z-10 pt-24 pb-12 w-full max-w-4xl mx-auto space-y-8 px-4">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
                        Image to <span className="text-green-400">Base64</span>
                    </h1>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        Convert any image to an optimized WebP Base64 string instantly. Perfect for embedding small images directly into code.
                    </p>
                </div>

                <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
                    <Dropzone onFilesDrop={handleFilesDrop} />
                </div>

                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-zinc-900/50 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row gap-6"
                            >
                                {/* Preview */}
                                <div className="relative w-full md:w-32 h-32 shrink-0 bg-black/50 rounded-lg overflow-hidden border border-white/5">
                                    <Image
                                        src={item.preview}
                                        alt={item.file.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-medium text-white truncate max-w-[200px] md:max-w-md">
                                                {item.file.name}
                                            </h3>
                                            <div className="flex gap-2 text-xs text-zinc-500 font-mono mt-1">
                                                <span>{(item.originalSize / 1024).toFixed(1)}KB</span>
                                                <span>→</span>
                                                <span className={cn(
                                                    "font-bold",
                                                    item.compressedSize && item.compressedSize < item.originalSize ? "text-green-400" : "text-white"
                                                )}>
                                                    {item.compressedSize ? `${(item.compressedSize / 1024).toFixed(1)}KB` : '...'}
                                                </span>
                                                <span className="text-zinc-600">• WebP</span>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeItem(item.id)}
                                            className="text-zinc-500 hover:text-red-400"
                                        >
                                            <X className="w-5 h-5" />
                                        </Button>
                                    </div>

                                    {item.status === 'done' && item.base64 && (
                                        <div className="flex flex-col gap-2">
                                            <div className="bg-black/50 rounded-lg p-3 font-mono text-[10px] text-zinc-500 break-all h-20 overflow-hidden relative group">
                                                {item.base64.substring(0, 300)}...
                                                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
                                            </div>

                                            <div className="flex gap-3">
                                                <Button
                                                    className="flex-1 bg-white text-black hover:bg-zinc-200"
                                                    onClick={() => copyToClipboard(item.base64!)}
                                                >
                                                    <Copy className="w-4 h-4 mr-2" />
                                                    Copy Base64
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
            <Footer />
        </Shell>
    );
}
