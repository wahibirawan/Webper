import React, { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileImage } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DropzoneProps {
    onFilesDrop: (files: File[]) => void;
    children?: React.ReactNode;
    accept?: Record<string, string[]>;
    className?: string;
}

export function Dropzone({ onFilesDrop, children, accept, className }: DropzoneProps) {
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
                    // Logic to handle images or generic files based on context?
                    // Original was image specific. Keeping it safe for now, or enabling all files?
                    // If we enable all files, it might conflict.
                    // Let's assume generic file handling if it's a file.
                    if (item.kind === 'file') {
                        const file = item.getAsFile();
                        if (file) {
                            // Check accept? 
                            // If accept prop is present, we should filter.
                            // But for now, let's just push valid files.
                            // React-dropzone's onDrop handles filtering usually? No, this is manual paste.
                            // Simple fix: Restore original image-only logic BUT add PDF support?
                            // Or just pass all files to onFilesDrop and let parent filter?
                            // Parent (handleFilesDrop) DOES filter!
                            // "const validFiles = acceptedFiles.filter(...)"
                            // So it is SAFE to pass all files.
                            files.push(file);
                        }
                    }
                });

                if (files.length > 0) {
                    // e.preventDefault(); // Don't prevent default globally if we are unsure?
                    // But usually we want to capture paste.
                    // If pdf-compress handles it too, we might have double handling.
                    // pdf-compress stops propagation?
                    // Let's rely on parent filtering.
                    onFilesDrop(files);
                }
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, [onFilesDrop]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: accept || {
            'image/jpeg': [],
            'image/png': [],
            'image/webp': []
        },
        noClick: false
    });

    return (
        <div
            {...getRootProps()}
            className={cn(
                "relative border-2 border-dashed rounded-3xl p-6 md:p-10 transition-all duration-300 cursor-pointer group",
                isDragActive
                    ? "border-blue-500 bg-blue-50/50"
                    : "border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50/30 hover:shadow-card-hover",
                className
            )}
        >
            <input {...getInputProps()} />

            {children ? (
                children
            ) : (
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-all duration-300 shadow-card-premium border border-gray-100">
                        <Upload className="w-7 h-7 text-gray-900" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700">
                            Drop images here or click to upload
                        </p>
                        <p className="text-xs text-gray-500">
                            Supports JPG, PNG, WebP up to 50MB
                        </p>
                    </div>
                </div>
            )}

            {/* Overlay for drag state */}
            {isDragActive && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-blue-500/10 backdrop-blur-sm rounded-2xl">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium shadow-lg"
                    >
                        Drop files now!
                    </motion.div>
                </div>
            )}
        </div>
    );
}
