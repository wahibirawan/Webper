import React from 'react';
import { Button } from '@/components/ui/button';
import { X, FileIcon, Shield } from 'lucide-react';
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
    metadata?: string[];
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
            className="group relative flex items-center gap-4 p-3 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all"
        >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                {file.file.type.startsWith('image/') ? (
                    <Image
                        src={file.preview}
                        alt={file.file.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <FileIcon className="h-6 w-6 text-gray-400" />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                        {file.file.name}
                    </p>
                    {file.status === 'done' && (
                        <span className="text-xs font-mono text-green-600 font-semibold">
                            -{Math.round((1 - (file.compressedSize! / file.originalSize)) * 100)}%
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                    <span>{formatSize(file.originalSize)}</span>
                    {file.status === 'done' && (
                        <span className="text-gray-900 font-medium">
                            {formatSize(file.compressedSize!)}
                        </span>
                    )}
                    {file.status === 'processing' && (
                        <span className="text-blue-600 animate-pulse">Processing...</span>
                    )}

                    {file.status === 'error' && (
                        <span className="text-red-500">Error</span>
                    )}

                    {/* Privacy Report */}
                    {file.metadata && file.metadata.length > 0 && (
                        <div className="flex items-center gap-1.5 ml-auto">
                            {file.status === 'done' ? (
                                <>
                                    <Shield className="w-3 h-3 text-green-600" />
                                    <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider hidden sm:inline-block">
                                        Privacy Safe
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Shield className="w-3 h-3 text-amber-500" />
                                    <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider hidden sm:inline-block">
                                        Metadata Detected
                                    </span>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                {(file.status === 'processing' || file.status === 'done') && (
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-200">
                        <motion.div
                            className={cn(
                                "h-full",
                                file.status === 'done' ? "bg-green-500" : "bg-blue-500"
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: `${file.progress}%` }}
                            transition={{ duration: 0.2 }}
                        />
                    </div>
                )}
            </div>

            {file.status === 'queued' && (
                <span className="hidden md:inline-flex text-[10px] uppercase tracking-wider font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full border border-gray-200 mr-2">Ready</span>
            )}

            <button
                onClick={() => onRemove(file.id)}
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
}
