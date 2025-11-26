import React from 'react';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

export function Footer() {
    return (
        <footer className="w-full py-8 mt-12 border-t-4 border-black bg-white">
            <div className="container mx-auto px-4 flex flex-col items-center text-center gap-6">
                <div className="space-y-2">
                    <h3 className="font-bold text-xl tracking-tight uppercase font-pixel">Webper</h3>
                    <p className="text-lg text-muted-foreground">
                        &copy; {new Date().getFullYear()} Webper. All rights reserved.
                    </p>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <p className="text-sm text-muted-foreground max-w-md">
                        This project is open source. We believe in privacy and transparency.
                        You can inspect the source code on GitHub.
                    </p>
                    <Button size="sm" className="gap-2 bg-black text-white hover:bg-black/80 border-2 border-black" asChild>
                        <a href="https://github.com/wahibirawan/Webper" target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4" />
                            View on GitHub
                        </a>
                    </Button>
                </div>
            </div>
        </footer>
    );
}
