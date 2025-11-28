import React, { useCallback } from 'react';
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
                    "relative group cursor-pointer overflow-hidden rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 transition-all duration-300 hover:border-zinc-600 hover:bg-zinc-900/50",
                    isDragActive && "border-white/50 bg-zinc-900/80 ring-1 ring-white/20"
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-4 py-16 px-4 text-center">
                    <div className={cn(
                        "p-4 rounded-full bg-zinc-900 border border-zinc-800 transition-transform duration-300 group-hover:scale-110 group-hover:border-zinc-700",
                        isDragActive && "scale-110 border-white/20 bg-zinc-800"
                    )}>
                        <Upload className={cn(
                            "w-8 h-8 text-zinc-500 transition-colors duration-300 group-hover:text-white",
                            isDragActive && "text-white"
                        )} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-medium text-white tracking-tight">
                            {isDragActive ? "Drop files now" : "Upload images"}
                        </h3>
                        <p className="text-sm text-zinc-500 font-mono">
                            Drag & drop or click to select
                        </p>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <span className="px-2 py-1 rounded text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-500">JPG</span>
                        <span className="px-2 py-1 rounded text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-500">PNG</span>
                        <span className="px-2 py-1 rounded text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-500">WEBP</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
