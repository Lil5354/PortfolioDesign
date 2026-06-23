import React, { useState } from 'react';
import { X, LayoutTemplate } from 'lucide-react';

export default function JournalSettingsModal({ isOpen, onClose, onContinue }) {
  const [orientation, setOrientation] = useState('portrait'); // 'portrait' | 'landscape'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-[#E0E0E0] bg-[#f8f8f8]">
          <h2 className="text-xl font-bold text-[#212121] flex items-center gap-2">
            <LayoutTemplate className="text-[#1a4ba8]" size={24} /> 
            Thiết lập Tập San
          </h2>
          <button onClick={onClose} className="p-2 text-[#666] hover:bg-[#E0E0E0] rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <h3 className="font-semibold text-[#212121] mb-4">Chọn chiều trang (Orientation)</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div 
              onClick={() => setOrientation('portrait')}
              className={`border-2 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${orientation === 'portrait' ? 'border-[#1a4ba8] bg-[#f0f4ff]' : 'border-[#E0E0E0] hover:border-[#999]'}`}
            >
              <div className="w-12 h-16 border-2 border-current rounded mb-2 bg-white"></div>
              <span className="font-semibold text-sm">Dọc (Portrait)</span>
            </div>

            <div 
              onClick={() => setOrientation('landscape')}
              className={`border-2 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${orientation === 'landscape' ? 'border-[#1a4ba8] bg-[#f0f4ff]' : 'border-[#E0E0E0] hover:border-[#999]'}`}
            >
              <div className="w-16 h-12 border-2 border-current rounded mb-2 bg-white"></div>
              <span className="font-semibold text-sm">Ngang (Landscape)</span>
            </div>
          </div>
          
          <p className="text-xs text-[#666] mb-6">
            Chiều trang sẽ quyết định định dạng của file PDF khi xuất tập san. Bạn không thể thay đổi chiều trang sau khi đã bắt đầu thiết kế.
          </p>

          <button 
            onClick={() => onContinue(orientation)}
            className="w-full py-3 bg-[#1a4ba8] text-white rounded-xl font-bold hover:bg-[#0d2e6e] transition-colors"
          >
            Bắt đầu thiết kế
          </button>
        </div>
      </div>
    </div>
  );
}
