import React from 'react';
import { FileItem } from './file-list';
import { Button } from '@/components/ui/button';
import { X, FileIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative overflow-hidden border-2 border-black bg-white p-4 pixel-shadow transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000]"
        >
            <div className="flex items-start gap-4">
                {/* Preview */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden border-2 border-black bg-secondary">
                    {file.file.type.startsWith('image/') ? (
                        <Image
                            src={file.preview}
                            alt={file.file.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <FileIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                        <div className="truncate">
                            <h4 className="font-bold text-sm truncate uppercase tracking-tight">
                                {file.file.name}
                            </h4>
                            <p className="text-xs text-muted-foreground font-mono">
                                {formatSize(file.originalSize)}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 -mr-2 -mt-2 hover:bg-destructive hover:text-destructive-foreground rounded-none"
                            onClick={() => onRemove(file.id)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Progress / Status */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono uppercase">
                            <span>
                                {file.status === 'queued' && 'WAITING...'}
                                {file.status === 'processing' && 'COMPRESSING...'}
                                {file.status === 'done' && 'DONE'}
                                {file.status === 'error' && 'ERROR'}
                            </span>
                            {file.status === 'done' && (
                                <span className="text-primary font-bold">
                                    -{Math.round((1 - file.compressedSize! / file.originalSize) * 100)}%
                                </span>
                            )}
                        </div>

                        <div className="h-3 w-full border-2 border-black bg-secondary p-[1px]">
                            <motion.div
                                className={cn(
                                    "h-full transition-all duration-300",
                                    file.status === 'error' ? "bg-destructive" : "bg-primary"
                                )}
                                initial={{ width: 0 }}
                                animate={{
                                    width: file.status === 'queued' ? '0%' :
                                        file.status === 'processing' ? '50%' :
                                            file.status === 'done' ? '100%' : '100%'
                                }}
                            />
                        </div>

                        {file.status === 'done' && (
                            <div className="flex justify-between text-xs font-mono text-muted-foreground">
                                <span>{formatSize(file.compressedSize!)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
