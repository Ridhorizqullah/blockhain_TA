import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

export const BookReader = ({ isOpen, onClose, pdfUrl, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
                    <h3 className="font-heading font-bold text-lg text-gray-800 truncate pr-4">
                        Reading: {title}
                    </h3>
                    <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100 rounded-full p-2">
                        <X size={20} />
                    </Button>
                </div>

                {/* PDF Viewer */}
                <div className="flex-1 bg-gray-50 relative">
                    {pdfUrl ? (
                        <iframe
                            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                            className="w-full h-full border-none"
                            title={`Reading ${title}`}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <p>PDF source not available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
