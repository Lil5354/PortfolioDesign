import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function toSlug(fullName: string): string {
  const latin = fullName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return latin;
}

const defaultSettings = {
  isPortfolioPublic: true,
  showEmail: false,
  contactEnabled: true,
  major: "Thiết kế Đồ họa",
  yearLevel: "Năm 3",
  profileHeadline: "Design Student",
  socialLinks: {},
  featuredArtworkIds: [],
};

async function main() {
  const users = await prisma.user.findMany({
    where: { role: { not: "admin" } },
  });

  console.log(`Found ${users.length} non-admin users`);

  let created = 0;
  let fixed = 0;

  for (const user of users) {
    let existing = await prisma.portfolioSetting.findUnique({
      where: { userId: user.id },
    });

    if (!existing) {
      let slug = toSlug(user.fullName);
      if (slug.length < 3) slug = `user-${user.id.slice(0, 6)}`;

      const duplicate = await prisma.portfolioSetting.findUnique({
        where: { portfolioSlug: slug },
      });
      if (duplicate) {
        slug = `${slug}-${user.id.slice(0, 6)}`;
      }

      await prisma.portfolioSetting.create({
        data: {
          userId: user.id,
          portfolioSlug: slug,
          ...defaultSettings,
        },
      });
      console.log(`  CREATED portfolio for ${user.fullName} → slug: "${slug}"`);
      created++;
    } else {
      const correctSlug = toSlug(user.fullName);
      if (correctSlug.length < 3) continue;

      if (existing.portfolioSlug !== correctSlug) {
        const duplicate = await prisma.portfolioSetting.findUnique({
          where: { portfolioSlug: correctSlug },
        });
        if (!duplicate || duplicate.userId === user.id) {
          await prisma.portfolioSetting.update({
            where: { userId: user.id },
            data: { portfolioSlug: correctSlug },
          });
          console.log(`  FIXED ${user.fullName}: "${existing.portfolioSlug}" → "${correctSlug}"`);
          fixed++;
        } else {
          await prisma.portfolioSetting.update({
            where: { userId: user.id },
            data: { portfolioSlug: `${correctSlug}-${user.id.slice(0, 6)}` },
          });
          console.log(`  FIXED ${user.fullName}: "${existing.portfolioSlug}" → "${correctSlug}-${user.id.slice(0, 6)}" (duplicate avoided)`);
          fixed++;
        }
      } else {
        console.log(`  OK    ${user.fullName} → "${correctSlug}"`);
      }
    }
  }

  const total = await prisma.portfolioSetting.count();
  console.log(`\nDone! Created: ${created}, Fixed: ${fixed}. Total portfolio settings: ${total}`);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
