import UPNG from 'upng-js';

export interface CompressionOptions {
    quality: number; // 0 to 100
    maxWidth?: number;
    maxHeight?: number;
    format: 'image/webp' | 'image/png' | 'image/jpeg';
}

export async function compressImage(
    file: File,
    options: CompressionOptions
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            try {
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions
                if (options.maxWidth && width > options.maxWidth) {
                    height = Math.round((height * options.maxWidth) / width);
                    width = options.maxWidth;
                }
                if (options.maxHeight && height > options.maxHeight) {
                    width = Math.round((width * options.maxHeight) / height);
                    height = options.maxHeight;
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                // Use alpha: true to support transparency for PNG/WebP
                const ctx = canvas.getContext('2d', { alpha: true });
                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }

                // High Quality Scaling using standard Canvas API
                // This is much more reliable than external libraries that might hang
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);

                // Compression based on format
                if (options.format === 'image/png') {
                    // PNG Compression Algorithm (Caesium/TinyPNG style)
                    const imageData = ctx.getImageData(0, 0, width, height);

                    // Quantization (Reduce colors to 256 if quality < 100)
                    // This is the core "lossy PNG" technique
                    const cnum = options.quality === 100 ? 0 : 256;

                    // Encode using UPNG
                    // UPNG.encode expects array of ArrayBuffers (frames). We have 1 frame.
                    const pngBuffer = UPNG.encode([imageData.data.buffer], width, height, cnum);
                    const blob = new Blob([pngBuffer], { type: 'image/png' });
                    resolve(blob);
                } else {
                    // WebP / JPEG Compression
                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                resolve(blob);
                            } else {
                                reject(new Error('Compression failed'));
                            }
                        },
                        options.format,
                        options.quality / 100
                    );
                }
            } catch (error) {
                console.error('Compression error:', error);
                reject(error);
            }
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };

        img.src = url;
    });
}

