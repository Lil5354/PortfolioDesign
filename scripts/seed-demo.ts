import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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

const studentArtworks = [
  { title: "Neon Dreams Poster Series", subject: "Poster", tools: ["Illustrator", "Photoshop", "InDesign"], desc: "Bộ poster concept về cuộc sống về đêm tại thành phố Hồ Chí Minh, sử dụng hiệu ứng ánh sáng neon và typography phá cách.", semester: "HK1", year: "2023-2024" },
  { title: "Brand Identity - GreenLeaf", subject: "Branding", tools: ["Illustrator", "Figma", "Photoshop"], desc: "Hệ thống nhận diện thương hiệu cho chuỗi cửa hàng thực phẩm hữu cơ GreenLeaf. Bao gồm logo, bao bì, và ấn phẩm văn phòng.", semester: "HK2", year: "2023-2024" },
  { title: "UI Design - Travel App", subject: "UI/UX", tools: ["Figma", "Adobe XD", "Sketch"], desc: "Thiết kế giao diện ứng dụng du lịch thông minh với trải nghiệm người dùng tối ưu, hỗ trợ lên kế hoạch và đặt vé.", semester: "HK1", year: "2024-2025" },
  { title: "3D Abstract Geometry", subject: "3D Art", tools: ["Blender", "Cinema 4D"], desc: "Khám phá hình học trừu tượng trong không gian 3 chiều. Sử dụng Blender để tạo các cấu trúc phức tạp.", semester: "HK2", year: "2024-2025" },
  { title: "Editorial Layout - Art Magazine", subject: "Editorial", tools: ["InDesign", "Illustrator", "Photoshop"], desc: "Thiết kế layout cho tạp chí nghệ thuật đương đại, kết hợp typography sáng tạo và hình ảnh độc đáo.", semester: "HK2", year: "2023-2024" },
  { title: "Packaging - Scent Tea Collection", subject: "Packaging", tools: ["Illustrator", "Cinema 4D", "Photoshop"], desc: "Bao bì cho dòng trà thượng hạng, lấy cảm hứng từ tranh thủy mặc và văn hóa trà đạo Việt Nam.", semester: "HK1", year: "2024-2025" },
  { title: "Motion Graphics - Opening Sequence", subject: "Motion Design", tools: ["After Effects", "Premiere Pro", "Blender"], desc: "Đoạn intro motion graphics cho chương trình truyền hình về văn hóa và ẩm thực Việt Nam.", semester: "HK2", year: "2024-2025" },
  { title: "Typography Poster - Vietnamese Script", subject: "Typography", tools: ["Illustrator", "InDesign", "Glyphs"], desc: "Bộ poster typography tôn vinh vẻ đẹp của chữ Việt, kết hợp giữa truyền thống và hiện đại.", semester: "HK1", year: "2023-2024" },
  { title: "Character Design - Fantasy World", subject: "Illustration", tools: ["Procreate", "Illustrator", "Photoshop"], desc: "Thiết kế nhân vật cho thế giới giả tưởng, bao gồm concept art và bảng màu chi tiết.", semester: "HK2", year: "2024-2025" },
  { title: "Food Photography Collection", subject: "Photography", tools: ["Lightroom", "Photoshop", "Capture One"], desc: "Bộ ảnh ẩm thực chuyên nghiệp với phong cách ánh sáng tự nhiên, tập trung vào ẩm thực đường phố Việt Nam.", semester: "HK1", year: "2024-2025" },
  { title: "Rebrand - Local Coffee Shop", subject: "Branding", tools: ["Illustrator", "Figma", "Photoshop"], desc: "Tái định vị thương hiệu cho quán cà phê địa phương, bao gồm thiết kế menu và không gian.", semester: "HK2", year: "2023-2024" },
  { title: "Poster - Music Festival 2025", subject: "Poster", tools: ["Illustrator", "Photoshop"], desc: "Bộ poster cho lễ hội âm nhạc điện tử, sử dụng phong cách psychedelic và màu sắc rực rỡ.", semester: "HK1", year: "2024-2025" },
  { title: "UI Design - Fitness App", subject: "UI/UX", tools: ["Figma", "ProtoPie", "Photoshop"], desc: "Ứng dụng thể dục thông minh với giao diện gamified, theo dõi sức khỏe và bài tập.", semester: "HK2", year: "2024-2025" },
  { title: "3D Visualization - Interior", subject: "3D Art", tools: ["Blender", "3ds Max", "Corona Renderer"], desc: "Hình dung kiến trúc nội thất căn hộ cao cấp, phong cách tối giản Scandinavian.", semester: "HK1", year: "2023-2024" },
  { title: "Illustration - Children's Book", subject: "Illustration", tools: ["Procreate", "Photoshop"], desc: "Minh họa sách thiếu nhi với phong cách vẽ tay ấm áp, màu nước kỹ thuật số.", semester: "HK2", year: "2024-2025" },
  { title: "Packaging - Premium Chocolate", subject: "Packaging", tools: ["Illustrator", "Photoshop", "Cinema 4D"], desc: "Bao bì socola cao cấp với thiết kế sang trọng, chất liệu thân thiện môi trường.", semester: "HK1", year: "2024-2025" },
  { title: "Photography - Urban Architecture", subject: "Photography", tools: ["Lightroom", "Photoshop"], desc: "Bộ ảnh kiến trúc đô thị, ghi lại vẻ đẹp hình khối và ánh sáng của các tòa nhà tại TP.HCM.", semester: "HK2", year: "2023-2024" },
  { title: "Motion Reel - Showreel 2024", subject: "Motion Design", tools: ["After Effects", "Premiere Pro", "Illustrator"], desc: "Showreel tổng hợp các dự án motion graphics và animation trong năm 2024.", semester: "HK2", year: "2024-2025" },
  { title: "Brand Identity - Tech Startup", subject: "Branding", tools: ["Illustrator", "Figma"], desc: "Xây dựng nhận diện thương hiệu cho startup công nghệ, từ logo đến hệ thống ấn phẩm số.", semester: "HK1", year: "2024-2025" },
  { title: "Typeface Design - Vietnamese", subject: "Typography", tools: ["Glyphs", "Illustrator", "InDesign"], desc: "Thiết kế bộ chữ Việt hiện đại, tối ưu cho cả print và digital.", semester: "HK2", year: "2023-2024" },
];

