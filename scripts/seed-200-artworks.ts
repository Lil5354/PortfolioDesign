import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const sampleUsers = [
  { fullName: "Nguyễn Minh Anh", email: "minhanh@uef.edu.vn", studentId: "21DGR00042", role: "student" as const },
  { fullName: "Trần Bảo Long", email: "longtb@uef.edu.vn", studentId: "21DGR00018", role: "student" as const },
  { fullName: "Lê Thị Hương", email: "huonglt@uef.edu.vn", studentId: "21DGR00031", role: "student" as const },
  { fullName: "Phạm Đức Tuân", email: "tuanduc@uef.edu.vn", studentId: "21DGR00055", role: "student" as const },
  { fullName: "Vũ Ngọc Mai", email: "maivn@uef.edu.vn", studentId: "21DGR00009", role: "student" as const },
  { fullName: "Hoàng Anh Kiệt", email: "kietha@uef.edu.vn", studentId: "21DGR00077", role: "student" as const },
  { fullName: "Đặng Thu Hiền", email: "hien@uef.edu.vn", studentId: "21DGR00063", role: "student" as const },
  { fullName: "Ngô Thanh Trúc", email: "truc@uef.edu.vn", studentId: "21DGR00102", role: "student" as const },
  { fullName: "Đỗ Minh Quân", email: "quan@uef.edu.vn", studentId: "21DGR00115", role: "student" as const },
  { fullName: "Bùi Thị Ánh", email: "anh@uef.edu.vn", studentId: "21DGR00128", role: "student" as const },
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

const artworkTemplates: { title: string; desc: string }[] = [];
const designKeywords = [
  "poster", "branding", "logo", "ui-ux", "web-design", "graphic-design", "illustration",
  "typography", "packaging", "motion", "photography", "editorial", "3d-art", "character-design",
  "infographic", "brochure", "flyer", "banner", "social-media", "mockup",
  "magazine", "book-cover", "app-design", "dashboard", "icon-set",
  "pattern-design", "label-design", "menu-design", "catalog", "presentation",
  "newsletter", "invitation", "certificate", "report-design", "signage",
  "billboard", "t-shirt", "sticker", "badge", "emblem",
  "vintage", "minimal", "modern", "abstract", "geometric",
  "watercolor", "digital-art", "vector", "pixel-art", "line-art",
  "calligraphy", "graffiti", "collage", "photo-manipulation", "retouching",
];

for (let i = 1; i <= 200; i++) {
  const kw = designKeywords[i % designKeywords.length];
  const adj = ["Creative", "Modern", "Vibrant", "Elegant", "Bold", "Dynamic", "Artistic", "Sleek", "Fresh", "Unique"][i % 7];
  artworkTemplates.push({
    title: `${adj} ${kw.charAt(0).toUpperCase() + kw.slice(1).replace(/-/g, " ")} — Vol.${Math.ceil(i / 20)}`,
    desc: `Tác phẩm ${kw.replace(/-/g, " ")} với phong cách ${adj.toLowerCase()}, thể hiện sự sáng tạo và tư duy thiết kế chuyên nghiệp của sinh viên UEF.`,
  });
}

const coverImageSeeds: string[] = [];
for (let i = 1; i <= 200; i++) {
  coverImageSeeds.push(`https://picsum.photos/seed/gd${String(i).padStart(3, "0")}/800/600`);
}

const unsplashDesignPhotos = [
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
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
  "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80",
  "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800&q=80",
  "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&q=80",
  "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&q=80",
  "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80",
  "https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80",
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
  "https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?w=800&q=80",
  "https://images.unsplash.com/photo-1559827291-b3a81c8e3cc9?w=800&q=80",
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80",
  "https://images.unsplash.com/photo-1561835490-5af2660c3c4f?w=800&q=80",
  "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=800&q=80",
  "https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80",
  "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&q=80",
  "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80",
  "https://images.unsplash.com/photo-1561835490-5af2660c3c4f?w=800&q=80",
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80",
  "https://images.unsplash.com/photo-1559827291-b3a81c8e3cc9?w=800&q=80",
  "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=800&q=80",
];

async function main() {
  const passwordHash = await bcrypt.hash("test123", 12);
  const createdUsers = await Promise.all(
    sampleUsers.map(u =>
      prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: {
          email: u.email,
          passwordHash,
          fullName: u.fullName,
          studentId: u.studentId,
          role: u.role,
          isActive: true,
        },
      })
    )
  );
  console.log(`Created/verified ${createdUsers.length} users`);

  const existingCount = await prisma.artwork.count();
  console.log(`Existing artworks: ${existingCount}`);

  let created = 0;
  for (let i = 0; i < artworkTemplates.length; i++) {
    const art = artworkTemplates[i];
    const subject = subjects[i % subjects.length];
    const student = createdUsers[i % 7];
    const tools = toolsBySubject[subject] || ["Photoshop", "Illustrator"];
    const year = academicYears[i % academicYears.length];
    const semester = semesters[i % semesters.length];
    const tags = [subject, tools[0], year, "Đồ án"];
    const likeCount = Math.floor(Math.random() * 200) + 5;
    const viewCount = Math.floor(Math.random() * 800) + 30;
    const coverImage = coverImageSeeds[i];

    try {
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
          collaboratorIds: [],
          fileUrls: [coverImage],
          coverImageUrl: coverImage,
          watermarkText: "UEF",
          watermarkPosition: "bottom-right",
          isPublic: true,
          isPending: false,
          isHighlighted: i < 20,
          isAiConfirmed: false,
          likeCount,
          viewCount,
        },
      });
      created++;
      if (created % 20 === 0) console.log(`  Created ${created}/${artworkTemplates.length}`);
    } catch (e) {
      console.error(`  Error creating artwork ${i}:`, (e as Error).message);
    }
  }

  const finalCount = await prisma.artwork.count();
  console.log(`\nTotal artworks: ${finalCount} (created ${created} new)`);

  const studentUsers = createdUsers.filter(u => u.role === "student");
  console.log(`\nStudent accounts (password: test123):`);
  studentUsers.forEach(u => console.log(`  ${u.fullName} — ${u.email}`));

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
