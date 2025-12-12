
export interface CompressionOptions {
    quality: number; // 0 to 100
    format: 'image/webp' | 'image/png' | 'image/jpeg';
    targetSizeKB?: number;
}

export async function compressImage(
    file: File,
    options: CompressionOptions
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = async () => {
            URL.revokeObjectURL(url);

            try {
                const width = img.width;
                const height = img.height;

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d', { alpha: true });
                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }

                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);

                const getBlob = async (quality: number): Promise<Blob> => {
                    return new Promise((res, rej) => {
                        if (options.format === 'image/png') {
                            const imageData = ctx.getImageData(0, 0, width, height);
                            const cnum = quality === 100 ? 0 : 256;
                            import('upng-js').then((module) => {
                                const UPNG = module.default;
                                // For PNG, quality reduces colors (cnum). 
                                // UPNG cnum: 0 = lossless, 256 = lossy (default).
                                // Let's map quality 100 -> 0, <100 -> 256. 
                                // Actually, UPNG doesn't have fine-grained quality slider same as JPEG.
                                // It mainly supports limiting colors.
                                // If targetSize is set, we might need to rely on JPEG/WebP or accept PNG limiation.
                                // For now, keep original logic: 100=lossless, else=256 colors.
                                const pngBuffer = UPNG.encode([imageData.data.buffer], width, height, cnum);
                                res(new Blob([pngBuffer], { type: 'image/png' }));
                            });
                        } else {
                            canvas.toBlob(
                                (blob) => {
                                    if (blob) res(blob);
                                    else rej(new Error('Compression failed'));
                                },
                                options.format,
                                quality / 100
                            );
                        }
                    });
                };

                let resultBlob = await getBlob(options.quality);

                // Target Size Logic (Simple Iterative Reduction)
                if (options.targetSizeKB && options.targetSizeKB > 0 && options.format !== 'image/png') {
                    // PNG UPNG doesn't support iterative quality well in this implementation (just cnum).
                    // Only applying for WebP/JPEG for now.
                    let currentQuality = options.quality;
                    let minQuality = 5; // Don't go below 5%

                    while (resultBlob.size / 1024 > options.targetSizeKB && currentQuality > minQuality) {
                        currentQuality -= 5;
                        resultBlob = await getBlob(currentQuality);
                    }
                }

                resolve(resultBlob);

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

