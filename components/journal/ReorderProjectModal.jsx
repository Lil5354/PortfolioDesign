import React, { useState, useEffect } from 'react';
import { Type, Image as ImageIcon, LayoutGrid, Play } from 'lucide-react';

const ReorderProjectModal = ({ isOpen, onClose, blocks, onSave }) => {
  const [localBlocks, setLocalBlocks] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setLocalBlocks([...blocks]);
    }
  }, [isOpen, blocks]);

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

  // Basic Move up/down logic for reordering without a heavy DnD library
  const moveBlock = (index, direction) => {
    const newBlocks = [...localBlocks];
    if (direction === 'up' && index > 0) {
      const temp = newBlocks[index - 1];
      newBlocks[index - 1] = newBlocks[index];
      newBlocks[index] = temp;
    } else if (direction === 'down' && index < newBlocks.length - 1) {
      const temp = newBlocks[index + 1];
      newBlocks[index + 1] = newBlocks[index];
      newBlocks[index] = temp;
    }
    setLocalBlocks(newBlocks);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[10000] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Reorder Content</h2>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh] bg-gray-50 flex flex-col gap-2">
          {localBlocks.map((block, index) => (
            <div key={block.id} className="flex items-center bg-white border border-gray-200 rounded p-3 shadow-sm group">
              <div className="flex flex-col gap-1 mr-4 opacity-30 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => moveBlock(index, 'up')} 
                  disabled={index === 0}
                  className="hover:text-blue-600 disabled:opacity-30 disabled:hover:text-inherit"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 15l-6-6-6 6"/></svg>
                </button>
                <button 
                  onClick={() => moveBlock(index, 'down')} 
                  disabled={index === localBlocks.length - 1}
                  className="hover:text-blue-600 disabled:opacity-30 disabled:hover:text-inherit"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6"/></svg>
                </button>
              </div>
              
              <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded flex items-center justify-center shrink-0 mr-4">
                {block.type === 'image' && block.content ? (
                  <img src={block.content} alt="" className="w-full h-full object-cover rounded" />
                ) : block.type === 'grid' && block.images && block.images.length > 0 ? (
                  <img src={block.images[0].content || block.images[0].url} alt="" className="w-full h-full object-cover rounded" />
                ) : (
                  getIcon(block.type)
                )}
              </div>
              
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-700">{getLabel(block)}</div>
              </div>
            </div>
          ))}
        </div>
        
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
