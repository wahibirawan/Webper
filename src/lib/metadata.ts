
/**
 * Simple utility to check for common metadata markers in image files.
 * This is a lightweight check and not a full EXIF parser.
 */
export async function detectMetadata(file: File): Promise<string[]> {
    const found: string[] = [];
    const buffer = await file.arrayBuffer();
    const view = new DataView(buffer);

    // Common strings to look for in binary data (simple heuristic)
    // In a real production app, use a proper parser like 'exif-reader' or 'piexifjs'
    const markers = [
        { key: 'GPS', label: 'GPS Location' },
        { key: 'Exif', label: 'Camera Settings' },
        { key: 'Make', label: 'Device Info' },
        { key: 'Model', label: 'Device Model' },
        { key: 'Software', label: 'Editing Software' },
        { key: 'Adobe', label: 'Adobe Metadata' }
    ];

    // Read first 50KB to check headers (EXIF usually at start)
    const headerSize = Math.min(buffer.byteLength, 50 * 1024);
    const headerBytes = new Uint8Array(buffer.slice(0, headerSize));
    const headerString = Array.from(headerBytes).map(b => String.fromCharCode(b)).join('');

    markers.forEach(marker => {
        if (headerString.includes(marker.key)) {
            // Avoid duplicates/overlap
            if (!found.includes(marker.label)) {
                found.push(marker.label);
            }
        }
    });

    // Special check for JPEG APP1 marker (Exif)
    if (file.type === 'image/jpeg') {
        if (view.byteLength > 4 && view.getUint16(0) === 0xFFD8) {
            // Scan for APP1 (0xFFE1)
            for (let i = 2; i < headerSize - 1; i++) {
                if (view.getUint16(i) === 0xFFE1) {
                    if (!found.includes('EXIF Data')) found.push('EXIF Data');
                    break;
                }
            }
        }
    }

    return found;
}
