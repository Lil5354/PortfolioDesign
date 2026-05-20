import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const sampleUsers = [
  { fullName: "Nguyễn Minh Anh", email: "minhanh@uef.edu.vn", studentId: "21DGR00042", role: "student" as const, avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" },
  { fullName: "Trần Bảo Long", email: "longtb@uef.edu.vn", studentId: "21DGR00018", role: "student" as const, avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80" },
  { fullName: "Lê Thị Hương", email: "huonglt@uef.edu.vn", studentId: "21DGR00031", role: "student" as const, avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80" },
  { fullName: "Phạm Đức Tuân", email: "tuanduc@uef.edu.vn", studentId: "21DGR00055", role: "student" as const, avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
  { fullName: "Vũ Ngọc Mai", email: "maivn@uef.edu.vn", studentId: "21DGR00009", role: "student" as const, avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" },
  { fullName: "Hoàng Anh Kiệt", email: "kietha@uef.edu.vn", studentId: "21DGR00077", role: "student" as const, avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80" },
  { fullName: "Đặng Thu Hiền", email: "hien@uef.edu.vn", studentId: "21DGR00063", role: "student" as const, avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80" },
  { fullName: "TS. Nguyễn Văn Tài", email: "tainv@uef.edu.vn", studentId: null, role: "lecturer" as const, avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80" },
  { fullName: "ThS. Trần Thị Lan", email: "lan.tt@uef.edu.vn", studentId: null, role: "lecturer" as const, avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80" },
  { fullName: "Admin System", email: "admin@uef.edu.vn", studentId: null, role: "admin" as const, avatarUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&q=80" },
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

const subjects = ["Poster", "Branding", "UI/UX", "3D Art", "Illustration", "Typography", "Photography", "Packaging", "Motion Design", "Editorial"];

const toolsBySubject: Record<string, string[]> = {
  Poster: ["Illustrator", "Photoshop", "InDesign"],
  Branding: ["Illustrator", "Figma", "Photoshop"],
  "UI/UX": ["Figma", "Adobe XD", "Sketch"],
  "3D Art": ["Blender", "Cinema 4D", "Maya"],
  Illustration: ["Procreate", "Illustrator", "Photoshop"],
  Typography: ["Illustrator", "InDesign", "Glyphs"],
  Photography: ["Lightroom", "Photoshop", "Capture One"],
  Packaging: ["Illustrator", "Cinema 4D", "Photoshop"],
  "Motion Design": ["After Effects", "Premiere Pro", "Blender"],
  Editorial: ["InDesign", "Illustrator", "Photoshop"],
};

const academicYears = ["2023-2024", "2024-2025", "2022-2023"];
const semesters = ["HK1", "HK2", "HK3"];

const artworkTemplates = [
  { title: "Neon Dreams Poster Series", desc: "Bộ poster concept về cuộc sống về đêm tại thành phố Hồ Chí Minh, sử dụng hiệu ứng ánh sáng neon và typography phá cách." },
  { title: "Brand Identity - GreenLeaf", desc: "Hệ thống nhận diện thương hiệu cho chuỗi cửa hàng thực phẩm hữu cơ GreenLeaf. Bao gồm logo, bao bì, và ấn phẩm văn phòng." },
  { title: "UI Design - Travel App", desc: "Thiết kế giao diện ứng dụng du lịch thông minh với trải nghiệm người dùng tối ưu, hỗ trợ lên kế hoạch và đặt vé." },
  { title: "3D Abstract Geometry", desc: "Khám phá hình học trừu tượng trong không gian 3 chiều. Sử dụng Blender để tạo các cấu trúc phức tạp." },
  { title: "Editorial Layout - Art Magazine", desc: "Thiết kế layout cho tạp chí nghệ thuật đương đại, kết hợp typography sáng tạo và hình ảnh độc đáo." },
  { title: "Packaging Design - Scent Tea", desc: "Bao bì cho dòng trà thượng hạng, lấy cảm hứng từ tranh thủy mặc và văn hóa trà đạo Việt Nam." },
  { title: "Motion Graphics - Opening Sequence", desc: "Đoạn intro motion graphics cho chương trình truyền hình về văn hóa và ẩm thực Việt Nam." },
  { title: "Typography Poster - Vietnamese Script", desc: "Bộ poster typography tôn vinh vẻ đẹp của chữ Việt, kết hợp giữa truyền thống và hiện đại." },
  { title: "Character Design - Fantasy World", desc: "Thiết kế nhân vật cho thế giới giả tưởng, bao gồm concept art và bảng màu chi tiết." },
  { title: "Food Photography Collection", desc: "Bộ ảnh ẩm thực chuyên nghiệp với phong cách ánh sáng tự nhiên, tập trung vào ẩm thực đường phố Việt Nam." },
  { title: "App Redesign - Banking App", desc: "Tái thiết kế ứng dụng ngân hàng số, cải thiện trải nghiệm người dùng và tối ưu hóa luồng thao tác." },
  { title: "Social Media Campaign", desc: "Chiến dịch truyền thông xã hội cho thương hiệu thời trang bền vững, bao gồm visual và motion content." },
  { title: "Illustration Series - Folklore", desc: "Bộ tranh minh họa về các câu chuyện dân gian Việt Nam, phong cách digital painting hiện đại." },
  { title: "Logo Collection - Minimalist", desc: "Bộ sưu tập logo theo phong cách tối giản, ứng dụng cho nhiều lĩnh vực khác nhau." },
  { title: "Photography - Urban Architecture", desc: "Bộ ảnh kiến trúc đô thị, ghi lại vẻ đẹp hình khối và ánh sáng của các tòa nhà tại TP.HCM." },
  { title: "Book Cover Design Series", desc: "Thiết kế bìa sách cho tủ sách văn học trẻ, kết hợp illustration và typography sáng tạo." },
  { title: "Data Visualization Dashboard", desc: "Dashboard trực quan hóa dữ liệu kinh doanh, thiết kế UX/UX với biểu đồ tương tác." },
  { title: "Poster - Environmental Campaign", desc: "Chiến dịch poster về bảo vệ môi trường biển, sử dụng phong cách đồ họa mạnh mẽ và thông điệp sâu sắc." },
  { title: "Brand Identity - Tech Startup", desc: "Xây dựng nhận diện thương hiệu cho startup công nghệ, từ logo đến hệ thống ấn phẩm số." },
  { title: "3D Character - Robot Series", desc: "Thiết kế nhân vật robot 3D cho game, bao gồm modeling, texturing và rigging cơ bản." },
  { title: "Wedding Invitation Suite", desc: "Bộ thiệp cưới cao cấp với kỹ thuật in nổi, ép kim và hoa văn cách điệu." },
  { title: "Infographic - Climate Change", desc: "Infographic trực quan về biến đổi khí hậu và tác động đến Việt Nam." },
  { title: "UI/UX - E-commerce Platform", desc: "Thiết kế nền tảng thương mại điện tử cho sản phẩm thủ công mỹ nghệ Việt Nam." },
  { title: "Stop Motion Short Film", desc: "Phim ngắn stop motion về hành trình của một hạt gạo từ đồng ruộng đến bàn ăn." },
  { title: "Poster Series - Music Festival", desc: "Bộ poster cho lễ hội âm nhạc điện tử, sử dụng phong cách psychedelic và màu sắc rực rỡ." },
  { title: "Rebrand - Local Coffee Shop", desc: "Tái định vị thương hiệu cho quán cà phê địa phương, bao gồm menu và không gian." },
  { title: "AR Filter Collection", desc: "Bộ filter AR cho Instagram với chủ đề văn hóa Việt Nam, sử dụng Spark AR." },
  { title: "Editorial - Fashion Magazine", desc: "Layout tạp chí thời trang với phong cách editorial tối giản, tập trung vào nhiếp ảnh và typography." },
  { title: "Illustration - Children's Book", desc: "Minh họa sách thiếu nhi với phong cách vẽ tay ấm áp, màu nước kỹ thuật số." },
  { title: "Motion Reel - Showreel 2024", desc: "Showreel tổng hợp các dự án motion graphics và animation trong năm 2024." },
  { title: "Product Photography - Ceramics", desc: "Bộ ảnh sản phẩm gốm sứ thủ công, chú trọng ánh sáng và bố cục tinh tế." },
  { title: "Wayfinding System", desc: "Hệ thống chỉ dẫn cho bảo tàng nghệ thuật, thiết kế đồ họa môi trường." },
  { title: "Packaging - Premium Chocolate", desc: "Bao bì socola cao cấp với thiết kế sang trọng, chất liệu thân thiện môi trường." },
  { title: "UI Design - Fitness App", desc: "Ứng dụng thể dục thông minh với giao diện gamified, theo dõi sức khỏe và bài tập." },
  { title: "Poster - Film Festival", desc: "Poster cho liên hoan phim quốc tế, kết hợp điện ảnh và nghệ thuật đồ họa." },
  { title: "Typeface Design - Vietnamese", desc: "Thiết kế bộ chữ Việt hiện đại, tối ưu cho cả print và digital." },
  { title: "3D Visualization - Interior", desc: "Hình dung kiến trúc nội thất căn hộ cao cấp, phong cách tối giản Scandinavian." },
  { title: "Brand Guidelines Manual", desc: "Sổ tay nhận diện thương hiệu đầy đủ cho tập đoàn giáo dục." },
  { title: "Photo Essay - Street Life", desc: "Bộ ảnh phóng sự về cuộc sống đường phố Sài Gòn qua góc nhìn nghệ thuật." },
  { title: "Website Redesign - Museum", desc: "Thiết kế lại website bảo tàng lịch sử với trải nghiệm số hóa và tương tác." },
  { title: "Poster - Cultural Event", desc: "Poster sự kiện văn hóa Tết Nguyên Đán, kết hợp họa tiết dân gian và thiết kế hiện đại." },
  { title: "Packaging Series - Craft Beer", desc: "Bộ bao bì bia thủ công với nhãn thiết kế độc đáo cho từng hương vị." },
  { title: "Illustration - Flora & Fauna", desc: "Bộ tranh minh họa thực vật và động vật Việt Nam, phong cách botanical art." },
  { title: "UI/UX - Hotel Booking", desc: "Nền tảng đặt phòng khách sạn cao cấp, UX research và thiết kế giao diện." },
  { title: "Motion Typography", desc: "Thử nghiệm typography chuyển động, kết hợp âm nhạc và hiệu ứng thị giác." },
  { title: "Poster Series - Social Issues", desc: "Bộ poster về các vấn đề xã hội với thông điệp mạnh mẽ và thiết kế tối giản." },
  { title: "Identity - Art Exhibition", desc: "Nhận diện triển lãm nghệ thuật đương đại, từ poster catalog đến không gian trưng bày." },
  { title: "Photo Manipulation - Surreal", desc: "Bộ ảnh kỹ thuật số siêu thực, kết hợp nhiếp ảnh và kỹ xảo Photoshop." },
  { title: "Game UI Design", desc: "Thiết kế giao diện người dùng cho game mobile thể loại RPG." },
  { title: "Annual Report Design", desc: "Thiết kế báo cáo thường niên cho doanh nghiệp, trực quan hóa dữ liệu tài chính." },
];

async function main() {
  const passwordHash = await bcrypt.hash("test123", 12);

  const createdUsers = await Promise.all(
    sampleUsers.map(u =>
      prisma.user.upsert({
        where: { email: u.email },
        update: { avatarUrl: u.avatarUrl, role: u.role },
        create: {
          email: u.email,
          passwordHash,
          fullName: u.fullName,
          studentId: u.studentId,
          role: u.role,
          avatarUrl: u.avatarUrl,
          isActive: true,
        },
      })
    )
  );

  console.log(`Created/verified ${createdUsers.length} users`);

  await prisma.artwork.deleteMany({});

  for (let i = 0; i < artworkTemplates.length; i++) {
    const art = artworkTemplates[i];
    const subject = subjects[i % subjects.length];
    const student = createdUsers[i % 7];
    const tools = toolsBySubject[subject] || ["Photoshop", "Illustrator"];
    const year = academicYears[i % academicYears.length];
    const semester = semesters[i % semesters.length];
    const tags = [subject, tools[0], year, "Đồ án"];
    const likeCount = Math.floor(Math.random() * 200) + 10;
    const viewCount = Math.floor(Math.random() * 500) + 50;
    const coverImage = coverImages[i % coverImages.length];

    await prisma.artwork.create({
      data: {
        userId: student.id,
        title: art.title,
        description: art.desc,
        toolsUsed: tools,
        subject,
        semester,
        academicYear: year,
        tags,
        collaborators: [],
        coverImageUrl: coverImage,
        fileUrls: [coverImage],
        isPublic: true,
        isHighlighted: i < 8,
        isAiConfirmed: false,
        likeCount,
        viewCount,
      },
    });
  }

  const finalCount = await prisma.artwork.count();
  console.log(`Created ${finalCount} artworks successfully`);

  const studentUsers = createdUsers.filter(u => u.role === "student");
  const lecturerUser = createdUsers.find(u => u.role === "lecturer");
  const adminUser = createdUsers.find(u => u.role === "admin");

  if (lecturerUser) {
    console.log(`Lecturer: ${lecturerUser.fullName} (${lecturerUser.email}) - password: test123`);
  }
  if (adminUser) {
    console.log(`Admin: ${adminUser.fullName} (${adminUser.email}) - password: test123`);
  }
  console.log(`Student count: ${studentUsers.length}`);
  console.log(`\nLecturers can login with: tainv@uef.edu.vn / test123`);
  console.log(`Admin can login with: admin@uef.edu.vn / test123`);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
