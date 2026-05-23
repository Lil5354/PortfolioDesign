import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const artworks = await prisma.artwork.findMany({ take: 3, select: { id: true, title: true } });
console.log("Total artworks:", await prisma.artwork.count());
console.log("Sample:", JSON.stringify(artworks, null, 2));
if (artworks.length > 0) {
  const id = artworks[0].id;
  console.log("Testing GET for:", id);
  try {
    const a = await prisma.artwork.findUnique({
      where: { id },
      include: { user: { select: { id: true, fullName: true, studentId: true, avatarUrl: true, portfolioSettings: { select: { portfolioSlug: true } } } } }
    });
    console.log("Success:", a?.title);
  } catch(e) {
    console.error("Error:", e.message);
  }
}
await prisma.$disconnect();
