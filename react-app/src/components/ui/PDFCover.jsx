import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { BookOpen } from 'lucide-react';

// Configure worker for Vite
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

export const PDFCover = ({ url, className }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const onDocumentLoadSuccess = () => {
        setLoading(false);
    };

    const onDocumentLoadError = (error) => {
        console.error('Error loading PDF cover:', error);
        setError(true);
        setLoading(false);
    };

    if (!url) return (
        <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
            <BookOpen className="text-gray-400" size={32} />
        </div>
    );

    return (
        <div className={`relative overflow-hidden bg-gray-100 flex items-center justify-center ${className}`}>
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-50">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {!error ? (
                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={null}
                    className="flex justify-center w-full h-full"
                >
                    <Page
                        pageNumber={1}
                        width={250}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="shadow-sm object-cover"
                    />
                </Document>
            ) : (
                <div className="flex items-center justify-center h-full w-full">
                    <BookOpen className="text-gray-400" size={32} />
                </div>
            )}
        </div>
    );
};
