import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, Image, Type, LayoutGrid, Play, Settings, PenTool, ArrowLeftRight, MoveHorizontal, Edit2, Plus, X, ChevronDown, AlignLeft, AlignCenter, AlignRight, Link, Unlink, Pilcrow, Mail, ThumbsUp, Folder, Upload, Eye, MessageCircle, Move } from "lucide-react";
import HTMLFlipBook from "react-pageflip";
import { api } from "../../lib/api-client";
import JustifiedGrid from "./JustifiedGrid";
import EditGridModal from "./EditGridModal";
import ReorderProjectModal from "./ReorderProjectModal";

export default function JournalBuilderModal({ isOpen, onClose, collection, orientation, initialDraft, onSaveDraft, currentUser }) {
  const [blocks, setBlocks] = useState(initialDraft?.blocks || []);
  const [hoveredBlockId, setHoveredBlockId] = useState(null);
  const [focusedBlockId, setFocusedBlockId] = useState(null);
  const [editingBlockId, setEditingBlockId] = useState(null);
  const [dropdownBlockId, setDropdownBlockId] = useState(null);
  const [activeOverlayId, setActiveOverlayId] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  const [showCollectionDrawer, setShowCollectionDrawer] = useState(false);
  const [draggedImg, setDraggedImg] = useState(null);
  const [fullArtworks, setFullArtworks] = useState({});

  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [editGridBlockId, setEditGridBlockId] = useState(null);

  const [isStylesModalOpen, setIsStylesModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [projectStyles, setProjectStyles] = useState(initialDraft?.settingsData?.projectStyles || { backgroundColor: '#ffffff', contentSpacing: 0 });
  const [settingsData, setSettingsData] = useState(initialDraft?.settingsData || {
    coverImage: null, title: '', tags: '', category: '', tools: '', projectYear: 'Năm 3', description: '', license: 'All Rights Reserved', coOwners: ''
  });

  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = () => {
    // We add a class to body so index.css print styles can specifically target this modal
    document.body.classList.add('printing-journal');
    setTimeout(() => {
      window.print();
      document.body.classList.remove('printing-journal');
    }, 100);
  };

  useEffect(() => {
    if (isOpen) {
      setBlocks(initialDraft?.blocks?.length ? [...initialDraft.blocks] : []);
      setSettingsData(initialDraft?.settingsData ? { ...initialDraft.settingsData } : {
        coverImage: null, title: '', tags: '', category: '', tools: '', projectYear: 'Năm 3', description: '', license: 'All Rights Reserved', coOwners: ''
      });
      setProjectStyles(initialDraft?.settingsData?.projectStyles || { backgroundColor: '#ffffff', contentSpacing: 0 });
      setIsPreviewMode(false);
      setEditingBlockId(null);
      setFocusedBlockId(null);
      setHoveredBlockId(null);
      setActiveOverlayId(null);
      setIsSettingsModalOpen(false);
      setIsStylesModalOpen(false);
      setShowCollectionDrawer(false);
      
      // Fetch full details for collection items to get all images
      if (collection?.items) {
        collection.items.forEach(it => {
          api.artworks.get(it.artworkId).then(art => {
            setFullArtworks(prev => ({ ...prev, [it.artworkId]: art }));
          }).catch(() => {});
        });
      }
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

  const renderBlock = (block, index, arr) => {
    const isLastBlock = arr && index === arr.length - 1;
    return (
      <div 
        key={block.id} 
        id={`pdf-block-${block.id}`}
        className={`relative group mx-auto mb-4 bg-transparent border ${block.type !== 'text' ? 'border-transparent hover:border-blue-500' : 'border-transparent'} transition-colors duration-200 flex flex-col justify-center shadow-md print:mb-0 print:border-none print:shadow-none ${!isLastBlock ? 'print:break-after-page' : ''} overflow-hidden`}
        onMouseEnter={() => setHoveredBlockId(block.id)}
        onMouseLeave={() => setHoveredBlockId(null)}
        style={{ 
          width: orientation === 'landscape' ? 800 : 600,
          height: block.type === 'text' ? (block.height || (orientation === 'landscape' ? 600 : 800)) : (orientation === 'landscape' ? 600 : 800),
          padding: block.fullWidth ? '0' : `${projectStyles.contentSpacing || 0}px` 
        }}
      >
        {block.type !== 'text' && !isPreviewMode && (
          <>
            {/* Edit Button */}
            <div className="absolute top-3 left-3 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="relative">
                <button 
                  className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); setDropdownBlockId(dropdownBlockId === block.id ? null : block.id); }}
                >
                  <Edit2 size={14} />
                </button>
                {dropdownBlockId === block.id && (
                  <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 py-1 overflow-hidden z-[60]">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={(e) => { e.stopPropagation(); setIsReorderModalOpen(true); setDropdownBlockId(null); }}>Reorder Project</button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={(e) => { e.stopPropagation(); setEditGridBlockId(block.id); setDropdownBlockId(null); }}>Edit Grid</button>
                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors" onClick={(e) => { e.stopPropagation(); removeBlock(block.id); setDropdownBlockId(null); }}>Delete Grid</button>
                  </div>
                )}
              </div>
            </div>

            {/* Resize Button */}
            <div className="absolute top-3 right-3 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                className="h-8 px-3 bg-gray-900/80 hover:bg-black text-white rounded-full flex items-center justify-center gap-1 shadow-lg transition-colors cursor-pointer backdrop-blur-sm border border-white/20"
                onClick={(e) => { e.stopPropagation(); updateBlock(block.id, { fullWidth: !block.fullWidth }); }}
                title="Give the grid some breathing room and add padding to the sides"
              >
                <ArrowLeftRight size={14} />
              </button>
            </div>
          </>
        )}
        {block.type === 'image' && (
           <div 
             className="w-full h-full bg-gray-100 flex flex-col items-center justify-center relative overflow-hidden"
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
                     const newOverlay = { 
                       id: Date.now().toString(), 
                       type: 'text', 
                       content: data.content || 'Văn bản', 
                       x, y, 
                       fontSize: data.styles?.fontSize || 24, 
                       color: data.styles?.color || '#000',
                       fontWeight: data.styles?.fontWeight || 'normal',
                       fontStyle: data.styles?.fontStyle || 'normal'
                     };
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
               <div 
                 className="w-full h-full"
                 style={{
                   backgroundImage: `url(${block.content})`,
                   backgroundSize: 'cover',
                   backgroundPosition: block.bgPosition || '50% 50%',
                   cursor: 'grab'
                 }}
                 onMouseDown={(e) => {
                   e.preventDefault();
                   const startX = e.clientX;
                   const startY = e.clientY;
                   
                   let posX = 50, posY = 50;
                   if (block.bgPosition) {
                     const parts = block.bgPosition.split(' ');
                     posX = parseFloat(parts[0]) || 50;
                     posY = parseFloat(parts[1]) || 50;
                   }

                   const handleMouseMove = (moveEvent) => {
                     const dx = moveEvent.clientX - startX;
                     const dy = moveEvent.clientY - startY;
                     
                     // Adjust sensitivity
                     const newX = Math.max(0, Math.min(100, posX - (dx / 3)));
                     const newY = Math.max(0, Math.min(100, posY - (dy / 3)));
                     
                     e.target.style.backgroundPosition = `${newX}% ${newY}%`;
                     e.target.dataset.newPos = `${newX}% ${newY}%`;
                   };

                   const handleMouseUp = () => {
                     window.removeEventListener('mousemove', handleMouseMove);
                     window.removeEventListener('mouseup', handleMouseUp);
                     if (e.target.dataset.newPos) {
                       updateBlock(block.id, { bgPosition: e.target.dataset.newPos });
                     }
                   };

                   window.addEventListener('mousemove', handleMouseMove);
                   window.addEventListener('mouseup', handleMouseUp);
                 }}
               />
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
                 style={{ position: 'absolute', left: overlay.x, top: overlay.y, zIndex: 10, cursor: (overlay.type === 'image' || activeOverlayId !== overlay.id) ? 'move' : 'default' }}
                 onClick={(e) => { e.stopPropagation(); setActiveOverlayId(overlay.id); }}
                 draggable={overlay.type === 'image' || activeOverlayId !== overlay.id}
                 onDragStart={(e) => {
                   e.stopPropagation();
                   e.dataTransfer.setData("application/json", JSON.stringify({ type: 'move-overlay', blockId: block.id, overlayId: overlay.id, offsetX: e.clientX - overlay.x, offsetY: e.clientY - overlay.y }));
                 }}
               >
                 {overlay.type === 'image' && (
                   <div className="relative group/overlay">
                     <img src={overlay.content} style={{ width: overlay.width || 200, height: overlay.height || 200, objectFit: 'cover', border: activeOverlayId === overlay.id ? '2px dashed #1a4ba8' : 'none' }} />
                     
                     {/* Delete Icon */}
                     {activeOverlayId === overlay.id && (
                       <div className="absolute -top-3 -right-3 flex items-center gap-1 bg-white shadow rounded-full p-1 z-20 border border-gray-200">
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
                         style={{ fontSize: overlay.fontSize || 24, color: overlay.color || '#000', fontWeight: overlay.fontWeight || 'normal', fontStyle: overlay.fontStyle || 'normal', background: 'transparent', border: '1px dashed #1a4ba8', outline: 'none', minWidth: '150px' }}
                       />
                     ) : (
                       <div style={{ fontSize: overlay.fontSize || 24, color: overlay.color || '#000', fontWeight: overlay.fontWeight || 'normal', fontStyle: overlay.fontStyle || 'normal', border: '1px solid transparent', whiteSpace: 'nowrap', minHeight: '32px', minWidth: '50px' }}>{overlay.content}</div>
                     )}
                     
                     {/* Text Formatting Toolbar */}
                     {activeOverlayId === overlay.id && (
                       <div className="absolute bottom-[calc(100%+10px)] left-0 flex flex-wrap items-center gap-1.5 bg-white shadow-lg border border-gray-200 rounded p-1.5 z-30" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.preventDefault()} style={{ width: 'max-content', maxWidth: '350px' }}>
                         
                         {/* Font Family */}
                         <select 
                           value={overlay.fontFamily || 'Helvetica'} 
                           onChange={(e) => {
                             const newOverlays = block.overlays.map(o => o.id === overlay.id ? { ...o, fontFamily: e.target.value } : o);
                             updateBlock(block.id, { overlays: newOverlays });
                           }}
                           className="bg-gray-100 px-2 h-7 rounded text-[13px] outline-none cursor-pointer border border-gray-200"
                         >
                           <option value="Helvetica">Helvetica</option>
                           <option value="Arial">Arial</option>
                           <option value="Times New Roman">Times New Roman</option>
                           <option value="Courier New">Courier</option>
                         </select>

                         <input 
                           type="number" 
                           title="Cỡ chữ"
                           value={overlay.fontSize || 24} 
                           onChange={(e) => {
                             const newOverlays = block.overlays.map(o => o.id === overlay.id ? { ...o, fontSize: parseInt(e.target.value) || 24 } : o);
                             updateBlock(block.id, { overlays: newOverlays });
                           }}
                           className="w-12 h-7 px-1 border border-gray-200 rounded text-[13px] outline-none bg-gray-50" 
                         />
                         <input 
                           type="color" 
                           title="Đổi màu chữ"
                           value={overlay.color || '#000000'} 
                           onChange={(e) => {
                             const newOverlays = block.overlays.map(o => o.id === overlay.id ? { ...o, color: e.target.value } : o);
                             updateBlock(block.id, { overlays: newOverlays });
                           }}
                           className="w-7 h-7 p-0 border-0 cursor-pointer rounded" 
                         />

                         <div className="w-[1px] h-5 bg-gray-300 mx-1"></div>

                         <button 
                           title="In đậm"
                           onClick={() => {
                             const newOverlays = block.overlays.map(o => o.id === overlay.id ? { ...o, fontWeight: o.fontWeight === 'bold' ? 'normal' : 'bold' } : o);
                             updateBlock(block.id, { overlays: newOverlays });
                           }}
                           className={`w-7 h-7 flex items-center justify-center rounded ${overlay.fontWeight === 'bold' ? 'bg-gray-300' : 'hover:bg-gray-100'} font-serif font-bold text-[14px]`}
                         >
                           B
                         </button>
                         <button 
                           title="In nghiêng"
                           onClick={() => {
                             const newOverlays = block.overlays.map(o => o.id === overlay.id ? { ...o, fontStyle: o.fontStyle === 'italic' ? 'normal' : 'italic' } : o);
                             updateBlock(block.id, { overlays: newOverlays });
                           }}
                           className={`w-7 h-7 flex items-center justify-center rounded ${overlay.fontStyle === 'italic' ? 'bg-gray-300' : 'hover:bg-gray-100'} font-serif italic text-[14px]`}
                         >
                           I
                         </button>
                         <button 
                           title="Gạch dưới"
                           onClick={() => {
                             const newOverlays = block.overlays.map(o => o.id === overlay.id ? { ...o, textDecoration: o.textDecoration === 'underline' ? 'none' : 'underline' } : o);
                             updateBlock(block.id, { overlays: newOverlays });
                           }}
                           className={`w-7 h-7 flex items-center justify-center rounded ${overlay.textDecoration === 'underline' ? 'bg-gray-300' : 'hover:bg-gray-100'} font-serif underline text-[14px]`}
                         >
                           U
                         </button>

                         <div className="w-[1px] h-5 bg-gray-300 mx-1"></div>

                         <button onClick={() => {
                           const newOverlays = block.overlays.map(o => o.id === overlay.id ? { ...o, textAlign: 'left' } : o);
                           updateBlock(block.id, { overlays: newOverlays });
                         }} className={`w-7 h-7 flex items-center justify-center rounded ${overlay.textAlign === 'left' ? 'bg-gray-300' : 'hover:bg-gray-100'}`}><AlignLeft size={14} /></button>
                         <button onClick={() => {
                           const newOverlays = block.overlays.map(o => o.id === overlay.id ? { ...o, textAlign: 'center' } : o);
                           updateBlock(block.id, { overlays: newOverlays });
                         }} className={`w-7 h-7 flex items-center justify-center rounded ${overlay.textAlign === 'center' ? 'bg-gray-300' : 'hover:bg-gray-100'}`}><AlignCenter size={14} /></button>
                         <button onClick={() => {
                           const newOverlays = block.overlays.map(o => o.id === overlay.id ? { ...o, textAlign: 'right' } : o);
                           updateBlock(block.id, { overlays: newOverlays });
                         }} className={`w-7 h-7 flex items-center justify-center rounded ${overlay.textAlign === 'right' ? 'bg-gray-300' : 'hover:bg-gray-100'}`}><AlignRight size={14} /></button>
                       </div>
                     )}
                     
                     {/* Delete Icon */}
                     {activeOverlayId === overlay.id && (
                       <div className="absolute -top-6 -right-3 flex items-center gap-1 bg-white shadow rounded-full p-1 z-20 border border-gray-200">
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
                   draggable
                   onDragStart={(e) => {
                     e.dataTransfer.setData("application/json", JSON.stringify({ type: 'text-overlay', content: block.content, styles: block.styles }));
                   }}
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
               <div className="absolute bottom-full left-0 mb-2 bg-[#1a1a1a] text-[#b3b3b3] flex items-center px-4 py-2.5 text-[13px] font-medium border border-[#333] rounded-lg flex-wrap gap-y-2 w-max shadow-2xl z-50">
                 <div className="flex items-center pr-2 relative">
                    <select 
                      value={block.styles?.textType || 'Paragraph'} 
                      onChange={(e) => {
                        const val = e.target.value;
                        let fs = block.styles?.fontSize || 17;
                        let fw = block.styles?.fontWeight || 'normal';
                        if (val === 'Heading 1') { fs = 32; fw = 'bold'; }
                        else if (val === 'Heading 2') { fs = 24; fw = 'bold'; }
                        else if (val === 'Paragraph') { fs = 17; fw = 'normal'; }
                        updateBlock(block.id, { styles: { ...block.styles, textType: val, fontSize: fs, fontWeight: fw } })
                      }}
                      className="bg-transparent text-white font-bold outline-none cursor-pointer appearance-none pr-4"
                    >
                      <option value="Paragraph" className="text-black">Paragraph</option>
                      <option value="Heading 1" className="text-black">Heading 1</option>
                      <option value="Heading 2" className="text-black">Heading 2</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-0 pointer-events-none text-white" />
                  </div>
                  <div className="w-[1px] h-5 bg-gray-700 mx-2"></div>
                  <div className="flex items-center px-2 relative">
                    <select 
                      value={block.styles?.fontFamily || 'Helvetica'} 
                      onChange={(e) => updateBlock(block.id, { styles: { ...block.styles, fontFamily: e.target.value } })}
                      className="bg-transparent text-white font-bold outline-none cursor-pointer appearance-none pr-4"
                    >
                      <option value="Helvetica" className="text-black">Helvetica</option>
                      <option value="Arial" className="text-black">Arial</option>
                      <option value="Times New Roman" className="text-black">Times New Roman</option>
                      <option value="Courier New" className="text-black">Courier</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-0 pointer-events-none text-white" />
                  </div>
                 <div className="w-[1px] h-5 bg-gray-700 mx-2"></div>
                 <div className="flex items-center gap-1 cursor-pointer hover:text-white px-2">
                    <input type="number" value={block.styles?.fontSize || 17} onChange={(e) => updateBlock(block.id, { styles: { ...block.styles, fontSize: parseInt(e.target.value) || 17 } })} className="w-12 h-6 px-1 border border-gray-600 rounded bg-transparent text-white text-center outline-none" title="Cỡ chữ" />
                  </div>
                  <div className="w-[1px] h-5 bg-gray-700 mx-2"></div>
                  <div className="flex items-center gap-2 px-2">
                    <input type="color" value={block.styles?.color || '#b3b3b3'} onChange={(e) => updateBlock(block.id, { styles: { ...block.styles, color: e.target.value } })} className="w-6 h-6 p-0 border-0 rounded cursor-pointer bg-transparent" title="Màu chữ" />
                  </div>
                  <div className="w-[1px] h-5 bg-gray-700 mx-2"></div>
                  <div className="flex items-center gap-4 px-2">
                    <button className="hover:text-white flex items-center justify-center border-b-2 border-gray-400 pb-[1px]"><Type size={14} /></button>
                    <button onClick={() => updateBlock(block.id, { styles: { ...block.styles, fontWeight: block.styles?.fontWeight === 'bold' ? 'normal' : 'bold' } })} className={`hover:text-white font-serif font-bold text-[15px] ${block.styles?.fontWeight === 'bold' ? 'text-white' : ''}`}>B</button>
                    <button onClick={() => updateBlock(block.id, { styles: { ...block.styles, fontStyle: block.styles?.fontStyle === 'italic' ? 'normal' : 'italic' } })} className={`hover:text-white font-serif italic text-[15px] ${block.styles?.fontStyle === 'italic' ? 'text-white' : ''}`}>I</button>
                    <button onClick={() => updateBlock(block.id, { styles: { ...block.styles, textDecoration: block.styles?.textDecoration === 'underline' ? 'none' : 'underline' } })} className={`hover:text-white font-serif underline text-[15px] ${block.styles?.textDecoration === 'underline' ? 'text-white' : ''}`}>U</button>
                  </div>
                  <div className="w-[1px] h-5 bg-gray-700 mx-2"></div>
                  <div className="flex items-center gap-4 px-2">
                    <button onClick={() => updateBlock(block.id, { styles: { ...block.styles, textAlign: 'left' } })} className={`hover:text-white ${block.styles?.textAlign === 'left' ? 'text-blue-400' : ''}`}><AlignLeft size={16} /></button>
                    <button onClick={() => updateBlock(block.id, { styles: { ...block.styles, textAlign: 'center' } })} className={`hover:text-white ${block.styles?.textAlign === 'center' ? 'text-blue-400' : ''}`}><AlignCenter size={16} /></button>
                    <button onClick={() => updateBlock(block.id, { styles: { ...block.styles, textAlign: 'right' } })} className={`hover:text-white ${block.styles?.textAlign === 'right' ? 'text-blue-400' : ''}`}><AlignRight size={16} /></button>
                  </div>
                 <div className="w-[1px] h-5 bg-gray-700 mx-2"></div>
                 <div className="flex items-center gap-4 px-2">
                   <button className="hover:text-white"><Link size={16} /></button>
                   <button className="hover:text-white relative"><Unlink size={16} /></button>
                 </div>
               </div>
             )}
             
              {/* TEXTAREA */}
              <textarea 
                className="w-full h-full resize-y p-4 outline-none font-sans bg-transparent" 
                style={{
                  fontFamily: block.styles?.fontFamily || 'Helvetica',
                  color: block.styles?.color || '#b3b3b3',
                  fontSize: `${block.styles?.fontSize || 17}px`,
                  fontWeight: block.styles?.fontWeight || 'normal',
                  fontStyle: block.styles?.fontStyle || 'normal',
                  textDecoration: block.styles?.textDecoration || 'none',
                  textAlign: block.styles?.textAlign || 'left',
                }}
                placeholder="Enter your text here..."
               value={block.content}
               onChange={(e) => updateBlock(block.id, { content: e.target.value })}
               onFocus={() => { setFocusedBlockId(block.id); setEditingBlockId(block.id); }}
               onMouseUp={(e) => {
                 if (e.target.style.height) {
                   const newH = parseInt(e.target.style.height);
                   if (newH !== block.height) {
                     updateBlock(block.id, { height: newH });
                   }
                 }
               }}
             />
           </div>
        )}
        {block.type === 'grid' && (
           <div 
             className={`w-full h-full relative transition-all duration-200 bg-white flex flex-col items-center justify-center min-h-0 overflow-hidden`}
             onClick={(e) => { e.stopPropagation(); setFocusedBlockId(block.id); if (editingBlockId !== block.id) setEditingBlockId(null); }}
           >
              {(!block.images || block.images.length === 0) ? (
                <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] bg-gray-50 w-full h-full border border-dashed border-gray-300">
                   <h2 className="text-[20px] font-medium text-gray-500 mb-6">Empty Grid</h2>
                   <button 
                     onClick={(e) => { e.stopPropagation(); setEditGridBlockId(block.id); }}
                     className="px-6 py-2 bg-[#2b64ff] text-white font-medium rounded-full hover:bg-blue-700 transition"
                   >
                     Add Photos
                   </button>
                </div>
              ) : (
                <div className="w-full flex-1 flex flex-col items-center justify-center min-h-0 overflow-hidden" style={{ maxWidth: block.fullWidth ? (orientation === 'landscape' ? 800 : 600) : ((orientation === 'landscape' ? 800 : 600) - (projectStyles.contentSpacing || 0)*2) }}>
                  <JustifiedGrid 
                    images={block.images} 
                    containerWidth="auto" 
                  />
                </div>
              )}
           </div>
        )}
        {block.type === 'video' && (
            <div 
              className={`w-full h-full relative transition-all duration-200 border 
                ${editingBlockId === block.id ? 'border-[#2b64ff]' : 
                  hoveredBlockId === block.id ? 'border-dashed border-[#2b64ff]' : 'border-transparent'} bg-gray-100 flex items-center justify-center overflow-hidden`}
              onClick={(e) => { e.stopPropagation(); if (editingBlockId !== block.id) setEditingBlockId(null); }}
              onDoubleClick={(e) => { e.stopPropagation(); setEditingBlockId(block.id); }}
            >
              {focusedBlockId === block.id && editingBlockId !== block.id && (
                <div 
                  className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-[#2b64ff] flex items-center justify-center cursor-pointer text-white shadow-md z-20 hover:bg-blue-700 transition"
                  onClick={(e) => { e.stopPropagation(); setEditingBlockId(block.id); }}
                >
                  <Edit2 size={14} />
                </div>
              )}

              {/* Editing Mode: Input URL */}
              {editingBlockId === block.id || !block.content ? (
                <div className="w-full h-[200px] bg-[#f8f8f8] flex flex-col items-center justify-center gap-3">
                  <Play size={32} className="text-gray-400" />
                  <span className="text-gray-500 font-medium">Embed a Video, Audio, or GIF from a link</span>
                  <input 
                    type="text"
                    placeholder="Paste a YouTube, Vimeo, MP4, or GIF link and press Enter"
                    className="w-[80%] max-w-[500px] px-4 py-2 border border-gray-300 rounded text-sm text-center outline-none focus:border-[#2b64ff]"
                    defaultValue={block.content || ''}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        updateBlock(block.id, { content: e.target.value });
                        setEditingBlockId(null);
                      }
                    }}
                    autoFocus
                  />
                  {block.content && (
                    <button onClick={(e) => { e.stopPropagation(); setEditingBlockId(null); }} className="mt-2 text-xs text-gray-500 hover:text-gray-800 underline">Cancel</button>
                  )}
                </div>
              ) : (
                /* Display Mode */
                <div className="w-full relative flex items-center justify-center">
                  {(() => {
                    const url = block.content;
                    if (!url) return null;
                    if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
                      const videoId = url.includes('youtu.be/') ? url.split('youtu.be/')[1].split('?')[0] : new URLSearchParams(new URL(url).search).get('v');
                      return <iframe width="100%" height="500" src={`https://www.youtube.com/embed/${videoId}?autoplay=0`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>;
                    } else if (url.includes('vimeo.com/')) {
                      const videoId = url.split('vimeo.com/')[1].split('?')[0];
                      return <iframe src={`https://player.vimeo.com/video/${videoId}`} width="100%" height="500" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>;
                    } else if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
                      return <video src={url} controls autoPlay loop muted playsInline style={{ maxWidth: '100%', maxHeight: '600px' }}></video>;
                    } else if (url.match(/\.(gif|jpg|jpeg|png|webp)(\?.*)?$/i)) {
                      return <img src={url} style={{ maxWidth: '100%', maxHeight: '600px', objectFit: 'contain' }} />;
                    } else {
                      return (
                        <div className="w-full h-[200px] bg-red-50 flex flex-col items-center justify-center gap-2 border border-red-200">
                          <span className="text-red-500 font-medium">Link format not supported or recognized.</span>
                          <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 underline mb-2 break-all px-4 text-center">{url}</a>
                          <button onClick={() => setEditingBlockId(block.id)} className="text-sm bg-white border border-gray-300 px-3 py-1 rounded hover:bg-gray-50">Edit Link</button>
                        </div>
                      );
                    }
                  })()}
                </div>
              )}
            </div>
         )}
        
        {/* END of block */}
      {/* PREVIEW OVERLAY */}
      {isPreviewMode && (
        <div style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", flexDirection: "column", overflowY: "auto", overflowX: "hidden", fontFamily: "'Inter', sans-serif" }}>
           <div style={{ position: "fixed", inset: 0, background: "#111111", zIndex: -1 }} />
           
           {/* Simple Close Button */}
           <div style={{ position: "fixed", top: 24, right: 24, zIndex: 1010 }}>
             <button 
               onClick={() => setIsPreviewMode(false)} 
               style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: 44, height: 44, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} 
               onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"} 
               onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
             >
               <X size={24} />
             </button>
           </div>

           <div style={{ display: "flex", width: "100%", height: "100vh", alignItems: "center", justifyContent: "center", position: "relative" }}>
             {blocks.length === 0 ? (
               <div style={{ height: 400, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}>
                  Empty Project
               </div>
             ) : (
               <HTMLFlipBook 
                 width={orientation === 'landscape' ? 800 : 600} 
                 height={orientation === 'landscape' ? 600 : 800} 
                 size="fixed" 
                 minWidth={315} 
                 maxWidth={1000} 
                 minHeight={400} 
                 maxHeight={1533} 
                 maxShadowOpacity={0.5} 
                 showCover={true} 
                 mobileScrollSupport={true}
                 className="shadow-2xl"
               >
                  {(() => {
                     const flipbookPages = blocks.map(block => (
                       <div key={block.id} className="bg-white overflow-hidden relative shadow-[0_0_20px_rgba(0,0,0,0.1)]" style={{ background: projectStyles.backgroundColor || "#ffffff" }}>
                         {block.type === 'image' && block.content && (
                           <img src={block.content} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                         )}
                         {block.type === 'grid' && (
                           <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                             <div className="w-full flex-1 flex flex-col justify-center items-center min-h-0 overflow-hidden" style={{ maxWidth: block.fullWidth ? (orientation === 'landscape' ? 800 : 600) : ((orientation === 'landscape' ? 800 : 600) - (projectStyles.contentSpacing || 0)*2), margin: "0 auto" }}>
                               <JustifiedGrid 
                                 images={block.images || []} 
                                 containerWidth="auto" 
                               />
                             </div>
                           </div>
                         )}
                         {block.type === 'text' && (
                           <div style={{ color: "#212121", padding: 32, fontSize: 17, fontFamily: "sans-serif", whiteSpace: "pre-wrap", width: "100%", height: "100%", overflowY: "auto" }} dangerouslySetInnerHTML={{ __html: block.content ? block.content.replace(/\n/g, '<br/>') : '' }}></div>
                         )}
                         {block.type === 'video' && block.content && (
                           <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyItems: "center" }}>
                             {(() => {
                               const url = block.content;
                               if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
                                 const videoId = url.includes('youtu.be/') ? url.split('youtu.be/')[1].split('?')[0] : new URLSearchParams(new URL(url).search).get('v');
                                 return <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}?autoplay=0`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>;
                               } else if (url.includes('vimeo.com/')) {
                                 const videoId = url.split('vimeo.com/')[1].split('?')[0];
                                 return <iframe src={`https://player.vimeo.com/video/${videoId}`} width="100%" height="100%" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>;
                               } else if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
                                 return <video src={url} controls autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>;
                               } else if (url.match(/\.(gif|jpg|jpeg|png|webp)(\?.*)?$/i)) {
                                 return <img src={url} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
                               }
                               return null;
                             })()}
                           </div>
                         )}
                         {/* Overlays */}
                         {block.overlays?.map(overlay => (
                           <div key={overlay.id} style={{ position: 'absolute', left: overlay.x, top: overlay.y, zIndex: 10 }}>
                             {overlay.type === 'image' ? (
                               <img src={overlay.content} style={{ width: overlay.width || 150, height: 'auto', display: 'block', transform: `scale(${overlay.scale || 1})` }} />
                             ) : (
                               <div style={{
                                 fontFamily: overlay.fontFamily || 'Helvetica',
                                 color: overlay.color || '#000000',
                                 fontSize: `${overlay.fontSize || 24}px`,
                                 fontWeight: overlay.fontWeight || 'normal',
                                 fontStyle: overlay.fontStyle || 'normal',
                                 textDecoration: overlay.textDecoration || 'none',
                                 textAlign: overlay.textAlign || 'left',
                                 whiteSpace: 'pre-wrap'
                               }}>
                                 {overlay.content}
                               </div>
                             )}
                           </div>
                         ))}
                       </div>
                     ));
                     
                     // Pad pages to be even, and ensure at least 4 pages to prevent react-pageflip blank bugs
                     while (flipbookPages.length % 2 !== 0 || flipbookPages.length < 4) {
                       flipbookPages.push(
                         <div key={`padding-page-${flipbookPages.length}`} className="bg-white overflow-hidden relative shadow-[0_0_20px_rgba(0,0,0,0.1)]" style={{ background: projectStyles.backgroundColor || "#ffffff" }}>
                            <div className="w-full h-full flex items-center justify-center text-gray-300">End</div>
                         </div>
                       );
                     }
                     return flipbookPages;
                  })()}
               </HTMLFlipBook>
             )}
           </div>
        </div>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          @page { size: ${orientation === 'landscape' ? 'A4 landscape' : 'A4 portrait'}; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          #root { display: none !important; }
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

      {/* Modals */}
      <ReorderProjectModal
        isOpen={isReorderModalOpen}
        onClose={() => setIsReorderModalOpen(false)}
        blocks={blocks}
        onSave={setBlocks}
      />
      
      {editGridBlockId && (
        <EditGridModal
          isOpen={!!editGridBlockId}
          onClose={() => setEditGridBlockId(null)}
          block={blocks.find(b => b.id === editGridBlockId)}
          onSave={updateBlock}
        />
      )}
      
      </div>
    );
  };


  return createPortal(
    <div className="journal-modal-root fixed inset-0 z-[9999] flex flex-col bg-[#f8f8f8] overflow-hidden print:static print:overflow-visible print:h-auto print:block print:bg-white">
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
          <button 
            onClick={handleExportPDF} 
            disabled={isExporting}
            className={`text-sm font-semibold text-white bg-[#1a4ba8] rounded-full px-5 py-1.5 transition flex items-center gap-2 ${isExporting ? 'opacity-70 cursor-wait' : 'hover:bg-[#1a4ba8]/90'}`}
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang xuất PDF...
              </>
            ) : (
              'Xuất PDF'
            )}
          </button>
          <button onClick={() => onSaveDraft && onSaveDraft({ blocks, settingsData, orientation })} className="text-sm font-semibold text-gray-800 border border-gray-300 rounded-full px-4 py-1.5 hover:bg-gray-50 transition">Lưu Nháp & Đóng</button>
        </div>
      </header>

      {/* BODY */}
      <div 
        className="flex flex-1 overflow-hidden relative print:overflow-visible print:static print:h-auto print:block" 
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
        <div className="flex-1 overflow-y-auto relative transition-colors print:overflow-visible print:static print:h-auto print:block" style={{ backgroundColor: projectStyles.backgroundColor }}>
          {blocks.length === 0 ? (
            <div className="w-full min-h-full pb-32 pt-12 print:p-0 print:m-0 journal-print-container"></div>
          ) : (
            <div className={`w-full min-h-full pb-32 ${blocks.length > 0 && blocks[0].fullWidth ? '' : 'pt-12'} print:p-0 print:m-0 journal-print-container`}>
              {blocks.map(renderBlock)}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-[300px] border-l border-gray-200 bg-white flex flex-col shrink-0 overflow-y-auto z-10 print:hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-[13px] font-bold text-gray-500 uppercase tracking-wide mb-3">Add Content</h3>
            <div className="grid grid-cols-2 gap-[1px] bg-gray-200 border border-gray-200 rounded overflow-hidden">
              <button className="bg-white hover:bg-gray-50 py-3 flex flex-col items-center justify-center gap-1.5 transition" onClick={() => addBlock('image')}>
                <Image size={18} className="text-gray-800" />
                <span className="text-[11px] font-medium text-gray-700">Image</span>
              </button>
              <button 
                draggable
                onDragStart={(e) => { e.dataTransfer.setData("application/json", JSON.stringify({ type: 'text-overlay' })); }}
                className="bg-white hover:bg-gray-50 py-3 flex flex-col items-center justify-center gap-1.5 transition" 
                onClick={() => addBlock('text')}
              >
                <Type size={18} className="text-gray-800" />
                <span className="text-[11px] font-medium text-gray-700">Text</span>
              </button>
              <button className="bg-white hover:bg-gray-50 py-3 flex flex-col items-center justify-center gap-1.5 transition" onClick={() => addBlock('grid')}>
                <LayoutGrid size={18} className="text-gray-800" />
                <span className="text-[11px] font-medium text-gray-700">Photo Grid</span>
              </button>
              <button className="bg-white hover:bg-gray-50 py-3 flex flex-col items-center justify-center gap-1.5 transition" onClick={() => addBlock('video')}>
                <Play size={18} className="text-gray-800" />
                <span className="text-[11px] font-medium text-gray-700">Video/Audio</span>
              </button>
              <button type="button" className="bg-white hover:bg-gray-50 py-3 flex flex-col items-center justify-center gap-1.5 transition" onClick={(e) => { e.stopPropagation(); setShowCollectionDrawer(!showCollectionDrawer); }}>
                <Folder size={18} className="text-[#1a4ba8]" />
                <span className="text-[11px] font-medium text-[#1a4ba8]">Bộ sưu tập</span>
              </button>
            </div>
          </div>
          
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-[13px] font-bold text-gray-500 uppercase tracking-wide mb-3">Edit Project</h3>
            <div className="grid grid-cols-1 gap-[1px] bg-gray-200 border border-gray-200 rounded overflow-hidden">
              <button className="bg-white hover:bg-gray-50 py-3 flex flex-col items-center justify-center gap-1.5 transition text-blue-600" onClick={() => setIsStylesModalOpen(true)}>
                <PenTool size={18} />
                <span className="text-[11px] font-medium">Styles</span>
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
          <div className="absolute top-0 bg-white/95 backdrop-blur-xl border-l border-gray-200 shadow-[0_0_40px_rgba(0,0,0,0.08)] z-[100] flex flex-col transition-transform duration-300 print:hidden" style={{ right: '300px', width: '340px', height: '100%' }}>
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-white/60 backdrop-blur-md sticky top-0 z-10">
              <h3 className="text-[15px] font-semibold text-gray-800 flex items-center gap-2">
                <Folder size={18} className="text-[#1a4ba8]" />
                Bộ sưu tập
              </h3>
              <button onClick={() => setShowCollectionDrawer(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-800 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-5 flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {collection?.items?.flatMap((item) => {
                  const artworkToUse = fullArtworks[item.artworkId] || item.artwork;
                  const images = [artworkToUse?.coverImageUrl || artworkToUse?.img];
                  if (artworkToUse?.fileUrls && Array.isArray(artworkToUse.fileUrls)) {
                    artworkToUse.fileUrls.forEach(url => {
                      if (!images.includes(url)) images.push(url);
                    });
                  }
                  if (artworkToUse?.blocksJson) {
                    try {
                      const blocks = typeof artworkToUse.blocksJson === 'string' ? JSON.parse(artworkToUse.blocksJson) : artworkToUse.blocksJson;
                      if (Array.isArray(blocks)) {
                        blocks.forEach(b => {
                          if (b.type === 'image' && b.data?.url && !images.includes(b.data.url)) {
                            images.push(b.data.url);
                          }
                        });
                      }
                    } catch(e) {}
                  }
                  return images.filter(Boolean).map((src, i) => (
                    <div 
                      key={`${item.id}-${i}`} 
                      draggable
                      onDragStart={(e) => {
                        setDraggedImg(src);
                        e.dataTransfer.setData("text/plain", src);
                      }}
                      className="group relative aspect-square bg-gray-50 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-300 transition-all duration-300 hover:-translate-y-1"
                    >
                      <img src={src} className="w-full h-full object-cover pointer-events-none group-hover:scale-110 transition-transform duration-500 ease-out" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                  ));
                })}
              </div>
              
              {(!collection?.items || collection.items.length === 0) && (
                <div className="flex flex-col items-center justify-center py-16 text-center opacity-70">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Folder size={24} className="text-gray-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Bộ sưu tập trống</p>
                  <p className="text-[13px] text-gray-400 mt-1 max-w-[200px]">Hãy thêm ảnh vào bộ sưu tập để sử dụng.</p>
                </div>
              )}
            </div>
            
            <div className="p-5 bg-white border-t border-gray-100">
              <div className="bg-blue-50/80 rounded-xl p-4 flex items-start gap-3 border border-blue-100/50 shadow-sm">
                <div className="mt-0.5 text-blue-500 shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                </div>
                <p className="text-[12.5px] leading-relaxed text-blue-800/90 font-medium">
                  Kéo và thả ảnh từ đây vào vùng thiết kế để chèn nhanh.
                </p>
              </div>
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
          body > *:not(.journal-modal-root) { display: none !important; }
          @page { size: ${orientation === 'landscape' ? '800px 600px' : '600px 800px'}; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          .print\\:bg-white { background: white !important; }
          .print\\:static { position: static !important; }
          .print\\:overflow-visible { overflow: visible !important; }
          .print\\:h-auto { height: auto !important; min-height: auto !important; max-height: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:mb-0 { margin-bottom: 0 !important; }
          .print\\:break-after-page:not(:last-child) { break-after: page !important; page-break-after: always !important; }
          .print\\:border-transparent { border-color: transparent !important; }
          .print\\:border-none { border: none !important; }
        }
      `}</style>
      {/* Modals */}
      <ReorderProjectModal
        isOpen={isReorderModalOpen}
        onClose={() => setIsReorderModalOpen(false)}
        blocks={blocks}
        onSave={setBlocks}
      />
      
      {editGridBlockId && (
        <EditGridModal
          isOpen={!!editGridBlockId}
          onClose={() => setEditGridBlockId(null)}
          block={blocks.find(b => b.id === editGridBlockId)}
          onSave={updateBlock}
          orientation={orientation}
          projectStyles={projectStyles}
        />
      )}
    </div>,
    document.body
  );
}
