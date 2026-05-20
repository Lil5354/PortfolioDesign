import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const thaosArtworks = [
  { title: "Brand Identity - Bloom Cosmetics", desc: "Hệ thống nhận diện thương hiệu cho dòng mỹ phẩm thiên nhiên Bloom, bao gồm logo, bao bì và ấn phẩm truyền thông.", subject: "Branding", tools: ["Illustrator", "Photoshop", "Figma"] },
  { title: "UI/UX - E-learning Platform", desc: "Thiết kế giao diện nền tảng học trực tuyến dành cho sinh viên đại học, tối ưu trải nghiệm người dùng trên cả mobile và desktop.", subject: "UI/UX", tools: ["Figma", "Adobe XD"] },
  { title: "Poster - Music Festival 2025", desc: "Bộ poster quảng bá cho lễ hội âm nhạc ngoài trời với phong cách đồ họa neon và typography phá cách.", subject: "Poster", tools: ["Illustrator", "Photoshop"] },
  { title: "Packaging - Artisan Chocolate", desc: "Bao bì socola thủ công cao cấp với thiết kế sang trọng, sử dụng chất liệu giấy tái chế và kỹ thuật in offset.", subject: "Packaging", tools: ["Illustrator", "Cinema 4D", "Photoshop"] },
  { title: "3D Character - Forest Spirit", desc: "Nhân vật 3D lấy cảm hứng từ các sinh vật thần thoại trong rừng già, sử dụng Blender cho modeling và texturing.", subject: "3D Art", tools: ["Blender", "Substance Painter"] },
  { title: "Editorial - Art Book Layout", desc: "Thiết kế layout cho sách nghệ thuật về kiến trúc đô thị Việt Nam, với bố cục sáng tạo và hệ thống typography tinh tế.", subject: "Editorial", tools: ["InDesign", "Illustrator", "Photoshop"] },
  { title: "Motion - Product Reel", desc: "Video giới thiệu sản phẩm chuyển động 30s, kết hợp đồ họa chuyển động và kỹ xảo hậu kỳ.", subject: "Motion Design", tools: ["After Effects", "Premiere Pro", "Cinema 4D"] },
  { title: "Photography - Urban Portrait", desc: "Bộ ảnh chân dung đô thị với phong cách ánh sáng tự nhiên, chụp tại các con hẻm Sài Gòn.", subject: "Photography", tools: ["Lightroom", "Photoshop"] },
  { title: "Illustration - Children's Book", desc: "Minh họa cho cuốn sách thiếu nhi 'Chuyện Rừng Xanh' với phong cách vẽ tay màu nước ấm áp.", subject: "Illustration", tools: ["Procreate", "Photoshop", "Illustrator"] },
  { title: "Typography - Vietnamese Typeface", desc: "Bộ chữ Việt hiện đại kết hợp giữa nét chữ truyền thống và phong cách sans-serif đương đại, tối ưu cho cả print và digital.", subject: "Typography", tools: ["Glyphs", "Illustrator", "InDesign"] },
  { title: "App Design - Fitness Tracker", desc: "Thiết kế ứng dụng theo dõi sức khỏe với giao diện gamified, biểu đồ tiến độ và tính năng social sharing.", subject: "UI/UX", tools: ["Figma", "ProtoPie", "Photoshop"] },
  { title: "Poster - Environmental Campaign", desc: "Poster chiến dịch môi trường 'Xanh hóa đại dương' với thông điệp mạnh mẽ và đồ họa ấn tượng.", subject: "Poster", tools: ["Photoshop", "Illustrator"] },
  { title: "Branding - Coffee Shop", desc: "Nhận diện thương hiệu cho quán cà phê specialty, từ menu, logo đến hệ thống bao bì và quà tặng.", subject: "Branding", tools: ["Illustrator", "Figma", "Photoshop"] },
  { title: "3D Visualization - Interior", desc: "Hình dung kiến trúc căn hộ penthouse phong cách hiện đại, tập trung vào vật liệu tự nhiên và ánh sáng ấm.", subject: "3D Art", tools: ["Blender", "3ds Max", "Corona Renderer"] },
  { title: "Editorial - Fashion Magazine", desc: "Layout tạp chí thời trang xuân-hè 2025 với phong cách editorial tối giản, tôn vinh nhiếp ảnh và typography.", subject: "Editorial", tools: ["InDesign", "Photoshop", "Lightroom"] },
  { title: "Motion - Social Media Kit", desc: "Bộ template motion graphics cho social media, bao gồm story, reel và quảng cáo động.", subject: "Motion Design", tools: ["After Effects", "Premiere Pro", "Illustrator"] },
  { title: "Packaging - Craft Beer Series", desc: "Bộ bao bì cho dòng bia thủ công với thiết kế nhãn độc đáo cho từng hương vị.", subject: "Packaging", tools: ["Illustrator", "Photoshop", "Cinema 4D"] },
  { title: "Illustration - Flora Collection", desc: "Bộ tranh minh họa thực vật nhiệt đới, phong cách Digital Painting kết hợp nét vẽ tay.", subject: "Illustration", tools: ["Procreate", "Photoshop"] },
  { title: "Photography - Street Food", desc: "Bộ ảnh ẩm thực đường phố Sài Gòn, ghi lại vẻ đẹp mộc mạc và màu sắc đặc trưng.", subject: "Photography", tools: ["Lightroom", "Photoshop"] },
  { title: "UI/UX - Booking Platform", desc: "Thiết kế nền tảng đặt phòng khách sạn và resort, UX research từ người dùng thực tế.", subject: "UI/UX", tools: ["Figma", "Adobe XD", "Photoshop"] },
];

const coverImages = [
  "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
  "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=800&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&q=80",
  "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=800&q=80",
  "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=800&q=80",
  "https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=800&q=80",
  "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80",
  "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=800&q=80",
  "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80",
  "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80",
  "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800&q=80",
  "https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80",
  "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&q=80",
  "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80",
  "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=800&q=80",
];

async function main() {
  const passwordHash = await bcrypt.hash("test123", 12);

  const user = await prisma.user.upsert({
    where: { email: "thaodtt22@uef.edu.vn" },
    update: { passwordHash },
    create: {
      email: "thaodtt22@uef.edu.vn",
      passwordHash,
      fullName: "Đỗ Thanh Thảo",
      studentId: "22DGR00106",
      role: "student",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
      isActive: true,
    },
  });
  console.log(`User: ${user.fullName} (${user.email}), password: test123`);

  await prisma.artwork.deleteMany({
    where: { userId: user.id, tags: { has: "test-data" } },
  });

  for (let i = 0; i < thaosArtworks.length; i++) {
    const a = thaosArtworks[i];
    const tags = [a.subject, a.tools[0], "test-data", "Đồ án"];
    const likeCount = Math.floor(Math.random() * 100) + 5;
    const viewCount = Math.floor(Math.random() * 400) + 30;
    await prisma.artwork.create({
      data: {
        userId: user.id,
        title: a.title,
        description: a.desc,
        toolsUsed: a.tools,
        subject: a.subject,
        semester: "HK2",
        academicYear: "2024-2025",
        tags,
        collaborators: [],
        coverImageUrl: coverImages[i % coverImages.length],
        fileUrls: [coverImages[i % coverImages.length]],
        isPublic: i < 15,
        isHighlighted: false,
        isAiConfirmed: false,
        likeCount,
        viewCount,
      },
    });
  }

  const total = await prisma.artwork.count({ where: { userId: user.id } });
  console.log(`Created/verified ${total} artworks for ${user.fullName}`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
