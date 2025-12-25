import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Image to Base64 Converter - Optimize & Encode | Webper",
    description: "Convert images (JPG, PNG, WebP) to Base64 strings instantly. Auto-optimize to WebP for smaller size and get ready-to-use HTML embed code.",
    alternates: {
        canonical: '/base64',
    },
    openGraph: {
        title: "Image to Base64 Converter - Optimize & Encode | Webper",
        description: "Convert images to Base64 strings instantly. Optimize images to WebP and get ready-to-use HTML embed code.",
        url: "https://webper.app/base64",
    }
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
