import React from 'react';
import { FileCard } from './file-card';
import { AnimatePresence, motion } from 'framer-motion';

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

interface FileListProps {
    files: FileItem[];
    onRemove: (id: string) => void;
}

export function FileList({ files, onRemove }: FileListProps) {
    if (files.length === 0) return null;

    return (
        <div className="space-y-3">
            <AnimatePresence mode="popLayout">
                {files.map((file) => (
                    <motion.div
                        key={file.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <FileCard file={file} onRemove={onRemove} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
