// Generic Ghostscript Worker Wrapper
// "ONE-SHOT" STRATEGY: 
// Designed to process ANY Ghostscript command on ANY set of files.
// 100% Stateless: Starts, runs once, and terminates.

self.onmessage = async function (e) {
    const { type, inputs, args } = e.data;

    // Inputs: [{ name: 'input0.pdf', data: Uint8Array }, ...]
    // args: ['-sDEVICE=pdfwrite', ..., '-sOutputFile=output.pdf', 'input0.pdf']

    if (type !== 'execute') return;

    try {
        console.log('[Worker] Starting GS execution...');
        console.log('[Worker] Args:', args);

        const outputFileName = 'output.pdf';

        // 1. Prepare Module
        self.Module = {
            arguments: args,
            preRun: [
                function () {
                    // Write ALL input files to virtual FS
                    try {
                        inputs.forEach(file => {
                            self.Module.FS.writeFile(file.name, file.data);
                            console.log(`[Worker] Wrote ${file.name} to FS`);
                        });
                    } catch (err) {
                        console.error('[Worker] FS Write Error', err);
                        self.postMessage({ type: 'error', error: 'FS Error: ' + err.message });
                    }
                }
            ],
            postRun: [], // No postRun needed, we handle exit in quit()
            print: function (text) {
                // Send stdout to main thread
                self.postMessage({ type: 'stdout', message: text });
            },
            printErr: function (text) {
                // Send stderr to main thread
                // self.postMessage({ type: 'stderr', message: text });
                console.log('[GS Stderr]', text);
            },
            // Handle Exit
            quit: function (status, toThrow) {
                console.log('[Worker] GS Exited with status:', status);
                if (status === 0 || status === '0') { // Check for string '0' just in case
                    try {
                        // Read output
                        // Check if file exists first? Emscripten throws if not found.
                        const outputData = self.Module.FS.readFile(outputFileName);
                        const blob = new Blob([outputData], { type: 'application/pdf' });

                        self.postMessage({
                            type: 'complete',
                            blob,
                            size: blob.size
                        });
                    } catch (err) {
                        console.error('[Worker] Read Output Error', err);
                        self.postMessage({ type: 'error', error: 'Output Read Error: ' + err.message });
                    }
                } else {
                    self.postMessage({ type: 'error', error: 'Ghostscript exited with status ' + status });
                }
            }
        };

        // 2. Load Script - This triggers everything automatically
        importScripts('/wasm/gs-worker.js');

    } catch (error) {
        console.error('[Worker] Top-level Error', error);
        self.postMessage({
            type: 'error',
            error: error.message || 'Worker Exception'
        });
    }
};
