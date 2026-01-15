import { Check, Palette, X } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

const ColorPicker = ({ selectedColor, onChange }) => {
    const colors = [
        { name: 'Blue', value: '#3B82F6' },
        { name: 'Indigo', value: '#6366f1' },
        { name: 'Purple', value: '#8b5cf6' },
        { name: 'Green', value: '#10b981' },
        { name: 'Red', value: '#ef4444' },
        { name: 'Orange', value: '#f97316' },
        { name: 'Teal', value: '#14b8a6' },
        { name: 'Pink', value: '#ec4899' },
        { name: 'Gray', value: '#6b7280' },
        { name: 'Black', value: '#1f2937' },
    ];

    const [isOpen, setIsOpen] = useState(false);
    const [selectedColorName, setSelectedColorName] = useState('Purple');
    const pickerRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Find selected color name
    useEffect(() => {
        const selected = colors.find(color => color.value === selectedColor);
        if (selected) setSelectedColorName(selected.name);
    }, [selectedColor]);

    const handleColorSelect = (color) => {
        onChange(color.value);
        setIsOpen(false);
    };

    const handleClose = (e) => {
        e.stopPropagation();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={pickerRef}>
            {/* Enhanced Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 bg-gradient-to-br from-white to-gray-50 border border-gray-200 text-gray-800 hover:bg-gray-50"
                aria-label="Select accent color"
                aria-expanded={isOpen}
                aria-haspopup="dialog"
            >
                <div className="flex items-center gap-2">
                    <Palette size={18} className="text-purple-600" />
                    <span className="max-sm:hidden font-medium">Accent Color</span>
                    <div className="flex items-center gap-2 ml-1">
                        <div
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: selectedColor }}
                        />
                        <span className="text-sm text-gray-600 max-sm:hidden">
                            {selectedColorName}
                        </span>
                    </div>
                </div>
                <div className="ml-2 text-gray-400">
                    {isOpen ? (
                        <X size={16} />
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    )}
                </div>
            </button>

            {/* Enhanced Dropdown */}
            {isOpen && (
                <div
                    className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl border border-gray-200 shadow-lg p-4 min-w-72 animate-in fade-in slide-in-from-top-2 duration-200"
                    role="dialog"
                    aria-label="Color picker"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Palette size={18} className="text-purple-600" />
                            <h3 className="text-sm font-semibold text-gray-900">Select Accent Color</h3>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                            aria-label="Close color picker"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Current Selection Preview */}
                    <div className="mb-4 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                                    style={{ backgroundColor: selectedColor }}
                                />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{selectedColorName}</p>
                                    <p className="text-xs text-gray-500">{selectedColor}</p>
                                </div>
                            </div>
                            <Check size={18} className="text-green-500" />
                        </div>
                    </div>

                    {/* Color Grid */}
                    <div className="grid grid-cols-5 gap-3">
                        {colors.map((color) => {
                            const isSelected = selectedColor === color.value;
                            return (
                                <button
                                    key={color.value}
                                    onClick={() => handleColorSelect(color)}
                                    className={`relative group flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                                        isSelected
                                            ? 'bg-gradient-to-br from-gray-50 to-white ring-2 ring-purple-500 ring-offset-2'
                                            : 'hover:bg-gray-50'
                                    }`}
                                    aria-label={`Select ${color.name} color`}
                                    aria-current={isSelected ? 'true' : 'false'}
                                >
                                    {/* Color Circle */}
                                    <div className="relative">
                                        <div
                                            className={`w-10 h-10 rounded-full border-2 transition-transform duration-200 group-hover:scale-110 ${
                                                isSelected ? 'border-white shadow-lg' : 'border-gray-100 group-hover:border-gray-300'
                                            }`}
                                            style={{ backgroundColor: color.value }}
                                        >
                                            {isSelected && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Check size={18} className="text-white drop-shadow-md" />
                                                </div>
                                            )}
                                        </div>
                                        {isSelected && (
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-500 rounded-full border-2 border-white" />
                                        )}
                                    </div>

                                    {/* Color Label */}
                                    <span
                                        className={`text-xs mt-2 font-medium transition-colors ${
                                            isSelected ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'
                                        }`}
                                    >
                                        {color.name}
                                    </span>

                                    {/* Tooltip on Hover */}
                                    <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                        {color.value}
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Click to select color</span>
                            <span>5x2 grid</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}
        </div>
    );
};

export default ColorPicker;