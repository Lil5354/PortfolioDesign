import sys
with open('portfolio_system.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

lecturersList_code = '''
const lecturersList = [
  { name: "PGS. TS. Nguyễn Minh Khoa", title: "Trưởng Khoa Thiết kế Đồ họa", bio: "Chuyên ngành: Visual Communication, Brand Identity & Design Strategy. Hơn 20 năm kinh nghiệm giảng dạy và thực chiến.", skills: ["Typography", "Brand Identity", "Visual Communication"], img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80" },
  { name: "ThS. Trần Thị Lan Anh", title: "Giảng viên chính", bio: "Chuyên ngành: UI/UX Design, Digital Product Design & Figma. Cố vấn thiết kế cho nhiều startup công nghệ.", skills: ["UI/UX", "Figma", "Product Design"], img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80" },
  { name: "ThS. Lê Quốc Bảo", title: "Giảng viên", bio: "Chuyên ngành: Motion Graphics, After Effects & 3D Animation. Freelance director với hơn 50 dự án thương mại lớn.", skills: ["Motion Graphics", "After Effects", "3D"], img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
  { name: "ThS. Phạm Hồng Nhung", title: "Giảng viên", bio: "Chuyên ngành: Typography, Editorial Design & Packaging. Từng đoạt 2 giải thưởng thiết kế bao bì quốc tế.", skills: ["Typography", "Editorial", "Packaging"], img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80" },
  { name: "TS. Nguyễn Đình Trọng", title: "Giảng viên cao cấp", bio: "Chuyên ngành: Illustration, Concept Art & Character Design. Cộng tác viên cho studio game và phim hoạt hình.", skills: ["Illustration", "Concept Art", "Character"], img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80" },
  { name: "ThS. Vũ Thanh Tuyền", title: "Giảng viên", bio: "Chuyên ngành: Photography, Photo Editing & Visual Storytelling. Nhiếp ảnh gia thương mại với studio tự do.", skills: ["Photography", "Photoshop", "Lightroom"], img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80" },
];

function AboutPage() {'''

if 'const lecturersList =' not in content:
    content = content.replace('function AboutPage() {', lecturersList_code)

with open('portfolio_system.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
