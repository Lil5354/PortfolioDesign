    const params = { page, limit, tab: activeTab };
    if (query.trim()) params.q = query.trim();
    if (filterSubject !== t("all")) params.subject = filterSubject;
    if (filterYear !== t("all")) params.year = filterYear;
    
    api.admin.artworks(params).then(res => {
      if (id === fetchId.current) {
        setData(prev => ({
          ...res,
          artworks: page === 1 ? (res.artworks || []) : [...(prev.artworks || []), ...(res.artworks || [])],
          counts: res.counts || { all: 0, reported: 0, pending: 0, hidden: 0, highlight: 0 }
        }));
        setLoading(false);
      }
    }).catch(() => { if (id === fetchId.current) setLoading(false); });
  };

  useEffect(() => {
    fetchArtworks();
  }, [page, limit, activeTab, query, filterSubject, filterYear]);

  useEffect(() => {
    setPageNum(1);
    setSelectedIds([]);
  }, [activeTab, query, filterSubject, filterYear]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading && (data.page || 1) < (data.totalPages || 0)) {
          setPageNum(p => p + 1);
        }
      },
      { threshold: 0.1 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => { if (observerTarget.current) observer.unobserve(observerTarget.current); };
  }, [loading, data.page, data.totalPages]);

  const filtered = data.artworks || [];
  const selected = filtered.find((a) => a.id === selectedId) ?? null;

  const handleOpenGallery = (idx) => {
    const imgs = Array.from(new Set([selected?.coverImageUrl, ...(selected?.fileUrls || [])].filter(Boolean)));
    setGalleryImages(imgs);
    setGalleryIdx(idx);
  };

  useEffect(() => {
    if (!selectedId) { setReports([]); return; }
    setReportsLoading(true);
    api.artworks.reports(selectedId).then(setReports).catch(() => setReports([])).finally(() => setReportsLoading(false));
  }, [selectedId]);

  const toggleSelectAll = (checked) => {
    setSelectedIds(checked ? filtered.map((a) => a.id) : []);
  };

  const toggleSelect = (id, checked) => {
    setSelectedIds((prev) => (checked ? Array.from(new Set([...prev, id])) : prev.filter((x) => x !== id)));
  };

  const approveArtwork = async (id) => {
    try { await api.admin.setArtworkStatus(id, true); fetchArtworks(); } catch {}
    setSelectedIds([]);
  };

  const hideArtwork = async (id) => {
    try { await api.admin.setArtworkStatus(id, false); fetchArtworks(); } catch {}
    setSelectedIds([]);
  };

  const toggleHighlight = async (id, val) => {
    try { await api.admin.toggleArtworkHighlight(id, val); fetchArtworks(); } catch {}
  };

  const removeItems = async (ids) => {
    try { await Promise.all(ids.map(id => api.admin.deleteArtwork(id))); fetchArtworks(); } catch {}
    setSelectedIds([]);
    if (ids.includes(selectedId)) {
      const next = filtered.find((a) => !ids.includes(a.id));
      setSelectedId(next?.id ?? null);
    }
  };

  const badge = (s) => {
    if (s === t("violation")) return "bg-red-50 text-[#8B1A1A] border border-[#F5C5C5]";
    if (s === "Bị báo cáo") return "bg-red-50 text-[#8B1A1A] border border-[#F5C5C5]";
    if (s === "Đã ẩn") return "bg-[#F8F8F8] text-[#666666] border border-[#E0E0E0]";
    if (s === "Nổi bật") return "bg-blue-50 text-[#1a4ba8] border border-[#a8bce0]";
    return "bg-white text-[#212121] border border-[#E0E0E0]";
  };

  const statusText = (s) => {
    if (s === "Đang hiển thị") return t("public");
    if (s === "Bị báo cáo") return t("report");
    return s;
  };

  const openConfirm = (mode, artId) => setConfirmModal({ isOpen: true, mode, artId });
  const closeConfirm = () => setConfirmModal({ isOpen: false, mode: "delete", artId: null });

  const confirmAction = () => {
    if (!confirmModal.artId) return;
    if (confirmModal.mode === "delete") removeItems([confirmModal.artId]);
    if (confirmModal.mode === "hide") hideArtwork(confirmModal.artId);
    closeConfirm();
  };

  const tabCount = (key) => {
    return data.counts ? (data.counts[key] || 0) : 0;
  };

  const FilterSelect = ({ value, onChange, children }) => (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="appearance-none px-3 py-2.5 rounded-lg border border-[#E0E0E0] bg-white text-sm text-[#212121] outline-none focus:border-[#1a4ba8] focus:ring-1 focus:ring-[#1a4ba8] cursor-pointer pr-9 hover:bg-[#F8F8F8] transition-colors"
      >
        {children}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#666666]" />
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-white relative">
      <AdminSidebar active="admin_artworks" setPage={setPage} />

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-8 border-b border-[#E0E0E0]">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-[#212121]">{t("processArtworks")}</h2>
              <p className="text-sm text-[#666666] mt-1">{t("processArtworksDesc")}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {[
              { key: "all", label: t("all") },
              { key: "reported", label: t("report") },
              { key: "pending", label: t("pending") },
              { key: "hidden", label: t("hidden") },
              { key: "highlight", label: t("highlighted") },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => { setActiveTab(t.key); setSelectedIds([]); }}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                  activeTab === t.key ? "bg-[#212121] text-white border-[#212121]" : "bg-white text-[#666666] border-[#E0E0E0] hover:bg-[#F8F8F8] hover:text-[#212121]"
                }`}
              >
                {t.label} <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${activeTab === t.key ? "bg-white/15 text-white" : "bg-[#F8F8F8] border border-[#E0E0E0] text-[#666666]"}`}>{tabCount(t.key)}</span>
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[260px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" size={16} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("searchArtworkStudentTags")} className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8]" />
            </div>
            <FilterSelect value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
              <option value="Tất cả">{t("subjectAll")}</option>
              <option value="Thiết kế TH">Thiết kế TH</option>
              <option value="Đồ hoạ ứng dụng">Đồ hoạ ứng dụng</option>
              <option value="Motion Design">Motion Design</option>
              <option value="UX/UI">UX/UI</option>
            </FilterSelect>
            <FilterSelect value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
              <option value="Tất cả">{t("yearAll")}</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </FilterSelect>
            <FilterSelect value={filterTool} onChange={(e) => setFilterTool(e.target.value)}>
              <option value="Tất cả">{t("toolAll")}</option>
              <option value="Illustrator">Illustrator</option>
              <option value="Photoshop">Photoshop</option>
              <option value="Figma">Figma</option>
              <option value="Blender">Blender</option>
              <option value="Procreate">Procreate</option>
            </FilterSelect>

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => { selectedIds.forEach(id => hideArtwork(id)); setSelectedIds([]); }}
                disabled={selectedIds.length === 0}
                className={`px-3.5 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                  selectedIds.length === 0 ? "bg-[#F8F8F8] text-[#999999] border-[#E0E0E0] cursor-not-allowed" : "bg-white text-[#212121] border-[#E0E0E0] hover:bg-[#F8F8F8]"
                }`}
              >
                {t("hideSelected")}
              </button>
              <button
                onClick={() => toggleHighlight(selectedIds)}
                disabled={selectedIds.length === 0}
                className={`px-3.5 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                  selectedIds.length === 0 ? "bg-[#F8F8F8] text-[#999999] border-[#E0E0E0] cursor-not-allowed" : "bg-[#e0eaff] text-[#1a4ba8] border-[#a8bce0] hover:bg-[#d0daf0]"
                }`}
              >
                Highlight
              </button>
              <button
                onClick={() => setSelectedIds([])}
                disabled={selectedIds.length === 0}
                className={`px-3.5 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                  selectedIds.length === 0 ? "bg-[#F8F8F8] text-[#999999] border-[#E0E0E0] cursor-not-allowed" : "bg-white text-[#666666] border-[#E0E0E0] hover:bg-[#F8F8F8] hover:text-[#212121]"
                }`}
              >
                {t("deselect")}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          <div className="w-full overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-[#E0E0E0]">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedIds.length > 0 && selectedIds.length === filtered.length}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-semibold text-[#212121]">{filtered.length} / {tabCount(activeTab)} {t("artworks")}</span>
              </div>
              {selectedIds.length > 0 && (
                <span className="text-sm text-[#666666]">{t("selected")} {selectedIds.length}</span>
              )}
            </div>

            <div className="overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr>
                    <th className="bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold w-10"></th>
                    <th className="bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold">{t("artworkStudent")}</th>
                    <th className="bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold">{t("subject")}</th>
                    <th className="bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold">{t("date")}</th>
                    <th className="bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold w-36">{t("status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && page === 1 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-[#666]">
                          <div className="w-8 h-8 border-4 border-[#1a4ba8]/20 border-t-[#1a4ba8] rounded-full animate-spin mb-4"></div>
                          <p className="font-semibold">{t("loadingData") || "Đang tải..."}</p>
                        </div>
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-12 text-center text-[#666666]">
                        Không tìm thấy ấn phẩm nào.
                      </td>
                    </tr>
                  ) : filtered.map((a) => (
                    <tr
                      key={a.id}
                      onClick={() => setSelectedId(a.id)}
                      className={`border-b transition-colors cursor-pointer ${
                        selectedId === a.id ? "bg-[#e0eaff]" : (a._count?.reports || 0) > 0 ? "bg-red-50" : a.isPending ? "bg-amber-50" : "bg-white"
                      } ${
                        (a._count?.reports || 0) > 0 ? "border-l-4 border-l-[#8B1A1A]" : "border-[#E0E0E0]"
                      } hover:bg-[#F8F8F8]`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(a.id)}
                          onChange={(e) => toggleSelect(a.id, e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={a.coverImageUrl} className="w-10 h-10 rounded-md object-cover bg-[#E0E0E0] border border-[#E0E0E0]" />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#212121] truncate">{a.title}</p>
                            <p className="text-xs text-[#666666] truncate">{a.user?.fullName || ""}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#666666]">{a.subject}</td>
                      <td className="px-4 py-3 text-sm text-[#666666]">{a.createdAt ? new Date(a.createdAt).toLocaleDateString("vi-VN") : ""}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 whitespace-nowrap text-xs px-2.5 py-1 rounded-full font-medium ${a.isPublic ? "bg-white text-[#212121] border border-[#E0E0E0]" : "bg-[#F8F8F8] text-[#666666] border border-[#E0E0E0]"}`}>
                            {a.isPublic ? <Check size={12} className="text-green-600" /> : <EyeOff size={12} className="text-[#666666]" />}
                            {a.isPublic ? t("public") : t("private")}
                          </span>
                          {(a._count?.reports || 0) > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#8B1A1A] bg-red-50 px-2 py-0.5 rounded-full border border-[#F5C5C5]">
                              <ShieldAlert size={11} /> {(a._count?.reports || 0)}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-[#666666]">{t("noMatchingArtworks")}</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div ref={observerTarget} style={{ height: 40, display: "flex", justifyContent: "center", alignItems: "center" }}>
                {loading && page > 1 && (
                  <div className="w-6 h-6 border-2 border-[#1a4ba8]/20 border-t-[#1a4ba8] rounded-full animate-spin"></div>
                )}
              </div>
          </div>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60" onClick={() => setSelectedId(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col relative" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-[#E0E0E0] flex items-start justify-between gap-3 bg-[#f8f9fa]">
              <div className="min-w-0">
                <p className="text-[11px] text-[#888] uppercase tracking-wide mb-1">{t("artworkDetails")}</p>
                <h3 className="text-lg font-bold text-[#212121] truncate">{selected.title}</h3>
                <p className="text-[13px] text-[#666666] mt-0.5">{selected.user?.fullName || selected.student}</p>
              </div>
              <button onClick={() => setSelectedId(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-[#E0E0E0] text-[#666666] hover:bg-[#F8F8F8] hover:text-[#212121] transition-colors"><X size={16} /></button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="rounded-md overflow-hidden border border-[#E0E0E0] bg-[#F8F8F8] relative group cursor-pointer" onClick={() => handleOpenGallery(0)}>
                <img src={selected.coverImageUrl} className="w-full h-56 object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 text-[13px] font-medium transition-opacity">{t("clickToZoom")}</span>
                </div>
              </div>
              {(selected.fileUrls || []).length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {Array.from(new Set([selected.coverImageUrl, ...(selected.fileUrls || [])].filter(Boolean))).map((url, idx) => (
                    <div key={idx} className="w-12 h-10 rounded-md overflow-hidden border border-[#E0E0E0] bg-[#F8F8F8] cursor-pointer hover:border-[#1a4ba8] transition-colors" onClick={() => handleOpenGallery(idx)}>
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5">{t("subject")}</p>
                  <p className="text-[13px] font-medium text-[#333]">{selected.subject}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5">{t("tools")}</p>
                  <p className="text-[13px] font-medium text-[#333]">{(selected.toolsUsed || []).join(", ") || "—"}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5">{t("status")}</p>
                  <span className={`inline-flex items-center gap-1 whitespace-nowrap text-[11px] px-2.5 py-1 rounded-full ${selected.isPublic ? "bg-white text-[#212121] border border-[#E0E0E0]" : "bg-[#F8F8F8] text-[#666666] border border-[#E0E0E0]"}`}>
                    {selected.isPublic ? <Check size={10} className="text-green-600" /> : <EyeOff size={10} />}
                    {selected.isPublic ? t("public") : t("private")}
                  </span>
                </div>
                <div>
                  <p className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5">{t("score")}</p>
                  <p className="text-[13px] font-medium text-[#333]">{selected.score ?? t("notGraded") }</p>
                </div>
              </div>

              <div className="mt-5">
                <a href={`${window.location.origin}/#/detail/${selected.id}`} target="_blank" rel="noopener noreferrer" className="text-[13px] text-[#1a4ba8] hover:text-[#0d2e6e] font-semibold flex items-center gap-1.5 transition-colors">
                  <ExternalLink size={14} /> {t("viewDetails")}: {selected.title}
                </a>
              </div>

              <div className="mt-6">
                <p className="text-[11px] text-[#888] uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <ShieldAlert size={14} /> {t("reportViolation")} {reports.length > 0 && <span className="bg-[#8B1A1A] text-white text-[9px] px-2 py-0.5 rounded-full">{reports.length}</span>}
                </p>
                {reportsLoading ? (
                  <p className="text-[13px] text-[#666666]">{t("loading")}</p>
                ) : reports.length === 0 ? (
                  <p className="text-[12px] text-[#666666] bg-[#F8F8F8] rounded-md p-3 border border-[#E0E0E0]">{t("noReportsForArtwork")}</p>
                ) : (
                  <div className="flex flex-col gap-2.5 max-h-[200px] overflow-y-auto pr-2">
                    {reports.map(r => (
                      <div key={r.id} className="bg-[#F8F8F8] rounded-md p-3 border border-[#E0E0E0]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-medium text-[#8B1A1A] bg-red-50 px-2 py-1 rounded border border-[#F5C5C5]">{r.violationType}</span>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${r.status === "pending" ? "bg-yellow-50 text-yellow-700 border border-yellow-200" : r.status === "resolved" ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-50 text-gray-500 border border-gray-200"}`}>
                            {r.status === "pending" ? t("pending") : r.status === "resolved" ? t("processed") : t("dismissed")}
                          </span>
                        </div>
                        {r.detail && <p className="text-[13px] text-[#212121] mb-2 leading-relaxed">{r.detail}</p>}
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-[#666666]">
                            {t("by")} {r.user?.fullName || r.user?.email || t("user") } · {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                          </p>
                          {r.status === "pending" && (
                            <div className="flex gap-1.5">
                              <button onClick={() => api.artworks.updateReportStatus(selected.id, r.id, "resolved").then(() => setReports(prev => prev.map(x => x.id === r.id ? { ...x, status: "resolved" } : x)))} className="text-[10px] font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded border border-green-200 hover:bg-green-100 transition-colors cursor-pointer">{t("resolve")}</button>
                              <button onClick={() => api.artworks.updateReportStatus(selected.id, r.id, "dismissed").then(() => setReports(prev => prev.map(x => x.id === r.id ? { ...x, status: "dismissed" } : x)))} className="text-[10px] font-semibold text-gray-500 bg-gray-50 px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">{t("dismiss")}</button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[#E0E0E0] grid grid-cols-3 gap-3">
                {!selected.isPublic ? (
                  <button onClick={() => { approveArtwork(selected.id); setSelectedId(null); }} className="py-2.5 rounded-lg border border-[#1a4ba8] bg-white text-[#1a4ba8] text-[13px] font-semibold hover:bg-[#eef4ff] transition-colors">
                    <Check size={14} className="inline mr-1.5" /> {t("approveArtwork")}
                  </button>
                ) : (
                  <button onClick={() => { hideArtwork(selected.id); setSelectedId(null); }} className="py-2.5 rounded-lg border border-[#E0E0E0] bg-white text-[13px] font-semibold text-[#666666] hover:bg-[#F8F8F8] hover:text-[#212121] transition-colors">
                    {t("hideArtwork")}
                  </button>
                )}
                <button onClick={() => openConfirm("delete", selected.id)} className="py-2.5 rounded-lg border border-[#F5C5C5] bg-red-50 text-[13px] font-semibold text-[#8B1A1A] hover:bg-red-100 transition-colors">
                  {t("deletePermanently")}
                </button>
                <button onClick={() => toggleHighlight(selected.id, !selected.isHighlighted)} className={`py-2.5 rounded-lg text-[13px] font-semibold border transition-colors ${
                  selected.isHighlighted ? "bg-[#212121] text-white border-[#212121]" : "bg-[#e0eaff] text-[#1a4ba8] border-[#a8bce0] hover:bg-[#d0daf0]"
                }`}>
                  {selected.isHighlighted ? t("removeHighlight") : t("highlightArtwork")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden flex flex-col p-6 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert size={28} className="text-[#8B1A1A]" />
            </div>
            <h3 className="font-bold text-lg text-[#212121] mb-2">{confirmModal.mode === "hide" ? t("hideArtworkQuestion") : t("deleteArtworkQuestion")}</h3>
            <p className="text-sm text-[#666666] mb-6">
              {confirmModal.mode === "hide"
                ? t("hideArtworkWarning")
                : t("deleteArtworkWarning")}
            </p>
            <div className="flex gap-3">
              <button onClick={closeConfirm} className="flex-1 py-2 rounded-lg border border-[#E0E0E0] text-sm font-semibold text-[#666666] hover:bg-[#F8F8F8] transition-colors cursor-pointer">{t("cancel")}</button>
              <button onClick={confirmAction} className="flex-1 py-2 rounded-lg border-none bg-[#8B1A1A] text-sm font-semibold text-white hover:bg-opacity-90 transition-opacity cursor-pointer">{t("confirm")}</button>
            </div>
          </div>
        </div>
      )}

      {galleryIdx !== null && galleryImages.length > 0 && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center" onClick={() => setGalleryIdx(null)}>
          <button onClick={(e) => { e.stopPropagation(); setGalleryIdx(prev => Math.max(0, prev - 1)); }} className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors z-10 cursor-pointer text-xl leading-none">&lsaquo;</button>
          <img src={galleryImages[galleryIdx]} alt="" className="max-w-[90vw] max-h-[90vh] object-contain" onClick={(e) => e.stopPropagation()} />
          <button onClick={(e) => { e.stopPropagation(); setGalleryIdx(prev => Math.min(galleryImages.length - 1, prev + 1)); }} className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors z-10 cursor-pointer text-xl leading-none">&rsaquo;</button>
          <button onClick={() => setGalleryIdx(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer"><X size={20} /></button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm">{galleryIdx + 1} / {galleryImages.length}</div>
        </div>
      )}
    </div>
  );
}

function AdminExportPage({ setPage, collections, onOpenExportConfig, onQuickCreateCollection, onOpenCatalogBuilder }) {
    return (