import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const timelineTemplates = [
  { month: "Tháng 9", year: "2023", title: "Đồ án nhập môn lập trình", description: "Hoàn thành đồ án Quản lý Thư viện bằng C++ với kiến trúc OOP. Đạt 9.5/10.", tags: ["C++", "OOP", "Xuất sắc"], linkUrl: "https://example.com/do-an-2023", linkLabel: "Xem đồ án →", imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80" },
  { month: "Tháng 3", year: "2024", title: "Giải Nhất NCKH cấp Trường", description: "Nghiên cứu ứng dụng AI trong phân tích cảm xúc văn bản tiếng Việt. Đạt giải Nhất.", tags: ["Nghiên cứu", "AI/NLP", "Giải Nhất"], linkUrl: "https://example.com/nckh-2024", linkLabel: "Xem báo cáo →", imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80" },
  { month: "Tháng 8", year: "2024", title: "Công bố bài báo quốc tế", description: "Đồng tác giả bài báo đăng trên hội nghị IEEE RIVF 2024.", tags: ["IEEE", "Công bố QT", "NLP"], linkUrl: "https://example.com/ieee-paper", linkLabel: "Xem bài báo →", imageUrl: "https://images.unsplash.com/photo-1559223607-a43c990c692c?w=800&q=80" },
  { month: "Tháng 2", year: "2025", title: "Thực tập chuyên ngành", description: "Tham gia team Frontend phát triển hệ thống quản lý nội bộ. Đánh giá: Xuất sắc.", tags: ["Thực tập", "Chuyên ngành", "Doanh nghiệp"], linkUrl: "https://example.com/intern-report", linkLabel: "Xem báo cáo →", imageUrl: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80" },
  { month: "Tháng 6", year: "2025", title: "Học bổng toàn phần", description: "Đạt học bổng toàn phần nhờ GPA 3.8/4.0 và thành tích nghiên cứu xuất sắc.", tags: ["Học bổng", "GPA cao", "Toàn phần"], linkUrl: "https://example.com/scholarship", linkLabel: "Xem quyết định →", imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=800&q=80" },
  { month: "Tháng 5", year: "2026", title: "Tốt nghiệp Thủ khoa", description: "Tốt nghiệp loại Xuất sắc. Điểm bảo vệ đồ án: 9.8/10.", tags: ["Thủ khoa", "Xuất sắc", "Tốt nghiệp"], linkUrl: "https://example.com/thesis", linkLabel: "Xem đồ án →", imageUrl: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800&q=80" },
];

async function main() {
  const students = await prisma.user.findMany({
    where: { role: "student" },
    select: { id: true, fullName: true },
  });

  if (students.length === 0) {
    console.log("No students found in database");
    return;
  }

  let totalCreated = 0;

  for (const student of students) {
    const existing = await prisma.timelineEntry.count({
      where: { userId: student.id },
    });

    if (existing > 0) {
      console.log(`Skipping ${student.fullName}: already has ${existing} entries`);
      continue;
    }

    const data = timelineTemplates.map((t, i) => ({
      userId: student.id,
      month: t.month,
      year: t.year,
      title: t.title,
      description: t.description,
      tags: t.tags,
      linkUrl: t.linkUrl,
      linkLabel: t.linkLabel,
      imageUrl: t.imageUrl,
      sortOrder: i,
    }));

    await prisma.timelineEntry.createMany({ data });
    totalCreated += data.length;
    console.log(`Inserted ${data.length} entries for ${student.fullName}`);
  }

  console.log(`\nDone! Total entries created: ${totalCreated}`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
