'use client';

import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { compressPDF, mergePDFs, splitPDF, QUALITY_PRESETS, PDFQuality } from '@/lib/pdf-tools';
import { Upload, FileText, Download, X, Layers, Scissors, Settings, CheckCircle, Loader2, ArrowRight, GripVertical, AlertCircle, Clipboard, Plus } from 'lucide-react';

import { Shell } from '@/components/shell';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Dropzone } from '@/components/dropzone';
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
            if (activeTab === 'compress' && files.length > 0) return;
            if (activeTab === 'split' && files.length > 0) return;

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
                        setFiles(newFiles.slice(0, 1));
                    }

                    setDownloadUrl(null);
                    setResultSize(null);
                    toast.success('File pasted from clipboard!');
                }
            }
        };

        document.addEventListener('paste', handlePaste);
        return () => document.removeEventListener('paste', handlePaste);
    }, [activeTab, files, downloadUrl]);

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

    const handleFilesDrop = async (acceptedFiles: File[]) => {
        if (activeTab !== 'merge' && files.length > 0 && activeTab !== 'split') {
            // Usually single file mode replaces? Or blocks? 
            // Current input handler replaces. So I will replace.
        }

        const validFiles = acceptedFiles.filter(f => f.type === 'application/pdf');
        if (validFiles.length === 0) {
            toast.error('Please upload PDF files only');
            return;
        }

        const newFiles = validFiles.map(f => ({
            id: Math.random().toString(36).substring(7) + Date.now(),
            file: f
        }));

        if (activeTab === 'merge') {
            setFiles(prev => [...prev, ...newFiles]);
        } else {
            // For compress/split, replace with new file
            setFiles(newFiles.slice(0, 1));
        }
        setDownloadUrl(null);
        setResultSize(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files).map(f => ({
                id: Math.random().toString(36).substring(7) + Date.now(),
                file: f
            }));

            if (activeTab === 'merge') {
                setFiles(prev => [...prev, ...newFiles]);
            } else {
                setFiles(newFiles.slice(0, 1));
            }
            setDownloadUrl(null);
            setResultSize(null);
        }
    };

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
        if (files.length <= 1) {
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

        const onLog = (log: string) => {
            console.log('[Worker]', log);
        };

        const rawFiles = files.map(f => f.file);

        try {
            let result;

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
            <div className="min-h-[100dvh] flex flex-col bg-gray-50">
                <Navbar />
                <main className="flex-1 pb-20 md:pb-32">
                    <div className="flex flex-col items-center justify-center space-y-8 relative z-10 w-full max-w-4xl mx-auto pt-32 pb-12 md:pt-40 md:pb-20 px-4">

                        {/* Header Section */}
                        <div className="text-center space-y-4">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-gray-900">
                                PDF Tools
                            </h1>
                            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                                Professional-grade PDF management running entirely in your browser. Compress, Merge, and Split PDF files with zero data transfer.
                            </p>
                        </div>

                        {/* Unified Card Container */}
                        <div className="bg-white rounded-3xl shadow-xs border border-gray-200 overflow-hidden w-full max-w-4xl mx-auto">

                            {/* Card Header: Tabs */}
                            <div className="bg-gray-50/80 border-b border-gray-200">
                                <div className="grid grid-cols-3 w-full">
                                    <button
                                        onClick={() => handleTabChange('compress')}
                                        className={cn(
                                            "flex items-center justify-center gap-2 py-5 text-sm font-medium transition-all duration-200 relative",
                                            activeTab === 'compress'
                                                ? "text-blue-600 bg-white shadow-[0_-1px_0_0_#fff_inset] before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-blue-600"
                                                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
                                        )}
                                    >
                                        <Settings className="w-4 h-4" /> Compress
                                    </button>
                                    <button
                                        onClick={() => handleTabChange('merge')}
                                        className={cn(
                                            "flex items-center justify-center gap-2 py-5 text-sm font-medium transition-all duration-200 relative",
                                            activeTab === 'merge'
                                                ? "text-blue-600 bg-white shadow-[0_-1px_0_0_#fff_inset] before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-blue-600"
                                                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
                                        )}
                                    >
                                        <Layers className="w-4 h-4" /> Merge
                                    </button>
                                    <button
                                        onClick={() => handleTabChange('split')}
                                        className={cn(
                                            "flex items-center justify-center gap-2 py-5 text-sm font-medium transition-all duration-200 relative",
                                            activeTab === 'split'
                                                ? "text-blue-600 bg-white shadow-[0_-1px_0_0_#fff_inset] before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-blue-600"
                                                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
                                        )}
                                    >
                                        <Scissors className="w-4 h-4" /> Split
                                    </button>
                                </div>
                            </div>

                            {/* Card Body: Dropzone & Content */}
                            <div className="p-6 md:p-8 space-y-8">
                                <Dropzone
                                    onFilesDrop={handleFilesDrop}
                                    accept={{ 'application/pdf': ['.pdf'] }}
                                    className={cn(
                                        "relative border-2 border-dashed rounded-2xl transition-all duration-200 text-center group cursor-pointer w-full flex flex-col",
                                        files.length === 0
                                            ? "items-center justify-center border-gray-200 bg-gray-50/50 hover:border-blue-400 hover:bg-blue-50/30 !p-12 md:!p-20"
                                            : "items-stretch justify-start border-gray-200 bg-white hover:border-blue-300 py-12 px-6"
                                    )}
                                >
                                    {files.length === 0 ? (
                                        <div className="text-center py-2 md:py-6">
                                            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto mb-5 group-hover:scale-105 transition-all duration-300 shadow-card-premium border border-gray-100">
                                                <Upload className="w-7 h-7 text-gray-900" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">
                                                Click to select, drag & drop, or paste PDF{activeTab === 'merge' ? 's' : ''}
                                            </h3>
                                            <p className="text-gray-500 text-sm mb-4">
                                                {activeTab === 'merge' ? 'Select multiple files to combine' : 'Select a single file'}
                                            </p>
                                            <div className="mt-4 hidden md:inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs text-blue-600 font-medium">
                                                Tip: You can use <kbd className="font-sans font-semibold text-blue-700">Ctrl+V</kbd> to paste files
                                            </div>
                                            <button
                                                type="button"
                                                className="mt-6 md:hidden inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-sm text-gray-900 font-bold btn-tactile hover:bg-gray-50 active:scale-95 transition-all whitespace-nowrap"
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    try {
                                                        const clipboardItems = await navigator.clipboard.read();
                                                        const pdfFiles: File[] = [];
                                                        for (const item of clipboardItems) {
                                                            for (const type of item.types) {
                                                                if (type === 'application/pdf') {
                                                                    const blob = await item.getType(type);
                                                                    const file = new File([blob], 'pasted-file.pdf', { type });
                                                                    pdfFiles.push(file);
                                                                }
                                                            }
                                                        }
                                                        if (pdfFiles.length > 0) {
                                                            handleFilesDrop(pdfFiles);
                                                            toast.success('File pasted from clipboard!');
                                                        } else {
                                                            toast.error('No PDF found in clipboard');
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
                                    ) : (
                                        <>
                                            <div className="space-y-5 text-left cursor-default px-1" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-between mb-3 px-1">
                                                    <h3 className="text-sm font-semibold text-gray-700 tracking-tight">
                                                        {isProcessing ? 'Processing files...' : (downloadUrl ? 'PDF Ready to Download' : `${files.length} File(s) Selected`)}
                                                    </h3>
                                                    {!isProcessing && !downloadUrl && activeTab === 'merge' && files.length > 1 && (
                                                        <span className="text-xs text-gray-400 font-medium animate-pulse">Drag items to reorder</span>
                                                    )}
                                                    {!isProcessing && !downloadUrl && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); clearAll(); }}
                                                            className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider py-1 px-2 hover:bg-red-50 rounded-md"
                                                        >
                                                            Clear All
                                                        </button>
                                                    )}
                                                </div>

                                                <Reorder.Group
                                                    axis="y"
                                                    values={files}
                                                    onReorder={setFiles}
                                                    className="space-y-3 w-full"
                                                >
                                                    {files.map((userFile, idx) => (
                                                        <Reorder.Item
                                                            key={userFile.id}
                                                            value={userFile}
                                                            layout
                                                            initial={{ opacity: 0, scale: 0.98 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.98 }}
                                                            whileDrag={{ scale: 1.0, boxShadow: "0 1px 6px rgba(0,0,0,0.02)", zIndex: 50 }}
                                                            dragMomentum={false}
                                                            transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
                                                            className={cn(
                                                                "relative overflow-hidden flex items-center justify-between p-4 md:p-5 rounded-2xl border transition-all duration-200 group/file cursor-grab active:cursor-grabbing",
                                                                downloadUrl
                                                                    ? "bg-green-50/50 border-green-200"
                                                                    : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                                                            )}
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {/* Progress Bar Background */}
                                                            {isProcessing && (
                                                                <motion.div
                                                                    className="absolute inset-0 bg-blue-50 z-0"
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
                                                                    <div className="flex items-center justify-center w-6 h-8 text-xs font-bold text-gray-400 select-none cursor-grab hover:text-gray-600 transition-colors">
                                                                        <span className="group-hover/file:hidden">#{idx + 1}</span>
                                                                        <GripVertical className="w-4 h-4 hidden group-hover/file:block text-gray-400 group-hover/file:text-gray-600" />
                                                                    </div>
                                                                )}

                                                                <div className={cn(
                                                                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                                                                    downloadUrl ? "bg-green-100" : "bg-gray-100"
                                                                )}>
                                                                    {isProcessing ? (
                                                                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                                                                    ) : downloadUrl ? (
                                                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                                                    ) : (
                                                                        <FileText className="w-4 h-4 text-gray-500" />
                                                                    )}
                                                                </div>
                                                                <div className="flex flex-col items-start min-w-0">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className={cn("text-sm truncate max-w-[150px] md:max-w-xs", downloadUrl ? "text-green-900" : "text-gray-900")}>
                                                                            {userFile.file.name}
                                                                        </span>
                                                                        {downloadUrl && (
                                                                            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                                                                                Done
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                                        <span>{(userFile.file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                                        {downloadUrl && resultSize && activeTab === 'compress' && (
                                                                            <>
                                                                                <ArrowRight className="w-3 h-3 text-gray-400" />
                                                                                <span className="text-green-600 font-medium">{(resultSize / 1024 / 1024).toFixed(2)} MB</span>
                                                                                <span className="text-gray-400 ml-1">
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
                                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600 z-10 relative"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </Reorder.Item>
                                                    ))}
                                                </Reorder.Group>

                                                {!isProcessing && !downloadUrl && activeTab === 'merge' && (
                                                    <div className="mt-6 text-center">
                                                        <Dropzone
                                                            accept={{ 'application/pdf': ['.pdf'] }}
                                                            onFilesDrop={async (newFiles) => {
                                                                const pdfFiles = newFiles.filter(f => f.type === 'application/pdf');
                                                                if (pdfFiles.length > 0) {
                                                                    const newItems = pdfFiles.map(f => ({
                                                                        id: Math.random().toString(36).substring(7) + Date.now(),
                                                                        file: f
                                                                    }));
                                                                    setFiles(prev => [...prev, ...newItems]);
                                                                    setDownloadUrl(null);
                                                                    setResultSize(null);
                                                                } else {
                                                                    toast.error('Only PDF files are allowed');
                                                                }
                                                            }}
                                                            className="inline-block border-0 p-0 bg-transparent hover:bg-transparent w-full"
                                                        >
                                                            <div
                                                                className="w-full py-4 border-2 border-dashed border-blue-200 rounded-2xl bg-blue-50/30 hover:bg-blue-50 hover:border-blue-400 text-blue-600 font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 group/add active:scale-[0.99]"
                                                                role="button"
                                                                tabIndex={0}
                                                            >
                                                                <div className="bg-white rounded-full p-1.5 shadow-sm border border-blue-100 group-hover/add:scale-110 transition-transform">
                                                                    <Plus className="w-4 h-4 text-blue-600" />
                                                                </div>
                                                                Add more files
                                                            </div>
                                                        </Dropzone>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </Dropzone>
                            </div>
                        </div>     {/* Controls Section */}
                        <AnimatePresence>
                            {files.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-8 relative z-20"
                                >
                                    <div className="h-px w-full bg-gray-200" />

                                    {/* COMPRESS CONTROLS */}
                                    {activeTab === 'compress' && !isProcessing && !downloadUrl && (
                                        <div className="space-y-4">
                                            <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Compression Quality</label>
                                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                                {(Object.keys(QUALITY_PRESETS) as PDFQuality[]).map((q) => (
                                                    <button
                                                        key={q}
                                                        onClick={() => setCompressionQuality(q)}
                                                        className={cn(
                                                            "p-4 rounded-xl border text-left transition-all duration-200 relative overflow-hidden group",
                                                            compressionQuality === q
                                                                ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500/50"
                                                                : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "font-semibold text-sm capitalize mb-1",
                                                            compressionQuality === q ? "text-blue-600" : "text-gray-900"
                                                        )}>
                                                            {QUALITY_PRESETS[q].label}
                                                        </div>
                                                        <div className="text-xs text-gray-500 leading-tight">
                                                            {QUALITY_PRESETS[q].description}
                                                        </div>
                                                        {compressionQuality === q && (
                                                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* SPLIT CONTROLS */}
                                    {activeTab === 'split' && !isProcessing && !downloadUrl && (
                                        <div className="space-y-4">
                                            <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Page Range</label>
                                            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                                <div className="flex-1">
                                                    <span className="text-xs text-gray-500 block mb-2">Start Page</span>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={splitRange.start}
                                                        onChange={(e) => setSplitRange(p => ({ ...p, start: parseInt(e.target.value) || 1 }))}
                                                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                                                    />
                                                </div>
                                                <div className="text-gray-400 font-mono mt-6">→</div>
                                                <div className="flex-1">
                                                    <span className="text-xs text-gray-500 block mb-2">End Page</span>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={splitRange.end}
                                                        onChange={(e) => setSplitRange(p => ({ ...p, end: parseInt(e.target.value) || 1 }))}
                                                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
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
                                                    className="w-full sm:w-auto h-12 px-8 rounded-full font-bold border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 gap-2"
                                                    onClick={clearAll}
                                                >
                                                    Start New
                                                </Button>
                                                <Button
                                                    className="w-full sm:w-auto h-12 px-8 rounded-full font-bold btn-tactile-dark gap-2"
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
                                                    "w-full sm:w-auto h-12 px-8 rounded-full font-bold gap-2 transition-all",
                                                    isProcessing
                                                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                        : "btn-tactile-dark hover:shadow-card-hover"
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
                </main>
                <Footer />
            </div>

            {/* CONFIRMATION DIALOG */}
            <AnimatePresence>
                {
                    showConfirmDialog && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
                                onClick={cancelTabChange}
                            />
                            <div className="fixed inset-0 flex items-center justify-center z-[70] pointer-events-none">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="bg-white border border-gray-200 p-6 rounded-2xl shadow-xl w-full max-w-sm pointer-events-auto"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                            <AlertCircle className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">Discard Changes?</h3>
                                            <p className="text-sm text-gray-500">Switching modes will clear your current files and progress.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 mt-6">
                                        <button
                                            onClick={cancelTabChange}
                                            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={confirmTabChange}
                                            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                                        >
                                            Yes, Switch
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        </>
                    )
                }
            </AnimatePresence >
        </>
    );
}
