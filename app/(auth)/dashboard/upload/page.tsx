"use client";

import { useState, useCallback } from "react";
import CloudinaryUploader from "@/components/upload/CloudinaryUploader";
import WatermarkModal from "@/components/upload/WatermarkModal";
import type { WatermarkPosition } from "@/lib/cloudinary";

interface WatermarkConfig {
  text: string;
  position: WatermarkPosition;
  fontSize: number;
  opacity: number;
}

interface UploadedImage {
  publicId: string;
  secureUrl: string;
}

export default function UploadArtworkPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [tools, setTools] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [toolInput, setToolInput] = useState("");
  const [isGroupProject, setIsGroupProject] = useState(false);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [collabInput, setCollabInput] = useState("");
  const [aiConfirmed, setAiConfirmed] = useState(false);

  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(
    null
  );
  const [watermarkConfig, setWatermarkConfig] =
    useState<WatermarkConfig | null>(null);
  const [showWatermarkModal, setShowWatermarkModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

  const handleUploadSuccess = useCallback(
    (result: { publicId: string; secureUrl: string }) => {
      setUploadedImage(result);
      setShowWatermarkModal(true);
    },
    []
  );

  const handleWatermarkConfirm = useCallback(
    (config: WatermarkConfig) => {
      setWatermarkConfig(config);
    },
    []
  );

  const handleWatermarkSkip = useCallback(() => {
    setWatermarkConfig(null);
  }, []);

  const addTag = useCallback(() => {
    const val = tagInput.trim();
    if (val && !tags.includes(val)) {
      setTags([...tags, val]);
      setTagInput("");
    }
  }, [tagInput, tags]);

  const addTool = useCallback(() => {
    const val = toolInput.trim();
    if (val && !tools.includes(val)) {
      setTools([...tools, val]);
      setToolInput("");
    }
  }, [toolInput, tools]);

  const addCollab = useCallback(() => {
    const val = collabInput.trim();
    if (val && !collaborators.includes(val)) {
      setCollaborators([...collaborators, val]);
      setCollabInput("");
    }
  }, [collabInput, collaborators]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      if (!uploadedImage) {
        setError("Vui lòng tải ảnh lên trước khi đăng");
        return;
      }
      if (!watermarkConfig) {
        setError("Vui lòng thêm watermark trước khi đăng");
        return;
      }
      if (!aiConfirmed) {
        setError(
          "Bạn cần xác nhận tác phẩm không sử dụng AI"
        );
        return;
      }

      setSubmitting(true);

      try {
        const body = {
          title,
          description,
          subject,
          toolsUsed: tools,
          tags,
          collaborators: isGroupProject ? collaborators : [],
          coverImageUrl: uploadedImage.secureUrl,
          watermarkText: watermarkConfig.text,
          watermarkPosition: watermarkConfig.position,
          isAiConfirmed: aiConfirmed,
        };

        const res = await fetch("/api/artworks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error("Upload failed");

        window.location.href = "/dashboard";
      } catch {
        setError("Có lỗi xảy ra khi đăng ấn phẩm");
      } finally {
        setSubmitting(false);
      }
    },
    [
      uploadedImage,
      watermarkConfig,
      aiConfirmed,
      title,
      description,
      subject,
      tools,
      tags,
      isGroupProject,
      collaborators,
    ]
  );

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#212121] mb-6">
        Đăng ấn phẩm mới
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#212121] mb-1.5">
            Tên ấn phẩm <span className="text-[#8B1A1A]">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="VD: Neon Cityscape Poster"
            className="w-full px-4 py-2.5 border border-[#E0E0E0] rounded-lg text-[#212121] focus:outline-none focus:border-[#077E9E]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#212121] mb-1.5">
            Mô tả
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Mô tả concept và ý tưởng tác phẩm..."
            className="w-full px-4 py-2.5 border border-[#E0E0E0] rounded-lg text-[#212121] focus:outline-none focus:border-[#077E9E] resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#212121] mb-1.5">
            Môn học / Dự án
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="VD: Design Principles"
            className="w-full px-4 py-2.5 border border-[#E0E0E0] rounded-lg text-[#212121] focus:outline-none focus:border-[#077E9E]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#212121] mb-1.5">
            Công cụ sử dụng
          </label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {tools.map((t) => (
              <span
                key={t}
                className="px-3 py-1 bg-[#077E9E]/10 text-[#077E9E] rounded-full text-sm flex items-center gap-1"
              >
                {t}
                <button
                  type="button"
                  onClick={() =>
                    setTools(tools.filter((x) => x !== t))
                  }
                  className="hover:text-[#8B1A1A]"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={toolInput}
              onChange={(e) => setToolInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTool())}
              placeholder="Illustrator, Figma..."
              className="flex-1 px-4 py-2.5 border border-[#E0E0E0] rounded-lg text-[#212121] focus:outline-none focus:border-[#077E9E]"
            />
            <button
              type="button"
              onClick={addTool}
              className="px-4 py-2.5 bg-[#077E9E] text-white rounded-lg hover:bg-[#055F78] text-sm"
            >
              Thêm
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#212121] mb-1.5">
            Thẻ tag
          </label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {tags.map((t) => (
              <span
                key={t}
                className="px-3 py-1 bg-[#F8F8F8] text-[#666666] rounded-full text-sm flex items-center gap-1"
              >
                {t}
                <button
                  type="button"
                  onClick={() => setTags(tags.filter((x) => x !== t))}
                  className="hover:text-[#8B1A1A]"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              placeholder="poster, branding, logo..."
              className="flex-1 px-4 py-2.5 border border-[#E0E0E0] rounded-lg text-[#212121] focus:outline-none focus:border-[#077E9E]"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2.5 bg-[#077E9E] text-white rounded-lg hover:bg-[#055F78] text-sm"
            >
              Thêm
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isGroupProject}
              onChange={(e) => setIsGroupProject(e.target.checked)}
              className="accent-[#077E9E] w-4 h-4"
            />
            <span className="text-sm text-[#212121]">
              Đồ án nhóm
            </span>
          </label>
        </div>

        {isGroupProject && (
          <div>
            <label className="block text-sm font-medium text-[#212121] mb-1.5">
              Thành viên nhóm
            </label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {collaborators.map((c) => (
                <span
                  key={c}
                  className="px-3 py-1 bg-[#077E9E]/10 text-[#077E9E] rounded-full text-sm flex items-center gap-1"
                >
                  {c}
                  <button
                    type="button"
                    onClick={() =>
                      setCollaborators(
                        collaborators.filter((x) => x !== c)
                      )
                    }
                    className="hover:text-[#8B1A1A]"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={collabInput}
                onChange={(e) => setCollabInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCollab())}
                placeholder="@username"
                className="flex-1 px-4 py-2.5 border border-[#E0E0E0] rounded-lg text-[#212121] focus:outline-none focus:border-[#077E9E]"
              />
              <button
                type="button"
                onClick={addCollab}
                className="px-4 py-2.5 bg-[#077E9E] text-white rounded-lg hover:bg-[#055F78] text-sm"
              >
                Thêm
              </button>
            </div>
          </div>
        )}

        <hr className="border-[#E0E0E0]" />

        <div>
          <label className="block text-sm font-medium text-[#212121] mb-3">
            Ảnh bìa <span className="text-[#8B1A1A]">*</span>
          </label>

          {!uploadedImage ? (
            <div className="border-2 border-dashed border-[#E0E0E0] rounded-xl p-12 text-center">
              <CloudinaryUploader
                onUploadSuccess={handleUploadSuccess}
                onUploadError={(err) => setError(err)}
              />
              <p className="text-xs text-[#666666] mt-2">
                Hỗ trợ PNG, JPG, WebP, GIF. Tối đa 50MB.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <img
                src={uploadedImage.secureUrl}
                alt="Uploaded preview"
                className="w-full max-h-96 object-contain rounded-lg border border-[#E0E0E0]"
              />
              <div className="flex items-center gap-3">
                <span className="text-sm text-green-700 bg-green-50 px-3 py-1 rounded-full">
                  Ảnh đã tải lên thành công
                </span>
                {watermarkConfig ? (
                  <span className="text-sm text-[#077E9E] bg-[#077E9E]/10 px-3 py-1 rounded-full">
                    ✓ Đã thêm watermark
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowWatermarkModal(true)}
                    className="text-sm text-[#077E9E] hover:text-[#055F78] font-medium"
                  >
                    + Thêm watermark
                  </button>
                )}
              </div>
              {watermarkConfig && (
                <p className="text-xs text-[#666666]">
                  Watermark: &ldquo;{watermarkConfig.text}&rdquo; - Vị trí:{" "}
                  {watermarkConfig.position}
                </p>
              )}
            </div>
          )}
        </div>

        <hr className="border-[#E0E0E0]" />

        <div className="bg-[#F8F8F8] rounded-xl p-5 space-y-4">
          <h3 className="font-medium text-[#212121]">
            Cam kết học thuật
          </h3>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={aiConfirmed}
              onChange={(e) => setAiConfirmed(e.target.checked)}
              className="accent-[#077E9E] w-4 h-4 mt-0.5"
            />
            <span className="text-sm text-[#212121] leading-relaxed">
              Tôi xác nhận rằng tác phẩm này là ý tưởng và thực
              hiện 100% bởi bản thân tôi. Tôi không sử dụng AI
              (Midjourney, DALL-E, Stable Diffusion...) để tạo ra
              hình ảnh hoặc nội dung chính của tác phẩm.
            </span>
          </label>
        </div>

        {error && (
          <p className="text-[#8B1A1A] text-sm bg-[#FFF5F5] px-4 py-2.5 rounded-lg">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || !uploadedImage}
          className="w-full py-3 bg-[#077E9E] text-white rounded-xl font-medium hover:bg-[#055F78] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base"
        >
          {submitting ? "Đang đăng..." : "Đăng ấn phẩm"}
        </button>
      </form>

      <WatermarkModal
        imageUrl={uploadedImage?.secureUrl ?? ""}
        publicId={uploadedImage?.publicId ?? ""}
        cloudName={cloudName}
        open={showWatermarkModal}
        onClose={() => setShowWatermarkModal(false)}
        onConfirm={handleWatermarkConfirm}
        onSkip={handleWatermarkSkip}
      />
    </main>
  );
}