const timelineEntries = [
  { month: "Tháng 9", year: "2023", title: "Đồ án nhập môn Thiết kế", description: "Hoàn thành đồ án thiết kế poster với Illustrator. Đạt 9.0/10.", tags: ["Illustrator", "Poster", "Xuất sắc"], linkUrl: "", linkLabel: "", imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80" },
  { month: "Tháng 3", year: "2024", title: "Giải Nhì NCKH cấp Trường", description: "Nghiên cứu ứng dụng AI trong thiết kế đồ họa. Đạt giải Nhì.", tags: ["Nghiên cứu", "AI", "Giải Nhì"], linkUrl: "", linkLabel: "", imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80" },
  { month: "Tháng 8", year: "2024", title: "Triển lãm thiết kế sinh viên", description: "Tác phẩm được chọn trưng bày tại triển lãm thiết kế đồ họa sinh viên toàn quốc.", tags: ["Triển lãm", "Sinh viên", "Thành tích"], linkUrl: "", linkLabel: "", imageUrl: "https://images.unsplash.com/photo-1559223607-a43c990c692c?w=800&q=80" },
  { month: "Tháng 2", year: "2025", title: "Thực tập tại Creative Studio", description: "Thực tập vị trí Junior Designer tại một studio thiết kế. Đánh giá: Hoàn thành tốt.", tags: ["Thực tập", "Design", "Doanh nghiệp"], linkUrl: "", linkLabel: "", imageUrl: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80" },
  { month: "Tháng 6", year: "2025", title: "Học bổng khuyến khích học tập", description: "Đạt học bổng loại Giỏi nhờ GPA 3.6/4.0 và thành tích hoạt động.", tags: ["Học bổng", "GPA", "Giỏi"], linkUrl: "", linkLabel: "", imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=800&q=80" },
  { month: "Tháng 5", year: "2026", title: "Tốt nghiệp loại Giỏi", description: "Tốt nghiệp loại Giỏi. Điểm bảo vệ đồ án: 9.2/10.", tags: ["Tốt nghiệp", "Giỏi", "Đồ án"], linkUrl: "", linkLabel: "", imageUrl: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800&q=80" },
];

const lecturerComments = [
  "Bố cục tốt, màu sắc hài hòa. Có thể cải thiện thêm phần typography.",
  "Kỹ thuật xử lý ánh sáng xuất sắc. Ý tưởng sáng tạo và độc đáo.",
  "Sản phẩm chỉn chu, tư duy thiết kế tốt. Điểm mạnh về cách phối màu.",
  "Cần chú ý hơn về tỷ lệ và cân bằng thị giác. Tuy nhiên màu sắc rất ấn tượng.",
  "Xuất sắc! Đây là một trong những bài tốt nhất lớp.",
];

async function main() {
  console.log("=== SEEDING DEMO DATA ===\n");
  const passwordHash = await bcrypt.hash("test123", 12);

  // ─── 1. CREATE USERS ──────────────────────────────────────────────────────
  const student = await prisma.user.upsert({
    where: { email: "sv@uef.edu.vn" },
    update: { passwordHash },
    create: {
      email: "sv@uef.edu.vn",
      passwordHash,
      fullName: "Nguyễn Minh Anh",
      studentId: "21DGR00042",
      role: "student",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
      isActive: true,
      bio: "Thiết kế đồ họa sinh viên UEF. Đam mê typography và brand identity.",
    },
  });
  console.log(`✓ Student: ${student.fullName} (${student.email}) / test123`);

  const lecturer = await prisma.user.upsert({
    where: { email: "tainv@uef.edu.vn" },
    update: { passwordHash },
    create: {
      email: "tainv@uef.edu.vn",
      passwordHash,
      fullName: "TS. Nguyễn Văn Tài",
      role: "lecturer",
      avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80",
      isActive: true,
      bio: "Trưởng Khoa Thiết kế Đồ họa. Chuyên ngành Branding & Identity Design.",
    },
  });
  console.log(`✓ Lecturer: ${lecturer.fullName} (${lecturer.email}) / test123`);

  const admin = await prisma.user.upsert({
    where: { email: "admin@uef.edu.vn" },
    update: { passwordHash },
    create: {
      email: "admin@uef.edu.vn",
      passwordHash,
      fullName: "Admin System",
      role: "admin",
      avatarUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&q=80",
      isActive: true,
    },
  });
  console.log(`✓ Admin: ${admin.fullName} (${admin.email}) / test123`);

  // ─── 2. DELETE OLD DATA ──────────────────────────────────────────────────
  await prisma.artwork.deleteMany({ where: { userId: student.id } });
  await prisma.timelineEntry.deleteMany({ where: { userId: student.id } });
  await prisma.collectionItem.deleteMany({ where: { lecturerId: lecturer.id } });
  await prisma.grade.deleteMany({ where: { lecturerId: lecturer.id } });
  await prisma.like.deleteMany({ where: { artwork: { userId: student.id } } });
  await prisma.comment.deleteMany({ where: { artwork: { userId: student.id } } });
  await prisma.report.deleteMany({ where: { artwork: { userId: student.id } } });
  await prisma.notification.deleteMany({ where: { userId: student.id } });
  await prisma.message.deleteMany({ where: { recipientId: student.id } });

  // ─── 3. CREATE ARTWORKS ──────────────────────────────────────────────────
  const createdArtworks = [];
  for (let i = 0; i < studentArtworks.length; i++) {
    const a = studentArtworks[i];
    const tags = [a.subject, a.tools[0], a.year, "Đồ án"];
    const likeCount = Math.floor(Math.random() * 150) + 20;
    const viewCount = Math.floor(Math.random() * 500) + 80;
    const img = coverImages[i % coverImages.length];

    const artwork = await prisma.artwork.create({
      data: {
        userId: student.id,
        title: a.title,
        description: a.desc,
        toolsUsed: a.tools,
        subject: a.subject,
        semester: a.semester,
        academicYear: a.year,
        tags,
        collaborators: [],
        collaboratorIds: [],
        coverImageUrl: img,
        fileUrls: [img, coverImages[(i + 1) % coverImages.length]],
        isPublic: true,
        isPending: false,
        isHighlighted: i < 5,
        isAiConfirmed: false,
        viewCount,
        likeCount,
      },
    });
    createdArtworks.push(artwork);
  }
  console.log(`✓ Created ${createdArtworks.length} artworks for ${student.fullName}`);

  // ─── 4. CREATE PORTFOLIO SETTINGS ────────────────────────────────────────
  await prisma.portfolioSetting.deleteMany({ where: { portfolioSlug: { in: ["nguyen-minh-anh", "ts-nguyen-van-tai", "admin-system"] } } });
  await prisma.portfolioSetting.deleteMany({ where: { userId: { in: [student.id, lecturer.id, admin.id] } } });

  await prisma.portfolioSetting.create({
    data: {
      userId: student.id,
      portfolioSlug: "nguyen-minh-anh",
      isPortfolioPublic: true,
      showEmail: false,
      contactEnabled: true,
      major: "Thiết kế Đồ họa",
      yearLevel: "Năm 3",
      profileHeadline: "Design Student · Typography & Brand Identity",
      socialLinks: { facebook: "https://facebook.com/minhanh.design", behance: "https://behance.net/minhanh" },
      featuredArtworkIds: createdArtworks.slice(0, 3).map(a => a.id),
      displayOrder: "newest",
    },
  });
  console.log(`✓ Portfolio setting created for student`);

  await prisma.portfolioSetting.create({
    data: {
      userId: lecturer.id,
      portfolioSlug: "ts-nguyen-van-tai",
      isPortfolioPublic: true,
      showEmail: true,
      contactEnabled: true,
      major: "Thiết kế Đồ họa",
      profileHeadline: "Trưởng Khoa · Branding & Identity",
      displayOrder: "newest",
    },
  });

  await prisma.portfolioSetting.create({
    data: {
      userId: admin.id,
      portfolioSlug: "admin-system",
      isPortfolioPublic: false,
      showEmail: false,
      contactEnabled: false,
      displayOrder: "newest",
    },
  });

  // ─── 5. CREATE TIMELINE ENTRIES ──────────────────────────────────────────
  for (let i = 0; i < timelineEntries.length; i++) {
    const t = timelineEntries[i];
    await prisma.timelineEntry.create({
      data: {
        userId: student.id,
        month: t.month,
        year: t.year,
        title: t.title,
        description: t.description,
        tags: t.tags,
        linkUrl: t.linkUrl || null,
        linkLabel: t.linkLabel || null,
        imageUrl: t.imageUrl,
        sortOrder: i,
      },
    });
  }
  console.log(`✓ Created ${timelineEntries.length} timeline entries`);

  // ─── 6. CREATE GRADES ────────────────────────────────────────────────────
  const gradedArtworks = createdArtworks.slice(0, 5);
  const gradeScores = [8.5, 9.0, 7.5, 9.5, 8.0];
  for (let i = 0; i < gradedArtworks.length; i++) {
    await prisma.grade.create({
      data: {
        artworkId: gradedArtworks[i].id,
        lecturerId: lecturer.id,
        score: gradeScores[i],
        comment: lecturerComments[i],
        isVisibleToStudent: true,
      },
    });
  }
  console.log(`✓ Created ${gradedArtworks.length} grades`);

  // ─── 7. CREATE COLLECTION ITEMS ─────────────────────────────────────────
  const collectionNames = ["Xuất sắc HK1-2024", "Triển lãm cuối năm"];
  const collectionArtworks = [createdArtworks.slice(0, 4), createdArtworks.slice(4, 8)];

  for (let c = 0; c < collectionNames.length; c++) {
    for (const artwork of collectionArtworks[c]) {
      await prisma.collectionItem.create({
        data: {
          lecturerId: lecturer.id,
          artworkId: artwork.id,
          collectionName: collectionNames[c],
          curatorEssay: c === 0 ? "Tuyển tập các tác phẩm xuất sắc nhất học kỳ 1 năm 2024." : "Bộ sưu tập các ấn phẩm tiêu biểu cho triển lãm cuối năm.",
          theme: c === 0 ? "Classic" : "Modern",
          note: c === 0 ? "Tác phẩm nổi bật về tư duy thiết kế" : "Phù hợp trưng bày triển lãm",
        },
      });
    }
  }
  console.log(`✓ Created collection items`);

  // ─── 8. CREATE LIKES & COMMENTS ─────────────────────────────────────────
  const commentTexts = [
    "Bài rất đẹp! Màu sắc hài hòa quá ạ.",
    "Em rất thích ý tưởng này!",
    "Có thể chia sẻ thêm về quy trình thực hiện được không ạ?",
    "Tuyệt vời! Cho em xin tips về phối màu với ạ.",
    "Ấn tượng! Phong cách rất chuyên nghiệp.",
    "Đẹp quá, chị ơi! Em muốn học hỏi thêm.",
    "Bài này được giảng viên chấm cao lắm đúng không ạ?",
    "Em thích nhất phần typography, rất sáng tạo.",
  ];

  const likedArtworks = createdArtworks.slice(0, 8);
  for (const artwork of likedArtworks) {
    await prisma.like.create({
      data: { artworkId: artwork.id, reactionType: "like" },
    });
  }

  const commentedArtworks = createdArtworks.slice(0, 5);
  for (let i = 0; i < commentedArtworks.length; i++) {
    await prisma.comment.create({
      data: {
        artworkId: commentedArtworks[i].id,
        userId: lecturer.id,
        content: commentTexts[i],
      },
    });
  }
  console.log(`✓ Created likes and comments`);

  // ─── 9. CREATE NOTIFICATIONS ─────────────────────────────────────────────
  await prisma.notification.createMany({
    data: [
      { userId: student.id, type: "grade_updated", referenceId: gradedArtworks[0].id, referenceType: "artwork", content: `TS. Nguyễn Văn Tài đã chấm điểm ấn phẩm "${gradedArtworks[0].title}"`, isRead: false, actorId: lecturer.id, actorName: "TS. Nguyễn Văn Tài" },
      { userId: student.id, type: "new_comment", referenceId: commentedArtworks[0].id, referenceType: "artwork", content: `TS. Nguyễn Văn Tài đã bình luận về ấn phẩm "${commentedArtworks[0].title}"`, isRead: false, actorId: lecturer.id, actorName: "TS. Nguyễn Văn Tài" },
      { userId: student.id, type: "new_like", referenceId: likedArtworks[0].id, referenceType: "artwork", content: `Có 1 lượt thích mới trên ấn phẩm "${likedArtworks[0].title}"`, isRead: true, actorName: "Người dùng" },
    ],
  });
  console.log(`✓ Created notifications`);

  // ─── 10. CREATE MESSAGE ──────────────────────────────────────────────────
  await prisma.message.create({
    data: {
      recipientId: student.id,
      senderName: "Công ty Sáng tạo ABC",
      senderEmail: "hr@abc-creative.com",
      senderCompany: "ABC Creative Studio",
      purpose: "Tuyển dụng",
      content: "Chào em, bên anh đang tìm Junior Designer. Em có thể gửi portfolio và CV qua email này nhé. Rất mong được làm việc cùng em!",
      isRead: false,
    },
  });
  console.log(`✓ Created demo message`);

  // ─── SUMMARY ─────────────────────────────────────────────────────────────
  console.log("\n═══════════════════════════════════════════");
  console.log("  SEED COMPLETE — 3 ACCOUNTS READY");
  console.log("═══════════════════════════════════════════");
  console.log("\n  1. STUDENT  : sv@uef.edu.vn");
  console.log("     Password  : test123");
  console.log("     Name      : Nguyễn Minh Anh");
  console.log("     Role      : Sinh viên");
  console.log(`     Artworks  : ${createdArtworks.length} ấn phẩm`);
  console.log(`     Timeline  : ${timelineEntries.length} mốc`);
  console.log(`     Grades    : ${gradedArtworks.length} bài đã chấm`);
  console.log(`     Messages  : 1 tin nhắn từ NTD\n`);
  console.log("  2. LECTURER : tainv@uef.edu.vn");
  console.log("     Password  : test123");
  console.log("     Name      : TS. Nguyễn Văn Tài");
  console.log("     Role      : Giảng viên\n");
  console.log("  3. ADMIN    : admin@uef.edu.vn");
  console.log("     Password  : test123");
  console.log("     Name      : Admin System");
  console.log("     Role      : Quản trị viên\n");
  console.log("═══════════════════════════════════════════\n");

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error("Seed error:", e);
  await prisma.$disconnect();
  process.exit(1);
});
