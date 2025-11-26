import React from 'react';

export function Announcement() {
    return (
        <div className="flex justify-center mb-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-border/40 bg-secondary/30 text-[10px] sm:text-xs font-medium text-muted-foreground backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse" />
                Webper works 100% locally. Your files never leave your device.
            </div>
        </div>
    );
}
