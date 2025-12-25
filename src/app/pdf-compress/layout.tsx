import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "PDF Tools - Compress, Merge, Split PDF Online | Webper",
    description: "Free professional PDF tools. Compress PDF file size, merge multiple PDFs into one, or split PDF pages securely in your browser. No upload, 100% private.",
    alternates: {
        canonical: '/pdf-compress',
    },
    openGraph: {
        title: "PDF Tools - Compress, Merge, Split PDF Online | Webper",
        description: "Professional-grade PDF management running entirely in your browser. Compress, Merge, and Split PDF files with zero data transfer.",
        url: "https://webper.app/pdf-compress",
    }
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
