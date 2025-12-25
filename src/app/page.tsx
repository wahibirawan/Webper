'use client';

import { useState, useCallback, useEffect } from 'react';
import { Shell } from '@/components/shell';
import { Dropzone } from '@/components/dropzone';
import { FileCard, FileItem } from '@/components/file-card';
import { CompressionSettings, SettingsState } from '@/components/compression-settings';
import { compressImage } from '@/lib/compressor';
import { Button } from '@/components/ui/button';
import NextImage from 'next/image';
import { Download, X, Shield, FileIcon, Settings, Upload, Clipboard } from 'lucide-react';
import { toast } from 'sonner';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';
import { detectMetadata } from '@/lib/metadata';
import { motion, AnimatePresence } from 'framer-motion';

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
    // Filter for images only
    const imageFiles = newFiles.filter(f => f.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      if (newFiles.length > 0) toast.error('Only image files are supported');
      return;
    }

    const newFileItemsWithMetadata = await Promise.all(imageFiles.map(async (file) => {
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

  // Global Paste Handler removed as Dropzone handles it
  // Ensure we filter efficiently in handleFilesDrop


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

    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

    if (filesToDownload.length === 1) {
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

    const newlyCompressedFiles: FileItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const fileItem = files[i];
      if (fileItem.status === 'done') {
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

    if (newlyCompressedFiles.length > 0) {
      downloadFiles(newlyCompressedFiles);
    }
  };

  const downloadAll = () => {
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
      case 'processing': return 'text-blue-600';
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-gray-50 relative">
      <Navbar />
      <main className="flex-1 relative z-10 pb-20 md:pb-32">

        <div className="text-center space-y-6 pt-32 pb-8 md:pt-40 md:pb-20 flex flex-col items-center relative z-10 px-4">

          {/* Announcement Banner */}
          <AnimatePresence>
            {showAnnouncement && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="inline-flex items-center gap-2.5 rounded-full border border-gray-200/60 bg-white/80 backdrop-blur-xl px-4 py-1.5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:shadow-md transition-all select-none cursor-default"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] sm:text-xs font-bold tracking-widest text-gray-500 uppercase whitespace-nowrap">
                  100% Private. No Data Leaves.
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 leading-[0.9]">
            Optimize images <br />
            <span className="text-gray-400">without limits.</span>
          </h1>
          <p className="text-gray-500 text-md md:text-lg max-w-2xl mx-auto font-light tracking-wide leading-relaxed">
            Professional-grade image compression for modern web development
          </p>
        </div>

        <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 px-6 md:px-8">
          <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">

            {/* Main Content */}
            <div className="lg:col-start-1 lg:row-start-1 space-y-6 w-full min-w-0">
              <Dropzone onFilesDrop={handleFilesDrop} className="!p-10 md:!p-14 w-full">
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-all duration-300 shadow-card-premium border border-gray-100">
                    <Upload className="w-7 h-7 text-gray-900" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Click to select, drag & drop, or paste images
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Supports JPG, PNG, and WebP up to 50MB
                  </p>
                  {/* Desktop: Keyboard shortcut tip */}
                  <div className="mt-4 hidden md:inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs text-blue-600 font-medium">
                    Tip: You can use Ctrl+V to paste images
                  </div>
                  {/* Mobile: Functional paste button */}
                  <button
                    type="button"
                    className="mt-6 md:hidden inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-sm text-gray-900 font-bold btn-tactile hover:bg-gray-50 active:scale-95 transition-all whitespace-nowrap"
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        const clipboardItems = await navigator.clipboard.read();
                        const imageFiles: File[] = [];
                        for (const item of clipboardItems) {
                          for (const type of item.types) {
                            if (type.startsWith('image/')) {
                              const blob = await item.getType(type);
                              const file = new File([blob], `pasted-image.${type.split('/')[1]}`, { type });
                              imageFiles.push(file);
                            }
                          }
                        }
                        if (imageFiles.length > 0) {
                          handleFilesDrop(imageFiles);
                          toast.success('Image pasted from clipboard!');
                        } else {
                          toast.error('No image found in clipboard');
                        }
                      } catch (err) {
                        toast.error('Unable to access clipboard. Please use file picker.');
                      }
                    }}
                  >
                    <Clipboard className="w-4 h-4" />
                    Paste from Clipboard
                  </button>
                </div>
              </Dropzone>

              {(queueFiles.length > 0 || finishedFiles.length > 0) && (
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Files ({files.length})</h3>
                  <Button variant="ghost" size="sm" onClick={clearAll} className="text-gray-500 hover:text-red-500 h-auto p-0 hover:bg-transparent">
                    Clear all
                  </Button>
                </div>
              )}

              {/* Queue List */}
              {queueFiles.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2">Queue ({queueFiles.length})</h3>

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
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h3 className="text-xs font-bold text-green-600 uppercase tracking-wider px-2 flex items-center gap-2">
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
                  className="w-full rounded-full h-14 text-base font-bold transition-all btn-tactile-dark"
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
                  className="w-full border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-full h-14 text-base font-medium"
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
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                  <Settings className="w-4 h-4 text-gray-400" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Configuration</h2>
                </div>

                <CompressionSettings settings={settings} onSettingsChange={setSettings} />

                {/* Status Column */}
                <div className="flex items-center justify-between py-4 border-t border-gray-100 mt-6">
                  <span className="text-sm font-medium text-gray-500">Status</span>
                  <span className={cn("text-sm font-mono", getStatusColor())}>
                    {getStatusText()}
                  </span>
                </div>

                <div className="space-y-4 pt-2">
                  <Button
                    size="lg"
                    className="w-full rounded-full h-12 text-sm font-bold transition-all btn-tactile-dark"
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
      </main>
      <Footer />

      {/* Mobile Settings Overlay */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[150] lg:hidden"
              onClick={() => setIsSettingsOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[160] p-6 rounded-t-3xl lg:hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-gray-900" />
                  <h2 className="text-lg font-bold text-gray-900">Settings</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSettingsOpen(false)}
                  className="h-8 w-8 rounded-full hover:bg-gray-100 text-gray-500"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-8">
                <CompressionSettings settings={settings} onSettingsChange={setSettings} />

                <Button
                  size="lg"
                  className="w-full bg-gray-900 text-white hover:bg-gray-800 rounded-xl h-14 text-base font-bold btn-tactile"
                  onClick={() => setIsSettingsOpen(false)}
                >
                  Save Changes
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
