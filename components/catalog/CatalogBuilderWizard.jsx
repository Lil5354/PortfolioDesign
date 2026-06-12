import { useState, useCallback, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { 
  X, ChevronLeft, ChevronRight, Check, Image as ImageIcon, Type, 
  AlignLeft, Layout, Eye, FileDown, Bold, Italic, List, GripVertical, 
  Palette, Settings, FileText, Smartphone, Laptop, Upload, ZoomIn, ZoomOut, Maximize
} from "lucide-react";

import { generatePreviewHTML, generatePrintReadyHTML } from "./templates/index.js";

// Tiptap Editor Component
function RichTextEditor({ value, onChange, placeholder }) {
  const editor = useEditor({
    extensions: [StarterKit, ImageExtension],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: "prose prose-sm max-w-none outline-none min-h-[120px] px-4 py-3 text-sm text-[#212121] bg-white rounded-b-xl" },
    },
  });

  if (!editor) return <div className="min-h-[120px] bg-[#F8F8F8] rounded-xl border border-[#E0E0E0]" />;

  return (
    <div className="border border-[#E0E0E0] rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-1 px-2 py-2 bg-[#F8F8F8] border-b border-[#E0E0E0] flex-wrap">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded ${editor.isActive("bold") ? "bg-[#E0E0E0]" : "hover:bg-[#E0E0E0]"}`}><Bold size={15} /></button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded ${editor.isActive("italic") ? "bg-[#E0E0E0]" : "hover:bg-[#E0E0E0]"}`}><Italic size={15} /></button>
        <span className="w-px h-4 bg-[#E0E0E0] mx-1" />
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded ${editor.isActive("bulletList") ? "bg-[#E0E0E0]" : "hover:bg-[#E0E0E0]"}`}><List size={15} /></button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function SortableSection({ id, item, isSelected, onToggle }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, zIndex: isDragging ? 10 : 1 };

  return (
    <div ref={setNodeRef} style={style} className={`flex items-center gap-3 p-3 rounded-xl border ${isSelected ? "border-[#1a4ba8] bg-[#eef4ff] shadow-sm" : "border-[#E0E0E0] bg-white"} transition-colors mb-2`}>
      <button {...attributes} {...listeners} className="cursor-grab text-[#666666] hover:text-[#212121] p-1"><GripVertical size={16} /></button>
      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
        {item.coverImageUrl ? <img src={item.coverImageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">IMG</div>}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#212121] truncate">{item.title}</p>
        <p className="text-xs text-[#666666] truncate">{item.student} - {item.category}</p>
      </div>
      <input type="checkbox" checked={isSelected} onChange={() => onToggle(item.id)} className="w-4 h-4 accent-[#1a4ba8] cursor-pointer" />
    </div>
  );
}

const InputRow = ({ label, value, onChange, placeholder }) => (
  <div className="mb-4">
    {label && <label className="block text-xs font-bold text-[#666] mb-1.5 uppercase tracking-wide">{label}</label>}
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-2.5 border border-[#E0E0E0] rounded-xl text-sm outline-none focus:border-[#1a4ba8] focus:ring-2 focus:ring-[#1a4ba8]/20 transition-all bg-[#F8F8F8] focus:bg-white" />
  </div>
);

const getFallbackImage = (url) => (url && url.trim() !== "" && url !== "undefined") ? url : "https://via.placeholder.com/150?text=No+Image";

function CanvasItem({ item, art, scale = 1, isSelected, onClick, onUpdate, onRemove }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const handlePointerDown = (e, action, dir = '') => {
    e.stopPropagation();
    e.preventDefault();
    if (action === 'drag') setIsDragging(true);
    if (action === 'resize') setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = parseFloat(item.left);
    const startTop = parseFloat(item.top);
    const startWidth = parseFloat(item.width);
    const startHeight = parseFloat(item.height);

    const onPointerMove = (eMove) => {
      const dx = (eMove.clientX - startX) / scale;
      const dy = (eMove.clientY - startY) / scale;
      
      if (action === 'drag') {
        onUpdate({ ...item, left: `${startLeft + dx}px`, top: `${startTop + dy}px` });
      } else if (action === 'resize') {
        let newWidth = startWidth;
        let newHeight = startHeight;
        let newLeft = startLeft;
        let newTop = startTop;

        if (dir.includes('e')) newWidth += dx;
        if (dir.includes('s')) newHeight += dy;
        if (dir.includes('w')) { newWidth -= dx; newLeft += dx; }
        if (dir.includes('n')) { newHeight -= dy; newTop += dy; }

        onUpdate({ 
          ...item, 
          width: `${Math.max(20, newWidth)}px`, 
          height: `${Math.max(20, newHeight)}px`, 
          left: `${newLeft}px`, 
          top: `${newTop}px` 
        });
      }
    };

    const onPointerUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  return (
    <div 
      onPointerDown={(e) => { onClick(); handlePointerDown(e, 'drag'); }}
      className={`absolute border-2 ${isSelected ? 'border-[#1a4ba8]' : 'border-transparent hover:border-gray-300'} group flex items-center justify-center`}
      style={{ 
        left: item.left, top: item.top, width: item.width, height: item.height, zIndex: item.zIndex, cursor: isDragging ? 'grabbing' : 'grab',
        color: item.color || '#000', fontFamily: item.fontFamily || 'Arial', fontSize: item.fontSize || '16px', fontWeight: item.fontWeight || 'normal'
      }}
    >
      {item.type === 'text' ? (
        <div style={{width: '100%', height: '100%', outline: 'none', overflow: 'hidden'}}>{item.content}</div>
      ) : (
        <img src={getFallbackImage(art?.coverImageUrl)} className="w-full h-full object-contain pointer-events-none" alt="" />
      )}
      <button onClick={(e) => { e.stopPropagation(); onRemove(item.id); }} className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 z-10"><X size={12} /></button>
      
      {['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map(dir => (
        <div 
          key={dir}
          onPointerDown={(e) => handlePointerDown(e, 'resize', dir)}
          className="absolute w-3 h-3 bg-white border border-[#1a4ba8] opacity-0 group-hover:opacity-100"
          style={{
            top: dir.includes('n') ? -6 : dir.includes('s') ? 'calc(100% - 6px)' : 'calc(50% - 6px)',
            left: dir.includes('w') ? -6 : dir.includes('e') ? 'calc(100% - 6px)' : 'calc(50% - 6px)',
            cursor: `${dir}-resize`,
            zIndex: 10
          }}
        />
      ))}
    </div>
  );
}

export default function CatalogBuilderWizard({ collection, onClose }) {
  const [step, setStep] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const iframeRef = useRef(null);

  const [payload, setPayload] = useState({
    // 1. Basic Info
    journalTitle: collection?.name || "FORMA",
    journalSubtitle: "Tập San Ấn Phẩm Thiết Kế Đồ Họa",
    editionNumber: "I",
    eventName: "Triển Lãm Thường Niên",
    schoolName: "Đại học Tôn Đức Thắng",
    departmentName: "Khoa Mỹ thuật Công nghiệp",
    academicYear: "2024 - 2025",
    publishMonthYear: "05/2025",
    forewordText: "<p>Kính gửi quý thầy cô và các bạn sinh viên...</p>",
    closingText: "<p>Trân Trọng.</p>",
    thanksList: "Ban Giám Hiệu, Khoa MTCN",
    
    // 2. Layout Setup
    layoutTheme: "modern", 
    coverLayout: "centered",
    coverImage: "", 
    showOnCover: { logo: true, title: true, edition: true, event: true, year: true, dept: true },
    tocLayout: "grid_2col",
    artworkCardStyle: "magazine_spread",
    artworksPerPage: 1, 
    showOnArtwork: { image: true, title: true, student: true, category: true, note: true, award: true },
    imageDisplayMode: "contain",

    // 3. Design System
    colorMode: "dark",
    primaryColor: "#ff3c00",
    secondaryColor: "#00c2a8", 
    backgroundColor: "#080808",
    textColor: "#f2f2f0",
    headingFont: "Barlow Condensed",
    bodyFont: "Barlow",
    monoFont: "IBM Plex Mono",
    borderStyle: "none",
    showGrain: false,
    bgLetter: "G",

    // 4. Structure
    enabledArtworkIds: (collection?.items || []).map((it) => it.artworkId),
    artworkOrderIds: (collection?.items || []).map((it) => it.artworkId),

    // 5. Export
    pdfSize: "A4",
    pdfOrientation: "portrait",
    pdfResolution: "print_300dpi",
    includeBleed: true,
    
    // 6. Custom Canvas
    layoutMode: "template", // 'template' | 'custom_canvas'
    customBackgroundUrl: "",
    canvasWidth: 0,
    canvasHeight: 0,
    canvasItems: [],
    canvasZoom: 100,
  });

  const update = useCallback((patch) => setPayload(p => ({ ...p, ...patch })), []);

  const items = (collection?.items || []).map(it => ({
    id: it.artworkId || Math.random().toString(), // fallback in case of no ID
    title: it.artwork?.title || "Untitled",
    student: it.artwork?.user?.fullName || "Student",
    coverImageUrl: it.artwork?.coverImageUrl || "",
    category: it.artwork?.subject || "Design",
    note: it.note || "",
    award: ""
  }));

  const sortedEnabled = payload.artworkOrderIds.map(id => items.find(it => it.id === id)).filter(Boolean).filter(it => payload.enabledArtworkIds.includes(it.id));

  // In Custom Canvas mode, we export ALL items added to the canvas regardless of "enabledArtworkIds"
  const canvasArtworks = payload.layoutMode === 'custom_canvas' ? items : sortedEnabled;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = payload.artworkOrderIds.indexOf(active.id);
    const newIdx = payload.artworkOrderIds.indexOf(over.id);
    update({ artworkOrderIds: arrayMove(payload.artworkOrderIds, oldIdx, newIdx) });
  };
  const toggleArtwork = (id) => {
    update({ enabledArtworkIds: payload.enabledArtworkIds.includes(id) ? payload.enabledArtworkIds.filter(x => x !== id) : [...payload.enabledArtworkIds, id] });
  };

  const getSteps = () => {
    if (payload.layoutMode === 'custom_canvas') {
      return [
        { key: "basic", label: "Thông tin & Chế độ", icon: AlignLeft },
        { key: "canvas", label: "Thiết kế Canvas", icon: Layout },
        { key: "preview", label: "Preview & Xuất PDF", icon: Eye },
      ];
    }
    return [
      { key: "basic", label: "Thông tin", icon: AlignLeft },
      { key: "layout", label: "Bố cục", icon: Layout },
      { key: "design", label: "Visual", icon: Palette },
      { key: "structure", label: "Cấu trúc", icon: FileText },
      { key: "preview", label: "Preview & Xuất PDF", icon: Eye },
    ];
  };

  const currentSteps = getSteps();

  useEffect(() => {
    const currentStepKey = currentSteps[step]?.key;
    if (currentStepKey === 'preview' && iframeRef.current) {
      const doc = iframeRef.current.contentWindow.document;
      doc.open();
      doc.write(generatePreviewHTML(payload, sortedEnabled));
      doc.close();

      const script = doc.createElement('script');
      script.innerHTML = `
        document.addEventListener('dblclick', function(e) {
          const el = e.target;
          if (el.tagName.toLowerCase() === 'img') {
            const newSrc = prompt('Nhập đường dẫn hình ảnh mới (URL):', el.src);
            if (newSrc) el.src = newSrc;
          } else {
            el.contentEditable = true;
            el.focus();
            el.style.outline = "2px dashed #1a4ba8";
            el.addEventListener('blur', function() {
              el.contentEditable = false;
              el.style.outline = "none";
            }, { once: true });
          }
        });
      `;
      doc.body.appendChild(script);
    }
  }, [step, payload, sortedEnabled, currentSteps]);

  const handleExport = () => {
    setExporting(true);
    const doc = iframeRef.current.contentWindow.document;
    
    // Tính toán kích thước vật lý (mm) tuỳ theo khổ in
    let sectionWidth = "210mm";
    let sectionHeight = "297mm";
    
    if (payload.layoutMode === 'custom_canvas') {
      sectionWidth = `${payload.canvasWidth || 1123}px`;
      sectionHeight = `${payload.canvasHeight || 794}px`;
    } else {
      if (payload.pdfSize === 'Square') {
        sectionWidth = "210mm";
        sectionHeight = "210mm";
      } else if (payload.pdfOrientation === 'landscape') {
        sectionWidth = "297mm";
        sectionHeight = "210mm";
      }
    }
    
    let html = "<!DOCTYPE html><html>" + doc.documentElement.innerHTML + "</html>";
    
    // Replace media queries to emulate print layout accurately in the popup window
    html = html.replace(/@media\s+screen/g, "@media nothing");
    html = html.replace(/@media\s+print/g, "@media all");
    
    const printCSS = `
      <style>
        @media all {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .page, .cover, .page-foreword, .page-toc, .page-closing, .page-spread, .page-body, .page-colophon, .page-works {
            width: ${sectionWidth} !important;
            min-height: ${sectionHeight} !important;
            height: auto !important;
            max-height: none !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
            page-break-before: avoid !important;
            break-before: avoid !important;
            overflow: visible !important;
          }
          .page-spread > div, .work-card, .article-card, .highlight-box, .stat-item, .work-block, [style*="border:1px solid"] {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          body { margin: 0 !important; }
        }
      </style>
    `;
    html = html.replace('</head>', printCSS + '</head>');
    
    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(html);
      printWin.document.close();
      printWin.onload = () => {
        // Force width to compute accurate scrollHeight for print
        printWin.document.body.style.width = sectionWidth;
        printWin.document.body.style.position = 'absolute';
        printWin.document.body.style.left = '0';
        printWin.document.body.style.top = '0';
        
        // Ensure all images are fully loaded before measuring height
        const images = Array.from(printWin.document.querySelectorAll('img'));
        const imagePromises = images.map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        });
        
        Promise.all(imagePromises).then(() => {
          setTimeout(() => {
            let realHeight = printWin.document.documentElement.scrollHeight;
            realHeight += 10; // add buffer to prevent unwanted page breaks from rounding
            
            const pageStyle = printWin.document.createElement('style');
            pageStyle.innerHTML = `@media all { @page { size: ${sectionWidth} ${realHeight}px; margin: 0; } }`;
            printWin.document.head.appendChild(pageStyle);
            
            // Reset styles
            printWin.document.body.style.position = '';
            printWin.document.body.style.left = '';
            printWin.document.body.style.top = '';
            printWin.document.body.style.width = '';
            
            printWin.print();
            setExporting(false);
          }, 800); // Allow browser to layout after images load
        });
      };
    } else {
      alert("Trình duyệt đã chặn popup.");
      setExporting(false);
    }
  };

  const getThemePresets = () => {
    if (payload.layoutTheme === 'modern') {
      return [
        { name: "Neon Grid", bg: "#080808", text: "#f2f2f0", primary: "#ff3c00", secondary: "#00c2a8", head: "Barlow Condensed", body: "Barlow" },
        { name: "Cyber Mono", bg: "#111111", text: "#e0e0e0", primary: "#ffe600", secondary: "#ff003c", head: "IBM Plex Mono", body: "Barlow" }
      ];
    } else if (payload.layoutTheme === 'classic') {
      return [
        { name: "Forma Sepia", bg: "#f8f4ec", text: "#1a1410", primary: "#b8963e", secondary: "#8b3a1e", head: "Playfair Display", body: "Lora" },
        { name: "Midnight Gold", bg: "#1a1410", text: "#f8f4ec", primary: "#d4af6a", secondary: "#b8963e", head: "Playfair Display", body: "Lora" }
      ];
    } else {
      return [
        { name: "Onyx Gold", bg: "#0a0a0a", text: "#f5f0e8", primary: "#c9a84c", secondary: "#8b1a1a", head: "Playfair Display", body: "Cormorant Garamond" },
        { name: "Ivory Minimal", bg: "#f5f0e8", text: "#2c3e50", primary: "#8b1a1a", secondary: "#c9a84c", head: "Playfair Display", body: "Cormorant Garamond" }
      ];
    }
  };

  const renderStep = () => {
    const stepKey = currentSteps[step]?.key;
    switch (stepKey) {
      case "basic":
        return (
          <div className="w-full min-w-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="w-full min-w-0">
              <h3 className="text-xl font-bold text-[#212121] mb-6 flex items-center gap-2"><AlignLeft className="text-[#1a4ba8]" /> Tiêu đề & Chế độ thiết kế</h3>
              <div className="grid grid-cols-2 gap-x-6">
                <InputRow label="Tên tập san" value={payload.journalTitle} onChange={v => update({ journalTitle: v })} />
                <InputRow label="Phụ đề" value={payload.journalSubtitle} onChange={v => update({ journalSubtitle: v })} />
              </div>
            </div>

            <hr className="border-[#E0E0E0]" />

            <div className="w-full min-w-0">
              <h3 className="text-xl font-bold text-[#212121] mb-6 flex items-center gap-2"><Layout className="text-[#1a4ba8]" /> Chế độ thiết kế</h3>
              <div className="flex gap-4 mb-6">
                <button onClick={() => update({ layoutMode: 'template' })} className={`flex-1 min-w-0 p-4 rounded-xl border-2 text-center transition-all ${payload.layoutMode === 'template' ? 'border-[#1a4ba8] bg-[#eef4ff]' : 'border-[#E0E0E0] hover:border-[#a8bce0] bg-white'}`}>
                  <Layout className="mx-auto mb-2 text-[#1a4ba8]" />
                  <div className="font-bold text-[#212121] truncate">Dùng Layout Có Sẵn</div>
                  <div className="text-xs text-[#666] mt-1 break-words">Các mẫu tự động dàn trang</div>
                </button>
                <button onClick={() => update({ layoutMode: 'custom_canvas' })} className={`flex-1 min-w-0 p-4 rounded-xl border-2 text-center transition-all ${payload.layoutMode === 'custom_canvas' ? 'border-[#1a4ba8] bg-[#eef4ff]' : 'border-[#E0E0E0] hover:border-[#a8bce0] bg-white'}`}>
                  <Upload className="mx-auto mb-2 text-[#1a4ba8]" />
                  <div className="font-bold text-[#212121] truncate">Tự Tải Nền Lên</div>
                  <div className="text-xs text-[#666] mt-1 break-words">Trở thành Canvas Editor tự do</div>
                </button>
              </div>
            </div>

            {payload.layoutMode === "template" && (
              <div className="mb-4 bg-[#F8F8F8] p-6 rounded-xl border border-[#E0E0E0]">
                <label className="block text-xs font-bold text-[#666] mb-1.5 uppercase tracking-wide">Khổ Tập San (Hướng in)</label>
                <select value={payload.pdfOrientation} onChange={e => update({ pdfOrientation: e.target.value })} className="w-full px-4 py-2.5 border border-[#E0E0E0] rounded-xl text-sm outline-none bg-white">
                  <option value="portrait">Khổ Dọc (Portrait)</option>
                  <option value="landscape">Khổ Ngang (Landscape)</option>
                </select>
                <p className="text-xs text-[#666] mt-2">Toàn bộ template sẽ tự động tối ưu để hiển thị vừa vặn với khổ in bạn chọn.</p>
              </div>
            )}

            {payload.layoutMode === 'custom_canvas' && (
              <div className="mb-4 bg-[#F8F8F8] p-6 rounded-xl border border-[#E0E0E0] w-full min-w-0 box-border">
                <h3 className="text-xl font-bold text-[#212121] mb-4">Tải lên hình nền (Background)</h3>
                <p className="text-sm text-[#666] mb-4 break-words">Tải lên một hình ảnh sẽ làm nền cho toàn bộ trang poster. Kích thước bản in PDF sẽ tự động vừa vặn 100% với kích thước ảnh nền này.</p>
                <div className="border-2 border-dashed border-[#E0E0E0] rounded-xl p-8 text-center bg-white hover:bg-gray-50 transition-colors w-full min-w-0 overflow-hidden box-border">
                  {payload.customBackgroundUrl ? (
                    <div className="space-y-4 w-full flex flex-col items-center">
                      <img src={payload.customBackgroundUrl} alt="Background" className="max-h-64 max-w-full object-contain mx-auto shadow-md rounded-lg" />
                      <div className="text-xs font-bold text-[#666]">Kích thước nhận diện: {payload.canvasWidth} x {payload.canvasHeight} px</div>
                      <button onClick={() => update({ customBackgroundUrl: '' })} className="px-4 py-2 bg-white border border-[#E0E0E0] rounded-lg text-sm font-semibold text-red-500 hover:bg-red-50">Xóa hình nền</button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#eef4ff] text-[#1a4ba8] flex items-center justify-center"><Upload size={24} /></div>
                      <div><span className="font-bold text-[#1a4ba8]">Nhấn để tải lên</span> ảnh nền từ máy tính</div>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        if (e.target.files[0]) {
                          const url = URL.createObjectURL(e.target.files[0]);
                          const img = new Image();
                          img.onload = () => {
                            update({ customBackgroundUrl: url, canvasWidth: img.width, canvasHeight: img.height });
                          };
                          img.src = url;
                        }
                      }} />
                    </label>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case "layout":
        return (
          <div className="w-full min-w-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="w-full min-w-0">
              <h3 className="text-xl font-bold text-[#212121] mb-6">Bố cục tổng thể (Theme)</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: "classic", label: "Classic", desc: "Cổ điển, đối xứng, sang trọng." },
                  { id: "modern", label: "Modern", desc: "Hiện đại, grid full-bleed." },
                  { id: "asymmetrical", label: "Editorial", desc: "Phá cách như tạp chí nghệ thuật." }
                ].map(t => (
                  <button key={t.id} onClick={() => {
                      update({ layoutTheme: t.id });
                      const presets = getThemePresets();
                      update({ backgroundColor: presets[0].bg, textColor: presets[0].text, primaryColor: presets[0].primary, secondaryColor: presets[0].secondary, headingFont: presets[0].head, bodyFont: presets[0].body });
                    }} 
                    className={`p-5 rounded-2xl border-2 text-left transition-all ${payload.layoutTheme === t.id ? "border-[#1a4ba8] bg-[#eef4ff]" : "border-[#E0E0E0] hover:border-[#a8bce0] bg-white"}`}>
                    <div className="text-sm font-bold text-[#212121] mb-1">{t.label}</div>
                    <div className="text-xs text-[#666]">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mt-8">
              <div>
                <h4 className="text-sm font-bold text-[#212121] mb-4">Cấu hình Bìa & Thông tin</h4>
                <div className="bg-[#F8F8F8] p-4 rounded-xl border border-[#E0E0E0] space-y-2">
                  <p className="text-xs font-bold text-[#666] mb-2 uppercase">Chữ cái trang trí (Chỉ dùng cho Editorial)</p>
                  <input value={payload.bgLetter} onChange={e => update({ bgLetter: e.target.value })} maxLength={1} className="w-16 px-4 py-2 border border-[#E0E0E0] rounded-xl text-center font-bold text-lg" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#212121] mb-4">Trang Tác Phẩm</h4>
                <div className="space-y-3">
                  <select value={payload.artworkCardStyle} onChange={e => update({ artworkCardStyle: e.target.value })} className="w-full px-4 py-2 border border-[#E0E0E0] rounded-xl text-sm bg-white outline-none">
                    <option value="magazine_spread">Magazine Spread (2 trang/tác phẩm)</option>
                    <option value="editorial">Editorial Card (1 cột)</option>
                    <option value="gallery">Gallery Grid (Nhiều ảnh)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case "design":
        return (
          <div className="w-full min-w-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-xl font-bold text-[#212121] flex items-center gap-2"><Palette className="text-[#1a4ba8]" /> Thiết kế Visual</h3>
            
            <div className="bg-[#F8F8F8] p-5 rounded-2xl border border-[#E0E0E0]">
              <h4 className="text-sm font-bold text-[#212121] mb-4">Color Presets (Phù hợp với Layout {payload.layoutTheme})</h4>
              <div className="flex gap-3 mb-6">
                {getThemePresets().map(theme => (
                  <button key={theme.name} onClick={() => update({ backgroundColor: theme.bg, textColor: theme.text, primaryColor: theme.primary, secondaryColor: theme.secondary, headingFont: theme.head, bodyFont: theme.body })} 
                    className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border border-[#E0E0E0] bg-white hover:border-[#1a4ba8] transition-all">
                    <div className="w-full h-8 rounded-lg flex overflow-hidden border border-gray-200">
                      <div className="flex-1" style={{ background: theme.bg }}></div>
                      <div className="flex-1" style={{ background: theme.primary }}></div>
                      <div className="flex-1" style={{ background: theme.secondary }}></div>
                    </div>
                    <span className="text-xs font-bold">{theme.name}</span>
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#666] mb-1">Màu chính (Primary)</label>
                  <input type="color" value={payload.primaryColor} onChange={e => update({ primaryColor: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#666] mb-1">Màu phụ (Secondary)</label>
                  <input type="color" value={payload.secondaryColor} onChange={e => update({ secondaryColor: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#666] mb-1">Màu nền (Background)</label>
                  <input type="color" value={payload.backgroundColor} onChange={e => update({ backgroundColor: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#666] mb-1">Màu chữ (Text)</label>
                  <input type="color" value={payload.textColor} onChange={e => update({ textColor: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-bold text-[#212121] mb-4">Typography (Phông chữ)</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#666] mb-1">Heading Font</label>
                    <select value={payload.headingFont} onChange={e => update({ headingFont: e.target.value })} className="w-full px-4 py-2 border border-[#E0E0E0] rounded-xl text-sm outline-none">
                      <option value="Barlow Condensed">Barlow Condensed (Modern)</option>
                      <option value="Playfair Display">Playfair Display (Editorial/Classic)</option>
                      <option value="Lora">Lora (Classic)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#666] mb-1">Body Font</label>
                    <select value={payload.bodyFont} onChange={e => update({ bodyFont: e.target.value })} className="w-full px-4 py-2 border border-[#E0E0E0] rounded-xl text-sm outline-none">
                      <option value="Barlow">Barlow (Sans-serif)</option>
                      <option value="Lora">Lora (Serif)</option>
                      <option value="Cormorant Garamond">Cormorant Garamond</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "structure":
        return (
          <div className="w-full min-w-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col">
            <div className="flex items-center justify-between shrink-0">
              <h3 className="text-xl font-bold text-[#212121] flex items-center gap-2"><FileText className="text-[#1a4ba8]" /> Cấu trúc & Thứ tự trang</h3>
              <div className="bg-[#F8F8F8] px-3 py-1.5 rounded-full text-xs font-bold text-[#666]">
                {payload.enabledArtworkIds.length} / {items.length} tác phẩm xuất bản
              </div>
            </div>
            
            <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6">
              <div className="mb-4 space-y-2">
                <div className="p-3 bg-[#eef4ff] border border-[#a8bce0] rounded-xl text-sm font-bold text-[#1a4ba8] flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#1a4ba8]"></div> [TRANG BÌA] Cố định</div>
                <div className="p-3 bg-[#eef4ff] border border-[#a8bce0] rounded-xl text-sm font-bold text-[#1a4ba8] flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#1a4ba8]"></div> [LỜI MỞ ĐẦU & MỤC LỤC] Cố định</div>
              </div>
              
              <p className="text-xs font-bold text-[#666] mb-3 uppercase tracking-wide">Danh sách Tác phẩm (Kéo thả để sắp xếp)</p>
              
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
                <SortableContext items={payload.artworkOrderIds} strategy={verticalListSortingStrategy}>
                  <div className="max-h-[300px] overflow-y-auto pr-2">
                    {payload.artworkOrderIds.map(id => {
                      const it = items.find(x => x.id === id);
                      if (!it) return null;
                      return <SortableSection key={it.id} id={it.id} item={it} isSelected={payload.enabledArtworkIds.includes(it.id)} onToggle={toggleArtwork} />;
                    })}
                  </div>
                </SortableContext>
              </DndContext>
              
              <div className="mt-4 pt-4 border-t border-[#E0E0E0] space-y-2">
                <div className="p-3 bg-[#eef4ff] border border-[#a8bce0] rounded-xl text-sm font-bold text-[#1a4ba8] flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#1a4ba8]"></div> [LỜI KẾT] Cố định</div>
              </div>
            </div>
          </div>
        );

      case "canvas":
        const selectedItem = payload.canvasItems.find(i => i.id === selectedItemId);
        return (
          <div className="w-full h-full space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col">
            <div className="flex items-center justify-between shrink-0">
              <h3 className="text-xl font-bold text-[#212121] flex items-center gap-2"><Palette className="text-[#1a4ba8]" /> Thiết kế Canvas Tự do</h3>
            </div>
            
            <div className="flex flex-1 gap-6 min-h-[500px] overflow-hidden">
              {/* Sidebar list of tools & artworks */}
              <div className="w-64 shrink-0 bg-white border border-[#E0E0E0] rounded-2xl p-4 flex flex-col">
                
                <h4 className="font-bold text-sm mb-3 text-[#1a4ba8]">Công cụ Text</h4>
                <div className="mb-4">
                  <button onClick={() => {
                    const newItem = {
                      id: Date.now().toString(),
                      type: 'text',
                      content: 'Nhập văn bản...',
                      left: '50px', top: '50px', width: '200px', height: '50px',
                      fontSize: '24px', color: '#000000', fontFamily: 'Inter', fontWeight: 'bold',
                      zIndex: payload.canvasItems.length + 1
                    };
                    update({ canvasItems: [...payload.canvasItems, newItem] });
                    setSelectedItemId(newItem.id);
                  }} className="w-full py-2 bg-[#1a4ba8] hover:bg-[#0d2e6e] text-white font-bold rounded-lg text-sm flex justify-center items-center gap-2 shadow">
                    <Type size={16} /> Thêm Văn Bản
                  </button>
                </div>

                {selectedItem && selectedItem.type === 'text' && (
                  <div className="mb-6 p-3 bg-[#eef4ff] border border-[#a8bce0] rounded-xl space-y-3 shadow-sm">
                    <div className="flex items-center justify-between border-b border-[#a8bce0] pb-1">
                      <h5 className="text-xs font-bold uppercase text-[#1a4ba8]">Thuộc tính Text</h5>
                      <button onClick={() => {
                        update({ canvasItems: payload.canvasItems.filter(x => x.id !== selectedItem.id) });
                        setSelectedItemId(null);
                      }} className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1 bg-white px-2 py-1 rounded shadow-sm border border-red-200">
                        <X size={12} /> Xoá
                      </button>
                    </div>
                    <div>
                      <label className="text-xs font-bold block mb-1">Nội dung</label>
                      <textarea value={selectedItem.content} onChange={e => update({ canvasItems: payload.canvasItems.map(x => x.id === selectedItem.id ? { ...x, content: e.target.value } : x) })} className="w-full p-2 border border-[#a8bce0] rounded text-sm outline-none" rows={3}></textarea>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-xs font-bold block mb-1">Cỡ chữ (px)</label>
                        <input type="number" value={parseInt(selectedItem.fontSize)} onChange={e => update({ canvasItems: payload.canvasItems.map(x => x.id === selectedItem.id ? { ...x, fontSize: `${e.target.value}px` } : x) })} className="w-full p-1.5 border border-[#a8bce0] rounded text-sm outline-none" />
                      </div>
                      <div>
                        <label className="text-xs font-bold block mb-1">Màu</label>
                        <input type="color" value={selectedItem.color} onChange={e => update({ canvasItems: payload.canvasItems.map(x => x.id === selectedItem.id ? { ...x, color: e.target.value } : x) })} className="w-8 h-8 rounded p-0 border-0 cursor-pointer" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold block mb-1">Font chữ</label>
                      <select value={selectedItem.fontFamily} onChange={e => update({ canvasItems: payload.canvasItems.map(x => x.id === selectedItem.id ? { ...x, fontFamily: e.target.value } : x) })} className="w-full p-1.5 border border-[#a8bce0] rounded text-sm outline-none">
                        <option value="Arial">Arial</option>
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Be Vietnam Pro">Be Vietnam Pro</option>
                        <option value="Playfair Display">Playfair Display</option>
                        <option value="Lora">Lora</option>
                        <option value="Merriweather">Merriweather</option>
                        <option value="Dancing Script">Dancing Script</option>
                        <option value="Pacifico">Pacifico</option>
                        <option value="Caveat">Caveat</option>
                      </select>
                    </div>
                  </div>
                )}

                <h4 className="font-bold text-sm mt-4 mb-3 border-t border-[#E0E0E0] pt-4">Thêm Ảnh Khả Dụng</h4>
                <p className="text-xs text-[#666] mb-4">Kéo thả ảnh từ đây vào canvas để sắp xếp.</p>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {items.map(it => (
                    <div key={it.id} 
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('artworkId', it.id);
                      }}
                      className="p-2 border border-[#E0E0E0] rounded-lg cursor-grab hover:border-[#1a4ba8] flex items-center gap-2 bg-white shadow-sm"
                      onClick={() => {
                        const newItem = {
                          id: Date.now().toString(),
                          type: 'artwork',
                          artworkId: it.id,
                          left: '50px',
                          top: '50px',
                          width: '150px',
                          height: '150px',
                          zIndex: payload.canvasItems.length + 1
                        };
                        update({ canvasItems: [...payload.canvasItems, newItem] });
                        setSelectedItemId(newItem.id);
                      }}
                    >
                      <img src={getFallbackImage(it.coverImageUrl)} className="w-10 h-10 object-cover rounded bg-gray-100 pointer-events-none" />
                      <span className="text-xs font-semibold truncate pointer-events-none">{it.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Canvas Area */}
              <div className="flex-1 bg-[#E0E0E0] rounded-2xl border border-[#CCC] overflow-hidden flex flex-col shadow-inner relative"
                   onPointerDown={() => setSelectedItemId(null)}>
                <div className="p-2 bg-white/80 border-b border-[#CCC] flex justify-between items-center z-20 absolute top-0 left-0 right-0 backdrop-blur">
                  <span className="text-xs font-bold text-[#666]">Canvas Preview</span>
                  <div className="flex gap-2">
                    <button onClick={() => update({ canvasZoom: Math.max(20, payload.canvasZoom - 10) })} className="p-1.5 hover:bg-gray-200 rounded"><ZoomOut size={16} /></button>
                    <span className="text-xs font-mono flex items-center w-12 justify-center">{payload.canvasZoom}%</span>
                    <button onClick={() => update({ canvasZoom: Math.min(200, payload.canvasZoom + 10) })} className="p-1.5 hover:bg-gray-200 rounded"><ZoomIn size={16} /></button>
                    <button onClick={() => update({ canvasZoom: 100 })} className="p-1.5 hover:bg-gray-200 rounded ml-2" title="Reset Zoom"><Maximize size={16} /></button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-auto mt-10 p-8 flex items-start justify-center bg-gray-50">
                  <div 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const artworkId = e.dataTransfer.getData('artworkId');
                      if (artworkId) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const scale = payload.canvasZoom / 100;
                        const x = (e.clientX - rect.left) / scale;
                        const y = (e.clientY - rect.top) / scale;
                        
                        const newItem = {
                          id: Date.now().toString(),
                          type: 'artwork',
                          artworkId,
                          left: `${x}px`,
                          top: `${y}px`,
                          width: '150px',
                          height: '150px',
                          zIndex: payload.canvasItems.length + 1
                        };
                        update({ canvasItems: [...payload.canvasItems, newItem] });
                        setSelectedItemId(newItem.id);
                      }
                    }}
                    className="relative bg-white shadow-lg transition-transform origin-top-left"
                    style={{ 
                      width: payload.canvasWidth || (payload.pdfOrientation === 'landscape' ? 1123 : 794),
                      height: payload.canvasHeight || (payload.pdfOrientation === 'landscape' ? 794 : 1123),
                      transform: `scale(${payload.canvasZoom / 100})`,
                      backgroundImage: payload.customBackgroundUrl ? `url('${payload.customBackgroundUrl}')` : 'none',
                      backgroundSize: '100% 100%',
                      backgroundPosition: 'center',
                    }}
                  >
                    {payload.canvasItems.map(cItem => (
                      <CanvasItem 
                        key={cItem.id} 
                        item={cItem} 
                        art={items.find(x => x.id === cItem.artworkId) || { coverImageUrl: '' }}
                        scale={payload.canvasZoom / 100}
                        isSelected={selectedItemId === cItem.id}
                        onClick={() => setSelectedItemId(cItem.id)}
                        onUpdate={(updated) => update({ canvasItems: payload.canvasItems.map(x => x.id === updated.id ? updated : x) })}
                        onRemove={(id) => {
                          update({ canvasItems: payload.canvasItems.filter(x => x.id !== id) });
                          if (selectedItemId === id) setSelectedItemId(null);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "preview":
        return (
          <div className="h-[calc(100vh-200px)] w-full flex animate-in fade-in slide-in-from-bottom-2 duration-300 gap-6">
            {/* Left strip */}
            <div className="w-64 bg-white border border-[#E0E0E0] rounded-2xl flex flex-col overflow-hidden">
               <div className="p-4 border-b border-[#E0E0E0] bg-[#F8F8F8]">
                 <h4 className="font-bold text-[#212121]">Xuất Bản Tập San</h4>
                 <p className="text-xs text-[#666] mt-1">{payload.layoutMode === 'custom_canvas' ? 'Canvas Tự do' : `${canvasArtworks.length} tác phẩm đã chọn`}</p>
               </div>
               <div className="p-4 flex-1 overflow-y-auto space-y-4">
                 {payload.layoutMode === 'template' ? (
                   <div>
                      <label className="block text-xs font-bold text-[#666] mb-1">Khổ Giấy</label>
                      <select value={payload.pdfSize} onChange={e => update({ pdfSize: e.target.value })} className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm bg-white font-semibold">
                        <option value="A4">A4 Portrait (210x297)</option>
                        <option value="Square">Vuông (210x210)</option>
                      </select>
                   </div>
                 ) : (
                   <div>
                     <label className="block text-xs font-bold text-[#666] mb-1">Khổ Giấy Tự Động</label>
                     <div className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm bg-[#F8F8F8] font-bold text-[#1a4ba8]">
                       {payload.canvasWidth || 1123} x {payload.canvasHeight || 794} px
                     </div>
                   </div>
                 )}
                 <div>
                    <label className="block text-xs font-bold text-[#666] mb-1">Chất lượng in</label>
                    <select value={payload.pdfResolution} onChange={e => update({ pdfResolution: e.target.value })} className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm bg-white font-semibold">
                      <option value="print_300dpi">In ấn (300 DPI, CMYK)</option>
                      <option value="screen_72dpi">Đăng web (72 DPI, RGB)</option>
                    </select>
                 </div>
               </div>
               <div className="p-4 border-t border-[#E0E0E0]">
                 <button onClick={handleExport} disabled={exporting} className="w-full py-3 rounded-xl bg-[#1a4ba8] text-white font-bold shadow hover:bg-[#0d2e6e] transition-all flex items-center justify-center gap-2">
                   <FileDown size={18} /> {exporting ? "Đang xử lý..." : "Print to PDF"}
                 </button>
               </div>
            </div>

            {/* Right Iframe preview full width */}
            <div className="flex-1 bg-[#E0E0E0] rounded-2xl overflow-hidden border border-[#CCC] relative shadow-inner group">
              <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm z-10 flex items-center gap-2">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
                Live Full Preview (Nháy đúp vào Văn bản / Ảnh để sửa trực tiếp)
              </div>
              <iframe ref={iframeRef} className="w-full h-full bg-white border-0" title="PDF Preview" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;700&family=Caveat:wght@400;700&family=Dancing+Script:wght@400;700&family=Inter:wght@400;700&family=Lora:ital,wght@0,400;0,700;1,400&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Montserrat:ital,wght@0,400;0,700;1,400&family=Pacifico&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Roboto:ital,wght@0,400;0,700;1,400&display=swap');
      `}</style>
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-[#E0E0E0] bg-white relative z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-[#F8F8F8] text-[#666] flex items-center justify-center transition-colors"><X size={20} /></button>
          <div>
            <h2 className="text-xl font-bold text-[#212121]">Thiết lập Xuất Tập San</h2>
            <p className="text-sm text-[#1a4ba8] font-semibold">{collection?.name || "Bộ sưu tập"}</p>
          </div>
        </div>
        
        {/* Steps Tracker */}
        <div className="flex items-center gap-2">
          {currentSteps.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <button onClick={() => setStep(i)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${i === step ? "bg-[#212121] text-white shadow-md" : i < step ? "bg-[#e0eaff] text-[#1a4ba8]" : "bg-transparent text-[#999] hover:bg-[#F8F8F8]"}`}>
                {i < step ? <Check size={16} /> : <s.icon size={16} />}
                <span className="hidden md:inline">{s.label}</span>
              </button>
              {i < currentSteps.length - 1 && <ChevronRight size={16} className="text-[#CCC] mx-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto bg-[#FAFAFA] p-8 ${(currentSteps[step]?.key === 'preview' || currentSteps[step]?.key === 'canvas') ? '' : 'flex flex-col'}`}>
        <div className={`${(currentSteps[step]?.key === 'preview' || currentSteps[step]?.key === 'canvas') ? 'w-full h-full' : 'max-w-6xl mx-auto bg-white rounded-3xl border border-[#E0E0E0] shadow-sm min-h-[600px] p-8 flex flex-col w-full shrink-0'}`}>
          {renderStep()}
        </div>
      </div>

      {/* Footer / Navigation */}
      <div className="flex items-center justify-between px-8 py-5 border-t border-[#E0E0E0] bg-white z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        <button onClick={() => setStep(Math.max(0, step - 1))} className={`px-6 py-3 rounded-xl border border-[#E0E0E0] font-bold text-[#666] hover:bg-[#F8F8F8] transition-colors flex items-center gap-2 ${step === 0 ? "opacity-0 pointer-events-none" : ""}`}>
          <ChevronLeft size={18} /> Quay lại
        </button>
        <div className="flex gap-2">
          {currentSteps.map((_, i) => <div key={i} className={`w-2.5 h-2.5 rounded-full ${i === step ? "bg-[#1a4ba8]" : "bg-[#E0E0E0]"}`} />)}
        </div>
        {step < currentSteps.length - 1 ? (
          <button onClick={() => setStep(step + 1)} className="px-8 py-3 rounded-xl bg-[#212121] text-white font-bold shadow-md hover:opacity-90 hover:shadow-lg transition-all flex items-center gap-2">
            Tiếp tục <ChevronRight size={18} />
          </button>
        ) : (
          <div className="w-[140px]"></div>
        )}
      </div>
    </div>
  );
}
