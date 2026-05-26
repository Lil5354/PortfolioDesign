import re

def update_file():
    with open('portfolio_system.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the CollectionExportConfigPage function
    start_str = "function CollectionExportConfigPage({ setPage, collection, onUpdateCollection }) {"
    
    # We know the next function is RegisterPage
    end_str = "function RegisterPage({ setPage }) {"
    
    start_idx = content.find(start_str)
    end_idx = content.find(end_str)
    
    if start_idx == -1 or end_idx == -1:
        print("Could not find the component boundaries.")
        return

    new_component = """function SortableArtworkCard({ item, id, onClick, deleteMode, isSelected, onToggleSelect, isHidden, onToggleHide }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isHidden ? 0.4 : (isDragging ? 0.8 : 1),
  };

  const badgeColors = {
    "Vàng": "#ecc94b",
    "Bạc": "#a0aec0",
    "Đồng": "#ed8936",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white border rounded-xl overflow-hidden transition-all cursor-pointer ${isSelected ? "border-[#077E9E] shadow-md ring-2 ring-[#077E9E]/20" : "border-[#E0E0E0] hover:shadow-md hover:border-[#077E9E]"}`}
      onClick={onClick}
    >
      <div className="aspect-[4/3] bg-[#F8F8F8] overflow-hidden relative">
        <img
          src={item.artwork?.coverImageUrl || item.artwork?.img || ""}
          alt={item.artwork?.title || ""}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          draggable={false}
        />
        {item.category && (
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-[10px] font-bold text-white uppercase tracking-wider">
            {item.category}
          </div>
        )}
        {item.award && item.award !== "Không có" && (
          <div className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm" style={{ backgroundColor: badgeColors[item.award] || "#fff", color: item.award==="Vàng" ? "#744210" : (item.award==="Bạc" ? "#2d3748" : "#7b341e") }} title={`Giải ${item.award}`}>
            ★
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-[#212121] truncate">{item.artwork?.title || "Untitled"}</p>
        <p className="text-xs text-[#666666] truncate">{item.artwork?.user?.fullName || item.artwork?.student || ""}</p>
      </div>

      {deleteMode ? (
        <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="w-5 h-5 accent-[#8B1A1A] cursor-pointer shadow-sm"
          />
        </div>
      ) : (
        <>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-white bg-black/40 rounded p-1 cursor-grab" {...attributes} {...listeners}>
            <GripVertical size={16} />
          </div>
          <div className="absolute top-2 right-9 opacity-0 group-hover:opacity-100 transition-opacity text-white bg-black/40 rounded p-1" onClick={(e) => { e.stopPropagation(); onToggleHide(); }}>
            {isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
          </div>
        </>
      )}
    </div>
  );
}

function CollectionExportConfigPage({ setPage, collection, onUpdateCollection, onOpenCatalogBuilder }) {
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState([]);
  const [detailArtwork, setDetailArtwork] = useState(null);
  const [saved, setSaved] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (!collection) {
    return (
      <div className="flex h-screen overflow-hidden bg-white">
        <AdminSidebar active="admin_export" setPage={setPage} />
        <div className="flex-1 p-8">
          <p className="text-sm text-[#666666]">{t("collectionNotFound")}</p>
          <button onClick={() => setPage("admin_export")} className="mt-4 px-4 py-2 rounded-lg border border-[#E0E0E0] text-sm font-semibold hover:bg-[#F8F8F8]">
            {t("goBack")}
          </button>
        </div>
      </div>
    );
  }

  const detailedItems = collection.items.filter((it) => it.artwork);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = detailedItems.findIndex(it => it.artworkId === active.id);
      const newIndex = detailedItems.findIndex(it => it.artworkId === over.id);
      const next = arrayMove(collection.items, oldIndex, newIndex);
      onUpdateCollection && onUpdateCollection({ items: next });
    }
  };

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setSelectedForDelete([]);
  };

  const toggleSelectDelete = (artworkId) => {
    setSelectedForDelete((prev) =>
      prev.includes(artworkId) ? prev.filter((x) => x !== artworkId) : [...prev, artworkId]
    );
  };

  const executeDelete = () => {
    if (selectedForDelete.length === 0) return;
    const next = collection.items.filter((it) => !selectedForDelete.includes(it.artworkId));
    onUpdateCollection && onUpdateCollection({ items: next });
    setSelectedForDelete([]);
    setDeleteMode(false);
    setDetailArtwork(null);
  };

  const toggleHide = (artworkId) => {
    const next = collection.items.map(it => it.artworkId === artworkId ? { ...it, isHidden: !it.isHidden } : it);
    onUpdateCollection && onUpdateCollection({ items: next });
  };

  const updateDetailArtwork = (updates) => {
    if (!detailArtwork) return;
    const updated = { ...detailArtwork, ...updates };
    setDetailArtwork(updated);
    const nextItems = collection.items.map(it => it.artworkId === detailArtwork.artworkId ? updated : it);
    onUpdateCollection && onUpdateCollection({ items: nextItems });
  };

  const activeCount = detailedItems.filter(it => !it.isHidden).length;

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AdminSidebar active="admin_export" setPage={setPage} />
      <div className="flex-1 overflow-y-auto p-8 flex flex-col">
        <div className="flex items-start justify-between gap-6 mb-8 pb-6 border-b border-[#E0E0E0] flex-shrink-0">
          <div className="min-w-0 flex-1 max-w-xl">
            <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">Quản lý Bộ sưu tập</p>
            <input
              value={collection.name}
              onChange={(e) => onUpdateCollection && onUpdateCollection({ name: e.target.value })}
              className="w-full text-2xl font-bold text-[#212121] bg-transparent border-none outline-none placeholder:text-[#ccc]"
              placeholder={t("collectionNamePlaceholder")}
            />
            <textarea
              value={collection.curatorEssay || ""}
              onChange={(e) => onUpdateCollection && onUpdateCollection({ curatorEssay: e.target.value })}
              className="w-full mt-2 text-sm text-[#666666] bg-transparent border-none outline-none resize-none placeholder:text-[#ccc]"
              rows={2}
              placeholder={t("collectionDescPlaceholder")}
            />
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => setPage("admin_export")} className="px-4 py-2.5 rounded-xl border border-[#E0E0E0] text-sm font-semibold text-[#666666] hover:bg-[#F8F8F8] transition-colors cursor-pointer">
              {t("goBack")}
            </button>
            <button onClick={() => { onOpenCatalogBuilder && onOpenCatalogBuilder(collection); }} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer bg-[#077E9E] text-white hover:bg-[#055F78]`}>
              <Settings size={16} /> Thiết lập Xuất Tập San
            </button>
          </div>
        </div>

        <div className="flex gap-8 flex-1 min-h-0">
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <p className="text-sm font-semibold text-[#212121]">
                {detailedItems.length} ấn phẩm ({activeCount} hiển thị)
              </p>
              <div className="flex items-center gap-2">
                {deleteMode && (
                  <>
                    <span className="text-sm text-[#666666]">{t("selected")} {selectedForDelete.length}</span>
                    <button onClick={executeDelete} disabled={selectedForDelete.length === 0} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${selectedForDelete.length > 0 ? "bg-[#8B1A1A] text-white" : "bg-[#E0E0E0] text-[#999]"}`}>
                      {t("delete")}
                    </button>
                  </>
                )}
                <button onClick={toggleDeleteMode} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${deleteMode ? "bg-[#8B1A1A] text-white border-[#8B1A1A]" : "bg-white text-[#666] border-[#E0E0E0] hover:border-[#8B1A1A] hover:text-[#8B1A1A]"}`}>
                  <Trash2 size={14} /> {deleteMode ? t("exitDeleteMode") : t("deleteArtwork")}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 pb-10">
              {detailedItems.length === 0 ? (
                <div className="text-sm text-[#666666] border border-dashed border-[#E0E0E0] rounded-xl p-8 text-center">
                  {t("noArtworksInCollectionMsg")}
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={detailedItems.map(it => it.artworkId)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-3 xl:grid-cols-4 gap-4">
                      {detailedItems.map((it) => (
                        <SortableArtworkCard
                          key={it.artworkId}
                          id={it.artworkId}
                          item={it}
                          deleteMode={deleteMode}
                          isSelected={detailArtwork?.artworkId === it.artworkId || selectedForDelete.includes(it.artworkId)}
                          isHidden={it.isHidden}
                          onToggleHide={() => toggleHide(it.artworkId)}
                          onToggleSelect={() => deleteMode ? toggleSelectDelete(it.artworkId) : setDetailArtwork(it)}
                          onClick={() => !deleteMode && setDetailArtwork(it)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>

          {detailArtwork && (
            <div className="w-80 flex-shrink-0 flex flex-col bg-[#F8F8F8] border border-[#E0E0E0] rounded-2xl overflow-hidden self-start">
              <div className="px-5 py-4 border-b border-[#E0E0E0] flex items-center justify-between bg-white">
                <h3 className="font-bold text-[#212121] text-sm truncate pr-4">{detailArtwork.artwork?.title}</h3>
                <button onClick={() => setDetailArtwork(null)} className="text-[#666] hover:text-[#212121]"><X size={18} /></button>
              </div>
              <div className="p-5 flex flex-col gap-5 flex-1 overflow-y-auto">
                <div className="aspect-[4/3] bg-white rounded-lg overflow-hidden border border-[#E0E0E0]">
                  <img src={detailArtwork.artwork?.coverImageUrl || detailArtwork.artwork?.img} alt="" className="w-full h-full object-cover" />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-[#666666] mb-1.5 uppercase tracking-wider">Chuyên đề (Category)</label>
                  <input
                    type="text"
                    value={detailArtwork.category || detailArtwork.artwork?.category || ""}
                    onChange={(e) => updateDetailArtwork({ category: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E]"
                    placeholder="VD: Brand Identity, Typography..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#666666] mb-1.5 uppercase tracking-wider">Giải thưởng (Award)</label>
                  <select
                    value={detailArtwork.award || "Không có"}
                    onChange={(e) => updateDetailArtwork({ award: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E]"
                  >
                    <option value="Không có">Không có</option>
                    <option value="Vàng">Vàng</option>
                    <option value="Bạc">Bạc</option>
                    <option value="Đồng">Đồng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#666666] mb-1.5 uppercase tracking-wider">Ghi chú của Giảng viên</label>
                  <textarea
                    value={detailArtwork.note || ""}
                    onChange={(e) => updateDetailArtwork({ note: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 bg-white border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E] resize-none"
                    placeholder="Nhận xét ngắn gọn về tác phẩm..."
                  />
                </div>
                
                <div className="mt-2 text-[11px] text-[#888]">
                  Mọi thay đổi trên panel này sẽ được lưu tự động vào bộ sưu tập.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"""
    
    new_content = content[:start_idx] + new_component + content[end_idx:]
    with open('portfolio_system.jsx', 'w', encoding='utf-8') as f:
        f.write(new_content)

update_file()
print("Updated successfully")
