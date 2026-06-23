import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, Image, Type, LayoutGrid, Play, Settings, PenTool, ArrowLeftRight, MoveHorizontal, Edit2, Plus, X, ChevronDown, AlignLeft, AlignCenter, AlignRight, Link, Unlink, Pilcrow, Mail, ThumbsUp, Folder, Upload, Eye, MessageCircle, Move } from "lucide-react";

export default function JournalBuilderModal({ isOpen, onClose, collection, orientation, initialDraft, onSaveDraft, currentUser }) {
  const [blocks, setBlocks] = useState(initialDraft?.blocks || []);
  const [hoveredBlockId, setHoveredBlockId] = useState(null);
  const [focusedBlockId, setFocusedBlockId] = useState(null);
  const [editingBlockId, setEditingBlockId] = useState(null);
  const [activeOverlayId, setActiveOverlayId] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  const [showCollectionDrawer, setShowCollectionDrawer] = useState(false);
  const [draggedImg, setDraggedImg] = useState(null);

  const [isStylesModalOpen, setIsStylesModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [projectStyles, setProjectStyles] = useState(initialDraft?.settingsData?.projectStyles || { backgroundColor: '#ffffff', contentSpacing: 0 });
  const [settingsData, setSettingsData] = useState(initialDraft?.settingsData || {
    coverImage: null, title: '', tags: '', category: '', tools: '', projectYear: 'Năm 3', description: '', license: 'All Rights Reserved', coOwners: ''
  });

  useEffect(() => {
    if (isOpen) {
      setBlocks(initialDraft?.blocks?.length ? [...initialDraft.blocks] : []);
      setSettingsData(initialDraft?.settingsData ? { ...initialDraft.settingsData } : {
        coverImage: null, title: '', tags: '', category: '', tools: '', projectYear: 'Năm 3', description: '', license: 'All Rights Reserved', coOwners: ''
      });
      setProjectStyles(initialDraft?.settingsData?.projectStyles || { backgroundColor: '#ffffff', contentSpacing: 0 });
      setIsPreviewMode(false);
      setIsSettingsModalOpen(false);
      setIsStylesModalOpen(false);
      setShowCollectionDrawer(false);
    }
  }, [isOpen]); // Depend only on isOpen so it initializes exactly once when opened

  const fileInputRef = useRef(null);
  
  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setSettingsData({...settingsData, coverImage: ev.target.result});
      reader.readAsDataURL(file);
    }
  };
  
  if (!isOpen) return null;

  const addBlock = (type) => {
    setBlocks([...blocks, { id: Date.now().toString(), type, content: "", fullWidth: false }]);
  };

  const updateBlock = (id, newProps) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...newProps } : b));
  };

  const removeBlock = (id) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const toggleFullWidth = (id) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, fullWidth: !b.fullWidth } : b));
  };

  const renderBlock = (block) => {
    return (
      <div 
        key={block.id} 
        className={`relative group ${block.fullWidth ? 'w-full' : 'max-w-5xl mx-auto mb-4'} bg-transparent border ${block.type !== 'text' ? 'border-transparent hover:border-blue-500' : 'border-transparent'} transition-colors duration-200 min-h-[100px] flex items-center justify-center`}
        onMouseEnter={() => setHoveredBlockId(block.id)}
        onMouseLeave={() => setHoveredBlockId(null)}
        style={{ padding: block.fullWidth ? '0' : `${projectStyles.contentSpacing || 0}px` }}
      >
        {block.type === 'image' && (
           <div 
             className="w-full h-full min-h-[300px] bg-gray-100 flex flex-col items-center justify-center relative overflow-hidden"
             onClick={() => setActiveOverlayId(null)}
             onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = "copy"; }}
             onDrop={(e) => {
               e.preventDefault();
               e.stopPropagation();
               const rect = e.currentTarget.getBoundingClientRect();
               const x = e.clientX - rect.left;
               const y = e.clientY - rect.top;
               
               const overlayType = e.dataTransfer.getData("application/json");
               if (overlayType) {
                 try {
                   const data = JSON.parse(overlayType);
                   if (data.type === 'text-overlay') {
                     const newOverlay = { id: Date.now().toString(), type: 'text', content: 'Văn bản', x, y, fontSize: 24, color: '#000' };
                     updateBlock(block.id, { overlays: [...(block.overlays || []), newOverlay] });
                   } else if (data.type === 'move-overlay' && data.blockId === block.id) {
                     const newOverlays = (block.overlays || []).map(o => o.id === data.overlayId ? { ...o, x: e.clientX - data.offsetX, y: e.clientY - data.offsetY } : o);
                     updateBlock(block.id, { overlays: newOverlays });
                   }
                   return; // Stop here if it's our internal JSON
                 } catch(err) {}
               }
               
               // Fallback: It's an image drag from Collection
               const src = draggedImg || e.dataTransfer.getData("text/plain");
               if (src) {
                 const newOverlay = { id: Date.now().toString(), type: 'image', content: src, x, y, width: 200, height: 200 };
                 updateBlock(block.id, { overlays: [...(block.overlays || []), newOverlay] });
                 setDraggedImg(null);
               }
             }}
           >
             {block.content ? (
               <img src={block.content} alt="Block" className="w-full h-full object-cover" />
             ) : (
               <>
                  <Image size={48} className="text-gray-400 mb-2" />
                  <span className="text-gray-500 font-medium">Tải ảnh lên</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => updateBlock(block.id, { content: ev.target.result });
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
               </>
             )}

             {/* RENDER OVERLAYS */}
             {block.overlays && block.overlays.map(overlay => (
               <div 
                 key={overlay.id} 
                 style={{ position: 'absolute', left: overlay.x, top: overlay.y, zIndex: 10 }}
                 onClick={(e) => { e.stopPropagation(); setActiveOverlayId(overlay.id); }}
               >
                 {overlay.type === 'image' && (
                   <div className="relative group/overlay">
                     <img src={overlay.content} style={{ width: overlay.width || 200, height: overlay.height || 200, objectFit: 'cover', border: activeOverlayId === overlay.id ? '2px dashed #1a4ba8' : 'none' }} />
                     
                     {/* Move and Delete Icons */}
                     {activeOverlayId === overlay.id && (
                       <div className="absolute -top-3 -right-3 flex items-center gap-1 bg-white shadow rounded-full p-1 z-20 border border-gray-200">
                         <div 
                           className="w-6 h-6 flex items-center justify-center cursor-move text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full"
                           draggable
                           onDragStart={(e) => {
                             e.stopPropagation();
                             e.dataTransfer.setData("application/json", JSON.stringify({ type: 'move-overlay', blockId: block.id, overlayId: overlay.id, offsetX: e.clientX - overlay.x, offsetY: e.clientY - overlay.y }));
                           }}
                         >
                           <Move size={14} />
                         </div>
                         <div 
                           className="w-6 h-6 flex items-center justify-center cursor-pointer text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-full"
                           onClick={(e) => {
                             e.stopPropagation();
                             updateBlock(block.id, { overlays: block.overlays.filter(o => o.id !== overlay.id) });
                           }}
                         >
                           <X size={14} />
                         </div>
                       </div>
                     )}
                   </div>
                 )}
                 {overlay.type === 'text' && (
                   <div className="relative group/overlay">
                     {activeOverlayId === overlay.id ? (
                       <input 
                         autoFocus
                         value={overlay.content}
                         onChange={(e) => {
                           const newOverlays = block.overlays.map(o => o.id === overlay.id ? { ...o, content: e.target.value } : o);
                           updateBlock(block.id, { overlays: newOverlays });
                         }}
                         onBlur={() => setActiveOverlayId(null)}
                         style={{ fontSize: overlay.fontSize || 24, color: overlay.color || '#000', background: 'transparent', border: '1px dashed #1a4ba8', outline: 'none', minWidth: '150px' }}
                       />
                     ) : (
                       <div style={{ fontSize: overlay.fontSize || 24, color: overlay.color || '#000', border: '1px solid transparent', whiteSpace: 'nowrap', minHeight: '32px', minWidth: '50px' }}>{overlay.content}</div>
                     )}
                     
                     {/* Move and Delete Icons */}
                     {activeOverlayId === overlay.id && (
                       <div className="absolute -top-6 -right-3 flex items-center gap-1 bg-white shadow rounded-full p-1 z-20 border border-gray-200">
                         <div 
                           className="w-6 h-6 flex items-center justify-center cursor-move text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full"
                           draggable
                           onDragStart={(e) => {
                             e.stopPropagation();
                             e.dataTransfer.setData("application/json", JSON.stringify({ type: 'move-overlay', blockId: block.id, overlayId: overlay.id, offsetX: e.clientX - overlay.x, offsetY: e.clientY - overlay.y }));
                           }}
                         >
                           <Move size={14} />
                         </div>
                         <div 
                           className="w-6 h-6 flex items-center justify-center cursor-pointer text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-full"
                           onClick={(e) => {
                             e.stopPropagation();
                             updateBlock(block.id, { overlays: block.overlays.filter(o => o.id !== overlay.id) });
                           }}
                         >
                           <X size={14} />
                         </div>
                       </div>
                     )}
                   </div>
                 )}
               </div>
             ))}
           </div>
        )}
        {block.type === 'text' && (
           <div 
             className={`w-full h-full min-h-[100px] flex flex-col relative transition-all duration-200 border 
               ${editingBlockId === block.id ? 'border-[#b3b3b3]' : 
                 focusedBlockId === block.id ? 'border-[#b3b3b3]' : 
                 hoveredBlockId === block.id ? 'border-dashed border-[#2b64ff]' : 'border-transparent'}`}
             onClick={(e) => { e.stopPropagation(); setFocusedBlockId(block.id); if (editingBlockId !== block.id) setEditingBlockId(null); }}
             onDoubleClick={(e) => { e.stopPropagation(); setEditingBlockId(block.id); }}
           >
             {/* When FOCUSED but NOT EDITING: Blue Pencil & Right Align Toolbar */}
             {focusedBlockId === block.id && editingBlockId !== block.id && (
               <>
                 <div 
                   className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-[#2b64ff] flex items-center justify-center cursor-pointer text-white shadow-md z-20 hover:bg-blue-700 transition"
                   onClick={(e) => { e.stopPropagation(); setEditingBlockId(block.id); }}
                 >
                   <Edit2 size={14} />
                 </div>
                 <div className="absolute -top-5 right-0 bg-[#2b64ff] rounded flex items-center shadow-md z-20">
                   <button className="px-3 py-2 text-white hover:bg-blue-700 transition flex items-center justify-center border-r border-blue-500/50"><AlignLeft size={16} /></button>
                   <button className="px-3 py-2 text-white hover:bg-blue-700 transition flex items-center justify-center border-r border-blue-500/50"><AlignCenter size={16} /></button>
                   <button className="px-3 py-2 text-white hover:bg-blue-700 transition flex items-center justify-center"><AlignRight size={16} /></button>
                 </div>
               </>
             )}

             {/* When EDITING: Black Toolbar attached to top */}
             {editingBlockId === block.id && (
               <div className="bg-[#1a1a1a] text-[#b3b3b3] flex items-center px-4 py-2.5 text-[13px] font-medium border-b border-[#1a1a1a] flex-wrap gap-y-2 relative w-full z-10">
                 <div className="flex items-center gap-1 cursor-pointer hover:text-white pr-2">
                   <span className="text-white font-bold">Paragraph</span> <ChevronDown size={14} />
                 </div>
                 <div className="w-[1px] h-5 bg-gray-700 mx-2"></div>
                 <div className="flex items-center gap-1 cursor-pointer hover:text-white px-2">
                   <span className="text-white font-bold">Helvetica</span> <ChevronDown size={14} />
                 </div>
                 <div className="w-[1px] h-5 bg-gray-700 mx-2"></div>
                 <div className="flex items-center gap-1 cursor-pointer hover:text-white px-2">
                   <span className="text-white font-bold">20</span> <ChevronDown size={14} />
                 </div>
                 <div className="w-[1px] h-5 bg-gray-700 mx-2"></div>
                 <div className="flex items-center gap-4 px-2">
                   <button className="hover:text-white flex items-center justify-center border-b-2 border-gray-400 pb-[1px]"><Type size={14} /></button>
                   <button className="hover:text-white font-serif font-bold text-[15px]">B</button>
                   <button className="hover:text-white font-serif italic text-[15px]">I</button>
                   <button className="hover:text-white font-serif underline text-[15px]">U</button>
                 </div>
                 <div className="w-[1px] h-5 bg-gray-700 mx-2"></div>
                 <div className="flex items-center gap-4 px-2">
                   <button className="hover:text-white"><AlignLeft size={16} /></button>
                   <button className="hover:text-white"><AlignCenter size={16} /></button>
                   <button className="hover:text-white"><AlignRight size={16} /></button>
                 </div>
                 <div className="w-[1px] h-5 bg-gray-700 mx-2"></div>
                 <div className="flex items-center gap-4 px-2">
                   <button className="hover:text-white"><Link size={16} /></button>
                   <button className="hover:text-white relative"><Unlink size={16} /></button>
                 </div>
                 <div className="w-[1px] h-5 bg-gray-700 mx-2"></div>
                 <div className="flex items-center gap-4 px-2">
                   <button className="hover:text-white flex items-center gap-[2px]"><Type size={14} /><span className="text-[10px] -ml-1 mt-1 font-bold">x</span></button>
                   <button className="hover:text-white"><Pilcrow size={16} /></button>
                 </div>
               </div>
             )}
             
             {/* TEXTAREA */}
             <textarea 
               className="w-full flex-1 min-h-[100px] resize-none p-4 outline-none text-[17px] text-[#b3b3b3] placeholder-gray-400 font-sans bg-transparent" 
               placeholder="Enter your text here..."
               value={block.content}
               onChange={(e) => updateBlock(block.id, { content: e.target.value })}
               onFocus={() => { setFocusedBlockId(block.id); setEditingBlockId(block.id); }}
             />
           </div>
        )}
        {block.type === 'grid' && (
           <div 
             className={`w-full h-full min-h-[300px] flex flex-col relative transition-all duration-200 border 
               ${focusedBlockId === block.id ? 'border-[#2b64ff]' : 
                 hoveredBlockId === block.id ? 'border-dashed border-[#2b64ff]' : 'border-transparent'} bg-white`}
             onClick={(e) => { e.stopPropagation(); setFocusedBlockId(block.id); if (editingBlockId !== block.id) setEditingBlockId(null); }}
           >
              {focusedBlockId === block.id && (
                <>
                  <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-[#2b64ff] flex items-center justify-center cursor-pointer text-white shadow-md z-20 hover:bg-blue-700 transition">
                    <Edit2 size={14} />
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center cursor-pointer text-white shadow-md z-20 hover:bg-black/80 transition">
                    <ArrowLeftRight size={14} />
                  </div>
                </>
              )}
              
              <div className="flex-1 flex flex-col items-center justify-center">
                 <h2 className="text-[20px] font-medium text-gray-500 mb-8">Add Photos to create your grid:</h2>
                 <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center gap-3 cursor-pointer group relative">
                       <div className="w-[72px] h-[72px] rounded-full bg-[#f4f7ff] flex items-center justify-center text-[#2b64ff] group-hover:bg-[#e8efff] transition overflow-hidden shadow-sm">
                          <Image size={24} />
                          <input 
                            type="file" 
                            accept="image/*" 
                            multiple
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                       </div>
                       <span className="font-bold text-[13px] text-gray-900">Image</span>
                    </div>
                    
                    <div className="flex flex-col items-center gap-3 cursor-pointer group">
                       <div className="w-[72px] h-[72px] rounded-full bg-[#f4f7ff] flex items-center justify-center text-[#2b64ff] group-hover:bg-[#e8efff] transition shadow-sm">
                          <div className="border-[2px] border-[#2b64ff] rounded-sm px-1.5 py-0.5 text-[12px] font-bold">Lr</div>
                       </div>
                       <span className="font-bold text-[13px] text-gray-900">Lightroom</span>
                    </div>
                 </div>
              </div>
           </div>
        )}
        {block.type === 'video' && (
           <div className="w-full h-full min-h-[200px] p-4 border border-dashed border-gray-300 rounded flex items-center justify-center">
             <span className="text-gray-500 font-medium">Video/Audio Placeholder</span>
           </div>
        )}
        
        {/* Floating Actions on Hover */}
        {hoveredBlockId === block.id && (
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
             <button 
               className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-lg hover:bg-gray-800 transition group/btn relative"
               onClick={() => toggleFullWidth(block.id)}
             >
               {block.fullWidth ? <MoveHorizontal size={18} /> : <ArrowLeftRight size={18} />}
               <div className="absolute right-full mr-2 px-3 py-1.5 bg-white text-gray-900 text-xs font-semibold rounded shadow opacity-0 group-hover/btn:opacity-100 pointer-events-none whitespace-nowrap">
                 {block.fullWidth ? "Give the grid some breathing room and add padding to the sides" : "Make the grid full-width"}
               </div>
             </button>
             <button 
               className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition"
               onClick={() => removeBlock(block.id)}
               title="Delete Grid"
             >
               <X size={18} />
             </button>
          </div>
        )}

        {/* Toolbar Top Left */}
        {hoveredBlockId === block.id && (
          <div className={`absolute left-4 bg-gray-900 text-white rounded-lg flex items-center px-2 py-1.5 shadow-lg z-10 ${block.type === 'text' ? 'top-16' : 'top-4'}`}>
            <span className="text-xs font-semibold text-gray-300 mr-3 ml-2">Insert Media:</span>
            <button className="p-1.5 hover:bg-gray-800 rounded mx-0.5 transition" onClick={() => addBlock('image')}><Image size={16} /></button>
            <button className="p-1.5 hover:bg-gray-800 rounded mx-0.5 transition" onClick={() => addBlock('text')}><Type size={16} /></button>
            <button className="p-1.5 hover:bg-gray-800 rounded mx-0.5 transition" onClick={() => addBlock('grid')}><LayoutGrid size={16} /></button>
            <button className="p-1.5 hover:bg-gray-800 rounded mx-0.5 transition" onClick={() => addBlock('video')}><Play size={16} /></button>
          </div>
        )}
      {/* PREVIEW OVERLAY */}
      {isPreviewMode && (
        <div style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", flexDirection: "column", overflowY: "auto", overflowX: "hidden", fontFamily: "'Inter', sans-serif" }}>
           <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(5px)", zIndex: -1, pointerEvents: "none" }} />
           {/* SINGLE FIXED TOP HEADER (100vw) */}
           <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 64, background: "#191919", zIndex: 1010, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", borderBottom: "1px solid #333" }}>
             
             {/* LEFT SIDE: Back, Logo, Avatar, Info */}
             <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
               <button onClick={() => setIsPreviewMode(false)} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"} onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
                 <ChevronLeft size={20} />
               </button>
               
               <span style={{ fontSize: 18, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px", marginRight: 8 }}>Bēhance</span>
               
               <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                 <img src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60"} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", cursor: "pointer", border: "1px solid #333" }} />
                 <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                   <span style={{ fontSize: 15, fontWeight: 600, color: "#fff", lineHeight: "1.2" }}>{settingsData?.title || "Untitled Project"}</span>
                   <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#bbb" }}>
                     <span style={{ cursor: "pointer", color: "#fff", fontWeight: 400 }}>{currentUser?.fullName || currentUser?.name || "Author"}</span>
                     <span>•</span>
                     <span style={{ color: "#0057ff", fontWeight: 600, cursor: "pointer", transition: "color 0.2s" }}>Follow</span>
                   </div>
                 </div>
               </div>
             </div>

             {/* RIGHT SIDE: Save as Draft, Publish, X */}
             <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
               <button className="px-5 py-2 rounded-full text-white/50 bg-white/5 font-semibold text-[13px] cursor-not-allowed border border-white/10 transition-colors" style={{ cursor: "not-allowed" }}>Save as Draft</button>
               <button className="px-6 py-2 rounded-full text-white bg-[#10a359] hover:bg-[#0e8f4e] font-semibold text-[13px] transition-colors" onClick={() => { setIsPreviewMode(false); setIsSettingsModalOpen(true); }}>Publish</button>
               <button onClick={() => setIsPreviewMode(false)} style={{ background: "transparent", border: "none", color: "#888", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", marginLeft: 4 }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#888"; }}>
                 <X size={20} />
               </button>
             </div>
           </div>

           {/* FIXED RIGHT SIDEBAR (Preview Mode) */}
           <div className="hidden xl:flex flex-col items-center gap-4 fixed right-6 top-[88px] z-[10020]">
              <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                 <div className="relative">
                    <img src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40"} className="w-9 h-9 rounded-full border-2 border-[#151515] object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0057ff] rounded-full flex items-center justify-center text-white border-[1.5px] border-[#151515] font-bold text-[12px] leading-none pb-[1px]">+</div>
                 </div>
                 <span className="text-[11px] font-medium text-white">Follow</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                 <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
                    <Mail size={16} className="text-black" />
                 </div>
                 <span className="text-[11px] font-medium text-white">Message</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                 <div className="w-10 h-10 rounded-full bg-[#0057ff] flex items-center justify-center group-hover:scale-105 transition-transform shadow-md shadow-blue-500/20">
                    <ThumbsUp size={18} className="text-white fill-white" />
                 </div>
                 <span className="text-[11px] font-medium text-white">Appreciate</span>
              </div>
           </div>

           {/* FLOATING BOTTOM BANNER */}
           <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#525760] rounded-xl flex items-center gap-6 z-[10020] shadow-2xl overflow-hidden pr-12 pl-4 py-3">
              <button className="absolute top-2 right-2 text-white/60 hover:text-white transition-colors">
                 <X size={16} />
              </button>
              
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white rounded flex items-center justify-center shrink-0">
                    <Image size={24} className="text-gray-300" />
                 </div>
                 <div className="flex flex-col justify-center">
                    <span className="text-white font-semibold text-[15px] leading-tight">{settingsData?.title || "Untitled Project"}</span>
                    <span className="text-white/80 text-[13px] font-medium">{currentUser?.fullName || currentUser?.name || "Author"}</span>
                 </div>
              </div>

              <div className="flex items-center gap-3">
                 <button className="bg-white hover:bg-gray-100 text-black font-semibold text-[13px] px-4 py-2 rounded-full flex items-center gap-2 transition-colors">
                    <div className="w-4 h-4 bg-black text-white rounded-full flex items-center justify-center font-bold text-[12px] pb-[1px]">+</div>
                    Follow {currentUser?.fullName?.split(' ')[currentUser?.fullName?.split(' ').length - 1] || currentUser?.name || "Author"}
                 </button>
                 <button className="bg-[#0057ff] hover:bg-blue-700 text-white font-semibold text-[13px] px-4 py-2 rounded-full flex items-center gap-2 transition-colors">
                    <ThumbsUp size={16} className="fill-white" />
                    Appreciate
                 </button>
              </div>
           </div>

           <div style={{ display: "flex", width: "100%", justifyContent: "center", position: "relative", minHeight: "100vh", paddingTop: 64 }}>
              
              {/* CỘT CHÍNH (Nội dung) */}
              <div style={{ width: "calc(100% - 200px)", maxWidth: 1400, display: "flex", flexDirection: "column", background: "#151515", margin: "0 auto", minHeight: "calc(100vh - 64px)" }}>
                 
                 {/* CÁC ẢNH HOẶC E-BOOK */}
                 <div style={{ display: "flex", flexDirection: "column", width: "100%", background: "transparent" }}>
                    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>

                       <div style={{ width: "100%", position: "relative" }}>
                          <div style={{ width: "100%", background: projectStyles.backgroundColor || "#ffffff", paddingBottom: blocks.length > 0 ? 0 : 400 }}>
                             {blocks.length === 0 ? (
                                <div style={{ height: 400, display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}>
                                   Empty Project
                                </div>
                             ) : (
                                blocks.map(block => (
                                   <div key={block.id} style={{ width: block.fullWidth ? "100%" : "min(100%, 1024px)", margin: "0 auto", padding: block.fullWidth ? "0" : `${projectStyles.contentSpacing || 0}px`, marginBottom: 16 }}>
                                      {block.type === 'image' && block.content && <img src={block.content} style={{ width: "100%", height: "auto", display: "block" }} />}
                                      {block.type === 'text' && <div style={{ color: "#212121", padding: 16, fontSize: 17, fontFamily: "sans-serif", whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: block.content ? block.content.replace(/\\n/g, '<br/>') : '' }}></div>}
                                      {block.type === 'grid' && <div style={{ width: "100%", height: 300, background: "rgba(0,0,0,0.05)", border: "1px dashed rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(0,0,0,0.4)" }}>Grid Preview</div>}
                                      {block.type === 'video' && <div style={{ width: "100%", height: 300, background: "rgba(0,0,0,0.05)", border: "1px dashed rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(0,0,0,0.4)" }}>Video/Audio Preview</div>}
                                   </div>
                                ))
                             )}
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* PREVIEW FOOTER (THÔNG SỐ & TÁC GIẢ) */}
                 <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
                    
                    {/* Phần Đen (Thông số & Tác giả) */}
                    <div style={{ background: "#111111", padding: "60px 40px", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center" }}>
                       <button style={{ width: 80, height: 80, borderRadius: "50%", background: "#0057ff", display: "flex", alignItems: "center", justifyContent: "center", border: "none", marginBottom: 32, cursor: "not-allowed" }}>
                         <ThumbsUp size={36} color="#fff" />
                       </button>

                       <h1 style={{ fontSize: 32, fontWeight: "bold", margin: "0 0 16px 0", textAlign: "center" }}>{settingsData?.title || "Untitled Project"}</h1>
                       
                       <div style={{ display: "flex", alignItems: "center", gap: 24, color: "#888", fontSize: 14, marginBottom: 24 }}>
                         <div style={{ display: "flex", alignItems: "center", gap: 6 }}><ThumbsUp size={16} /> 0</div>
                         <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Eye size={16} /> 0</div>
                         <div style={{ display: "flex", alignItems: "center", gap: 6 }}><MessageCircle size={16} /> 0</div>
                       </div>

                       <p style={{ color: "#888", fontSize: 13, margin: "0 0 40px 0" }}>Published: {new Date().toLocaleDateString()}</p>
                    </div>

                    {/* Phần Trắng (Bình luận & Owner Card) */}
                    <div style={{ display: "flex", background: "#f9f9f9", padding: "60px 40px" }}>
                       
                       {/* Cột trái (Bình luận) */}
                       <div style={{ flex: "0 0 65%", paddingRight: 60 }}>
                          <div style={{ background: "#fff", border: "1px solid #EAEAEA", borderRadius: 8, padding: 24, marginBottom: 40, display: "flex", gap: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                             <img src={currentUser?.avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(currentUser?.fullName || currentUser?.name || "User")} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
                             <div style={{ flex: 1 }}>
                               <textarea placeholder="What are your thoughts on this project?" style={{ width: "100%", padding: "12px", borderRadius: 6, border: "1px solid #CCC", outline: "none", resize: "vertical", minHeight: 80, boxSizing: "border-box", fontSize: 14, fontFamily: "inherit" }} disabled />
                               <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                                 <button disabled style={{ background: "#E8E8E8", color: "#666", border: "none", padding: "10px 24px", borderRadius: 20, fontSize: 14, fontWeight: "bold", cursor: "not-allowed" }}>Post a Comment</button>
                               </div>
                             </div>
                          </div>
                          <p style={{ fontSize: 13, color: "#999", textAlign: "center", padding: "20px 0" }}>No comments yet.</p>
                       </div>

                       {/* Cột phải (Owner Card) */}
                       <div style={{ flex: "0 0 35%", display: "flex", flexDirection: "column", gap: 24 }}>
                          <div style={{ background: "#fff", border: "1px solid #EAEAEA", borderRadius: 8, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                             <span style={{ fontSize: 11, fontWeight: "bold", color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16, display: "block" }}>Owner</span>
                             <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                               <img src={currentUser?.avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(currentUser?.fullName || currentUser?.name || "User")} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }} />
                               <div>
                                 <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                   <h3 style={{ margin: 0, fontSize: 15, fontWeight: "bold", color: "#191919" }}>{currentUser?.fullName || currentUser?.name || "Author"}</h3>
                                 </div>
                                 <span style={{ fontSize: 13, color: "#888", display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> 
                                   Vietnam
                                 </span>
                               </div>
                             </div>
                             <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                               <button style={{ background: "#0057ff", color: "#fff", border: "none", padding: "10px", borderRadius: 24, fontSize: 14, fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                                 <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>+</div> Follow
                               </button>
                               <button style={{ background: "#fff", color: "#0057ff", border: "1px solid #EAEAEA", padding: "10px", borderRadius: 24, fontSize: 14, fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                                 <Mail size={16} /> Message
                               </button>
                             </div>
                          </div>
                          
                          <div style={{ background: "#fff", border: "1px solid #EAEAEA", borderRadius: 8, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                             <h3 style={{ margin: "0 0 16px 0", fontSize: 15, fontWeight: "bold", color: "#191919" }}>{settingsData?.title || "Untitled Project"}</h3>
                             <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#888", fontSize: 13 }}>
                               <div style={{ display: "flex", alignItems: "center", gap: 6 }}><ThumbsUp size={14} /> 0</div>
                               <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Eye size={14} /> 0</div>
                               <div style={{ display: "flex", alignItems: "center", gap: 6 }}><MessageCircle size={14} /> 0</div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Print Styles */}
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
        }
      `}</style>
      </div>
    );
  };


  return createPortal(
    <div className="fixed inset-0 z-[9999] flex flex-col bg-[#f8f8f8] overflow-hidden">
      {/* HEADER */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-20 print:hidden">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <div className="font-bold text-[#212121]">Thiết kế Tập san {orientation === 'landscape' ? '(Ngang)' : '(Dọc)'}</div>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition" onClick={() => setIsPreviewMode(true)}>Preview Ebook</button>
          <button onClick={() => window.print()} className="text-sm font-semibold text-white bg-[#1a4ba8] rounded-full px-5 py-1.5 hover:bg-[#1a4ba8]/90 transition flex items-center gap-2">Xuất PDF</button>
          <button onClick={() => onSaveDraft && onSaveDraft({ blocks, settingsData, orientation })} className="text-sm font-semibold text-gray-800 border border-gray-300 rounded-full px-4 py-1.5 hover:bg-gray-50 transition">Lưu Nháp & Đóng</button>
        </div>
      </header>

      {/* BODY */}
      <div 
        className="flex flex-1 overflow-hidden relative print:overflow-visible" 
        onClick={() => { setFocusedBlockId(null); setEditingBlockId(null); }}
        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const src = draggedImg || e.dataTransfer.getData("text/plain");
          if (src) {
            setBlocks([...blocks, { id: Date.now().toString(), type: 'image', content: src, fullWidth: false }]);
            setDraggedImg(null);
          }
        }}
      >
        {/* WORKSPACE */}
        <div className="flex-1 overflow-y-auto relative transition-colors" style={{ backgroundColor: projectStyles.backgroundColor }}>
          {blocks.length === 0 ? (
            <div className="min-h-full flex flex-col items-center justify-center pt-20 pb-40">
              <h2 className="text-[26px] font-medium text-gray-600 mb-12">Add Photos to create your grid:</h2>
              <div className="flex items-center gap-8">
                <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => addBlock('image')}>
                  <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition">
                    <Image size={28} />
                  </div>
                  <span className="font-bold text-gray-900">Image</span>
                </div>
                <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => addBlock('text')}>
                  <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition">
                    <Type size={28} />
                  </div>
                  <span className="font-bold text-gray-900">Text</span>
                </div>
              </div>
            </div>
          ) : (
            <div className={`w-full min-h-full pb-32 ${blocks.length > 0 && blocks[0].fullWidth ? '' : 'pt-12'}`}>
              {blocks.map(renderBlock)}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-[300px] border-l border-gray-200 bg-white flex flex-col shrink-0 overflow-y-auto z-10">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-[13px] font-bold text-gray-500 uppercase tracking-wide mb-3">Add Content</h3>
            <div className="grid grid-cols-2 gap-[1px] bg-gray-200 border border-gray-200 rounded overflow-hidden">
              <button className="bg-white hover:bg-gray-50 py-4 flex flex-col items-center justify-center gap-2 transition" onClick={() => addBlock('image')}>
                <Image size={24} className="text-gray-800" />
                <span className="text-[13px] font-medium text-gray-700">Image</span>
              </button>
              <button 
                draggable
                onDragStart={(e) => { e.dataTransfer.setData("application/json", JSON.stringify({ type: 'text-overlay' })); }}
                className="bg-white hover:bg-gray-50 py-4 flex flex-col items-center justify-center gap-2 transition" 
                onClick={() => addBlock('text')}
              >
                <Type size={24} className="text-gray-800" />
                <span className="text-[13px] font-medium text-gray-700">Text</span>
              </button>
              <button className="bg-white hover:bg-gray-50 py-4 flex flex-col items-center justify-center gap-2 transition" onClick={() => addBlock('grid')}>
                <LayoutGrid size={24} className="text-gray-800" />
                <span className="text-[13px] font-medium text-gray-700">Photo Grid</span>
              </button>
              <button className="bg-white hover:bg-gray-50 py-4 flex flex-col items-center justify-center gap-2 transition" onClick={() => addBlock('video')}>
                <Play size={24} className="text-gray-800" />
                <span className="text-[13px] font-medium text-gray-700">Video/Audio</span>
              </button>
              <button type="button" className="bg-white hover:bg-gray-50 py-4 flex flex-col items-center justify-center gap-2 transition" onClick={(e) => { e.stopPropagation(); setShowCollectionDrawer(!showCollectionDrawer); }}>
                <Folder size={24} className="text-[#1a4ba8]" />
                <span className="text-[13px] font-medium text-[#1a4ba8]">Bộ sưu tập</span>
              </button>
            </div>
          </div>
          
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-[13px] font-bold text-gray-500 uppercase tracking-wide mb-3">Edit Project</h3>
            <div className="grid grid-cols-1 gap-[1px] bg-gray-200 border border-gray-200 rounded overflow-hidden">
              <button className="bg-white hover:bg-gray-50 py-4 flex flex-col items-center justify-center gap-2 transition text-blue-600" onClick={() => setIsStylesModalOpen(true)}>
                <PenTool size={20} />
                <span className="text-[13px] font-medium">Styles</span>
              </button>
            </div>
            
            <div className="mt-4 flex flex-col items-center border border-gray-200 rounded p-4 bg-[#f8f8f8]">
               <button className="px-4 py-1.5 border border-gray-300 bg-white rounded-full text-sm font-semibold text-gray-800 mb-3 w-full hover:bg-gray-50">Custom Button</button>
               <p className="text-[11px] text-gray-500 text-center leading-relaxed">Customize the call to action<br/>on your project</p>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="text-[13px] font-bold text-gray-500 uppercase tracking-wide mb-3">Attach Assets</h3>
            <div className="flex flex-col items-center border border-gray-200 rounded p-4 bg-[#f8f8f8]">
               <button className="px-4 py-1.5 border border-gray-300 bg-white rounded-full text-sm font-semibold text-gray-800 mb-3 w-full hover:bg-gray-50 flex items-center justify-center gap-2">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                 Attach Assets
               </button>
               <p className="text-[11px] text-gray-500 text-center leading-relaxed">Add files like fonts, illustrations, photos, zips, or templates as free or paid downloads.</p>
            </div>
          </div>
        </div>

        {/* Collection Drawer Popup */}
        {showCollectionDrawer && (
          <div className="absolute top-0 bg-white border-l border-gray-200 shadow-2xl z-[100] flex flex-col transition-transform print:hidden" style={{ right: '300px', width: '320px', height: '100%' }}>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-[#f8f8f8]">
              <h3 className="font-bold text-gray-800">Ảnh từ Bộ sưu tập</h3>
              <button onClick={() => setShowCollectionDrawer(false)} className="text-gray-500 hover:text-gray-800"><X size={18} /></button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto grid grid-cols-2 gap-3">
              {collection?.items?.map(item => (
                <div 
                  key={item.id} 
                  draggable
                  onDragStart={(e) => {
                    const src = item.artwork?.coverImageUrl || item.artwork?.img;
                    setDraggedImg(src);
                    e.dataTransfer.setData("text/plain", src);
                  }}
                  className="aspect-square bg-gray-100 rounded overflow-hidden cursor-grab active:cursor-grabbing hover:ring-2 ring-[#1a4ba8]"
                >
                  <img src={item.artwork?.coverImageUrl || item.artwork?.img} className="w-full h-full object-cover pointer-events-none" />
                </div>
              ))}
              {(!collection?.items || collection.items.length === 0) && (
                <div className="col-span-2 text-sm text-gray-500 text-center py-10">Bộ sưu tập trống</div>
              )}
            </div>
            <div className="p-4 bg-blue-50 text-xs text-blue-800 border-t border-blue-100">
              Kéo ảnh từ đây thả vào vùng trống ở giữa trang để tạo block ảnh.
            </div>
          </div>
        )}
      </div>

      {isStylesModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-[500px] overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Project Styles</h2>
              
              <div className="flex items-center justify-between mb-6">
                <span className="font-bold text-[15px] text-gray-800">Background Color</span>
                <div className="flex items-center gap-2">
                  <input type="color" value={projectStyles.backgroundColor} onChange={e => setProjectStyles({...projectStyles, backgroundColor: e.target.value})} className="w-8 h-8 p-0 border-0 rounded cursor-pointer" />
                  <span className="text-sm text-gray-500">or</span>
                  <input type="text" value={projectStyles.backgroundColor} onChange={e => setProjectStyles({...projectStyles, backgroundColor: e.target.value})} className="border border-gray-300 rounded px-3 py-1.5 w-24 text-sm outline-none" />
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-8">
                <span className="font-bold text-[15px] text-gray-800">Content Spacing</span>
                <div className="flex items-center gap-2">
                  <input type="range" min="0" max="100" value={projectStyles.contentSpacing} onChange={e => setProjectStyles({...projectStyles, contentSpacing: Number(e.target.value)})} className="w-32" />
                  <input type="number" value={projectStyles.contentSpacing} onChange={e => setProjectStyles({...projectStyles, contentSpacing: Number(e.target.value)})} className="border border-gray-300 rounded px-2 py-1.5 w-16 text-sm outline-none text-center" />
                  <span className="text-sm text-gray-500">px</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition" onClick={() => setIsStylesModalOpen(false)}>Save</button>
                <button className="text-gray-600 hover:text-gray-900 font-semibold py-2 px-4 transition" onClick={() => setIsStylesModalOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Print Styles */}
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
        }
      `}</style>
    </div>,
    document.body
  );
}
