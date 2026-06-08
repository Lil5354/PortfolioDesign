import React, { useState, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { X, UploadCloud, Loader2, BookOpen, Maximize2, CheckCircle2 } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

export default function EbookViewerModal({ isOpen, onClose, onUseEbook }) {
  const [pdfFile, setPdfFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);
  const viewerRef = useRef(null);

  if (!isOpen) return null;

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen().catch(err => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      setError('Vui lòng chọn một tệp PDF hợp lệ.');
      return;
    }
    
    setPdfFile(file);
    setLoading(true);
    setError('');
    setPages([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      const numPages = pdf.numPages;
      const loadedPages = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // High resolution scale
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        loadedPages.push(canvas.toDataURL('image/jpeg', 0.8));
      }

      setPages(loadedPages);
    } catch (err) {
      console.error('Error parsing PDF:', err);
      setError('Đã xảy ra lỗi khi đọc tệp PDF. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPdfFile(null);
    setPages([]);
    setError('');
    setLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div ref={viewerRef} className="bg-[#FAFAFA] w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0] bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#eef4ff] text-[#1a4ba8] rounded-xl flex items-center justify-center">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#212121]">Mô phỏng E-Book (Flipbook)</h2>
              <p className="text-sm text-[#666666]">Tải lên PDF để xem dưới dạng sách lật</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {pages.length > 0 && (
              <>
                {onUseEbook && (
                  <button onClick={() => { onUseEbook(pages, pdfFile); onClose(); }} className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-[#1a4ba8] hover:bg-[#0d2e6e] flex items-center gap-2 shadow-md transition-colors">
                    <CheckCircle2 size={18} /> Xác nhận & Sử dụng
                  </button>
                )}
                <button onClick={handleReset} className="px-4 py-2.5 rounded-xl text-sm font-bold text-[#666] border border-[#E0E0E0] hover:bg-[#F8F8F8] transition-colors">
                  Tải file khác
                </button>
              </>
            )}
            <button onClick={toggleFullScreen} className="w-10 h-10 rounded-full hover:bg-[#F8F8F8] text-[#666] flex items-center justify-center transition-colors" title="Xem toàn màn hình">
              <Maximize2 size={20} />
            </button>
            <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-[#F8F8F8] text-[#666] flex items-center justify-center transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto bg-[#F0F2F5] relative">
          
          {!loading && pages.length === 0 && (
            <div className="w-full max-w-md bg-white border-2 border-dashed border-[#a8bce0] rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:bg-[#eef4ff] transition-colors cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
              <div className="w-20 h-20 bg-[#e0eaff] rounded-full flex items-center justify-center text-[#1a4ba8] mb-6 group-hover:scale-110 transition-transform">
                <UploadCloud size={40} />
              </div>
              <h3 className="text-lg font-bold text-[#212121] mb-2">Chọn file PDF của bạn</h3>
              <p className="text-sm text-[#666666] mb-6">Hệ thống sẽ tự động tạo sách điện tử (E-book) từ file này.</p>
              <button className="px-6 py-3 bg-[#1a4ba8] text-white font-bold rounded-xl shadow-md hover:bg-[#0d2e6e] transition-colors">
                Tải lên PDF
              </button>
              <input 
                type="file" 
                accept="application/pdf" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              {error && (
                <p className="mt-4 text-sm text-[#8B1A1A] font-medium bg-red-50 p-3 rounded-lg border border-[#F5C5C5] w-full">
                  {error}
                </p>
              )}
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 size={48} className="text-[#1a4ba8] animate-spin" />
              <p className="text-lg font-semibold text-[#212121]">Đang xử lý PDF...</p>
              <p className="text-sm text-[#666666]">Quá trình này có thể mất vài giây tùy vào dung lượng file.</p>
            </div>
          )}

          {!loading && pages.length > 0 && (
            <div className="w-full h-full flex items-center justify-center">
              <HTMLFlipBook 
                width={450} 
                height={630} 
                size="stretch"
                minWidth={315}
                maxWidth={1000}
                minHeight={400}
                maxHeight={1533}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={true}
                className="shadow-2xl mx-auto"
              >
                {pages.map((imgSrc, index) => (
                  <div key={index} className="demoPage bg-white overflow-hidden border border-gray-200">
                    <img src={imgSrc} alt={`Page ${index + 1}`} className="w-full h-full object-contain pointer-events-none" />
                  </div>
                ))}
              </HTMLFlipBook>
              
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 text-white px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 backdrop-blur-md shadow-lg">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00c2a8] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00c2a8]"></span>
                </span>
                Kéo mép giấy hoặc click vào góc để lật trang
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
