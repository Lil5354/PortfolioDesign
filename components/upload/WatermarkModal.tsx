"use client";

import { useState, useCallback } from "react";
import type { WatermarkPosition } from "@/lib/cloudinary";
import { WATERMARK_POSITIONS } from "@/lib/cloudinary";

interface WatermarkConfig {
  text: string;
  position: WatermarkPosition;
  fontSize: number;
  opacity: number;
}

interface WatermarkModalProps {
  imageUrl: string;
  publicId: string;
  cloudName: string;
  onConfirm: (config: WatermarkConfig) => void;
  onSkip: () => void;
  open: boolean;
  onClose: () => void;
}

const POSITION_MAP: Record<
  WatermarkPosition,
  { top?: string; left?: string; right?: string; bottom?: string; transform: string }
> = {
  north_west: { top: "5%", left: "5%", transform: "translate(0,0)" },
  north: { top: "5%", left: "50%", transform: "translate(-50%,0)" },
  north_east: { top: "5%", right: "5%", transform: "translate(0,0)" },
  west: { top: "50%", left: "5%", transform: "translate(0,-50%)" },
  center: { top: "50%", left: "50%", transform: "translate(-50%,-50%)" },
  east: { top: "50%", right: "5%", transform: "translate(0,-50%)" },
  south_west: { bottom: "5%", left: "5%", transform: "translate(0,0)" },
  south: { bottom: "5%", left: "50%", transform: "translate(-50%,0)" },
  south_east: { bottom: "5%", right: "5%", transform: "translate(0,0)" },
};

export default function WatermarkModal({
  imageUrl,
  onConfirm,
  onSkip,
  open,
  onClose,
}: WatermarkModalProps) {
  const [config, setConfig] = useState<WatermarkConfig>({
    text: "",
    position: "south_east",
    fontSize: 48,
    opacity: 60,
  });
  const [error, setError] = useState("");

  const previewPx = Math.max(config.fontSize / 6, 12);
  const watermarkStyle = config.text.trim()
    ? {
        ...POSITION_MAP[config.position],
        color: "white",
        fontSize: `${previewPx}px`,
        fontWeight: "bold" as const,
        textShadow: "0 2px 6px rgba(0,0,0,0.6)",
        opacity: config.opacity / 100,
        maxWidth: "80%",
        wordBreak: "break-word" as const,
        lineHeight: 1.2,
        pointerEvents: "none" as const,
        position: "absolute" as const,
        zIndex: 10,
        padding: "2px 6px",
      }
    : {};

  const handleConfirm = useCallback(() => {
    if (!config.text.trim()) {
      setError("Vui lòng nhập nội dung watermark");
      return;
    }
    setError("");
    onConfirm(config);
    onClose();
  }, [config, onConfirm, onClose]);

  const handleSkip = useCallback(() => {
    onSkip();
    onClose();
  }, [onSkip, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#212121]">
              Thêm watermark bảo vệ bản quyền
            </h2>
            <p className="text-sm text-[#666666] mt-1">
              Watermark được áp dụng qua Cloudinary, không làm ảnh
              hưởng đến file gốc
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#666666] hover:text-[#212121] text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-1.5">
                Nội dung watermark <span className="text-[#8B1A1A]">*</span>
              </label>
              <input
                type="text"
                value={config.text}
                onChange={(e) => {
                  setConfig({ ...config, text: e.target.value });
                  setError("");
                }}
                placeholder="VD: Nguyễn Văn A - 21DGR00042"
                className="w-full px-4 py-2.5 border border-[#E0E0E0] rounded-lg text-[#212121] focus:outline-none focus:border-[#077E9E] focus:ring-1 focus:ring-[#077E9E]"
              />
              {error && (
                <p className="text-[#8B1A1A] text-sm mt-1">{error}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#212121] mb-1.5">
                Vị trí
              </label>
              <div className="grid grid-cols-3 gap-2">
                {WATERMARK_POSITIONS.map((pos) => (
                  <button
                    key={pos.value}
                    type="button"
                    onClick={() =>
                      setConfig({ ...config, position: pos.value })
                    }
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                      config.position === pos.value
                        ? "border-[#077E9E] bg-[#077E9E]/10 text-[#077E9E] font-medium"
                        : "border-[#E0E0E0] text-[#666666] hover:border-[#077E9E]"
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#212121] mb-1.5">
                Kích thước: {config.fontSize}px
              </label>
              <input
                type="range"
                min="24"
                max="96"
                step="4"
                value={config.fontSize}
                onChange={(e) =>
                  setConfig({ ...config, fontSize: Number(e.target.value) })
                }
                className="w-full accent-[#077E9E]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#212121] mb-1.5">
                Độ mờ: {config.opacity}%
              </label>
              <input
                type="range"
                min="20"
                max="90"
                step="5"
                value={config.opacity}
                onChange={(e) =>
                  setConfig({ ...config, opacity: Number(e.target.value) })
                }
                className="w-full accent-[#077E9E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#212121] mb-2">
              Xem trước (cập nhật real-time)
            </label>
            <div className="relative rounded-lg overflow-hidden border border-[#E0E0E0] bg-[#F8F8F8] min-h-[300px] flex items-center justify-center">
              {imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-auto max-h-[500px] object-contain"
                  />
                  {config.text.trim() && (
                    <div style={watermarkStyle}>{config.text}</div>
                  )}
                </>
              ) : (
                <p className="text-[#666666] text-sm">
                  Chưa có ảnh để xem trước
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleSkip}
            className="px-6 py-2.5 text-[#666666] hover:text-[#212121] font-medium transition-colors text-sm"
          >
            Bỏ qua (không khuyến khích)
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-[#E0E0E0] text-[#212121] rounded-lg hover:bg-[#F8F8F8] font-medium transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!config.text.trim()}
              className="px-6 py-2.5 bg-[#077E9E] text-white rounded-lg font-medium hover:bg-[#055F78] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Xác nhận & Áp dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
