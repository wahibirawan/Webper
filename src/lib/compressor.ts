export interface CompressionOptions {
    quality: number; // 0 to 100
    maxWidth?: number;
    maxHeight?: number;
    format: 'image/webp';
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

            const ctx = canvas.getContext('2d', { alpha: false }); // Optimize for no alpha if possible, but WebP supports it. Let's keep default but add settings.
            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }

            // 1. High Quality Scaling
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Draw image to canvas
            ctx.drawImage(img, 0, 0, width, height);

            // 2. Apply Sharpening (Simple Convolution) to reduce blur
            // Only sharpen if we resized (downscaled) significantly, or always? 
            // A mild sharpen is usually good for "professional" look.
            const imageData = ctx.getImageData(0, 0, width, height);
            const sharpenedData = sharpen(ctx, width, height, 0.15); // 15% sharpen strength
            ctx.putImageData(sharpenedData, 0, 0);

            // Convert to blob
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
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };

        img.src = url;
    });
}

// Simple Sharpening Filter
function sharpen(ctx: CanvasRenderingContext2D, w: number, h: number, mix: number) {
    const weights = [0, -1, 0, -1, 5, -1, 0, -1, 0];
    const katet = Math.round(Math.sqrt(weights.length));
    const half = (katet * 0.5) | 0;
    const dstData = ctx.createImageData(w, h);
    const dstBuff = dstData.data;
    const srcBuff = ctx.getImageData(0, 0, w, h).data;
    let y = h;

    while (y--) {
        let x = w;
        while (x--) {
            const sy = y;
            const sx = x;
            const dstOff = (y * w + x) * 4;
            let r = 0;
            let g = 0;
            let b = 0;
            let a = 0;

            for (let cy = 0; cy < katet; cy++) {
                for (let cx = 0; cx < katet; cx++) {
                    const scy = sy + cy - half;
                    const scx = sx + cx - half;

                    if (scy >= 0 && scy < h && scx >= 0 && scx < w) {
                        const srcOff = (scy * w + scx) * 4;
                        const wt = weights[cy * katet + cx];

                        r += srcBuff[srcOff] * wt;
                        g += srcBuff[srcOff + 1] * wt;
                        b += srcBuff[srcOff + 2] * wt;
                        a += srcBuff[srcOff + 3] * wt;
                    }
                }
            }

            dstBuff[dstOff] = r * mix + srcBuff[dstOff] * (1 - mix);
            dstBuff[dstOff + 1] = g * mix + srcBuff[dstOff + 1] * (1 - mix);
            dstBuff[dstOff + 2] = b * mix + srcBuff[dstOff + 2] * (1 - mix);
            dstBuff[dstOff + 3] = srcBuff[dstOff + 3];
        }
    }
    return dstData;
}
