import os

CODE = """import { useState, useCallback, useRef, useEffect } from "react";
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
  Palette, Settings, FileText, Smartphone, Laptop
} from "lucide-react";

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
    <div ref={setNodeRef} style={style} className={`flex items-center gap-3 p-3 rounded-xl border ${isSelected ? "border-[#077E9E] bg-[#F0F8FB] shadow-sm" : "border-[#E0E0E0] bg-white"} transition-colors mb-2`}>
      <button {...attributes} {...listeners} className="cursor-grab text-[#666666] hover:text-[#212121] p-1"><GripVertical size={16} /></button>
      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
        {item.coverImageUrl ? <img src={item.coverImageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">IMG</div>}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#212121] truncate">{item.title}</p>
        <p className="text-xs text-[#666666] truncate">{item.student} - {item.category}</p>
      </div>
      <input type="checkbox" checked={isSelected} onChange={() => onToggle(item.id)} className="w-4 h-4 accent-[#077E9E] cursor-pointer" />
    </div>
  );
}

const STEPS = [
  { key: "basic", label: "Thông tin", icon: AlignLeft },
  { key: "layout", label: "Bố cục", icon: Layout },
  { key: "design", label: "Visual", icon: Palette },
  { key: "structure", label: "Cấu trúc", icon: FileText },
  { key: "preview", label: "Preview", icon: Eye },
];

export default function CatalogBuilderWizard({ collection, onClose }) {
  const [step, setStep] = useState(0);
  const [exporting, setExporting] = useState(false);
  const iframeRef = useRef(null);

  // PAYLOAD ĐẦY ĐỦ THEO PHASE 3
  const [payload, setPayload] = useState({
    // 1. Basic Info
    journalTitle: collection?.name || "GRAPHICA",
    journalSubtitle: "Triển Lãm Ấn Phẩm Đồ Họa Thường Niên",
    editionNumber: "VII",
    eventName: "Triển Lãm Cuối Khóa K16",
    schoolName: "Đại học Tôn Đức Thắng",
    departmentName: "Khoa Mỹ thuật Công nghiệp",
    academicYear: "2024 - 2025",
    publishMonthYear: "05/2025",
    forewordText: "<p>Kính gửi quý thầy cô và các bạn sinh viên,</p><p>Đây là tập san tổng hợp những tác phẩm xuất sắc nhất...</p>",
    closingText: "<p>Xin trân trọng cảm ơn.</p>",
    thanksList: "Ban Giám Hiệu, Khoa MTCN",
    
    // 2. Layout Setup
    layoutTheme: "modern", // classic, modern, asymmetrical
    coverLayout: "centered", // centered, top_heavy, split
    coverImage: "", // URL ảnh bìa tùy chỉnh
    showOnCover: { logo: true, title: true, edition: true, event: true, year: true, dept: true },
    tocLayout: "grid_2col", // grid_2col, list, visual
    artworkCardStyle: "magazine_spread", // magazine, editorial, gallery
    artworksPerPage: 1, // 1, 2, 3, 4
    showOnArtwork: { image: true, title: true, student: true, category: true, note: true, award: true },
    imageDisplayMode: "contain", // contain, cover, original

    // 3. Design System
    colorMode: "dark", // dark, light
    primaryColor: "#c9a84c", // Gold
    secondaryColor: "#8b1a1a", // Crimson
    backgroundColor: "#0a0a0a",
    textColor: "#f5f0e8",
    headingFont: "Playfair Display",
    bodyFont: "Cormorant Garamond",
    monoFont: "Space Mono",
    borderStyle: "gold_rule",
    showGrain: true,
    bgLetter: "G",

    // 4. Structure
    enabledArtworkIds: (collection?.items || []).map((it) => it.artworkId),
    artworkOrderIds: (collection?.items || []).map((it) => it.artworkId),

    // 5. Export
    pdfSize: "A4",
    pdfOrientation: "portrait",
    pdfResolution: "print_300dpi",
    includeBleed: true,
  });

  const update = useCallback((patch) => setPayload(p => ({ ...p, ...patch })), []);
  const updateNested = useCallback((key, field, val) => setPayload(p => ({ ...p, [key]: { ...p[key], [field]: val } })), []);

  const items = (collection?.items || []).map(it => ({
    id: it.artworkId,
    title: it.artwork?.title || "Untitled",
    student: it.artwork?.user?.fullName || "Student",
    coverImageUrl: it.artwork?.coverImageUrl || "",
    category: it.category || "Design",
    note: it.note || "",
    award: it.award || ""
  }));

  const enabledArtworks = items.filter(it => payload.enabledArtworkIds.includes(it.id));
  const sortedEnabled = payload.artworkOrderIds.map(id => items.find(it => it.id === id)).filter(Boolean).filter(it => payload.enabledArtworkIds.includes(it.id));

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

  // HTML Preview generation (simplified logic for Iframe)
  const generatePreviewHTML = () => {
    const themeStyles = `
      :root {
        --bg: ${payload.backgroundColor};
        --text: ${payload.textColor};
        --primary: ${payload.primaryColor};
        --secondary: ${payload.secondaryColor};
        --heading-font: '${payload.headingFont}', serif;
        --body-font: '${payload.bodyFont}', serif;
        --mono-font: '${payload.monoFont}', monospace;
      }
      body { background: var(--bg); color: var(--text); font-family: var(--body-font); margin: 0; padding: 0; }
      .page { width: 100%; min-height: 100vh; display: flex; flex-direction: column; position: relative; overflow: hidden; page-break-after: always; padding: 40px; box-sizing: border-box; }
      .cover { justify-content: center; align-items: center; text-align: center; }
      .title { font-family: var(--heading-font); font-size: 4rem; font-weight: 700; color: var(--primary); margin-bottom: 1rem; }
      .subtitle { font-size: 1.5rem; margin-bottom: 2rem; font-style: italic; }
      .meta { font-family: var(--mono-font); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px; }
      .border-gold { border: 1px solid var(--primary); position: absolute; inset: 20px; pointer-events: none; }
      .bg-letter { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 60vw; opacity: 0.05; font-family: var(--heading-font); pointer-events: none; }
      .artwork-page { display: flex; flex-direction: ${payload.layoutTheme === 'classic' ? 'column' : 'row'}; gap: 20px; align-items: center; justify-content: center;}
      .artwork-img { max-width: 100%; max-height: 60vh; object-fit: ${payload.imageDisplayMode}; border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
      .artwork-info { flex: 1; text-align: ${payload.layoutTheme === 'classic' ? 'center' : 'left'}; }
    `;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Space+Mono&display=swap" rel="stylesheet">
        <style>${themeStyles}</style>
      </head>
      <body>
        <!-- Cover Page -->
        <div class="page cover">
          ${payload.borderStyle === 'gold_rule' ? '<div class="border-gold"></div>' : ''}
          ${payload.bgLetter ? `<div class="bg-letter">${payload.bgLetter}</div>` : ''}
          <div style="z-index: 10">
            ${payload.showOnCover.edition ? `<div class="meta" style="margin-bottom: 2rem">EDITION ${payload.editionNumber}</div>` : ''}
            ${payload.showOnCover.title ? `<h1 class="title">${payload.journalTitle}</h1>` : ''}
            <div class="subtitle">${payload.journalSubtitle}</div>
            ${payload.showOnCover.event ? `<div class="meta" style="margin-top: 2rem">${payload.eventName}</div>` : ''}
            ${payload.showOnCover.dept ? `<div class="meta" style="margin-top: 1rem">${payload.schoolName} <br> ${payload.departmentName}</div>` : ''}
          </div>
        </div>
        
        <!-- Artwork Sample Page -->
        ${sortedEnabled.length > 0 ? `
        <div class="page artwork-page">
           ${payload.borderStyle === 'gold_rule' ? '<div class="border-gold"></div>' : ''}
           <div style="flex: 1.5; text-align: center">
             <img src="${sortedEnabled[0].coverImageUrl}" class="artwork-img" />
           </div>
           <div class="artwork-info" style="z-index:10;">
             <h2 class="title" style="font-size: 2.5rem; margin-bottom: 0.5rem">${sortedEnabled[0].title}</h2>
             <p class="subtitle" style="font-size: 1.2rem; color: var(--primary)">${sortedEnabled[0].student}</p>
             <p class="meta" style="margin-bottom: 1rem">${sortedEnabled[0].category}</p>
             ${payload.showOnArtwork.note && sortedEnabled[0].note ? `<p style="font-style: italic; border-left: 2px solid var(--primary); padding-left: 1rem; margin-top: 2rem">"${sortedEnabled[0].note}"</p>` : ''}
             ${payload.showOnArtwork.award && sortedEnabled[0].award ? `<div style="margin-top: 2rem; color: var(--primary); font-weight: bold; border: 1px solid var(--primary); display: inline-block; padding: 4px 12px; border-radius: 20px;">Giải ${sortedEnabled[0].award}</div>` : ''}
           </div>
        </div>
        ` : ''}
      </body>
      </html>
    `;
  };

  useEffect(() => {
    if (step === 4 && iframeRef.current) {
      const doc = iframeRef.current.contentWindow.document;
      doc.open();
      doc.write(generatePreviewHTML());
      doc.close();
    }
  }, [step, payload]);

  const handleExport = async () => {
    setExporting(true);
    setTimeout(() => {
      alert("Mô phỏng xuất PDF thành công (Puppeteer backend)!");
      setExporting(false);
    }, 2000);
  };

  const InputRow = ({ label, value, onChange, placeholder }) => (
    <div className="mb-4">
      <label className="block text-xs font-bold text-[#666] mb-1.5 uppercase tracking-wide">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-2.5 border border-[#E0E0E0] rounded-xl text-sm outline-none focus:border-[#077E9E] focus:ring-2 focus:ring-[#077E9E]/20 transition-all bg-[#F8F8F8] focus:bg-white" />
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <h3 className="text-xl font-bold text-[#212121] mb-6 flex items-center gap-2"><AlignLeft className="text-[#077E9E]" /> Tiêu đề & Thông tin bìa</h3>
              <div className="grid grid-cols-2 gap-x-6">
                <InputRow label="Tên tập san" value={payload.journalTitle} onChange={v => update({ journalTitle: v })} />
                <InputRow label="Phụ đề" value={payload.journalSubtitle} onChange={v => update({ journalSubtitle: v })} />
                <InputRow label="Số xuất bản (Edition)" value={payload.editionNumber} onChange={v => update({ editionNumber: v })} />
                <InputRow label="Tên sự kiện / Chủ đề" value={payload.eventName} onChange={v => update({ eventName: v })} />
                <InputRow label="Tên trường" value={payload.schoolName} onChange={v => update({ schoolName: v })} />
                <InputRow label="Khoa / Bộ môn" value={payload.departmentName} onChange={v => update({ departmentName: v })} />
              </div>
            </div>
            <hr className="border-[#E0E0E0]" />
            <div>
              <h3 className="text-xl font-bold text-[#212121] mb-6">Nội dung Lời tựa</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-[#666] mb-1.5 uppercase tracking-wide">Lời mở đầu</label>
                  <RichTextEditor value={payload.forewordText} onChange={v => update({ forewordText: v })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#666] mb-1.5 uppercase tracking-wide">Lời kết & Cảm ơn</label>
                  <RichTextEditor value={payload.closingText} onChange={v => update({ closingText: v })} />
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <h3 className="text-xl font-bold text-[#212121] mb-6 flex items-center gap-2"><Layout className="text-[#077E9E]" /> Bố cục tổng thể (Theme)</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: "classic", label: "Classic", desc: "Cổ điển, đối xứng, sang trọng." },
                  { id: "modern", label: "Modern", desc: "Hiện đại, grid full-bleed." },
                  { id: "asymmetrical", label: "Editorial", label2: "Bất đối xứng", desc: "Phá cách như tạp chí nghệ thuật." }
                ].map(t => (
                  <button key={t.id} onClick={() => update({ layoutTheme: t.id })} className={`p-5 rounded-2xl border-2 text-left transition-all ${payload.layoutTheme === t.id ? "border-[#077E9E] bg-[#F0F8FB]" : "border-[#E0E0E0] hover:border-[#B3D9E8] bg-white"}`}>
                    <div className="text-sm font-bold text-[#212121] mb-1">{t.label}</div>
                    <div className="text-xs text-[#666]">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <hr className="border-[#E0E0E0]" />
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-bold text-[#212121] mb-4">Trang Bìa</h4>
                <div className="space-y-3">
                  <select value={payload.coverLayout} onChange={e => update({ coverLayout: e.target.value })} className="w-full px-4 py-2 border border-[#E0E0E0] rounded-xl text-sm bg-white outline-none">
                    <option value="centered">Căn giữa (Centered)</option>
                    <option value="top_heavy">Phía trên (Top Heavy)</option>
                    <option value="split">Chia dọc (Split Vertical)</option>
                  </select>
                  <div className="bg-[#F8F8F8] p-4 rounded-xl border border-[#E0E0E0] space-y-2">
                    <p className="text-xs font-bold text-[#666] mb-2 uppercase">Hiển thị thông tin</p>
                    {Object.keys(payload.showOnCover).map(key => (
                      <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={payload.showOnCover[key]} onChange={e => updateNested("showOnCover", key, e.target.checked)} className="accent-[#077E9E]" />
                        <span className="capitalize">{key}</span>
                      </label>
                    ))}
                  </div>
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
                  <select value={payload.imageDisplayMode} onChange={e => update({ imageDisplayMode: e.target.value })} className="w-full px-4 py-2 border border-[#E0E0E0] rounded-xl text-sm bg-white outline-none">
                    <option value="contain">Hiển thị toàn bộ (Contain)</option>
                    <option value="cover">Cắt vừa khung (Cover Crop)</option>
                  </select>
                  <div className="bg-[#F8F8F8] p-4 rounded-xl border border-[#E0E0E0] space-y-2">
                    <p className="text-xs font-bold text-[#666] mb-2 uppercase">Hiển thị thông tin</p>
                    {Object.keys(payload.showOnArtwork).map(key => (
                      <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={payload.showOnArtwork[key]} onChange={e => updateNested("showOnArtwork", key, e.target.checked)} className="accent-[#077E9E]" />
                        <span className="capitalize">{key}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-xl font-bold text-[#212121] flex items-center gap-2"><Palette className="text-[#077E9E]" /> Thiết kế Visual</h3>
            
            <div className="bg-[#F8F8F8] p-5 rounded-2xl border border-[#E0E0E0]">
              <h4 className="text-sm font-bold text-[#212121] mb-4">Color Mode & Theme Presets</h4>
              <div className="flex gap-3 mb-6">
                {[
                  { name: "Onyx Gold", bg: "#0a0a0a", text: "#f5f0e8", primary: "#c9a84c" },
                  { name: "Ivory Classic", bg: "#f5f0e8", text: "#2c3e50", primary: "#8b1a1a" },
                  { name: "Minimal", bg: "#ffffff", text: "#111111", primary: "#000000" },
                ].map(theme => (
                  <button key={theme.name} onClick={() => update({ backgroundColor: theme.bg, textColor: theme.text, primaryColor: theme.primary })} 
                    className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border border-[#E0E0E0] bg-white hover:border-[#077E9E] transition-all">
                    <div className="w-full h-8 rounded-lg flex overflow-hidden border border-gray-200">
                      <div className="flex-1" style={{ background: theme.bg }}></div>
                      <div className="flex-1" style={{ background: theme.primary }}></div>
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
                      <option value="Playfair Display">Playfair Display (Sang trọng)</option>
                      <option value="Cormorant">Cormorant (Thanh lịch)</option>
                      <option value="DM Serif Display">DM Serif (Hiện đại)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#666] mb-1">Body Font</label>
                    <select value={payload.bodyFont} onChange={e => update({ bodyFont: e.target.value })} className="w-full px-4 py-2 border border-[#E0E0E0] rounded-xl text-sm outline-none">
                      <option value="Cormorant Garamond">Cormorant Garamond</option>
                      <option value="Lora">Lora</option>
                      <option value="Inter">Inter (Sans-serif)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#212121] mb-4">Chi tiết trang trí (Decorations)</h4>
                <div className="space-y-3">
                  <select value={payload.borderStyle} onChange={e => update({ borderStyle: e.target.value })} className="w-full px-4 py-2 border border-[#E0E0E0] rounded-xl text-sm outline-none">
                    <option value="gold_rule">Viền mỏng kim loại (Gold Rule)</option>
                    <option value="double_line">Viền đôi (Double Line)</option>
                    <option value="none">Không có viền</option>
                  </select>
                  <label className="flex items-center gap-2 text-sm cursor-pointer mt-4">
                    <input type="checkbox" checked={payload.showGrain} onChange={e => update({ showGrain: e.target.checked })} className="accent-[#077E9E]" />
                    <span>Thêm hiệu ứng Grain (Hạt giấy)</span>
                  </label>
                  <div className="mt-4">
                    <label className="block text-xs font-bold text-[#666] mb-1">Chữ cái in chìm (Background Letter)</label>
                    <input value={payload.bgLetter} onChange={e => update({ bgLetter: e.target.value })} maxLength={1} className="w-16 px-4 py-2 border border-[#E0E0E0] rounded-xl text-center font-bold text-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#212121] flex items-center gap-2"><FileText className="text-[#077E9E]" /> Cấu trúc & Thứ tự trang</h3>
              <div className="bg-[#F8F8F8] px-3 py-1.5 rounded-full text-xs font-bold text-[#666]">
                {payload.enabledArtworkIds.length} / {items.length} tác phẩm xuất bản
              </div>
            </div>
            
            <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6">
              <div className="mb-4 space-y-2">
                <div className="p-3 bg-[#F0F8FB] border border-[#B3D9E8] rounded-xl text-sm font-bold text-[#077E9E] flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#077E9E]"></div> [TRANG BÌA] Cố định</div>
                <div className="p-3 bg-[#F0F8FB] border border-[#B3D9E8] rounded-xl text-sm font-bold text-[#077E9E] flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#077E9E]"></div> [LỜI MỞ ĐẦU & MỤC LỤC] Cố định</div>
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
                <div className="p-3 bg-[#F0F8FB] border border-[#B3D9E8] rounded-xl text-sm font-bold text-[#077E9E] flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#077E9E]"></div> [LỜI KẾT] Cố định</div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#212121] flex items-center gap-2"><Eye className="text-[#077E9E]" /> Preview & Xuất File</h3>
              <div className="flex gap-4">
                <select value={payload.pdfSize} onChange={e => update({ pdfSize: e.target.value })} className="px-3 py-1.5 border border-[#E0E0E0] rounded-lg text-sm bg-white font-semibold">
                  <option value="A4">Khổ A4 (210x297mm)</option>
                  <option value="Square">Khổ Vuông (210x210mm)</option>
                </select>
                <select value={payload.pdfResolution} onChange={e => update({ pdfResolution: e.target.value })} className="px-3 py-1.5 border border-[#E0E0E0] rounded-lg text-sm bg-white font-semibold">
                  <option value="print_300dpi">In ấn (300 DPI, CMYK)</option>
                  <option value="screen_72dpi">Đăng web (72 DPI, RGB)</option>
                </select>
              </div>
            </div>

            <div className="flex-1 bg-[#E0E0E0] rounded-2xl overflow-hidden border border-[#CCC] relative shadow-inner">
              <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm z-10">Realtime HTML Preview</div>
              {/* Iframe render HTML mockup */}
              <iframe ref={iframeRef} className="w-full h-full bg-white border-0" title="PDF Preview" />
            </div>

            <div className="mt-6">
              <button onClick={handleExport} disabled={exporting} className="w-full py-4 rounded-xl bg-[#077E9E] text-white font-bold text-lg shadow-lg hover:bg-[#055F78] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none">
                <FileDown size={20} /> {exporting ? "Đang kết xuất PDF (Rendering)..." : "Xuất Tập San (Generate PDF)"}
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-[#E0E0E0] bg-white relative z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-[#F8F8F8] text-[#666] flex items-center justify-center transition-colors"><X size={20} /></button>
          <div>
            <h2 className="text-xl font-bold text-[#212121]">Thiết lập Xuất Tập San</h2>
            <p className="text-sm text-[#077E9E] font-semibold">{collection?.name || "Bộ sưu tập"}</p>
          </div>
        </div>
        
        {/* Steps Tracker */}
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <button onClick={() => setStep(i)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${i === step ? "bg-[#212121] text-white shadow-md" : i < step ? "bg-[#E8F4F8] text-[#077E9E]" : "bg-transparent text-[#999] hover:bg-[#F8F8F8]"}`}>
                {i < step ? <Check size={16} /> : <s.icon size={16} />}
                <span className="hidden md:inline">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && <ChevronRight size={16} className="text-[#CCC] mx-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-[#FAFAFA] p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-[#E0E0E0] shadow-sm min-h-[600px] p-8 flex flex-col">
          {renderStep()}
        </div>
      </div>

      {/* Footer / Navigation */}
      <div className="flex items-center justify-between px-8 py-5 border-t border-[#E0E0E0] bg-white z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        <button onClick={() => setStep(Math.max(0, step - 1))} className={`px-6 py-3 rounded-xl border border-[#E0E0E0] font-bold text-[#666] hover:bg-[#F8F8F8] transition-colors flex items-center gap-2 ${step === 0 ? "opacity-0 pointer-events-none" : ""}`}>
          <ChevronLeft size={18} /> Quay lại
        </button>
        <div className="flex gap-2">
          {STEPS.map((_, i) => <div key={i} className={`w-2.5 h-2.5 rounded-full ${i === step ? "bg-[#077E9E]" : "bg-[#E0E0E0]"}`} />)}
        </div>
        {step < STEPS.length - 1 ? (
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
"""

with open("components/catalog/CatalogBuilderWizard.jsx", "w", encoding="utf-8") as f:
    f.write(CODE)
print("Updated successfully")
