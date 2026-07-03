import React, { useState, useEffect } from 'react';
import { X, Plus, Move, Image as ImageIcon } from 'lucide-react';
import JustifiedGrid from './JustifiedGrid';

const EditGridModal = ({ isOpen, onClose, block, onSave, orientation = 'landscape', projectStyles = {}, watermarkText }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (isOpen && block) {
      setImages(block.images || []);
    }
  }, [isOpen, block]);

  if (!isOpen || !block) return null;

  const handleAddPhotos = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const readPromises = files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const img = new window.Image();
            img.onload = () => {
              resolve({
                id: Date.now().toString() + Math.random().toString().slice(2, 6),
                url: ev.target.result,
                content: ev.target.result,
                width: img.width,
                height: img.height
              });
            };
            img.src = ev.target.result;
          };
          reader.readAsDataURL(file);
        });
      });
      Promise.all(readPromises).then(newImages => {
        setImages([...images, ...newImages]);
      });
    }
  };

  const handleRemove = (id) => {
    setImages(images.filter(img => img.id !== id));
  };

  const handleSave = () => {
    onSave(block.id, { ...block, images });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[10000] flex flex-col pt-10 px-10 pb-10">
      <div className="bg-white rounded-lg shadow-2xl flex flex-col flex-1 overflow-hidden w-full max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <h2 className="text-xl font-medium text-gray-800">Edit Grid</h2>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition">
              <Move size={14} /> Custom
            </button>
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-1.5 border border-[#2b64ff] text-[#2b64ff] rounded text-sm font-medium hover:bg-blue-50 transition">
                <Plus size={16} /> Add Photos
              </button>
              <input 
                type="file" 
                accept="image/*" 
                multiple
                onChange={handleAddPhotos}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <button onClick={onClose} className="px-4 py-1.5 rounded text-sm font-medium text-gray-600 hover:bg-gray-100 transition">
              Cancel
            </button>
            <button onClick={handleSave} className="px-5 py-1.5 rounded-full bg-[#2b64ff] text-white text-sm font-semibold hover:bg-blue-700 transition shadow-md">
              Done
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#f4f4f4]">
          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
              <ImageIcon size={48} />
              <p>No photos in this grid yet.</p>
            </div>
          ) : (
            <div 
              className="mx-auto w-full transition-all duration-300" 
              style={{ 
                maxWidth: block.fullWidth ? (orientation === 'landscape' ? 800 : 600) : ((orientation === 'landscape' ? 800 : 600) - (projectStyles.contentSpacing || 0)*2),
                height: block.fullWidth ? (orientation === 'landscape' ? 600 : 800) : ((orientation === 'landscape' ? 600 : 800) - (projectStyles.contentSpacing || 0)*2)
              }}
            >
              <JustifiedGrid 
                images={images}
                spacing={8}
                targetWidth={block.fullWidth ? (orientation === 'landscape' ? 800 : 600) : ((orientation === 'landscape' ? 800 : 600) - (projectStyles.contentSpacing || 0)*2)}
                targetHeight={block.fullWidth ? (orientation === 'landscape' ? 600 : 800) : ((orientation === 'landscape' ? 600 : 800) - (projectStyles.contentSpacing || 0)*2)}
                watermarkText={watermarkText}
                animate={true}
                renderImage={(img) => (
                  <div className="relative group w-full h-full bg-white rounded shadow-sm overflow-hidden absolute inset-0">
                    <img src={img.content || img.url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity border-2 border-blue-500 pointer-events-none" />
                    <button 
                      onClick={() => handleRemove(img.id)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md z-10"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default EditGridModal;
