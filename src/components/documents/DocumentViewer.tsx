import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  X, 
  Printer, 
  Download, 
  Loader2, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut,
  ExternalLink,
  Copy,
  Check
} from "lucide-react";
import { toast } from "sonner";

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string | null;
  documentName: string;
}

export const DocumentViewer = ({
  isOpen,
  onClose,
  documentUrl,
  documentName,
}: DocumentViewerProps) => {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [documentTitle, setDocumentTitle] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Clean markdown syntax in HTML content
  const cleanMarkdownInHtml = useCallback((html: string): string => {
    return html
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')  // **bold** to <strong>
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')              // *italic* to <em>
      .replace(/^##\s*/gm, '')                              // Strip ## headers
      .replace(/^#\s*/gm, '');                              // Strip # headers
  }, []);

  // Extract clean title from HTML content or filename
  const extractTitle = useCallback((html: string, fileName: string): string => {
    // Try to extract from h1 tag
    const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    if (h1Match && h1Match[1]) {
      return h1Match[1].trim();
    }
    // Fallback: clean up filename
    return fileName
      .replace(/_Business_Plan\.html$/i, "")
      .replace(/_/g, " ")
      .replace(/\.html$/i, "");
  }, []);

  useEffect(() => {
    const fetchHtmlContent = async () => {
      if (!documentUrl || !isOpen) {
        setHtmlContent(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(documentUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch document");
        }
        const html = await response.text();
        const cleanedHtml = cleanMarkdownInHtml(html);
        setHtmlContent(cleanedHtml);
        setDocumentTitle(extractTitle(cleanedHtml, documentName));
      } catch (err) {
        console.error("Error fetching document:", err);
        setError("Failed to load document. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHtmlContent();
  }, [documentUrl, isOpen, documentName, extractTitle, cleanMarkdownInHtml]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        handlePrint();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handlePrint = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.print();
    }
  };

  const handleDownload = () => {
    if (!htmlContent) return;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = documentName.endsWith(".html")
      ? documentName
      : `${documentName}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenInNewTab = () => {
    if (documentUrl) {
      window.open(documentUrl, "_blank");
    }
  };

  const handleCopyLink = async () => {
    if (documentUrl) {
      await navigator.clipboard.writeText(documentUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 10, 70));
  const handleZoomReset = () => setZoomLevel(100);

  const toggleFullScreen = () => setIsFullScreen((prev) => !prev);

  // Apply zoom to iframe content
  useEffect(() => {
    if (iframeRef.current?.contentDocument?.body) {
      iframeRef.current.contentDocument.body.style.zoom = `${zoomLevel}%`;
    }
  }, [zoomLevel, htmlContent]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className={`flex flex-col p-0 gap-0 ${
          isFullScreen 
            ? "max-w-[100vw] w-[100vw] h-[100vh] rounded-none" 
            : "max-w-5xl w-[95vw] h-[90vh]"
        }`}
      >
        <DialogHeader className="flex flex-row items-center justify-between px-4 py-3 border-b border-border shrink-0 bg-gradient-to-r from-background to-muted/30">
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <DialogTitle className="text-base font-semibold truncate pr-4">
              {documentTitle || documentName}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Business Plan Document
            </DialogDescription>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Zoom controls */}
            <div className="hidden sm:flex items-center gap-1 mr-2 px-2 py-1 bg-muted/50 rounded-md">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 70}
                className="h-7 w-7"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </Button>
              <button 
                onClick={handleZoomReset}
                className="text-xs font-medium min-w-[40px] text-center hover:text-primary transition-colors"
              >
                {zoomLevel}%
              </button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 150}
                className="h-7 w-7"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Action buttons */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyLink}
              disabled={!documentUrl}
              className="h-8 w-8"
              title="Copy link"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleOpenInNewTab}
              disabled={!documentUrl}
              className="h-8 w-8"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              disabled={!htmlContent}
              className="gap-1.5 hidden sm:flex"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={!htmlContent}
              className="gap-1.5 hidden sm:flex"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </Button>

            {/* Mobile-only icon buttons */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrint}
              disabled={!htmlContent}
              className="h-8 w-8 sm:hidden"
            >
              <Printer className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              disabled={!htmlContent}
              className="h-8 w-8 sm:hidden"
            >
              <Download className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullScreen}
              className="h-8 w-8"
              title={isFullScreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullScreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
            
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden bg-muted/30">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">Loading document...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-destructive mb-2">{error}</p>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          )}

          {htmlContent && !isLoading && !error && (
            <iframe
              ref={iframeRef}
              srcDoc={htmlContent}
              title={documentTitle || documentName}
              className="w-full h-full border-0 bg-white"
              sandbox="allow-same-origin allow-popups"
              onLoad={() => {
                // Apply zoom after iframe loads
                if (iframeRef.current?.contentDocument?.body) {
                  iframeRef.current.contentDocument.body.style.zoom = `${zoomLevel}%`;
                }
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
