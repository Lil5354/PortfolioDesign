import React from "react";

export function LecturerCard({ name, title, bio, skills, avatar }) {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#077E9E] transition-all duration-300 hover:shadow-lg group">
      <div className="flex flex-col p-6 h-full">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100 group-hover:border-[#077E9E] transition-colors">
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            ) : (
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            )}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-base mb-1">{name}</h4>
            <p className="text-[#077E9E] text-xs font-semibold">{title}</p>
          </div>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed mb-5 flex-grow">{bio}</p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {skills.map(skill => (
            <span key={skill} className="bg-blue-50 text-[#077E9E] border border-[#077E9E]/20 text-[11px] font-medium px-2.5 py-1 rounded-md">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
