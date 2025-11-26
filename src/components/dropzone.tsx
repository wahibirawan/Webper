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
        <motion.div
            {...(getRootProps() as any)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={cn(
                'relative group cursor-pointer overflow-hidden border-4 border-black transition-all duration-300 ease-out min-h-[200px] flex flex-col items-center justify-center p-8 gap-4 bg-white pixel-shadow-lg',
                isDragActive
                    ? 'bg-primary/10'
                    : 'hover:bg-secondary/20'
            )}
            style={{
                borderStyle: 'dashed',
                borderWidth: '4px',
                borderColor: '#000'
            }}
        >
            <input {...getInputProps()} />

            <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                <div className={cn(
                    "p-4 border-2 border-black transition-colors duration-300 bg-white pixel-shadow",
                    isDragActive ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground group-hover:bg-primary group-hover:text-primary-foreground"
                )}>
                    <Upload className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-bold uppercase tracking-widest">
                        {isDragActive ? 'Drop Files Now' : 'Upload Images'}
                    </h3>
                    <p className="text-sm text-muted-foreground font-mono">
                        Drag & drop or click to upload multiple files
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono border-2 border-black px-2 py-1 bg-secondary/30">
                <FileImage className="w-3 h-3" />
                <span>Supports JPG, PNG, WEBP</span>
            </div>
        </motion.div>
    );
}
