import React, { useState, useRef, useEffect } from "react";
import { X, Save, Eye, Download, Image as ImageIcon, Type, Move, Trash2 } from "lucide-react";

export default function JournalBuilderModal({ isOpen, onClose, collection, orientation, initialDraft, onSaveDraft }) {
  // blocks: { id, type: 'image', src, overlays: [{ id, text, x, y }] }
  const [blocks, setBlocks] = useState([]);
  const [previewMode, setPreviewMode] = useState('none'); // 'none', 'ebook', 'pdf'
  const [draggedImg, setDraggedImg] = useState(null);
  const [activeOverlayId, setActiveOverlayId] = useState(null);
  
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (initialDraft && initialDraft.blocks) {
        setBlocks(initialDraft.blocks);
      } else {
        setBlocks([]);
      }
      setPreviewMode('none');
    }
  }, [isOpen, initialDraft]);

  if (!isOpen) return null;

  const handleDragStartSidebar = (e, src) => {
    setDraggedImg(src);
    e.dataTransfer.setData("text/plain", src);
  };

  const handleDragOverCanvas = (e) => {
    e.preventDefault();
  };

  const handleDropCanvas = (e) => {
    e.preventDefault();
    if (draggedImg) {
      setBlocks([...blocks, { id: Date.now().toString(), type: 'image', src: draggedImg, overlays: [] }]);
      setDraggedImg(null);
    }
  };

  const addTextOverlay = (blockId) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId) {
        return {
          ...b,
          overlays: [...b.overlays, { id: Date.now().toString(), text: "Nhập nội dung...", x: 10, y: 10 }]
        };
      }
      return b;
    }));
  };

  const updateOverlayText = (blockId, overlayId, newText) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId) {
        return {
          ...b,
          overlays: b.overlays.map(o => o.id === overlayId ? { ...o, text: newText } : o)
        };
      }
      return b;
    }));
  };

  const updateOverlayPos = (blockId, overlayId, x, y) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId) {
        return {
          ...b,
          overlays: b.overlays.map(o => o.id === overlayId ? { ...o, x, y } : o)
        };
      }
      return b;
    }));
  };

  const deleteOverlay = (blockId, overlayId) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId) {
        return {
          ...b,
          overlays: b.overlays.filter(o => o.id !== overlayId)
        };
      }
      return b;
    }));
  };

  const deleteBlock = (blockId) => {
    setBlocks(blocks.filter(b => b.id !== blockId));
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleSaveAndClose = () => {
    onSaveDraft({ blocks, orientation });
    onClose();
  };

  const isPortrait = orientation === 'portrait';
  const pageClass = isPortrait ? 'aspect-[1/1.414] w-[600px]' : 'aspect-[1.414/1] w-[800px]';

  // Component that renders the inner content of a page block
  const renderBlockContent = (block, idx) => (
    <div 
      className={`relative bg-white overflow-hidden w-full h-full group ${previewMode === 'none' ? 'shadow-lg' : ''} print:shadow-none print:break-after-page`}
    >
      <img src={block.src} className="absolute inset-0 w-full h-full object-cover" alt="" />
      
      {block.overlays.map(overlay => (
        <div 
          key={overlay.id}
          className={`absolute p-2 min-w-[100px] group/text cursor-move border-2 ${activeOverlayId === overlay.id && previewMode === 'none' ? 'border-blue-500 bg-white/80 backdrop-blur' : 'border-transparent hover:border-gray-300 hover:bg-white/50'} print:border-transparent print:bg-transparent`}
          style={{ left: `${overlay.x}%`, top: `${overlay.y}%` }}
          draggable={previewMode === 'none'}
          onDragStart={(e) => {
            e.dataTransfer.setData("text/plain", JSON.stringify({ blockId: block.id, overlayId: overlay.id, offsetX: e.clientX, offsetY: e.clientY }));
          }}
          onDragEnd={(e) => {
            const rect = e.target.parentElement.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            updateOverlayPos(block.id, overlay.id, Math.max(0, Math.min(x, 90)), Math.max(0, Math.min(y, 90)));
          }}
          onClick={(e) => { e.stopPropagation(); setActiveOverlayId(overlay.id); }}
        >
          {previewMode === 'none' && activeOverlayId === overlay.id ? (
            <textarea
              autoFocus
              value={overlay.text}
              onChange={(e) => updateOverlayText(block.id, overlay.id, e.target.value)}
              onBlur={() => setActiveOverlayId(null)}
              className="bg-transparent border-none outline-none resize-none text-black font-semibold text-lg"
              rows={3}
            />
          ) : (
            <div className="text-black font-semibold text-lg whitespace-pre-wrap drop-shadow-md">
              {overlay.text}
            </div>
          )}
          
          {previewMode === 'none' && (
            <button onClick={(e) => { e.stopPropagation(); deleteOverlay(block.id, overlay.id); }} className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 hidden group-hover/text:block z-10">
              <Trash2 size={12} />
            </button>
          )}
        </div>
      ))}

      {previewMode === 'none' && (
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button onClick={() => addTextOverlay(block.id)} className="bg-white text-black p-2 rounded shadow hover:bg-gray-100 flex items-center gap-1 text-xs font-bold">
            <Type size={14} /> Thêm Text
          </button>
          <button onClick={() => deleteBlock(block.id)} className="bg-red-500 text-white p-2 rounded shadow hover:bg-red-600">
            <Trash2 size={14} />
          </button>
        </div>
      )}
      
      <div className="absolute bottom-4 right-4 text-white/50 text-xs font-bold mix-blend-difference z-0">{idx + 1}</div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col h-screen overflow-hidden print:bg-white print:static print:h-auto print:overflow-visible">
      {/* Header - Hidden when printing */}
      <div className="h-14 bg-white border-b border-[#E0E0E0] flex items-center justify-between px-6 shrink-0 print:hidden shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button onClick={handleSaveAndClose} className="p-2 -ml-2 text-[#666] hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
          <div className="font-bold text-[#212121]">Thiết kế Tập san {orientation === 'landscape' ? '(Ngang)' : '(Dọc)'}</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button onClick={() => setPreviewMode('none')} className={`px-4 py-1.5 rounded-md font-bold text-sm transition-colors ${previewMode === 'none' ? 'bg-white shadow text-[#1a4ba8]' : 'text-[#666] hover:text-[#212121]'}`}>
              Design
            </button>
            <button onClick={() => setPreviewMode('pdf')} className={`px-4 py-1.5 rounded-md font-bold text-sm transition-colors flex items-center gap-2 ${previewMode === 'pdf' ? 'bg-white shadow text-[#1a4ba8]' : 'text-[#666] hover:text-[#212121]'}`}>
              <Eye size={16} /> PDF
            </button>
            <button onClick={() => setPreviewMode('ebook')} className={`px-4 py-1.5 rounded-md font-bold text-sm transition-colors flex items-center gap-2 ${previewMode === 'ebook' ? 'bg-white shadow text-[#1a4ba8]' : 'text-[#666] hover:text-[#212121]'}`}>
              <Eye size={16} /> Ebook
            </button>
          </div>
          <button onClick={handleExportPDF} className="px-4 py-2 bg-[#1a4ba8] text-white rounded-lg font-bold text-sm hover:bg-[#0d2e6e] transition-colors flex items-center gap-2 ml-2">
            <Download size={16} /> Xuất PDF
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden print:overflow-visible">
        {previewMode === 'none' && (
          <div className="w-[300px] bg-[#f8f8f8] border-r border-[#E0E0E0] flex flex-col h-full print:hidden shrink-0">
            <div className="p-4 border-b border-[#E0E0E0] font-bold text-[#212121]">Ấn phẩm trong bộ sưu tập</div>
            <div className="p-4 flex-1 overflow-y-auto grid grid-cols-2 gap-3">
              {collection?.items?.map(item => (
                <div 
                  key={item.id} 
                  draggable
                  onDragStart={(e) => handleDragStartSidebar(e, item.artwork?.coverImageUrl || item.artwork?.img)}
                  className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-[#1a4ba8]"
                >
                  <img src={item.artwork?.coverImageUrl || item.artwork?.img} alt="" className="w-full h-full object-cover pointer-events-none" />
                </div>
              ))}
              {(!collection?.items || collection.items.length === 0) && (
                <div className="col-span-2 text-sm text-gray-500 text-center py-10">Bộ sưu tập trống</div>
              )}
            </div>
            <div className="p-4 border-t border-[#E0E0E0] bg-blue-50 text-xs text-blue-800 rounded-t-xl mt-auto">
              <p className="font-semibold mb-1">Hướng dẫn:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Kéo ảnh từ đây thả vào vùng thiết kế.</li>
                <li>Thêm Text và kéo thả vị trí trên ảnh.</li>
              </ul>
            </div>
          </div>
        )}

        <div 
          className="flex-1 bg-[#EBEBEB] overflow-y-auto p-8 flex flex-col items-center print:p-0 print:bg-white print:block"
          onDragOver={handleDragOverCanvas}
          onDrop={handleDropCanvas}
          ref={canvasRef}
        >
          {blocks.length === 0 && previewMode === 'none' && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <ImageIcon size={64} className="mb-4 opacity-50" />
              <p className="font-medium text-lg">Kéo thả ảnh vào đây để bắt đầu</p>
            </div>
          )}

          {/* Standard Linear Layout for Design and PDF Mode */}
          {(previewMode === 'none' || previewMode === 'pdf') && (
            <div className={`w-full flex flex-col items-center space-y-10 print:space-y-0 print:block`}>
              {blocks.map((block, idx) => (
                <div key={block.id} className={pageClass}>
                  {renderBlockContent(block, idx)}
                </div>
              ))}
            </div>
          )}

          {/* Ebook Mode - uses custom HTMLFlipBook or side-by-side view */}
          {previewMode === 'ebook' && blocks.length > 0 && (
             <div className="w-full flex justify-center items-center h-full">
                {/* Note: In a real app we'd use <HTMLFlipBook /> here, but since HTMLFlipBook requires 
                    specific React class components or React.forwardRef pages, we render a CSS side-by-side spread 
                    for simplicity in this prototype. */}
                <div className="flex bg-white shadow-2xl overflow-hidden rounded-md" style={{ width: isPortrait ? 1200 : 1600, maxWidth: '90%', height: '80vh', aspectRatio: isPortrait ? '2/1.414' : '2.828/1' }}>
                  {blocks.length >= 2 ? (
                    <>
                      <div className="w-1/2 h-full border-r border-[#E0E0E0] bg-gray-50 relative">
                        {renderBlockContent(blocks[0], 0)}
                      </div>
                      <div className="w-1/2 h-full relative">
                        {renderBlockContent(blocks[1], 1)}
                      </div>
                    </>
                  ) : (
                    <div className="w-1/2 h-full mx-auto relative border border-[#E0E0E0]">
                      {renderBlockContent(blocks[0], 0)}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur">
                  {blocks.length > 2 ? `Đang hiển thị 2 / ${blocks.length} trang` : "Chế độ xem Ebook"}
                </div>
             </div>
          )}
        </div>
      </div>

      <style>{`
        @media print {
          @page { size: ${orientation === 'landscape' ? 'A4 landscape' : 'A4 portrait'}; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          .print\\:bg-white { background: white !important; }
          .print\\:static { position: static !important; }
          .print\\:overflow-visible { overflow: visible !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:break-after-page { break-after: page !important; page-break-after: always !important; }
          .print\\:border-transparent { border-color: transparent !important; }
          .print\\:bg-transparent { background: transparent !important; }
          .print\\:space-y-0 > :not([hidden]) ~ :not([hidden]) { margin-top: 0 !important; }
        }
      `}</style>
    </div>
  );
}
