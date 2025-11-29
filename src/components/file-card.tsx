import React from 'react';
import { Button } from '@/components/ui/button';
import { X, FileIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export interface FileItem {
    id: string;
    file: File;
    preview: string;
    status: 'queued' | 'processing' | 'done' | 'error';
    progress: number;
    originalSize: number;
    compressedSize?: number;
    error?: string;
    blob?: Blob;
}

interface FileCardProps {
    file: FileItem;
    onRemove: (id: string) => void;
}

export function FileCard({ file, onRemove }: FileCardProps) {
    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative flex items-center gap-4 p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
        >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-black border border-white/10">
                {file.file.type.startsWith('image/') ? (
                    <Image
                        src={file.preview}
                        alt={file.file.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <FileIcon className="h-6 w-6 text-zinc-500" />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <p className="truncate text-sm font-medium text-white">
                        {file.file.name}
                    </p>
                    {file.status === 'done' && (
                        <span className="text-xs font-mono text-green-400">
                            -{Math.round((1 - (file.compressedSize! / file.originalSize)) * 100)}%
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
                    <span>{formatSize(file.originalSize)}</span>
                    {file.status === 'done' && (
                        <span className="text-white">
                            {formatSize(file.compressedSize!)}
                        </span>
                    )}
                    {file.status === 'processing' && (
                        <span className="text-zinc-400 animate-pulse">Processing...</span>
                    )}

                    {file.status === 'error' && (
                        <span className="text-red-400">Error</span>
                    )}
                </div>

                {/* Progress Bar */}
                {(file.status === 'processing' || file.status === 'done') && (
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
                        <motion.div
                            className="h-full bg-white"
                            initial={{ width: 0 }}
                            animate={{ width: `${file.progress}%` }}
                            transition={{ duration: 0.2 }}
                        />
                    </div>
                )}
            </div>

            {file.status === 'queued' && (
                <span className="hidden md:inline-flex text-[10px] uppercase tracking-wider font-bold text-zinc-500 bg-white/5 px-2 py-1 rounded-full border border-white/5 mr-2">Ready</span>
            )}

            <button
                onClick={() => onRemove(file.id)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
}
