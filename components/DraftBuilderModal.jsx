import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, Image, Type, LayoutGrid, Play, Settings, PenTool, ArrowLeftRight, MoveHorizontal, Edit2, Plus, X, ChevronDown, AlignLeft, AlignCenter, AlignRight, Link, Unlink, Pilcrow, Mail, ThumbsUp, Folder, Upload, Eye, MessageCircle, FileText } from "lucide-react";
import JustifiedGrid from "./journal/JustifiedGrid";
import EditGridModal from "./journal/EditGridModal";
import ReorderProjectModal from "./journal/ReorderProjectModal";

export default function DraftBuilderModal({ isOpen, onClose, onPublish, onSave, currentUser, initialBlocks = [], initialSettingsData = null }) {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [hoveredBlockId, setHoveredBlockId] = useState(null);
  const [focusedBlockId, setFocusedBlockId] = useState(null);
  const [editingBlockId, setEditingBlockId] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [dropdownBlockId, setDropdownBlockId] = useState(null);
  const [activeOverlayId, setActiveOverlayId] = useState(null);
  const [draggedImg, setDraggedImg] = useState(null);
  const [editGridBlockId, setEditGridBlockId] = useState(null);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  
  const handlePublish = async () => {
    onPublish(blocks, settingsData);
  };
  
  const [isStylesModalOpen, setIsStylesModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [projectStyles, setProjectStyles] = useState(initialSettingsData?.projectStyles || { backgroundColor: '#ffffff', contentSpacing: 0 });
  const [settingsData, setSettingsData] = useState(initialSettingsData || {
    coverImage: null, title: '', tags: '', category: '', tools: '', role: '', projectYear: 'Năm 3', description: '', license: 'All Rights Reserved', coOwners: '',
    projectStatus: 'Draft', aiUsage: 'none', aiPrompt: ''
  });

  useEffect(() => {
    if (isOpen) {
      setBlocks(initialBlocks || []);
      if (initialSettingsData) {
        setSettingsData({ projectStatus: 'Draft', role: '', aiUsage: 'none', aiPrompt: '', ...initialSettingsData });
        setProjectStyles(initialSettingsData?.projectStyles || { backgroundColor: '#ffffff', contentSpacing: 0 });
      } else {
        setSettingsData({
          coverImage: null, title: '', tags: '', category: '', tools: '', role: '', projectYear: 'Năm 3', description: '', license: 'All Rights Reserved', coOwners: '',
          projectStatus: 'Draft', aiUsage: 'none', aiPrompt: ''
        });
        setProjectStyles({ backgroundColor: '#ffffff', contentSpacing: 0 });
      }
      setIsPreviewMode(false);
      setIsSettingsModalOpen(false);
      setIsStylesModalOpen(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const autoSaveRef = useRef({ blocks, settingsData });
  useEffect(() => {
    autoSaveRef.current = { blocks, settingsData };
  });

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      const state = autoSaveRef.current;
      if (state.blocks.length > 0 || (state.settingsData.title && state.settingsData.title !== 'Untitled Project')) {
        onSave(state.blocks, state.settingsData, true); // true = isAutoSave
        console.log("Auto-saved draft from builder at", new Date().toLocaleTimeString());
      }
    }, 60000);
    return () => clearInterval(timer);
  }, [isOpen, onSave]);
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

  const addBlock = (type, initialContent = "") => {
    setBlocks([...blocks, { id: Date.now().toString(), type, content: initialContent, fullWidth: false }]);
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
                    {block.type === 'grid' && (
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={(e) => { e.stopPropagation(); setEditGridBlockId(block.id); setDropdownBlockId(null); }}>Edit Grid</button>
                    )}
                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors" onClick={(e) => { e.stopPropagation(); removeBlock(block.id); setDropdownBlockId(null); }}>Delete Block</button>
                  </div>
                )}
              </div>
            </div>

            {/* Resize Button */}
            <div className="absolute top-3 right-3 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                className="h-8 px-3 bg-gray-900/80 hover:bg-black text-white rounded-full flex items-center justify-center gap-1 shadow-lg transition-colors cursor-pointer backdrop-blur-sm border border-white/20"
                onClick={(e) => { e.stopPropagation(); updateBlock(block.id, { fullWidth: !block.fullWidth }); }}
                title="Toggle Full Width"
              >
                <ArrowLeftRight size={14} />
              </button>
            </div>
          </>
        )}
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
                 className="absolute inset-0 w-full h-full"
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
             
             {/* Caption Input */}
             <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
               <input 
                 type="text" 
                 placeholder="Add a caption (optional)" 
                 value={block.caption || ''} 
                 onChange={(e) => updateBlock(block.id, { caption: e.target.value })} 
                 className="bg-white/90 backdrop-blur border border-gray-200 shadow-sm text-sm px-4 py-2 rounded-full w-[80%] max-w-[500px] text-center outline-none focus:border-blue-500 focus:bg-white text-gray-800"
                 onClick={(e) => e.stopPropagation()}
               />
             </div>
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
             className={`w-full relative transition-all duration-200 border 
               ${focusedBlockId === block.id ? 'border-[#2b64ff]' : 
                 hoveredBlockId === block.id ? 'border-dashed border-[#2b64ff]' : 'border-transparent'} bg-white flex flex-col items-center justify-center overflow-hidden`}
             onClick={(e) => { e.stopPropagation(); setFocusedBlockId(block.id); if (editingBlockId !== block.id) setEditingBlockId(null); }}
           >
              {(!block.images || block.images.length === 0) ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 w-full border border-dashed border-gray-300">
                   <h2 className="text-[20px] font-medium text-gray-500 mb-6">Empty Grid</h2>
                   <button 
                     onClick={(e) => { e.stopPropagation(); setEditGridBlockId(block.id); }}
                     className="px-6 py-2 bg-[#2b64ff] text-white font-medium rounded-full hover:bg-blue-700 transition"
                   >
                     Add Photos
                   </button>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center justify-center min-h-[400px] overflow-hidden" style={{ maxWidth: block.fullWidth ? 1400 : 1000 }}>
                  <JustifiedGrid 
                    images={block.images} 
                    targetWidth={block.fullWidth ? 1400 : 1000}
                    targetHeight={400}
                    autoHeight={true}
                    watermarkText="UEF"
                  />
                </div>
              )}
           </div>
        )}
        {block.type === 'video' && (
             <div 
               className={`w-full relative transition-all duration-200 border 
                 ${focusedBlockId === block.id ? 'border-[#2b64ff]' : 
                   hoveredBlockId === block.id ? 'border-dashed border-[#2b64ff]' : 'border-transparent'} bg-white flex flex-col items-center justify-center overflow-hidden`}
               onClick={(e) => { e.stopPropagation(); setFocusedBlockId(block.id); if (editingBlockId !== block.id) setEditingBlockId(null); }}
             >
                {focusedBlockId === block.id && block.content && (
                    <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-[#2b64ff] flex items-center justify-center cursor-pointer text-white shadow-md z-20 hover:bg-blue-700 transition" onClick={(e) => { e.stopPropagation(); updateBlock(block.id, { content: "" }); }}>
                      <Edit2 size={14} />
                    </div>
                )}
                {(!block.content) ? (
                  <div className="flex flex-col items-center justify-center min-h-[300px] bg-gray-50 w-full border border-dashed border-gray-300 p-8">
                     <h2 className="text-[20px] font-medium text-gray-500 mb-2">Embed Media</h2>
                     <p className="text-[14px] text-gray-400 mb-6 text-center">Paste a link from YouTube, Vimeo, Figma, Sketchfab, or a direct MP4 link.</p>
                     <div className="flex w-full max-w-lg gap-2">
                       <input 
                         type="text" 
                         placeholder="https://..." 
                         className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm outline-none focus:border-[#2b64ff]"
                         id={`embed-input-${block.id}`}
                         onKeyDown={(e) => {
                           if (e.key === 'Enter') {
                             updateBlock(block.id, { content: e.target.value });
                           }
                         }}
                       />
                       <button 
                         onClick={(e) => { e.stopPropagation(); updateBlock(block.id, { content: document.getElementById(`embed-input-${block.id}`).value }); }}
                         className="px-6 py-2 bg-[#2b64ff] text-white font-medium rounded hover:bg-blue-700 transition"
                       >
                         Embed
                       </button>
                     </div>
                  </div>
                ) : (
                  <div className="w-full relative" style={{ aspectRatio: '16 / 9' }}>
                    {(() => {
                       let type = 'iframe';
                       let url = block.content;
                       if (url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)) {
                         type = 'youtube';
                         url = `https://www.youtube.com/embed/${url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)[1]}`;
                       } else if (url.match(/(?:vimeo\.com\/)(\d+)/)) {
                         type = 'vimeo';
                         url = `https://player.vimeo.com/video/${url.match(/(?:vimeo\.com\/)(\d+)/)[1]}`;
                       } else if (url.includes('figma.com')) {
                         type = 'figma';
                         url = `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`;
                       } else if (url.includes('sketchfab.com') && url.match(/([a-fA-F0-9]{32})/)) {
                         type = 'sketchfab';
                         url = `https://sketchfab.com/models/${url.match(/([a-fA-F0-9]{32})/)[1]}/embed`;
                       } else if (url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm')) {
                         type = 'video';
                       }
                       
                       if (type === 'video') {
                         return <video src={url} controls className="absolute top-0 left-0 w-full h-full object-cover" />;
                       }
                       return (
                         <iframe 
                           src={url} 
                           className="absolute top-0 left-0 w-full h-full border-0" 
                           allowFullScreen 
                           allow="autoplay; fullscreen; xr-spatial-tracking"
                         />
                       );
                    })()}
                  </div>
                )}
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
               <button className="px-6 py-2 rounded-full text-white bg-[#10a359] hover:bg-[#0e8f4e] font-semibold text-[13px] transition-colors" onClick={() => { setIsPreviewMode(false); handlePublish(); }}>Publish</button>
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
                    Follow {currentUser?.fullName ? currentUser.fullName.split(' ').pop() : (currentUser?.name || "Author")}
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
                                      {block.type === 'grid' && (
                                        <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                            <div className="w-full flex flex-col justify-center items-center overflow-hidden min-h-[400px]" style={{ maxWidth: block.fullWidth ? 1400 : 1000, margin: "0 auto" }}>
                                              <JustifiedGrid 
                                                images={block.images || []} 
                                                targetWidth={block.fullWidth ? 1400 : 1000}
                                                targetHeight={400}
                                                autoHeight={true}
                                                watermarkText="UEF"
                                              />
                                            </div>
                                        </div>
                                      )}
                                        {block.type === 'video' && (
                                           <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                              <div className="w-full flex flex-col justify-center items-center overflow-hidden" style={{ maxWidth: block.fullWidth ? 1400 : 1000, margin: "0 auto", aspectRatio: '16 / 9' }}>
                                                {(() => {
                                                   if (!block.content) return null;
                                                   let type = 'iframe';
                                                   let url = block.content;
                                                   if (url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)) {
                                                     type = 'youtube';
                                                     url = `https://www.youtube.com/embed/${url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)[1]}`;
                                                   } else if (url.match(/(?:vimeo\.com\/)(\d+)/)) {
                                                     type = 'vimeo';
                                                     url = `https://player.vimeo.com/video/${url.match(/(?:vimeo\.com\/)(\d+)/)[1]}`;
                                                   } else if (url.includes('figma.com')) {
                                                     type = 'figma';
                                                     url = `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`;
                                                   } else if (url.includes('sketchfab.com') && url.match(/([a-fA-F0-9]{32})/)) {
                                                     type = 'sketchfab';
                                                     url = `https://sketchfab.com/models/${url.match(/([a-fA-F0-9]{32})/)[1]}/embed`;
                                                   } else if (url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm')) {
                                                     type = 'video';
                                                   }
                                                   
                                                   if (type === 'video') {
                                                     return <video src={url} controls className="w-full h-full object-cover" />;
                                                   }
                                                   return (
                                                     <iframe 
                                                       src={url} 
                                                       className="w-full h-full border-0" 
                                                       allowFullScreen 
                                                       allow="autoplay; fullscreen; xr-spatial-tracking"
                                                     />
                                                   );
                                                })()}
                                              </div>
                                           </div>
                                        )}
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
      </div>
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex flex-col bg-[#f8f8f8] overflow-hidden">
      {/* HEADER */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          
          {/* Status Progress & Dropdown */}
          <div className="flex items-center gap-3 ml-2">
            <div className="hidden lg:flex items-center bg-gray-50 rounded-full px-3 py-1.5 border border-gray-200">
               {['Draft', 'Submitted', 'Revision', 'Approved', 'Published'].map((status, idx) => {
                 const isActive = settingsData?.projectStatus === status;
                 // Determine if it's "passed"
                 const statuses = ['Draft', 'Submitted', 'Revision', 'Approved', 'Published'];
                 const currentIndex = statuses.indexOf(settingsData?.projectStatus || 'Draft');
                 const isPassed = idx <= currentIndex;
                 
                 return (
                   <React.Fragment key={status}>
                     <div className={`flex items-center justify-center text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors ${isActive ? 'bg-[#2b64ff] text-white shadow-sm' : isPassed ? 'text-[#2b64ff]' : 'text-gray-400'}`}>
                       {status}
                     </div>
                     {idx < 4 && <div className={`w-3 h-[2px] mx-1 rounded-full ${isPassed && idx < currentIndex ? 'bg-[#2b64ff]' : 'bg-gray-200'}`}></div>}
                   </React.Fragment>
                 );
               })}
            </div>
            
            <select 
              value={settingsData?.projectStatus || 'Draft'}
              onChange={(e) => setSettingsData({...settingsData, projectStatus: e.target.value})}
              className="text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md px-2 py-1.5 outline-none focus:border-[#2b64ff] cursor-pointer hover:bg-gray-50 transition shadow-sm"
            >
              <option value="Draft">Draft</option>
              <option value="Submitted">Submit for Review</option>
              <option value="Revision">Request Revision</option>
              <option value="Approved">Approve Project</option>
              <option value="Published">Publish (Public)</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition" onClick={() => setIsPreviewMode(true)}>Preview</button>
          <button onClick={() => onSave(blocks, settingsData)} className="text-sm font-semibold text-gray-800 border border-gray-300 rounded-full px-4 py-1.5 hover:bg-gray-50 transition">Save as Draft</button>
          <button onClick={handlePublish} className="text-sm font-semibold text-white bg-[#1a4ba8] rounded-full px-5 py-1.5 hover:bg-[#1a4ba8]/90 transition">Publish</button>
        </div>
      </header>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden relative" onClick={() => { setFocusedBlockId(null); setEditingBlockId(null); }}>
        {/* WORKSPACE */}
        <div id="draft-scroll-container" className="flex-1 overflow-y-auto relative transition-colors" style={{ backgroundColor: projectStyles.backgroundColor }}>
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
            <div id="draft-canvas-area" className={`w-full min-h-full pb-32 ${blocks.length > 0 && blocks[0].fullWidth ? '' : 'pt-12'}`} style={{ backgroundColor: projectStyles.backgroundColor }}>
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
              <button className="bg-white hover:bg-gray-50 py-4 flex flex-col items-center justify-center gap-2 transition" onClick={() => addBlock('text')}>
                <Type size={24} className="text-gray-800" />
                <span className="text-[13px] font-medium text-gray-700">Text</span>
              </button>
              <button className="bg-white hover:bg-gray-50 py-4 flex flex-col items-center justify-center gap-2 transition" onClick={() => addBlock('grid')}>
                <LayoutGrid size={24} className="text-gray-800" />
                <span className="text-[13px] font-medium text-gray-700">Photo Grid</span>
              </button>
              <button className="bg-white hover:bg-gray-50 py-4 flex flex-col items-center justify-center gap-2 transition" onClick={() => addBlock('video')}>
                <Play size={24} className="text-gray-800" />
                  <span className="text-[13px] font-medium text-gray-700">Video/Embed</span>
              </button>
            </div>
          </div>
          
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-[13px] font-bold text-gray-500 uppercase tracking-wide mb-3">Edit Project</h3>
            <div className="grid grid-cols-3 gap-[1px] bg-gray-200 border border-gray-200 rounded overflow-hidden">
              <button className="bg-white hover:bg-gray-50 py-4 flex flex-col items-center justify-center gap-2 transition text-blue-600" onClick={() => setIsStylesModalOpen(true)}>
                <PenTool size={20} />
                <span className="text-[13px] font-medium">Styles</span>
              </button>
              <button className="bg-white hover:bg-gray-50 py-4 flex flex-col items-center justify-center gap-2 transition" onClick={() => setIsSettingsModalOpen(true)}>
                <Settings size={20} className="text-gray-800" />
                <span className="text-[13px] font-medium text-gray-700">Settings</span>
              </button>
              <button className="bg-white hover:bg-gray-50 py-4 flex flex-col items-center justify-center gap-2 transition text-indigo-600" onClick={() => setIsReorderModalOpen(true)}>
                <LayoutGrid size={20} />
                <span className="text-[13px] font-medium">Rearrange</span>
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

      {editGridBlockId && (
        <EditGridModal
          isOpen={!!editGridBlockId}
          onClose={() => setEditGridBlockId(null)}
          block={blocks.find(b => b.id === editGridBlockId)}
          onSave={(id, updatedBlock) => {
             updateBlock(id, updatedBlock);
             setEditGridBlockId(null);
          }}
          orientation="landscape"
          projectStyles={projectStyles}
          watermarkText="UEF"
        />
      )}

      {isReorderModalOpen && (
        <ReorderProjectModal
          isOpen={true}
          onClose={() => setIsReorderModalOpen(false)}
          blocks={blocks}
          onSaveReorder={(newBlocks) => {
            setBlocks(newBlocks);
            setIsReorderModalOpen(false);
          }}
        />
      )}

      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-[10000] bg-black/60 flex items-center justify-center p-8">
          <div className="bg-white shadow-2xl w-full max-w-[1000px] h-[90vh] rounded-lg relative flex flex-col overflow-hidden">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 z-10" onClick={() => setIsSettingsModalOpen(false)}><X size={24} /></button>
            
            <div className="flex flex-1 overflow-hidden">
              <div className="w-[350px] border-r border-gray-100 p-8 shrink-0 overflow-y-auto">
                <h3 className="font-bold text-[15px] text-gray-900 mb-4">Project Cover <span className="text-gray-500 font-normal">(required)</span></h3>
                <div className="border border-dashed border-gray-300 bg-gray-50 aspect-[4/3] rounded flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-gray-100 transition relative overflow-hidden" onClick={() => fileInputRef.current?.click()}>
                  {settingsData.coverImage ? (
                    <img src={settingsData.coverImage} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="bg-blue-600 text-white font-bold py-2 px-6 rounded-full mb-6">Upload Image</div>
                      <p className="text-sm text-gray-500">Minimum size of "808 x 632px"<br/>GIF files will not animate.</p>
                    </>
                  )}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleCoverUpload} />
                </div>
              </div>
              
              <div className="flex-1 p-8 bg-[#fdfdfd] overflow-y-auto">
                <div className="mb-8">
                  <h3 className="font-bold text-[13px] text-gray-800 uppercase tracking-wider mb-6">PROJECT INFORMATION</h3>
                  
                  <div className="mb-6">
                    <label className="block font-bold text-[15px] text-gray-900 mb-2">Title <span className="text-gray-500 font-normal">(required)</span></label>
                    <input type="text" className="w-full border border-gray-300 rounded p-3 text-gray-900 outline-none focus:border-blue-500 transition" placeholder="Give your project a title" value={settingsData.title} onChange={e => setSettingsData({...settingsData, title: e.target.value})} />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block font-bold text-[15px] text-gray-900 mb-2">Tags <span className="text-gray-500 font-normal">(limit of 10)</span></label>
                    <input type="text" className="w-full border border-gray-300 rounded p-3 text-gray-900 outline-none focus:border-blue-500 transition" placeholder="Add up to 10 keywords to help people discover your project" value={settingsData.tags} onChange={e => setSettingsData({...settingsData, tags: e.target.value})} />
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block font-bold text-[15px] text-gray-900">Category <span className="text-gray-500 font-normal">(required, limit of 3)</span></label>
                      <span className="text-blue-600 text-sm font-medium cursor-pointer">View all</span>
                    </div>
                    <input type="text" className="w-full border border-gray-300 rounded p-3 text-gray-900 outline-none focus:border-blue-500 transition" placeholder="How Would You Categorize This Project?" value={settingsData.category} onChange={e => setSettingsData({...settingsData, category: e.target.value})} />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block font-bold text-[15px] text-gray-900 mb-2">Tools Used</label>
                    <input type="text" className="w-full border border-gray-300 rounded p-3 text-gray-900 outline-none focus:border-blue-500 transition" placeholder="What software, hardware, or materials did you use?" value={settingsData.tools || ''} onChange={e => setSettingsData({...settingsData, tools: e.target.value})} />
                  </div>

                  <div className="mb-6">
                    <label className="block font-bold text-[15px] text-gray-900 mb-2">Role / Responsibility</label>
                    <input type="text" className="w-full border border-gray-300 rounded p-3 text-gray-900 outline-none focus:border-blue-500 transition" placeholder="e.g. Lead UI/UX, 3D Modeler, Concept Artist" value={settingsData.role || ''} onChange={e => setSettingsData({...settingsData, role: e.target.value})} />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block font-bold text-[15px] text-gray-900 mb-2">Project Year / Academic <span className="text-gray-500 font-normal">(required)</span></label>
                    <select className="w-full border border-gray-300 rounded p-3 text-gray-900 outline-none focus:border-blue-500 transition bg-white" value={settingsData.projectYear} onChange={e => setSettingsData({...settingsData, projectYear: e.target.value})}>
                      <option>Năm 1</option>
                      <option>Năm 2</option>
                      <option>Năm 3</option>
                      <option>Năm 4</option>
                    </select>
                    <p className="text-xs text-gray-400 mt-2">Fully accessible and discoverable to anyone</p>
                  </div>
                </div>
                
                <hr className="my-8 border-gray-200" />
                
                <div className="mb-8">
                  <div className="flex items-center justify-between cursor-pointer mb-6">
                    <h3 className="font-bold text-[13px] text-gray-800 uppercase tracking-wider">ADDITIONAL DETAILS</h3>
                    <ChevronDown size={18} className="text-gray-500" />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block font-bold text-[15px] text-gray-900 mb-2">Description</label>
                    <textarea className="w-full h-24 resize-none border border-gray-300 rounded p-3 text-gray-900 outline-none focus:border-blue-500 transition" placeholder="Add a short description for your project" value={settingsData.description || ''} onChange={e => setSettingsData({...settingsData, description: e.target.value})} />
                  </div>

                  <div className="mb-6 bg-gray-50 border border-gray-200 rounded p-4">
                    <label className="block font-bold text-[15px] text-gray-900 mb-1">AI Usage Declaration</label>
                    <p className="text-xs text-gray-500 mb-3">Declare how AI was used in your creative process.</p>
                    <select className="w-full border border-gray-300 rounded p-3 text-gray-900 outline-none focus:border-blue-500 transition bg-white mb-3" value={settingsData.aiUsage || 'none'} onChange={e => setSettingsData({...settingsData, aiUsage: e.target.value})}>
                      <option value="none">No AI was used in this project</option>
                      <option value="brainstorm">Used AI for ideation & brainstorming</option>
                      <option value="generation">Used AI to generate raw assets/images</option>
                      <option value="editing">Used AI for post-processing & editing</option>
                    </select>
                    {settingsData.aiUsage && settingsData.aiUsage !== 'none' && (
                      <div>
                        <label className="block font-bold text-[13px] text-gray-700 mb-2">AI Prompts / Description</label>
                        <textarea className="w-full h-20 resize-none border border-gray-300 rounded p-3 text-gray-900 outline-none focus:border-blue-500 transition" placeholder="List the AI tools used, your prompts, or how you used them..." value={settingsData.aiPrompt || ''} onChange={e => setSettingsData({...settingsData, aiPrompt: e.target.value})} />
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <label className="block font-bold text-[15px] text-gray-900 mb-2">Confirmations & License</label>
                    <select className="w-full border border-gray-300 rounded p-3 text-gray-900 outline-none focus:border-blue-500 transition bg-white" value={settingsData.license} onChange={e => setSettingsData({...settingsData, license: e.target.value})}>
                      <option>All Rights Reserved</option>
                      <option>Attribution NoDerivs (CC BY-ND)</option>
                      <option>Attribution-NonCommercial (CC BY-NC)</option>
                    </select>
                  </div>
                </div>
                
                <hr className="my-8 border-gray-200" />
                
                <div className="mb-8">
                  <div className="flex items-center justify-between cursor-pointer mb-6">
                    <h3 className="font-bold text-[13px] text-gray-800 uppercase tracking-wider">TEAM</h3>
                    <ChevronDown size={18} className="text-gray-500" />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block font-bold text-[15px] text-gray-900 mb-2">Co-Owners</label>
                    <div className="w-full border border-gray-300 rounded p-1.5 flex flex-wrap items-center gap-2 focus-within:border-blue-500 transition bg-white min-h-[46px]">
                      {currentUser && (
                         <div className="bg-[#1a1a1a] text-white text-[11px] font-bold px-3 py-1.5 rounded uppercase tracking-wider flex items-center shrink-0">
                           {currentUser.fullName || currentUser.name || "User"} (CREATOR)
                         </div>
                      )}
                      <input type="text" className="flex-1 min-w-[200px] p-1.5 text-gray-900 outline-none text-[15px] bg-transparent" placeholder={currentUser ? "" : "Add co-owners by name or username"} value={settingsData.coOwners || ''} onChange={e => setSettingsData({...settingsData, coOwners: e.target.value})} />
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-4 px-8 flex justify-end items-center gap-4 bg-white rounded-b shrink-0">
              <button className="text-gray-600 font-bold hover:text-gray-900 transition" onClick={() => setIsSettingsModalOpen(false)}>Cancel</button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-full transition" onClick={() => { setIsSettingsModalOpen(false); onSave(blocks, settingsData); }}>Save as Draft</button>
              <button className="bg-green-700 hover:bg-green-800 text-white font-bold py-2.5 px-8 rounded-full transition" onClick={() => { setIsSettingsModalOpen(false); handlePublish(); }}>Publish</button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
