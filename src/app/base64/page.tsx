'use client';

import { useState, useCallback, useEffect } from 'react';
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
    blob?: Blob;
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
            preview: URL.createObjectURL(file), // Initially verify original
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
                            compressedSize: webpBlob.size,
                            blob: webpBlob
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

    // Global Paste Handler
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            if (e.clipboardData && e.clipboardData.files.length > 0) {
                const pastedFiles = Array.from(e.clipboardData.files).filter(f => f.type.startsWith('image/'));
                if (pastedFiles.length > 0) {
                    handleFilesDrop(pastedFiles);
                    toast.success('Image pasted from clipboard!');
                }
            }
        };
        document.addEventListener('paste', handlePaste);
        return () => document.removeEventListener('paste', handlePaste);
    }, [handleFilesDrop]);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success('Base64 copied to clipboard!', { position: 'bottom-center' });
        } catch (err) {
            toast.error('Failed to copy');
        }
    };

    const copyHtml = async (base64: string, filename: string) => {
        try {
            const imgTag = `<img src="${base64}" alt="${filename}" />`;
            await navigator.clipboard.writeText(imgTag);
            toast.success('HTML copied to clipboard!', { position: 'bottom-center' });
        } catch (err) {
            toast.error('Failed to copy HTML');
        }
    };

    const clearAll = () => {
        items.forEach(item => URL.revokeObjectURL(item.preview));
        setItems([]);
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

            <div className="relative z-10 pt-20 pb-12 w-full max-w-5xl mx-auto space-y-6 px-4">
                <div className="text-center space-y-2 mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-white">
                        Image to <span className="text-green-400">Base64</span>
                    </h1>
                    <p className="text-zinc-400 max-w-lg mx-auto text-sm">
                        Convert images to optimized WebP Base64 instantly.
                    </p>
                </div>

                <div className="grid gap-6">
                    <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Upload</h2>
                            {items.length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearAll}
                                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-8 px-2 text-xs"
                                >
                                    <X className="w-3 h-3 mr-1.5" />
                                    Clear All
                                </Button>
                            )}
                        </div>
                        <Dropzone onFilesDrop={handleFilesDrop}>
                            <div className="text-center py-8">
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    Click to select, drag & drop, or paste images
                                </h3>
                                <p className="text-zinc-400 text-xs mb-3">
                                    Supports JPG, PNG, and WebP
                                </p>
                                <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-300 font-medium uppercase tracking-wider shadow-[0_0_10px_-4px_rgba(59,130,246,0.5)]">
                                    Tip: You can use Ctrl+V to paste images
                                </div>
                            </div>
                        </Dropzone>
                    </div>

                    <div className="space-y-3">
                        <AnimatePresence mode="popLayout">
                            {items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-zinc-900/80 border border-white/10 rounded-lg p-3 flex gap-4 group"
                                >
                                    {/* Compact Preview */}
                                    <div className="relative w-20 h-20 shrink-0 bg-black/50 rounded-md overflow-hidden border border-white/5">
                                        <Image
                                            src={item.preview}
                                            alt={item.file.name}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <h3 className="font-medium text-sm text-white truncate" title={item.file.name}>
                                                    {item.file.name}
                                                </h3>
                                                {item.status === 'done' ? (
                                                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono mt-0.5">
                                                        <span>{(item.originalSize / 1024).toFixed(1)}KB</span>
                                                        <span className="text-zinc-600">→</span>
                                                        <span className={cn(
                                                            "font-bold",
                                                            item.compressedSize && item.compressedSize < item.originalSize ? "text-green-400" : "text-white"
                                                        )}>
                                                            {item.compressedSize ? `${(item.compressedSize / 1024).toFixed(1)}KB` : '...'}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5 animate-pulse">
                                                        Processing...
                                                    </p>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeItem(item.id)}
                                                className="h-6 w-6 -mt-1 -mr-1 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>

                                        {item.status === 'done' && item.base64 && (
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="flex-1 bg-black/40 rounded px-2 py-1.5 font-mono text-[10px] text-zinc-500 truncate select-all">
                                                    {item.base64.substring(0, 50)}...
                                                </div>

                                                <div className="flex gap-2 shrink-0">
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        className="h-7 px-2.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                                                        onClick={() => copyHtml(item.base64!, item.file.name)}
                                                        title="Copy <img> tag for Blogger/HTML"
                                                    >
                                                        <Copy className="w-3 h-3 mr-1.5" />
                                                        HTML
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="h-7 px-2.5 text-xs bg-white text-black hover:bg-zinc-200"
                                                        onClick={() => copyToClipboard(item.base64!)}
                                                        title="Copy Base64 String"
                                                    >
                                                        <Copy className="w-3 h-3 mr-1.5" />
                                                        Base64
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
            </div>
            <Footer />
        </Shell>
    );
}
