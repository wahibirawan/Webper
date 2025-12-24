import React, { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileImage } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DropzoneProps {
    onFilesDrop: (files: File[]) => void;
    children?: React.ReactNode;
}

export function Dropzone({ onFilesDrop, children }: DropzoneProps) {
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
            'image/jpeg': [],
            'image/png': [],
            'image/webp': []
        },
        noClick: false // Allow clicking
    });

    return (
        <div
            {...getRootProps()}
            className={cn(
                "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer group hover:border-blue-500/50 hover:bg-blue-500/5",
                isDragActive ? "border-blue-500 bg-blue-500/10" : "border-zinc-800 bg-black/20"
            )}
        >
            <input {...getInputProps()} />

            {/* If children provided, render them. Otherwise default UI */}
            {children ? (
                children
            ) : (
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6 text-zinc-400 group-hover:text-blue-400" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-zinc-300">
                            Drop images here or click to upload
                        </p>
                        <p className="text-xs text-zinc-500">
                            Supports JPG, PNG, WebP up to 50MB
                        </p>
                    </div>
                </div>
            )}

            {/* Overlay for drag state */}
            {isDragActive && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-blue-500/20 backdrop-blur-sm rounded-xl">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg"
                    >
                        Drop files now!
                    </motion.div>
                </div>
            )}
        </div>
    );
}
