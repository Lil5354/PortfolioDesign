"use client";

import { useCallback, useState } from "react";

interface CloudinaryUploaderProps {
  onUploadSuccess: (result: { publicId: string; secureUrl: string }) => void;
  onUploadError?: (error: string) => void;
  disabled?: boolean;
}

export default function CloudinaryUploader({
  onUploadSuccess,
  onUploadError,
  disabled,
}: CloudinaryUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const openCloudinaryWidget = useCallback(async () => {
    setUploading(true);

    try {
      const res = await fetch("/api/upload/signature");
      const { timestamp, signature, cloudName, apiKey, folder } =
        await res.json();

      const formData = new FormData();
      formData.append("file", "");

      const widget = (window as any).cloudinary?.createUploadWidget(
        {
          cloudName,
          apiKey,
          uploadSignature: signature,
          uploadSignatureTimestamp: timestamp,
          folder,
          sources: ["local", "camera"],
          multiple: false,
          maxFileSize: 50000000,
          clientAllowedFormats: ["png", "jpg", "jpeg", "webp", "gif"],
          showPoweredBy: false,
          styles: {
            palette: {
              window: "#FFFFFF",
              windowBorder: "#E0E0E0",
              tabIcon: "#077E9E",
              menuIcons: "#077E9E",
              textDark: "#212121",
              textLight: "#FFFFFF",
              link: "#077E9E",
              action: "#077E9E",
              inactiveTabIcon: "#666666",
              error: "#8B1A1A",
              inProgress: "#077E9E",
              complete: "#077E9E",
              sourceBg: "#F8F8F8",
            },
          },
        },
        (error: any, result: any) => {
          if (error) {
            onUploadError?.(error.message || "Upload failed");
            setUploading(false);
            return;
          }
          if (result.event === "success") {
            onUploadSuccess({
              publicId: result.info.public_id,
              secureUrl: result.info.secure_url,
            });
          }
          if (
            result.event === "close" ||
            result.event === "success"
          ) {
            setUploading(false);
          }
        }
      );

      widget.open();
    } catch {
      onUploadError?.("Failed to initialize upload");
      setUploading(false);
    }
  }, [onUploadSuccess, onUploadError]);

  return (
    <button
      type="button"
      onClick={openCloudinaryWidget}
      disabled={disabled || uploading}
      className="px-6 py-3 bg-[#077E9E] text-white rounded-lg font-medium hover:bg-[#055F78] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {uploading ? "Đang mở..." : "Chọn ảnh để tải lên"}
    </button>
  );
}
