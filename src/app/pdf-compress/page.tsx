'use client';

import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { compressPDF, mergePDFs, splitPDF, QUALITY_PRESETS, PDFQuality } from '@/lib/pdf-tools';
import { Upload, FileText, Download, X, Layers, Scissors, Settings, CheckCircle, Loader2, ArrowRight, GripVertical, AlertCircle } from 'lucide-react';

import { Shell } from '@/components/shell';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

type ToolMode = 'compress' | 'merge' | 'split';

interface UserFile {
    id: string;
    file: File;
}

export default function GenericPDFTools() {
    const [activeTab, setActiveTab] = useState<ToolMode>('compress');

    // Warning Dialog State
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingTab, setPendingTab] = useState<ToolMode | null>(null);

    // State
    const [files, setFiles] = useState<UserFile[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [downloadName, setDownloadName] = useState<string>('');
    const [resultSize, setResultSize] = useState<number | null>(null);

    // Settings
    const [compressionQuality, setCompressionQuality] = useState<PDFQuality>('medium');
    const [splitRange, setSplitRange] = useState({ start: 1, end: 1 });

    const handleTabChange = (newTab: ToolMode) => {
        if (activeTab === newTab) return;

        if (files.length > 0 || downloadUrl) {
            setPendingTab(newTab);
            setShowConfirmDialog(true);
        } else {
            setActiveTab(newTab);
            clearAll();
        }
    };

    // Global Paste Handler
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            if (activeTab === 'compress' && files.length > 0) return; // Single file limit
            if (activeTab === 'split' && files.length > 0) return; // Single file limit

            if (e.clipboardData && e.clipboardData.files.length > 0) {
                const pastedFiles = Array.from(e.clipboardData.files).filter(f => f.type === 'application/pdf');

                if (pastedFiles.length > 0) {
                    const newFiles = pastedFiles.map(f => ({
                        id: Math.random().toString(36).substring(7) + Date.now(),
                        file: f
                    }));

                    if (activeTab === 'merge') {
                        setFiles(prev => [...prev, ...newFiles]);
                    } else {
                        setFiles(newFiles.slice(0, 1)); // Single file for others
                    }

                    setDownloadUrl(null);
                    setResultSize(null);
                    toast.success('File pasted from clipboard!');
                }
            }
        };

        document.addEventListener('paste', handlePaste);
        return () => document.removeEventListener('paste', handlePaste);
    }, [activeTab, files, downloadUrl]); // Dependencies for safe state updates

    const confirmTabChange = () => {
        if (pendingTab) {
            setActiveTab(pendingTab);
            clearAll();
            setPendingTab(null);
        }
        setShowConfirmDialog(false);
    };

    const cancelTabChange = () => {
        setPendingTab(null);
        setShowConfirmDialog(false);
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files).map(f => ({
                id: Math.random().toString(36).substring(7) + Date.now(),
                file: f
            }));

            if (activeTab === 'merge') {
                setFiles(prev => [...prev, ...newFiles]);
            } else {
                setFiles(newFiles.slice(0, 1)); // Single file for others
            }
            setDownloadUrl(null); // Reset result
            setResultSize(null);
        }
    };

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
        if (files.length <= 1) { // If removing makes it empty (checked before update effectively)
            setDownloadUrl(null);
            setResultSize(null);
        }
    };

    const clearAll = () => {
        setFiles([]);
        setDownloadUrl(null);
        setResultSize(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleProcess = async () => {
        if (files.length === 0) return;

        setIsProcessing(true);
        setDownloadUrl(null);
        setResultSize(null);

        // No UI logs necessary anymore
        const onLog = (log: string) => {
            console.log('[Worker]', log);
        };

        const rawFiles = files.map(f => f.file);

        try {
            let result;

            // Artificial delay for better UX (progress bar visibility)
            await new Promise(r => setTimeout(r, 500));

            if (activeTab === 'compress') {
                result = await compressPDF(rawFiles[0], { quality: compressionQuality }, onLog);
                setDownloadName(rawFiles[0].name.replace('.pdf', '-min.pdf'));
            } else if (activeTab === 'merge') {
                result = await mergePDFs(rawFiles, onLog);
                setDownloadName('merged-document.pdf');
            } else if (activeTab === 'split') {
                result = await splitPDF(rawFiles[0], { startPage: splitRange.start, endPage: splitRange.end }, onLog);
                setDownloadName(rawFiles[0].name.replace('.pdf', `-split-${splitRange.start}-${splitRange.end}.pdf`));
            }

            if (result) {
                setDownloadUrl(URL.createObjectURL(result.blob));
                setResultSize(result.outputSize);
                toast.success(`Operation Complete! Size: ${(result.outputSize / 1024 / 1024).toFixed(2)} MB`);
            }

        } catch (err: any) {
            console.error(err);
            toast.error('Operation Failed: ' + err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <Navbar />
            <Shell>
                <BackgroundBeams />

                <div className="flex flex-col items-center justify-center space-y-8 relative z-10 w-full max-w-4xl mx-auto pt-32 pb-20">

                    {/* Header Section */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                            Webper PDF
                        </h1>
                        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                            Professional-grade PDF management running entirely in your browser. You can Compress, Merge, and Split PDF files with zero data transfer.
                        </p>
                    </div>

                    {/* Main Dashboard Card */}
                    <div className="w-full bg-zinc-900/50 border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden shadow-2xl">

                        {/* Tab Navigation */}
                        <div className="grid grid-cols-3 border-b border-white/10">
                            <button
                                onClick={() => handleTabChange('compress')}
                                className={cn(
                                    "flex items-center justify-center gap-2 py-4 text-sm font-medium transition-all duration-200",
                                    activeTab === 'compress'
                                        ? "bg-white/10 text-white border-b-2 border-blue-500"
                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Settings className="w-4 h-4" /> Compress
                            </button>
                            <button
                                onClick={() => handleTabChange('merge')}
                                className={cn(
                                    "flex items-center justify-center gap-2 py-4 text-sm font-medium transition-all duration-200",
                                    activeTab === 'merge'
                                        ? "bg-white/10 text-white border-b-2 border-blue-500"
                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Layers className="w-4 h-4" /> Merge
                            </button>
                            <button
                                onClick={() => handleTabChange('split')}
                                className={cn(
                                    "flex items-center justify-center gap-2 py-4 text-sm font-medium transition-all duration-200",
                                    activeTab === 'split'
                                        ? "bg-white/10 text-white border-b-2 border-blue-500"
                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Scissors className="w-4 h-4" /> Split
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="p-6 md:p-8 space-y-8">

                            {/* File Selection */}
                            <div
                                className={cn(
                                    "relative border-2 border-dashed rounded-2xl transition-all duration-200 text-center p-12 group cursor-pointer",
                                    files.length === 0
                                        ? "border-zinc-700 hover:border-blue-500/50 hover:bg-blue-500/5"
                                        : "border-zinc-700 bg-zinc-800/50"
                                )}
                            >
                                {files.length === 0 ? (
                                    <div onClick={() => fileInputRef.current?.click()}>
                                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.5)] transition-all duration-300">
                                            <Upload className="w-8 h-8 text-black" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            Click to select, drag & drop, or paste PDF{activeTab === 'merge' ? 's' : ''}
                                        </h3>
                                        <p className="text-zinc-400 text-sm">
                                            {activeTab === 'merge' ? 'Select multiple files to combine' : 'Select a single file'}
                                        </p>
                                        <div className="mt-4 inline-block px-3 md:px-4 py-1.5 md:py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] md:text-xs text-blue-300 font-medium uppercase tracking-wider shadow-[0_0_10px_-4px_rgba(59,130,246,0.5)] leading-relaxed">
                                            <span className="hidden md:inline">Tip: You can use Ctrl+V to paste files</span>
                                            <span className="md:hidden">Tip: Paste files with long press</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-sm font-medium text-zinc-400">
                                                {isProcessing ? 'Processing files...' : (downloadUrl ? 'PDF Ready to Download' : `${files.length} File(s) Selected`)}
                                            </h3>
                                            {!isProcessing && !downloadUrl && activeTab === 'merge' && files.length > 1 && (
                                                <span className="text-xs text-zinc-500 animate-pulse">Drag items to reorder</span>
                                            )}
                                            {!isProcessing && !downloadUrl && (
                                                <button onClick={clearAll} className="text-xs text-red-400 hover:text-red-300 transition-colors">Clear All</button>
                                            )}
                                        </div>

                                        <Reorder.Group
                                            axis="y"
                                            values={files}
                                            onReorder={setFiles}
                                            className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar"
                                        >
                                            {files.map((userFile, idx) => (
                                                <Reorder.Item
                                                    key={userFile.id}
                                                    value={userFile}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={cn(
                                                        "relative overflow-hidden flex items-center justify-between p-3 rounded-xl border transition-colors group/file cursor-grab active:cursor-grabbing",
                                                        downloadUrl
                                                            ? "bg-green-500/10 border-green-500/30"
                                                            : "bg-zinc-800 border-white/5 hover:border-white/10"
                                                    )}
                                                >
                                                    {/* Progress Bar Background */}
                                                    {isProcessing && (
                                                        <motion.div
                                                            className="absolute inset-0 bg-blue-500/10 z-0"
                                                            initial={{ width: "0%" }}
                                                            animate={{ width: "100%" }}
                                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                        />
                                                    )}
                                                    {/* Progress Stripe */}
                                                    {isProcessing && (
                                                        <div className="absolute bottom-0 left-0 h-1 bg-blue-500 w-full animate-progress-indeterminate z-10" />
                                                    )}

                                                    <div className="flex items-center gap-3 overflow-hidden z-10 relative">
                                                        {/* ORDER BADGE (Merge Only) */}
                                                        {activeTab === 'merge' && !downloadUrl && (
                                                            <div className="flex items-center justify-center w-6 h-8 text-xs font-bold text-zinc-500 select-none cursor-grab hover:text-white transition-colors">
                                                                <span className="group-hover/file:hidden">#{idx + 1}</span>
                                                                <GripVertical className="w-4 h-4 hidden group-hover/file:block text-zinc-400 group-hover/file:text-white" />
                                                            </div>
                                                        )}

                                                        <div className={cn(
                                                            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                                                            downloadUrl ? "bg-green-500/20" : "bg-zinc-700"
                                                        )}>
                                                            {isProcessing ? (
                                                                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                                                            ) : downloadUrl ? (
                                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                                            ) : (
                                                                <FileText className="w-4 h-4 text-zinc-400" />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col items-start min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className={cn("text-sm truncate max-w-[150px] md:max-w-xs", downloadUrl ? "text-green-100" : "text-zinc-200")}>
                                                                    {userFile.file.name}
                                                                </span>
                                                                {downloadUrl && (
                                                                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30">
                                                                        {activeTab === 'compress' ? 'Compressed' : 'Success'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                                                <span>{(userFile.file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                                {downloadUrl && resultSize && activeTab === 'compress' && (
                                                                    <>
                                                                        <ArrowRight className="w-3 h-3 text-zinc-600" />
                                                                        <span className="text-green-400 font-medium">{(resultSize / 1024 / 1024).toFixed(2)} MB</span>
                                                                        <span className="text-zinc-600 ml-1">
                                                                            ({Math.round((1 - resultSize / userFile.file.size) * 100)}% saved)
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {!isProcessing && !downloadUrl && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); removeFile(userFile.id); }}
                                                            className="p-2 hover:bg-zinc-700 rounded-lg transition-colors text-zinc-500 hover:text-white z-10 relative"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </Reorder.Item>
                                            ))}
                                        </Reorder.Group>

                                        {!isProcessing && !downloadUrl && activeTab === 'merge' && (
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="text-sm text-blue-400 font-medium hover:text-blue-300 transition-colors mt-2"
                                            >
                                                + Add more files
                                            </button>
                                        )}
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf"
                                    multiple={activeTab === 'merge'}
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>

                            {/* Controls Section */}
                            <AnimatePresence>
                                {files.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-8 relative z-20"
                                    >
                                        <div className="h-px w-full bg-white/10" />

                                        {/* COMPRESS CONTROLS */}
                                        {activeTab === 'compress' && !isProcessing && !downloadUrl && (
                                            <div className="space-y-4">
                                                <label className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Compression Quality</label>
                                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                                    {(Object.keys(QUALITY_PRESETS) as PDFQuality[]).map((q) => (
                                                        <button
                                                            key={q}
                                                            onClick={() => setCompressionQuality(q)}
                                                            className={cn(
                                                                "p-4 rounded-xl border text-left transition-all duration-200 relative overflow-hidden group",
                                                                compressionQuality === q
                                                                    ? "border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/50"
                                                                    : "border-white/5 bg-zinc-800/50 hover:bg-zinc-800 hover:border-white/10"
                                                            )}
                                                        >
                                                            <div className={cn(
                                                                "font-semibold text-sm capitalize mb-1",
                                                                compressionQuality === q ? "text-blue-400" : "text-zinc-200"
                                                            )}>
                                                                {QUALITY_PRESETS[q].label}
                                                            </div>
                                                            <div className="text-xs text-zinc-500 leading-tight">
                                                                {QUALITY_PRESETS[q].description}
                                                            </div>
                                                            {compressionQuality === q && (
                                                                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* SPLIT CONTROLS */}
                                        {activeTab === 'split' && !isProcessing && !downloadUrl && (
                                            <div className="space-y-4">
                                                <label className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Page Range</label>
                                                <div className="flex items-center gap-4 bg-zinc-800/50 p-4 rounded-xl border border-white/5">
                                                    <div className="flex-1">
                                                        <span className="text-xs text-zinc-500 block mb-2">Start Page</span>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={splitRange.start}
                                                            onChange={(e) => setSplitRange(p => ({ ...p, start: parseInt(e.target.value) || 1 }))}
                                                            className="w-full bg-black/50 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                                        />
                                                    </div>
                                                    <div className="text-zinc-600 font-mono mt-6">→</div>
                                                    <div className="flex-1">
                                                        <span className="text-xs text-zinc-500 block mb-2">End Page</span>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={splitRange.end}
                                                            onChange={(e) => setSplitRange(p => ({ ...p, end: parseInt(e.target.value) || 1 }))}
                                                            className="w-full bg-black/50 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* ACTION BAR */}
                                        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4">

                                            {downloadUrl ? (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full sm:w-auto h-12 px-8 rounded-full font-bold border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white gap-2"
                                                        onClick={clearAll}
                                                    >
                                                        Start New
                                                    </Button>
                                                    <Button
                                                        className="w-full sm:w-auto h-12 px-8 bg-white text-black hover:bg-zinc-200 rounded-full font-bold shadow-lg shadow-white/10 gap-2"
                                                        onClick={() => {
                                                            const a = document.createElement('a');
                                                            a.href = downloadUrl;
                                                            a.download = downloadName;
                                                            a.click();
                                                        }}
                                                    >
                                                        <Download className="w-5 h-5" /> Download Result
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button
                                                    onClick={handleProcess}
                                                    disabled={isProcessing}
                                                    className={cn(
                                                        "w-full sm:w-auto h-12 px-8 rounded-full font-bold shadow-lg gap-2 transition-all",
                                                        isProcessing
                                                            ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                                                            : "bg-white text-black hover:bg-zinc-200 shadow-white/10"
                                                    )}
                                                >
                                                    {isProcessing ? (
                                                        <>
                                                            <Loader2 className="w-5 h-4 animate-spin" />
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        <>Start {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</>
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </div>
                    </div>

                </div>
                <Footer />
            </Shell>

            {/* CONFIRMATION DIALOG */}
            <AnimatePresence>
                {showConfirmDialog && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                            onClick={cancelTabChange}
                        />
                        <div className="fixed inset-0 flex items-center justify-center z-[70] pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="bg-zinc-900 border border-white/10 p-6 rounded-2xl shadow-2xl w-full max-w-sm pointer-events-auto"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Discard Changes?</h3>
                                        <p className="text-sm text-zinc-400">Switching modes will clear your current files and progress.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 mt-6">
                                    <button
                                        onClick={cancelTabChange}
                                        className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmTabChange}
                                        className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-white text-black hover:bg-zinc-200 transition-colors"
                                    >
                                        Yes, Switch
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
