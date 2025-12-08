import React, { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileImage } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DropzoneProps {
    onFilesDrop: (files: File[]) => void;
}

export function Dropzone({ onFilesDrop }: DropzoneProps) {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles?.length > 0) {
                onFilesDrop(acceptedFiles);
            }
        },
        [onFilesDrop]
    );

    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            if (e.clipboardData && e.clipboardData.items) {
                const items = Array.from(e.clipboardData.items);
                const files: File[] = [];

                items.forEach((item) => {
                    if (item.kind === 'file' && item.type.startsWith('image/')) {
                        const file = item.getAsFile();
                        if (file) {
                            files.push(file);
                        }
                    }
                });

                if (files.length > 0) {
                    // Prevent default paste behavior if we found images
                    e.preventDefault();
                    onFilesDrop(files);
                }
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, [onFilesDrop]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
        },
    });

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={cn(
                    "relative group cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900/50 transition-all duration-300 hover:border-zinc-500 hover:bg-zinc-900/80",
                    isDragActive && "border-white/50 bg-zinc-900/90 ring-1 ring-white/20"
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-4 py-16 px-4 text-center">
                    <div className={cn(
                        "p-4 rounded-full bg-white border border-white transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.5)]",
                        isDragActive && "scale-110 shadow-[0_0_30px_-5px_rgba(255,255,255,0.6)]"
                    )}>
                        <Upload className="w-8 h-8 text-black" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white tracking-tight">
                            {isDragActive ? "Drop files now" : "Upload Files"}
                        </h3>
                        <p className="text-sm text-zinc-400 font-mono">
                            Support multiple files (JPG, PNG, WEBP)
                        </p>
                    </div>
                    <div className="flex gap-2 mt-2 opacity-50">
                        <span className="px-2 py-1 rounded text-[10px] font-mono bg-zinc-800 border border-zinc-700 text-zinc-300">JPG</span>
                        <span className="px-2 py-1 rounded text-[10px] font-mono bg-zinc-800 border border-zinc-700 text-zinc-300">PNG</span>
                        <span className="px-2 py-1 rounded text-[10px] font-mono bg-zinc-800 border border-zinc-700 text-zinc-300">WEBP</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
