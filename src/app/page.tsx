'use client';

import { useState, useCallback, useEffect } from 'react';
import { Shell } from '@/components/shell';
import { Dropzone } from '@/components/dropzone';
import { FileCard, FileItem } from '@/components/file-card';
import { CompressionSettings, SettingsState } from '@/components/compression-settings';
import { compressImage } from '@/lib/compressor';
import { Button } from '@/components/ui/button';
import NextImage from 'next/image';
import { Download, X, Shield, FileIcon, Settings, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Navbar } from '@/components/navbar';
import { Announcement } from '@/components/announcement';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';
import { detectMetadata } from '@/lib/metadata';
import { motion, AnimatePresence } from 'framer-motion';

import { BackgroundBeams } from "@/components/ui/background-beams";

export default function Home() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<SettingsState>({
    quality: 80,
    targetSize: undefined,
    stripMetadata: true,
    keepOriginalFilename: false,
    format: 'image/webp',
  });
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  // Derived state for list separation
  const queueFiles = files.filter(f => f.status !== 'done');
  const finishedFiles = files.filter(f => f.status === 'done');

  const handleFilesDrop = useCallback(async (newFiles: File[]) => {
    // Determine metadata for all files
    const newFileItemsWithMetadata = await Promise.all(newFiles.map(async (file) => {
      const metadata = await detectMetadata(file);
      return {
        id: Math.random().toString(36).substring(7),
        file,
        preview: URL.createObjectURL(file),
        status: 'queued' as const,
        progress: 0,
        originalSize: file.size,
        metadata,
      };
    }));

    setFiles((prev) => [...prev, ...newFileItemsWithMetadata]);
    setStatus('idle');
  }, []);

  // Global Paste Handler (Moved here to access handleFilesDrop)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const pastedFiles = Array.from(e.clipboardData.files).filter(f => f.type.startsWith('image/'));
        if (pastedFiles.length > 0) {
          handleFilesDrop(pastedFiles);
          toast.success('Image pasted from clipboard!');
        }
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handleFilesDrop]);

  const handleRemoveFile = useCallback((id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      const updatedFiles = prev.filter((f) => f.id !== id);
      if (updatedFiles.length === 0) setStatus('idle');
      return updatedFiles;
    });
  }, []);

  const handleSettingsChange = useCallback((newSettings: SettingsState) => {
    setSettings(newSettings);
  }, []);

  const updateFileStatus = useCallback((id: string, status: FileItem['status'], progress: number, compressedSize?: number, blob?: Blob) => {
    setFiles(prev => prev.map(f => {
      if (f.id === id) {
        return { ...f, status, progress, compressedSize, blob };
      }
      return f;
    }));
  }, []);

  const downloadFiles = async (filesToDownload: FileItem[]) => {
    if (filesToDownload.length === 0) return;

    const getExtension = (type: string) => {
      switch (type) {
        case 'image/png': return 'png';
        case 'image/jpeg': return 'jpg';
        default: return 'webp';
      }
    };

    // Generate formatted timestamp: YYYYMMDD_HHMMSS
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

    if (filesToDownload.length === 1) {
      // Single file download
      const file = filesToDownload[0];
      if (!file.blob) return;

      const url = URL.createObjectURL(file.blob);
      const a = document.createElement('a');
      a.href = url;
      const ext = getExtension(file.blob.type);

      let filename = `webper_${timestamp}.${ext}`;
      if (settings.keepOriginalFilename) {
        const originalName = file.file.name.replace(/\.[^/.]+$/, "");
        filename = `${originalName}.${ext}`;
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // ZIP download
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      filesToDownload.forEach((f, index) => {
        if (f.blob) {
          const ext = getExtension(f.blob.type);

          let filename = `webper_${timestamp}_${index + 1}.${ext}`;
          if (settings.keepOriginalFilename) {
            const originalName = f.file.name.replace(/\.[^/.]+$/, "");
            filename = `${originalName}.${ext}`;
          }

          // Handle duplicate names in zip to prevent overwriting
          let finalFilename = filename;
          let counter = 1;
          while (zip.file(finalFilename)) {
            const namePart = filename.replace(/\.[^/.]+$/, "");
            finalFilename = `${namePart}_${counter}.${ext}`;
            counter++;
          }

          zip.file(finalFilename, f.blob);
        }
      });

      zip.generateAsync({ type: 'blob' }).then((content) => {
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        // New naming: webper_compressed_timedate.zip
        a.download = `webper_compressed_${timestamp}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
  };

  const startCompression = async () => {
    setIsCompressing(true);
    setStatus('processing');

    // Track completed files for auto-download (ONLY new ones)
    const newlyCompressedFiles: FileItem[] = [];

    // Process files sequentially
    for (let i = 0; i < files.length; i++) {
      const fileItem = files[i];
      if (fileItem.status === 'done') {
        // Skip already finished files for compression AND auto-download
        continue;
      }

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileItem.id ? { ...f, status: 'processing', progress: 10 } : f
        )
      );

      try {
        const blob = await compressImage(fileItem.file, {
          quality: settings.quality,
          format: settings.format,
          targetSizeKB: settings.targetSize,
        });

        const newPreviewUrl = URL.createObjectURL(blob);
        URL.revokeObjectURL(fileItem.preview);

        const updatedFileItem: FileItem = {
          ...fileItem,
          status: 'done',
          progress: 100,
          compressedSize: blob.size,
          blob: blob,
          preview: newPreviewUrl,
        };

        newlyCompressedFiles.push(updatedFileItem);

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id ? updatedFileItem : f
          )
        );
      } catch (error) {
        console.error(error);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id ? { ...f, status: 'error', error: 'Failed' } : f
          )
        );
      }
    }

    setIsCompressing(false);
    setStatus('success');
    toast.success('Compression completed!');

    // Auto download ONLY newly processed files
    if (newlyCompressedFiles.length > 0) {
      downloadFiles(newlyCompressedFiles);
    }
  };

  const downloadAll = () => {
    // Manual download gets ALL finished files
    const completedFiles = files.filter((f) => f.status === 'done');
    downloadFiles(completedFiles);
  };

  const clearAll = () => {
    setFiles([]);
    setStatus('idle');
  };

  const getStatusText = () => {
    switch (status) {
      case 'processing': return 'Processing...';
      case 'success': return 'Compression Complete';
      case 'error': return 'Error Occurred';
      default: return files.length > 0 ? 'Ready' : 'Waiting for files';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing': return 'text-yellow-500';
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Shell>
      <Navbar />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <BackgroundBeams />
      </div>

      <div className="text-center space-y-8 pt-20 pb-12 flex flex-col items-center relative z-10">

        {/* Announcement Banner */}
        <AnimatePresence>
          {showAnnouncement && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-400 backdrop-blur-md"
            >
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              <span className="text-xs font-mono tracking-wide">100% PRIVATE. NO DATA LEAVES YOUR MACHINE.</span>
            </motion.div>
          )}
        </AnimatePresence>

        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white leading-[0.9]">
          Optimize images <br />
          <span className="text-zinc-500">without limits.</span>
        </h1>
        <p className="text-zinc-400 text-md md:text-md max-w-2xl mx-auto font-light tracking-wide leading-relaxed">
          Professional-grade image compression for modern web development
        </p>
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
          {/* Main Content */}

          {/* Main Content */}
          <div className="lg:col-start-1 lg:row-start-1 space-y-6 w-full min-w-0">
            <Dropzone onFilesDrop={handleFilesDrop}>
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4 hover:scale-110 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.5)] transition-all duration-300">
                  <Upload className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Click to select, drag & drop, or paste images
                </h3>
                <p className="text-zinc-400 text-sm">
                  Supports JPG, PNG, and WebP up to 50MB
                </p>
                <div className="mt-4 inline-block px-3 md:px-4 py-1.5 md:py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] md:text-xs text-blue-300 font-medium uppercase tracking-wider shadow-[0_0_10px_-4px_rgba(59,130,246,0.5)] leading-relaxed">
                  <span className="hidden md:inline">Tip: You can use Ctrl+V to paste images</span>
                  <span className="md:hidden">Tip: Paste images with long press</span>
                </div>
              </div>
            </Dropzone>

            {(queueFiles.length > 0 || finishedFiles.length > 0) && (
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider"> Files ({files.length})</h3>
                <Button variant="ghost" size="sm" onClick={clearAll} className="text-zinc-500 hover:text-red-400 h-auto p-0 hover:bg-transparent">
                  Clear all
                </Button>
              </div>
            )}

            {/* Queue List */}
            {queueFiles.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-wider px-2">Queue ({queueFiles.length})</h3>

                {/* Mobile Horizontal Scroll */}
                <div className="md:hidden w-full overflow-x-auto pb-4 -mx-4 px-4 snap-x flex gap-4">
                  <AnimatePresence mode="popLayout">
                    {queueFiles.map((file) => (
                      <div key={file.id} className="min-w-[280px] snap-center">
                        <FileCard file={file} onRemove={handleRemoveFile} />
                      </div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Desktop List */}
                <div className="hidden md:flex flex-col gap-3">
                  <AnimatePresence mode="popLayout">
                    {queueFiles.map((file) => (
                      <FileCard key={file.id} file={file} onRemove={handleRemoveFile} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Finished List */}
            {finishedFiles.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-xs font-bold text-green-500/80 uppercase tracking-wider px-2 flex items-center gap-2">
                  Finished ({finishedFiles.length})
                </h3>

                {/* Mobile Horizontal Scroll */}
                <div className="md:hidden w-full overflow-x-auto pb-4 -mx-4 px-4 snap-x flex gap-4">
                  <AnimatePresence mode="popLayout">
                    {finishedFiles.map((file) => (
                      <div key={file.id} className="min-w-[280px] snap-center">
                        <FileCard file={file} onRemove={handleRemoveFile} />
                      </div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Desktop List */}
                <div className="hidden md:flex flex-col gap-3">
                  <AnimatePresence mode="popLayout">
                    {finishedFiles.map((file) => (
                      <FileCard key={file.id} file={file} onRemove={handleRemoveFile} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Mobile Controls */}
            <div className="lg:hidden space-y-4 pt-4">
              <Button
                size="lg"
                className="w-full bg-white text-black hover:bg-zinc-200 rounded-xl h-14 text-base font-bold transition-all"
                onClick={queueFiles.length > 0 ? startCompression : downloadAll}
                disabled={files.length === 0 || isCompressing}
              >
                {isCompressing ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    Compressing...
                  </span>
                ) : (
                  queueFiles.length > 0
                    ? `Compress ${queueFiles.length} Images`
                    : (finishedFiles.length > 0 ? 'Download All (ZIP)' : 'Start Compressing')
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl h-14 text-base font-medium"
                onClick={() => setIsSettingsOpen(true)}
                disabled={isCompressing}
              >
                <Settings className="w-5 h-5 mr-2" />
                Configure Settings
              </Button>
            </div>
          </div>

          {/* Sidebar Controls */}
          <div className="hidden lg:block lg:col-start-2 lg:row-start-1 space-y-6 lg:sticky lg:top-24">
            <div className="rounded-xl border border-white/10 bg-black/50 backdrop-blur-xl p-6">
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <Settings className="w-4 h-4 text-zinc-500" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Configuration</h2>
              </div>

              <CompressionSettings settings={settings} onSettingsChange={setSettings} />

              {/* Status Column */}
              <div className="flex items-center justify-between py-4 border-t border-white/5 mt-6">
                <span className="text-sm font-medium text-zinc-500">Status</span>
                <span className={cn("text-sm font-mono", getStatusColor())}>
                  {getStatusText()}
                </span>
              </div>

              <div className="space-y-4 pt-2">
                <Button
                  size="lg"
                  className="w-full bg-white text-black hover:bg-zinc-200 border-none rounded-lg h-12 text-sm font-bold transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)]"
                  onClick={queueFiles.length > 0 ? startCompression : downloadAll}
                  disabled={files.length === 0 || isCompressing}
                >
                  {isCompressing ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Processing...
                    </span>
                  ) : (
                    queueFiles.length > 0
                      ? `Compress ${queueFiles.length} Images`
                      : (finishedFiles.length > 0 ? 'Download All' : 'Start Compression')
                  )}
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />

      {/* Mobile Settings Overlay */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150] lg:hidden"
              onClick={() => setIsSettingsOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-white/10 z-[160] p-6 rounded-t-3xl lg:hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-white" />
                  <h2 className="text-lg font-bold text-white">Settings</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSettingsOpen(false)}
                  className="h-8 w-8 rounded-full hover:bg-white/10 text-zinc-400"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-8">
                <CompressionSettings settings={settings} onSettingsChange={setSettings} />

                <Button
                  size="lg"
                  className="w-full bg-white text-black hover:bg-zinc-200 rounded-xl h-14 text-base font-bold"
                  onClick={() => setIsSettingsOpen(false)}
                >
                  Save Changes
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Shell>
  );
}
