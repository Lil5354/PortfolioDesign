import { useState, useCallback } from "react";
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
import { X, ChevronLeft, ChevronRight, Check, Image, Type, AlignLeft, Layout, Eye, FileDown, Bold, Italic, List, GripVertical, Plus } from "lucide-react";

const STEPS = [
  { key: "cover", label: "Trang bìa", icon: Image },
  { key: "editorial", label: "Lời mở đầu & Kết", icon: AlignLeft },
  { key: "artworks", label: "Chọn & Sắp xếp", icon: Layout },
  { key: "layout", label: "Bố cục", icon: Layout },
  { key: "preview", label: "Xem trước & Xuất", icon: Eye },
];

function RichTextEditor({ value, onChange, placeholder }) {
  const editor = useEditor({
    extensions: [StarterKit, ImageExtension],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: "prose prose-sm max-w-none outline-none min-h-[160px] px-4 py-3 text-sm text-[#212121]" },
    },
  });

  const addImage = () => {
    const url = prompt("Nhập URL hình ảnh:");
    if (url && editor) editor.chain().focus().setImage({ src: url }).run();
  };

  if (!editor) return <div className="min-h-[160px] bg-[#F8F8F8] rounded-xl border border-[#E0E0E0]" />;

  return (
    <div className="border border-[#E0E0E0] rounded-xl overflow-hidden">
      <div className="flex items-center gap-1 px-2 py-1.5 bg-[#F8F8F8] border-b border-[#E0E0E0] flex-wrap">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded ${editor.isActive("bold") ? "bg-[#E0E0E0]" : "hover:bg-[#E0E0E0]"} transition-colors`} title="In đậm"><Bold size={15} /></button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded ${editor.isActive("italic") ? "bg-[#E0E0E0]" : "hover:bg-[#E0E0E0]"} transition-colors`} title="In nghiêng"><Italic size={15} /></button>
        <span className="w-px h-4 bg-[#E0E0E0] mx-1" />
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded ${editor.isActive("bulletList") ? "bg-[#E0E0E0]" : "hover:bg-[#E0E0E0]"} transition-colors`} title="Danh sách"><List size={15} /></button>
        <button onClick={addImage} className="p-1.5 rounded hover:bg-[#E0E0E0] transition-colors" title="Chèn hình"><Image size={15} /></button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function SortableItem({ item, isSelected, onToggle }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} className={`flex items-center gap-3 p-3 rounded-xl border ${isSelected ? "border-[#077E9E] bg-[#F0F8FB]" : "border-[#E0E0E0] bg-white"} transition-colors`}>
      <button {...attributes} {...listeners} className="cursor-grab text-[#666666] hover:text-[#212121] transition-colors"><GripVertical size={18} /></button>
      <img src={item.coverImageUrl} alt={item.title} className="w-10 h-10 rounded-lg object-cover bg-[#F8F8F8] border border-[#E0E0E0] flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#212121] truncate">{item.title}</p>
        <p className="text-xs text-[#666666] truncate">{item.student}</p>
      </div>
      <input type="checkbox" checked={isSelected} onChange={() => onToggle(item.id)} className="w-4 h-4 accent-[#077E9E] flex-shrink-0" />
    </div>
  );
}

const layoutOptions = [
  { id: "classic", title: "Classic", desc: "1 tác phẩm / trang. Nhiều khoảng trắng, sang trọng.", icon: "□" },
  { id: "modern", title: "Modern", desc: "2 tác phẩm / trang. Grid cân bằng.", icon: "▦" },
  { id: "asymmetrical", title: "Asymmetrical", desc: "Bố cục động, kích thước linh hoạt.", icon: "◰" },
];

export default function CatalogBuilderWizard({ collection, onClose }) {
  const [step, setStep] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [payload, setPayload] = useState({
    collectionName: collection?.name || "",
    coverImageUrl: "",
    mainTitle: "",
    eventTheme: "",
    academicYear: "",
    departmentInfo: "",
    prefaceHtml: "",
    epilogueHtml: "",
    artworkIds: (collection?.items || []).map((it) => it.artworkId),
    enabledArtworkIds: (collection?.items || []).map((it) => it.artworkId),
    layoutStyle: "classic",
  });

  const items = (collection?.items || []).map((it) => ({
    id: it.artworkId,
    title: it.artwork?.title || "Untitled",
    student: it.artwork?.user?.fullName || "",
    coverImageUrl: it.artwork?.coverImageUrl || "",
  }));

  const enabledArtworks = items.filter((it) => payload.enabledArtworkIds.includes(it.id));
  const disabledArtworks = items.filter((it) => !payload.enabledArtworkIds.includes(it.id));
  const sortedEnabled = payload.artworkIds.map((id) => items.find((it) => it.id === id)).filter(Boolean);

  const updatePayload = useCallback((patch) => setPayload((p) => ({ ...p, ...patch })), []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = payload.artworkIds.indexOf(active.id);
    const newIdx = payload.artworkIds.indexOf(over.id);
    if (oldIdx === -1 || newIdx === -1) return;
    updatePayload({ artworkIds: arrayMove(payload.artworkIds, oldIdx, newIdx) });
  };

  const toggleArtwork = (id) => {
    const enabled = payload.enabledArtworkIds.includes(id)
      ? payload.enabledArtworkIds.filter((x) => x !== id)
      : [...payload.enabledArtworkIds, id];
    updatePayload({ enabledArtworkIds: enabled });
  };

  const getPageEstimate = () => {
    let pages = 1;
    if (payload.prefaceHtml) pages += 1;
    const perPage = payload.layoutStyle === "classic" ? 1 : payload.layoutStyle === "modern" ? 2 : 1.5;
    pages += Math.ceil(sortedEnabled.length / perPage);
    if (payload.epilogueHtml) pages += 1;
    return Math.max(2, pages);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch(`/api/collections/${encodeURIComponent(payload.collectionName)}/export-catalog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Export failed");
      if (data.pdfUrl) window.open(data.pdfUrl, "_blank");
      alert("Xuất tập san thành công!");
    } catch (e) {
      alert("Lỗi xuất PDF: " + (e?.message || "Vui lòng thử lại"));
    }
    setExporting(false);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-5 max-w-2xl">
            <h3 className="text-lg font-bold text-[#212121]">Trang bìa</h3>
            <div>
              <label className="block text-sm font-semibold text-[#666666] mb-1.5">Ảnh bìa (URL)</label>
              <div className="flex gap-3">
                <input value={payload.coverImageUrl} onChange={(e) => updatePayload({ coverImageUrl: e.target.value })} placeholder="https://example.com/cover.jpg" className="flex-1 px-4 py-2.5 border border-[#E0E0E0] rounded-xl text-sm outline-none focus:border-[#077E9E]" />
              </div>
              {payload.coverImageUrl && (
                <div className="mt-3 rounded-xl overflow-hidden border border-[#E0E0E0] h-48">
                  <img src={payload.coverImageUrl} alt="Cover preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#666666] mb-1.5">Tiêu đề tập san</label>
                <input value={payload.mainTitle} onChange={(e) => updatePayload({ mainTitle: e.target.value })} placeholder="Triển lãm Đồ án Xuất sắc 2026" className="w-full px-4 py-2.5 border border-[#E0E0E0] rounded-xl text-sm outline-none focus:border-[#077E9E]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#666666] mb-1.5">Chủ đề / Sự kiện</label>
                <input value={payload.eventTheme} onChange={(e) => updatePayload({ eventTheme: e.target.value })} placeholder="Sáng tạo không giới hạn" className="w-full px-4 py-2.5 border border-[#E0E0E0] rounded-xl text-sm outline-none focus:border-[#077E9E]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#666666] mb-1.5">Năm học</label>
                <input value={payload.academicYear} onChange={(e) => updatePayload({ academicYear: e.target.value })} placeholder="2025-2026" className="w-full px-4 py-2.5 border border-[#E0E0E0] rounded-xl text-sm outline-none focus:border-[#077E9E]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#666666] mb-1.5">Khoa / Bộ môn</label>
                <input value={payload.departmentInfo} onChange={(e) => updatePayload({ departmentInfo: e.target.value })} placeholder="Khoa Thiết kế Đồ họa" className="w-full px-4 py-2.5 border border-[#E0E0E0] rounded-xl text-sm outline-none focus:border-[#077E9E]" />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-lg font-bold text-[#212121] mb-1">Lời mở đầu</h3>
              <p className="text-sm text-[#666666] mb-3">Nhập lời tựa cho tập san</p>
              <RichTextEditor value={payload.prefaceHtml} onChange={(v) => updatePayload({ prefaceHtml: v })} placeholder="Nhập lời mở đầu..." />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#212121] mb-1">Lời kết</h3>
              <p className="text-sm text-[#666666] mb-3">Nhập lời kết cho tập san</p>
              <RichTextEditor value={payload.epilogueHtml} onChange={(v) => updatePayload({ epilogueHtml: v })} placeholder="Nhập lời kết..." />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5 max-w-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#212121]">Chọn & Sắp xếp tác phẩm</h3>
              <p className="text-sm text-[#666666]">{payload.enabledArtworkIds.length} / {items.length} tác phẩm được chọn</p>
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
              <SortableContext items={payload.artworkIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {payload.artworkIds.map((id) => {
                    const it = items.find((x) => x.id === id);
                    if (!it) return null;
                    return <SortableItem key={it.id} item={it} isSelected={payload.enabledArtworkIds.includes(it.id)} onToggle={toggleArtwork} />;
                  })}
                </div>
              </SortableContext>
            </DndContext>
            {sortedEnabled.length === 0 && <p className="text-sm text-[#666666] text-center py-8">Chưa có tác phẩm nào trong bộ sưu tập.</p>}
          </div>
        );

      case 3:
        return (
          <div className="space-y-5 max-w-2xl">
            <h3 className="text-lg font-bold text-[#212121]">Chọn bố cục in ấn</h3>
            <p className="text-sm text-[#666666]">Chọn kiểu trình bày cho tập san</p>
            <div className="grid grid-cols-3 gap-4">
              {layoutOptions.map((opt) => (
                <button key={opt.id} onClick={() => updatePayload({ layoutStyle: opt.id })} className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${payload.layoutStyle === opt.id ? "border-[#077E9E] bg-[#F0F8FB]" : "border-[#E0E0E0] bg-white hover:border-[#B3D9E8]"}`}>
                  <div className="text-3xl mb-3 text-[#077E9E]">{opt.icon}</div>
                  <p className="text-sm font-bold text-[#212121] mb-1">{opt.title}</p>
                  <p className="text-xs text-[#666666]">{opt.desc}</p>
                </button>
              ))}
            </div>
            <div className="bg-[#F8F8F8] rounded-xl p-4 border border-[#E0E0E0]">
              <p className="text-sm text-[#666666]">
                <strong>{sortedEnabled.length}</strong> tác phẩm · Bố cục <strong>{layoutOptions.find((o) => o.id === payload.layoutStyle)?.title}</strong> · Ước tính <strong>{getPageEstimate()}</strong> trang
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5 max-w-2xl">
            <h3 className="text-lg font-bold text-[#212121]">Xem trước & Mục lục</h3>
            <div className="bg-[#F8F8F8] rounded-xl p-4 border border-[#E0E0E0] space-y-1">
              <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">Mục lục tự động</p>
              <div className="text-sm text-[#212121] space-y-0.5">
                <p>Trang 1: Bìa — {payload.mainTitle || "(chưa nhập tiêu đề)"}</p>
                {payload.prefaceHtml && <p>Trang 2: Lời mở đầu</p>}
                {sortedEnabled.map((it, i) => {
                  const startPage = 2 + (payload.prefaceHtml ? 1 : 0) + 1;
                  return <p key={it.id}>Trang {startPage + i}: {it.title}</p>;
                })}
                {payload.epilogueHtml && <p>Trang {2 + (payload.prefaceHtml ? 1 : 0) + sortedEnabled.length + 1}: Lời kết</p>}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden">
              <div className="p-4 border-b border-[#E0E0E0] bg-[#F8F8F8] flex items-center gap-2">
                <Eye size={16} className="text-[#666666]" />
                <span className="text-sm font-semibold text-[#666666]">Xem trước (demo)</span>
              </div>
              <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
                <div className="aspect-[a4] bg-white border border-[#E0E0E0] rounded-lg p-6 shadow-sm">
                  {payload.coverImageUrl && <img src={payload.coverImageUrl} alt="" className="w-full h-32 object-cover rounded-lg mb-3" />}
                  <p className="text-xl font-extrabold text-[#212121]">{payload.mainTitle || "Tiêu đề tập san"}</p>
                  <p className="text-sm text-[#666666]">{payload.eventTheme}</p>
                  <p className="text-xs text-[#666666] mt-2">{payload.academicYear}{payload.academicYear && payload.departmentInfo ? " · " : ""}{payload.departmentInfo}</p>
                  <p className="text-[10px] text-[#666666] mt-4 pt-4 border-t border-[#E0E0E0] text-center">Trang bìa — Preview</p>
                </div>
                {sortedEnabled.slice(0, 3).map((it, i) => (
                  <div key={it.id} className="aspect-[a4] bg-white border border-[#E0E0E0] rounded-lg p-4 shadow-sm">
                    <img src={it.coverImageUrl} alt="" className="w-full h-40 object-cover rounded-lg mb-2" />
                    <p className="text-sm font-bold text-[#212121]">{it.title}</p>
                    <p className="text-xs text-[#666666]">{it.student}</p>
                    <p className="text-[10px] text-[#666666] mt-2 pt-2 border-t border-[#E0E0E0] text-center">Trang {2 + (payload.prefaceHtml ? 1 : 0) + i + 1} / {sortedEnabled.length}</p>
                  </div>
                ))}
                {sortedEnabled.length > 3 && <p className="text-sm text-[#666666] text-center">... và {sortedEnabled.length - 3} tác phẩm khác</p>}
              </div>
            </div>

            <button onClick={handleExport} disabled={exporting} className="w-full py-3 rounded-xl bg-[#077E9E] text-white text-sm font-bold hover:bg-[#055F78] transition-colors flex items-center justify-center gap-2 disabled:bg-[#E0E0E0] disabled:text-[#999] cursor-pointer disabled:cursor-not-allowed">
              <FileDown size={18} /> {exporting ? "Đang xuất PDF..." : "Xuất tập san PDF"}
            </button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[80] bg-white flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0] bg-white">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#F8F8F8] text-[#666666] transition-colors cursor-pointer"><X size={20} /></button>
          <div>
            <h2 className="text-lg font-bold text-[#212121]">Tạo Tập San Triển Lãm</h2>
            <p className="text-sm text-[#666666]">Bộ sưu tập: {payload.collectionName}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {STEPS.map((s, i) => (
            <button key={s.key} onClick={() => setStep(i)} className={`w-8 h-8 rounded-full text-xs font-bold transition-colors flex items-center justify-center cursor-pointer ${i === step ? "bg-[#212121] text-white" : i < step ? "bg-[#077E9E] text-white" : "bg-[#F8F8F8] text-[#999] border border-[#E0E0E0]"}`}>
              {i < step ? <Check size={14} /> : i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 px-6 py-2 bg-[#F8F8F8] border-b border-[#E0E0E0] text-sm text-[#666666]">
        {STEPS.map((s, i) => (
          <span key={s.key} className={`flex items-center gap-1.5 ${i === step ? "text-[#212121] font-semibold" : ""}`}>
            <s.icon size={14} /> {s.label}
            {i < STEPS.length - 1 && <span className="text-[#E0E0E0] mx-1">›</span>}
          </span>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        {renderStep()}
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-[#E0E0E0] bg-white">
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="px-4 py-2 rounded-xl border border-[#E0E0E0] text-sm font-semibold text-[#666666] hover:bg-[#F8F8F8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer">
          <ChevronLeft size={16} /> Quay lại
        </button>
        <div className="text-xs text-[#666666]">Bước {step + 1} / {STEPS.length}</div>
        {step < STEPS.length - 1 ? (
          <button onClick={() => setStep(step + 1)} className="px-4 py-2 rounded-xl bg-[#212121] text-white text-sm font-semibold hover:opacity-90 transition-colors flex items-center gap-1.5 cursor-pointer">
            Tiếp theo <ChevronRight size={16} />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
