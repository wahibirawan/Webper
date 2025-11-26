'use client';

import { useState, useCallback } from 'react';
import { Shell } from '@/components/shell';
import { Dropzone } from '@/components/dropzone';
import { FileList, FileItem } from '@/components/file-list';
import { FileCard } from '@/components/file-card';
import { CompressionSettings, SettingsState } from '@/components/compression-settings';
import { compressImage } from '@/lib/compressor';
import { Button } from '@/components/ui/button';
import NextImage from 'next/image';
import { Download, X, Shield, FileIcon, Settings } from 'lucide-react';
import { toast } from 'sonner';
import JSZip from 'jszip';
import { Navbar } from '@/components/navbar';
import { Announcement } from '@/components/announcement';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<SettingsState>({
    quality: 80,
    maxWidth: 0,
    maxHeight: 0,
    stripMetadata: true,
  });
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  const handleFilesDrop = useCallback((newFiles: File[]) => {
    const newFileItems: FileItem[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      status: 'queued' as const,
      progress: 0,
      originalSize: file.size,
    }));
    setFiles((prev) => [...prev, ...newFileItems]);
    setStatus('idle');
  }, []);

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

  const downloadFiles = (filesToDownload: FileItem[]) => {
    if (filesToDownload.length === 0) return;

    if (filesToDownload.length === 1) {
      // Single file download
      const file = filesToDownload[0];
      if (!file.blob) return;

      const url = URL.createObjectURL(file.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.file.name.replace(/\.[^/.]+$/, '') + '.webp';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // ZIP download
      const zip = new JSZip();
      filesToDownload.forEach((f) => {
        if (f.blob) {
          zip.file(f.file.name.replace(/\.[^/.]+$/, '') + '.webp', f.blob);
        }
      });

      zip.generateAsync({ type: 'blob' }).then((content) => {
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'compressed-images.zip';
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

    // Track completed files for auto-download
    const processedFiles: FileItem[] = [];

    // Process files sequentially
    for (let i = 0; i < files.length; i++) {
      const fileItem = files[i];
      if (fileItem.status === 'done') {
        processedFiles.push(fileItem);
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
          maxWidth: settings.maxWidth || undefined,
          maxHeight: settings.maxHeight || undefined,
          format: 'image/webp',
        });

        const updatedFileItem: FileItem = {
          ...fileItem,
          status: 'done',
          progress: 100,
          compressedSize: blob.size,
          blob: blob,
        };

        processedFiles.push(updatedFileItem);

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

    // Auto download
    const successfulFiles = processedFiles.filter(f => f.status === 'done');
    if (successfulFiles.length > 0) {
      downloadFiles(successfulFiles);
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
      case 'processing': return 'text-yellow-500';
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Shell>
      <Navbar />

      <div className="text-center space-y-4 pt-6 pb-4 flex flex-col items-center">
        {/* Announcement Banner */}
        <AnimatePresence>
          {showAnnouncement && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-[#8D5524] text-white border-2 border-[#3E2723] relative z-50 mb-4 w-auto inline-block pixel-shadow-sm"
            >
              <div className="px-6 py-2 flex items-center justify-center">
                <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold tracking-wide uppercase font-pixel text-center md:whitespace-nowrap">
                  <span>100% Local Processing - Your images never leave your device</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground font-pixel leading-relaxed py-2">
          Webper
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-none mx-auto font-light tracking-wide md:whitespace-nowrap">
          Professional image compression tool. Simple, fast, and private.
        </p>
      </div>

      <div className="w-full flex flex-col gap-8">
        <div className="grid lg:grid-cols-[1fr_350px] gap-8 items-start">
          {/* Main Content (Left on Desktop, Top on Mobile) */}
          <div className="lg:col-start-1 lg:row-start-1 space-y-6 min-h-[500px] w-full min-w-0">
            <Dropzone onFilesDrop={handleFilesDrop} />

            {/* Download Button Area */}
            {files.some(f => f.status === 'done') && (
              <div className="flex justify-center py-2">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full md:w-auto min-w-[200px] border-primary/20 text-primary hover:bg-primary/5 font-medium rounded-md h-12 shadow-sm"
                  onClick={downloadAll}
                >
                  {files.filter(f => f.status === 'done').length > 1 ? 'Download All (ZIP)' : 'Download Image'}
                </Button>
              </div>
            )}

            {/* Mobile Thumbnail List */}
            <div className="md:hidden w-full max-w-[calc(100vw-3rem)] mx-auto">
              <div className="flex overflow-x-auto gap-4 pb-4 snap-x custom-scrollbar min-h-[120px] items-center px-1">
                {files.length === 0 && (
                  <div className="text-sm text-muted-foreground w-full text-center italic">
                    No images selected
                  </div>
                )}
                <AnimatePresence mode="popLayout">
                  {files.map((file) => (
                    <motion.div
                      key={file.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative flex-none w-24 h-24 border-2 border-black pixel-shadow bg-white snap-center group"
                    >
                      <div className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleRemoveFile(file.id)}
                          className="bg-red-500 text-white p-0.5 border border-black"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>

                      {file.file.type.startsWith('image/') ? (
                        <NextImage
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

                      {/* Status Indicator */}
                      {file.status === 'processing' && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" />
                        </div>
                      )}
                      {file.status === 'done' && (
                        <div className="absolute bottom-0 right-0 bg-green-500 border-t-2 border-l-2 border-black p-0.5">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Desktop File List */}
            <div className="hidden md:block max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <FileList files={files} onRemove={handleRemoveFile} />
            </div>

            {/* Mobile Controls (Visible only on Mobile) */}
            <div className="lg:hidden space-y-3 pt-2">
              <Button
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-md h-12 text-sm"
                onClick={startCompression}
                disabled={files.length === 0 || isCompressing}
              >
                {isCompressing ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    Compressing...
                  </span>
                ) : (
                  files.length > 0 ? `Compress ${files.length} Images` : 'Start Compressing'
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full border-2 border-black bg-white text-black hover:bg-gray-100 font-medium rounded-md h-12 text-sm"
                onClick={() => setIsSettingsOpen(true)}
                disabled={isCompressing}
              >
                <Settings className="w-4 h-4 mr-2" />
                Configure Settings
              </Button>
            </div>
          </div>

          {/* Sidebar Controls (Hidden on Mobile, Right on Desktop) */}
          <div className="hidden lg:block lg:col-start-2 lg:row-start-1 space-y-6 lg:sticky lg:top-24 p-6 border-2 border-black bg-white pixel-shadow w-full">
            <div className="flex items-center gap-2 mb-4 border-b border-border pb-4">
              <div className="h-2 w-2 bg-primary rounded-full" />
              <h2 className="text-sm font-medium text-muted-foreground">Settings</h2>
            </div>

            <CompressionSettings settings={settings} onSettingsChange={setSettings} />

            {/* Status Column */}
            <div className="flex items-center justify-between py-3 border-t border-border mt-4">
              <span className="text-sm font-medium text-muted-foreground">Status</span>
              <span className={cn("text-sm font-medium", getStatusColor())}>
                {getStatusText()}
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <Button
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-md h-12 text-sm"
                onClick={startCompression}
                disabled={files.length === 0 || isCompressing}
              >
                {isCompressing ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    Compressing...
                  </span>
                ) : (
                  files.length > 0 ? `Compress ${files.length} Images` : 'Start Compressing'
                )}
              </Button>

              {files.length > 0 && (
                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground hover:text-destructive font-medium text-sm"
                  onClick={clearAll}
                  disabled={isCompressing}
                >
                  Clear All
                </Button>
              )}
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
              className="fixed inset-0 bg-black/50 z-[150] lg:hidden"
              onClick={() => setIsSettingsOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black z-[160] p-6 rounded-t-2xl lg:hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  <h2 className="text-lg font-bold font-pixel uppercase">Settings</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSettingsOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                <CompressionSettings settings={settings} onSettingsChange={setSettings} />

                <Button
                  size="lg"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-md h-12 text-sm"
                  onClick={() => setIsSettingsOpen(false)}
                >
                  Save Settings
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Shell>
  );
}
