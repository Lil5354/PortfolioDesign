import React from "react";
import { MonitorPlay, Palette, Layout, Box } from "lucide-react";

const icons = {
  "Thiết kế đồ họa Truyền thông": <Layout className="w-6 h-6 text-[#1a4ba8]" />,
  "Thiết kế Kỹ thuật số & UI/UX": <MonitorPlay className="w-6 h-6 text-[#1a4ba8]" />,
  "Motion Graphics & Video": <MonitorPlay className="w-6 h-6 text-[#1a4ba8]" />,
  "Minh họa & Nghệ thuật 3D": <Box className="w-6 h-6 text-[#1a4ba8]" />,
};

export function MajorCard({ title, desc }) {
  const icon = icons[title] || <Palette className="w-6 h-6 text-[#1a4ba8]" />;
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-2xl hover:shadow-lg hover:border-[#1a4ba8] transition-all duration-300">
      <div className="w-14 h-14 bg-[#1a4ba8]/10 rounded-xl flex items-center justify-center mb-5">
        {icon}
      </div>
      <h4 className="text-lg font-bold text-gray-900 mb-3">{title}</h4>
      <p className="text-[13px] text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}
