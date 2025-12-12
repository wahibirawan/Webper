import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export interface SettingsState {
    quality: number;
    targetSize?: number;
    stripMetadata: boolean;
    keepOriginalFilename: boolean;
    format: 'image/webp' | 'image/png' | 'image/jpeg';
}

interface CompressionSettingsProps {
    settings: SettingsState;
    onSettingsChange: (settings: SettingsState) => void;
}

export function CompressionSettings({ settings, onSettingsChange }: CompressionSettingsProps) {
    const handleQualityChange = (value: number[]) => {
        onSettingsChange({ ...settings, quality: value[0] });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onSettingsChange({ ...settings, [name]: Number(value) });
    };

    const handleSwitchChange = (checked: boolean) => {
        onSettingsChange({ ...settings, stripMetadata: checked });
    };

    const handleFormatChange = (format: SettingsState['format']) => {
        onSettingsChange({ ...settings, format });
    };

    return (
        <Card className="flex flex-col gap-2 bg-transparent border-none shadow-none">
            {/* Format Section */}
            <div className="space-y-3">
                <Label className="text-sm font-medium text-white">Output Format</Label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-900/80 rounded-lg border border-zinc-700">
                    {(['image/webp', 'image/png', 'image/jpeg'] as const).map((fmt) => (
                        <button
                            key={fmt}
                            onClick={() => handleFormatChange(fmt)}
                            className={`
                                py-2 px-3 rounded-md text-xs font-bold transition-all cursor-pointer
                                ${settings.format === fmt
                                    ? 'bg-white text-black shadow-sm'
                                    : 'text-zinc-400 hover:text-white hover:bg-white/10'
                                }
                            `}
                        >
                            {fmt.split('/')[1].toUpperCase().replace('JPEG', 'JPG')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-px bg-white/5 w-full" />

            {/* Quality Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-white">Quality</Label>
                    <span className="text-xs font-mono text-zinc-400 bg-white/5 px-2 py-1 rounded">{settings.quality}%</span>
                </div>
                <Slider
                    value={[settings.quality]}
                    onValueChange={handleQualityChange}
                    max={100}
                    step={1}
                    className="py-2"
                />
            </div>

            <div className="h-px bg-white/5 w-full" />

            {/* Target Size Section */}
            <div className="space-y-3">
                <Label htmlFor="targetSize" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Target File Size (KB)</Label>
                <div className="relative">
                    <Input
                        id="targetSize"
                        name="targetSize"
                        type="number"
                        placeholder="Optional (e.g., 500)"
                        value={settings.targetSize || ''}
                        onChange={handleInputChange}
                        className="font-mono text-sm bg-zinc-900 border-zinc-700 focus:border-white/40 focus:bg-black transition-colors placeholder:text-zinc-600 pl-3 pr-10"
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <span className="text-xs text-zinc-500 font-mono">KB</span>
                    </div>
                </div>
                <p className="text-[10px] text-zinc-500">
                    Auto-adjust quality to meet target. Leaves blank for quality-based.
                </p>
            </div>

            <div className="h-px bg-white/5 w-full" />

            {/* Metadata Section */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <Label className="text-sm font-medium text-white">Strip Metadata</Label>
                    <p className="text-xs text-zinc-500">Remove EXIF data to save space</p>
                </div>
                <Switch
                    checked={settings.stripMetadata}
                    onCheckedChange={handleSwitchChange}
                />
            </div>

            <div className="h-px bg-white/5 w-full" />

            {/* Filename Section */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <Label className="text-sm font-medium text-white">Keep Original Filename</Label>
                    <p className="text-xs text-zinc-500">Preserve name instead of renaming</p>
                </div>
                <Switch
                    checked={settings.keepOriginalFilename}
                    onCheckedChange={(checked) => onSettingsChange({ ...settings, keepOriginalFilename: checked })}
                />
            </div>
        </Card>
    );
}
