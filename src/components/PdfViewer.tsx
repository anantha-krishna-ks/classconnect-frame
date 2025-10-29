import React, { useCallback, useMemo, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Loader2, Download, Printer } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure the worker from a CDN to avoid bundler issues in preview sandboxes
pdfjs.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

interface PdfViewerProps {
  url: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);

  const onDocumentLoadSuccess = useCallback((pdf: { numPages: number }) => {
    setNumPages(pdf.numPages);
    setPageNumber(1);
  }, []);

  const canPrev = pageNumber > 1;
  const canNext = pageNumber < numPages;
  const pages = useMemo(() => Array.from({ length: numPages }, (_, i) => i + 1), [numPages]);

  const zoomIn = () => setScale((s) => Math.min(2.5, parseFloat((s + 0.1).toFixed(2))));
  const zoomOut = () => setScale((s) => Math.max(0.6, parseFloat((s - 0.1).toFixed(2))));

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = url;
    a.download = url.split('/').pop() || 'document.pdf';
    a.target = '_blank';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    const w = window.open(url, '_blank');
    // Some browsers need a delay before print
    setTimeout(() => w?.print(), 600);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Top toolbar */}
      <div className="flex items-center gap-2 p-2 border-b bg-background/80">
        <Button variant="outline" size="icon" onClick={zoomOut} aria-label="Zoom out">
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={zoomIn} aria-label="Zoom in">
          <ZoomIn className="w-4 h-4" />
        </Button>
        <div className="mx-3 text-sm text-muted-foreground">
          Page {pageNumber} / {numPages || '—'} • {Math.round(scale * 100)}%
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setPageNumber((p) => Math.max(1, p - 1))} disabled={!canPrev} aria-label="Previous page">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))} disabled={!canNext} aria-label="Next page">
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleDownload} aria-label="Download PDF">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handlePrint} aria-label="Print PDF">
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 flex bg-muted/40">
        {/* Thumbnails sidebar */}
        <div className="w-40 border-r overflow-auto bg-background">
          <Document file={url} onLoadSuccess={onDocumentLoadSuccess} loading={null} error={null}>
            <div className="p-2 space-y-2">
              {pages.map((p) => (
                <button
                  key={p}
                  onClick={() => setPageNumber(p)}
                  className={`block w-full rounded border ${p === pageNumber ? 'border-primary ring-1 ring-primary' : 'border-muted'} overflow-hidden`}
                >
                  <Page
                    pageNumber={p}
                    width={136}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="bg-white"
                  />
                </button>
              ))}
            </div>
          </Document>
        </div>

        {/* Main page */}
        <div className="flex-1 overflow-auto">
          <div className="flex justify-center py-6">
            <Document
              file={url}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading PDF…
                </div>
              }
              error={<div className="text-sm text-destructive">Failed to load PDF. Please try again.</div>}
            >
              <Page pageNumber={pageNumber} scale={scale} renderAnnotationLayer renderTextLayer />
            </Document>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
