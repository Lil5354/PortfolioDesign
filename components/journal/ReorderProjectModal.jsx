import React, { useState, useEffect } from 'react';
import { Type, Image as ImageIcon, LayoutGrid, Play, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ block, getLabel, getIcon }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    position: 'relative'
  };

  return (
    <div ref={setNodeRef} style={style} className={`flex items-center bg-white border border-gray-200 rounded p-3 shadow-sm group ${isDragging ? 'shadow-lg ring-2 ring-blue-500 opacity-90' : ''}`}>
      <div {...attributes} {...listeners} className="mr-3 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing p-1">
        <GripVertical size={18} />
      </div>
      
      <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded flex items-center justify-center shrink-0 mr-4">
        {block.type === 'image' && block.content ? (
          <img src={block.content} alt="" className="w-full h-full object-cover rounded pointer-events-none" />
        ) : block.type === 'grid' && block.images && block.images.length > 0 ? (
          <img src={block.images[0].content || block.images[0].url} alt="" className="w-full h-full object-cover rounded pointer-events-none" />
        ) : (
          getIcon(block.type)
        )}
      </div>
      
      <div className="flex-1">
        <div className="text-sm font-semibold text-gray-700">{getLabel(block)}</div>
      </div>
    </div>
  );
};

const ReorderProjectModal = ({ isOpen, onClose, blocks, onSave }) => {
  const [localBlocks, setLocalBlocks] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setLocalBlocks([...blocks]);
    }
  }, [isOpen, blocks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLocalBlocks((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localBlocks);
    onClose();
  };

  const getIcon = (type) => {
    switch (type) {
      case 'image': return <ImageIcon size={20} className="text-gray-400" />;
      case 'text': return <Type size={20} className="text-gray-400" />;
      case 'grid': return <LayoutGrid size={20} className="text-gray-400" />;
      case 'video': return <Play size={20} className="text-gray-400" />;
      default: return <LayoutGrid size={20} className="text-gray-400" />;
    }
  };

  const getLabel = (block) => {
    switch (block.type) {
      case 'image': return 'Image';
      case 'text': return 'Text';
      case 'grid': {
        const count = block.images ? block.images.length : 0;
        return `Grid (${count} Image${count !== 1 ? 's' : ''})`;
      }
      case 'video': return 'Video/Audio';
      default: return 'Block';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[10000] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Reorder Content</h2>
        </div>
        
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={localBlocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
            <div className="p-6 overflow-y-auto max-h-[60vh] bg-gray-50 flex flex-col gap-2">
              {localBlocks.map((block) => (
                <SortableItem key={block.id} block={block} getLabel={getLabel} getIcon={getIcon} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        
        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3 bg-white">
          <button 
            onClick={handleSave} 
            className="px-6 py-2 bg-[#2b64ff] hover:bg-blue-700 text-white rounded-full text-sm font-semibold transition shadow"
          >
            Save New Order
          </button>
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReorderProjectModal;
