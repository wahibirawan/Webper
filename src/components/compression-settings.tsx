import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export interface SettingsState {
    quality: number;
    maxWidth: number;
    maxHeight: number;
    stripMetadata: boolean;
}

interface CompressionSettingsProps {
    settings: SettingsState;
    onSettingsChange: (settings: SettingsState) => void;
}

export function CompressionSettings({ settings, onSettingsChange }: CompressionSettingsProps) {
    const handleChange = (key: keyof SettingsState, value: any) => {
        onSettingsChange({ ...settings, [key]: value });
    };

    return (
        <div className="space-y-6">
            {/* Quality */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-bold uppercase tracking-widest">Quality</Label>
                    <span className="text-sm font-mono bg-black text-white px-2 py-0.5">
                        {settings.quality}%
                    </span>
                </div>
                <Slider
                    value={[settings.quality]}
                    onValueChange={(vals) => handleChange('quality', vals[0])}
                    min={1}
                    max={100}
                    step={1}
                    className="py-2"
                />
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest">Max Width</Label>
                    <Input
                        type="number"
                        placeholder="Auto"
                        value={settings.maxWidth || ''}
                        onChange={(e) => handleChange('maxWidth', Number(e.target.value))}
                        className="font-mono border-2 border-black pixel-shadow-sm focus-visible:ring-0 focus-visible:border-primary rounded-none h-10 !bg-white"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest">Max Height</Label>
                    <Input
                        type="number"
                        placeholder="Auto"
                        value={settings.maxHeight || ''}
                        onChange={(e) => handleChange('maxHeight', Number(e.target.value))}
                        className="font-mono border-2 border-black pixel-shadow-sm focus-visible:ring-0 focus-visible:border-primary rounded-none h-10 !bg-white"
                    />
                </div>
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between border-2 border-black p-3 bg-white pixel-shadow-sm">
                <Label htmlFor="strip-metadata" className="text-xs font-bold uppercase tracking-widest cursor-pointer">
                    Strip Metadata
                </Label>
                <Switch
                    id="strip-metadata"
                    checked={settings.stripMetadata}
                    onCheckedChange={(checked) => handleChange('stripMetadata', checked)}
                />
            </div>
        </div>
    );
}
