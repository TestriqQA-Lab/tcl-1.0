"use client";

import React from 'react';

interface RangeSliderProps {
    label: string;
    min: number;
    max: number;
    step?: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
    formatValue?: (value: number) => string;
    required?: boolean;
    className?: string;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
    label,
    min,
    max,
    step = 1,
    value,
    onChange,
    formatValue = (v) => v.toString(),
    required = false,
    className = '',
}) => {
    const [minValue, maxValue] = value;

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMin = Math.min(Number(e.target.value), maxValue - step);
        onChange([newMin, maxValue]);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMax = Math.max(Number(e.target.value), minValue + step);
        onChange([minValue, newMax]);
    };

    const minPercent = ((minValue - min) / (max - min)) * 100;
    const maxPercent = ((maxValue - min) / (max - min)) * 100;

    return (
        <div className={`w-full ${className}`}>
            <label className="block text-sm font-semibold mb-1.5 text-slate-700">
                {label}
                {required && <span className="text-primary ml-1">*</span>}
            </label>

            <div className="px-2 py-4">
                {/* Value Display */}
                <div className="flex justify-between items-center mb-6">
                    <div className="text-center">
                        <p className="text-xs text-slate-500 mb-1">Min</p>
                        <p className="text-lg font-bold text-primary">{formatValue(minValue)}</p>
                    </div>
                    <div className="text-slate-400">—</div>
                    <div className="text-center">
                        <p className="text-xs text-slate-500 mb-1">Max</p>
                        <p className="text-lg font-bold text-primary">{formatValue(maxValue)}</p>
                    </div>
                </div>

                {/* Slider Track */}
                <div className="relative h-2">
                    {/* Background Track */}
                    <div className="absolute w-full h-2 bg-slate-200 rounded-full"></div>

                    {/* Active Track */}
                    <div
                        className="absolute h-2 bg-primary rounded-full"
                        style={{
                            left: `${minPercent}%`,
                            right: `${100 - maxPercent}%`,
                        }}
                    ></div>

                    {/* Min Thumb */}
                    <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={minValue}
                        onChange={handleMinChange}
                        className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white 
              [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary 
              [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto
              [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-110
              [&::-webkit-slider-thumb]:transition-transform
              [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full 
              [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 
              [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:cursor-pointer
              [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:shadow-md"
                        style={{ zIndex: minValue > max - (max - min) / 4 ? 5 : 3 }}
                    />

                    {/* Max Thumb */}
                    <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={maxValue}
                        onChange={handleMaxChange}
                        className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white 
              [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary 
              [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto
              [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-110
              [&::-webkit-slider-thumb]:transition-transform
              [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full 
              [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 
              [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:cursor-pointer
              [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:shadow-md"
                        style={{ zIndex: 4 }}
                    />
                </div>

                {/* Min/Max Labels */}
                <div className="flex justify-between mt-2">
                    <span className="text-xs text-slate-400">{formatValue(min)}</span>
                    <span className="text-xs text-slate-400">{formatValue(max)}</span>
                </div>
            </div>
        </div>
    );
};
