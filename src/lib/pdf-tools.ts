// Comprehensive PDF Tools Library
// Interacts with the generic "One-Shot" WASM worker
// REFACTORED: Integrated advanced logic from pdf-compressor.ts (Extreme Mode Fixes)

export type PDFQuality = 'low' | 'medium' | 'high' | 'maximum';

export interface PDFToolResult {
    blob: Blob;
    originalSize: number;
    outputSize: number;
    logs: string[];
}

export interface CompressOptions {
    quality: PDFQuality;
}

export interface SplitOptions {
    startPage: number;
    endPage: number;
}

export const QUALITY_PRESETS: Record<PDFQuality, {
    label: string;
    description: string;
    targetPreset: string;
    device?: string; // Engine Selector
    additionalArgs?: string[];
}> = {

    low: {
        label: 'Low',
        description: 'Screen quality (72dpi)',
        targetPreset: 'screen'
    },
    medium: {
        label: 'Medium',
        description: 'Ebook quality (150dpi)',
        targetPreset: 'ebook'
    },
    high: {
        label: 'High',
        description: 'Print quality (300dpi)',
        targetPreset: 'printer'
    },
    maximum: {
        label: 'Maximum',
        description: 'Prepress quality (High Res)',
        targetPreset: 'prepress'
    }
};

// --- Core Worker Execution ---

async function runGS(
    inputs: Array<{ name: string; data: Uint8Array }>,
    args: string[],
    onProgress?: (log: string) => void
): Promise<{ blob: Blob }> {
    return new Promise((resolve, reject) => {
        // CACHE BUSTING: Force fresh worker
        const worker = new Worker(`/wasm/pdf-worker.js?v=VECTOR_FIX_${Date.now()}`);
        const logs: string[] = [];

        // Safety timeout
        const timeoutId = setTimeout(() => {
            worker.terminate();
            reject(new Error('Operation timed out (90s limit).'));
        }, 90000);

        worker.onmessage = (e) => {
            const { type, blob, message, error } = e.data;

            if (type === 'stdout' || type === 'stderr') {
                logs.push(message);
                if (onProgress) onProgress(message);

            } else if (type === 'complete') {
                clearTimeout(timeoutId);
                worker.terminate();
                resolve({ blob });

            } else if (type === 'error') {
                clearTimeout(timeoutId);
                worker.terminate();
                reject(new Error(error));
            }
        };

        worker.onerror = (err) => {
            clearTimeout(timeoutId);
            worker.terminate();
            reject(new Error('Worker system error: ' + err.message));
        };

        // Start Execution
        worker.postMessage({
            type: 'execute',
            inputs,
            args
        });
    });
}

// --- Tool Implementations ---

export async function compressPDF(
    file: File,
    options: CompressOptions,
    onLog?: (log: string) => void
): Promise<PDFToolResult> {
    const buffer = await file.arrayBuffer();
    const data = new Uint8Array(buffer);
    const preset = QUALITY_PRESETS[options.quality];



    // --- STANDARD MODES ---
    const device = preset.device || 'pdfwrite';
    const args = [
        `-sDEVICE=${device}`,
        '-dCompatibilityLevel=1.4',
        '-dNOPAUSE', '-dQUIET', '-dBATCH',
        '-sOutputFile=output.pdf'
    ];

    if (device === 'pdfwrite') {
        args.push(`-dPDFSETTINGS=/${preset.targetPreset}`);
    }

    if (preset.additionalArgs) {
        args.push(...preset.additionalArgs);
    }

    args.push('input.pdf');

    // DEBUG
    console.log('[Compressor] Executing GS with:', args);

    const { blob } = await runGS(
        [{ name: 'input.pdf', data }],
        args,
        onLog
    );

    return {
        blob,
        originalSize: file.size,
        outputSize: blob.size,
        logs: []
    };
}

export async function mergePDFs(
    files: File[],
    onLog?: (log: string) => void
): Promise<PDFToolResult> {
    const inputs: Array<{ name: string; data: Uint8Array }> = [];
    const inputNames: string[] = [];
    let totalSize = 0;

    for (let i = 0; i < files.length; i++) {
        const buffer = await files[i].arrayBuffer();
        inputs.push({
            name: `input${i}.pdf`,
            data: new Uint8Array(buffer)
        });
        inputNames.push(`input${i}.pdf`);
        totalSize += files[i].size;
    }

    const args = [
        '-sDEVICE=pdfwrite',
        '-dCompatibilityLevel=1.4',
        '-dNOPAUSE', '-dQUIET', '-dBATCH',
        '-sOutputFile=output.pdf',
        ...inputNames
    ];

    const { blob } = await runGS(inputs, args, onLog);

    return {
        blob,
        originalSize: totalSize,
        outputSize: blob.size,
        logs: []
    };
}

export async function splitPDF(
    file: File,
    options: SplitOptions,
    onLog?: (log: string) => void
): Promise<PDFToolResult> {
    const buffer = await file.arrayBuffer();
    const data = new Uint8Array(buffer);

    const args = [
        '-sDEVICE=pdfwrite',
        '-dCompatibilityLevel=1.4',
        '-dNOPAUSE', '-dQUIET', '-dBATCH',
        `-dFirstPage=${options.startPage}`,
        `-dLastPage=${options.endPage}`,
        '-sOutputFile=output.pdf',
        'input.pdf'
    ];

    const { blob } = await runGS(
        [{ name: 'input.pdf', data }],
        args,
        onLog
    );

    return {
        blob,
        originalSize: file.size,
        outputSize: blob.size,
        logs: []
    };
}


